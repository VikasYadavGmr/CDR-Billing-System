import React, { useEffect, useMemo, useState } from 'react';
import type {
  Country,
  RateCategory,
  TaxAuditLog,
  TaxRule,
  TaxValidationIssue,
} from '../../types/tax';
import { REGION_EUROPE } from '../../types/tax';
import { taxService } from '../../services/taxService';
import { countryService } from '../../services/countryService';
import { taxAuditService } from '../../services/taxAuditService';
import { taxValidationService } from '../../services/taxValidationService';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { TaxRuleFormModal } from '../../components/tax/TaxRuleFormModal';
import type { TaxRuleFormValues } from '../../components/tax/TaxRuleFormModal';
import { TaxRuleDetailDrawer } from '../../components/tax/TaxRuleDetailDrawer';
import { formatRate } from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import { isRuleEffectiveOn } from '../../utils/taxEngine';
import {
  AlertTriangle,
  BadgeEuro,
  Ban,
  CheckCircle2,
  Download,
  Edit2,
  Eye,
  Globe2,
  History,
  Percent,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';

type TaxTab = 'rules' | 'countries' | 'audit';

const RATE_CATEGORIES: RateCategory[] = ['Standard', 'Reduced', 'Super Reduced', 'Zero', 'Exempt'];

const selectClass =
  'px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none';

export const TaxVatMaster: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TaxTab>('rules');
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [auditLogs, setAuditLogs] = useState<TaxAuditLog[]>([]);
  const [masterIssues, setMasterIssues] = useState<TaxValidationIssue[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [taxTypeFilter, setTaxTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [effectiveOn, setEffectiveOn] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [formIssues, setFormIssues] = useState<TaxValidationIssue[]>([]);
  const [saving, setSaving] = useState(false);
  const [viewingRule, setViewingRule] = useState<TaxRule | null>(null);

  const refresh = async () => {
    const [r, c, a, audit] = await Promise.all([
      taxService.getTaxRules(),
      countryService.getCountries(),
      taxAuditService.getAuditLogs(),
      taxValidationService.auditTaxMaster(),
    ]);
    setRules(r);
    setCountries(c);
    setAuditLogs(a);
    setMasterIssues(audit.issues);
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredRules = useMemo(
    () =>
      rules.filter((rule) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          rule.countryName.toLowerCase().includes(q) ||
          rule.isoCode.toLowerCase().includes(q) ||
          rule.taxName.toLowerCase().includes(q) ||
          rule.taxRuleId.toLowerCase().includes(q) ||
          rule.sourceReference.toLowerCase().includes(q);
        const matchesCountry = countryFilter === 'ALL' || rule.isoCode === countryFilter;
        const matchesType = taxTypeFilter === 'ALL' || rule.taxType === taxTypeFilter;
        const matchesCategory = categoryFilter === 'ALL' || rule.rateCategory === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || rule.status === statusFilter;
        const matchesDate = !effectiveOn || isRuleEffectiveOn(rule, effectiveOn);
        return (
          matchesSearch &&
          matchesCountry &&
          matchesType &&
          matchesCategory &&
          matchesStatus &&
          matchesDate
        );
      }),
    [rules, search, countryFilter, taxTypeFilter, categoryFilter, statusFilter, effectiveOn]
  );

  const kpis = useMemo(() => {
    const activeRules = rules.filter((r) => r.status === 'Active');
    const configuredCountries = new Set(activeRules.map((r) => r.isoCode));
    const standardRates = activeRules
      .filter((r) => r.rateCategory === 'Standard')
      .map((r) => r.rate);
    const today = new Date().toISOString().slice(0, 10);
    const futureRules = activeRules.filter((r) => r.effectiveFrom > today);
    return {
      activeRules: activeRules.length,
      totalRules: rules.length,
      configuredCountries: configuredCountries.size,
      activeCountries: countries.filter((c) => c.status === 'Active').length,
      minRate: standardRates.length ? Math.min(...standardRates) : 0,
      maxRate: standardRates.length ? Math.max(...standardRates) : 0,
      futureRules: futureRules.length,
    };
  }, [rules, countries]);

  const taxTypes = useMemo(() => [...new Set(rules.map((r) => r.taxType))], [rules]);

  const handleOpenAdd = () => {
    setEditingRule(null);
    setFormIssues([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rule: TaxRule) => {
    setEditingRule(rule);
    setFormIssues([]);
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (rule: TaxRule) => {
    const nextStatus = rule.status === 'Active' ? 'Inactive' : 'Active';
    const reason =
      nextStatus === 'Inactive'
        ? 'Rule disabled from the Tax & VAT master.'
        : 'Rule re-enabled from the Tax & VAT master.';
    await taxService.setTaxRuleStatus(rule.taxRuleId, nextStatus, 'admin', reason);
    await refresh();
  };

  const handleSubmit = async (values: TaxRuleFormValues, rateVersionFrom: string | null) => {
    setSaving(true);
    try {
      const country = countries.find((c) => c.isoCode === values.isoCode);
      const candidate: TaxRule = {
        taxRuleId: editingRule?.taxRuleId ?? 'TAX-NEW',
        countryId: country?.countryId ?? '',
        countryName: country?.countryName ?? '',
        isoCode: values.isoCode,
        region: country?.region ?? REGION_EUROPE,
        taxType: values.taxType,
        taxName: values.taxName.trim(),
        rate: Number(values.rate),
        rateCategory: values.rateCategory,
        serviceType: values.serviceType,
        effectiveFrom: values.effectiveFrom,
        effectiveTo: values.effectiveTo || null,
        status: values.status,
        priority: Number(values.priority) || 10,
        taxInclusive: values.taxInclusive,
        reverseCharge: values.reverseCharge,
        exemptionCode: values.exemptionCode.trim() || null,
        sourceReference: values.sourceReference.trim(),
        lastVerifiedAt: editingRule?.lastVerifiedAt ?? new Date().toISOString(),
        createdAt: editingRule?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const validation = await taxValidationService.validateTaxRule(candidate);
      setFormIssues(validation.issues);
      if (!validation.isValid) return;

      const reason = values.reason.trim() || 'Updated from the Tax & VAT master.';

      if (!editingRule) {
        const { taxRuleId: _id, countryId: _cid, countryName: _cn, createdAt: _ca, updatedAt: _ua, ...input } =
          candidate;
        await taxService.addTaxRule({ ...input, isoCode: values.isoCode }, 'admin', reason);
      } else {
        await taxService.updateTaxRule(candidate, 'admin', reason);
        if (rateVersionFrom && Number(values.rate) !== editingRule.rate) {
          await taxService.changeTaxRate(
            editingRule.taxRuleId,
            Number(values.rate),
            rateVersionFrom,
            'admin',
            reason
          );
        }
      }

      await refresh();
      setIsFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleExportRules = () => {
    exportToCSV(filteredRules, 'Tax_VAT_Rules', [
      { key: 'taxRuleId', label: 'Tax Rule ID' },
      { key: 'countryName', label: 'Country' },
      { key: 'isoCode', label: 'ISO Code' },
      { key: 'region', label: 'Region' },
      { key: 'taxType', label: 'Tax Type' },
      { key: 'taxName', label: 'Tax Name' },
      { key: 'rate', label: 'Rate (%)' },
      { key: 'rateCategory', label: 'Rate Category' },
      { key: 'serviceType', label: 'Service Type' },
      { key: 'effectiveFrom', label: 'Effective From' },
      { key: 'effectiveTo', label: 'Effective To' },
      { key: 'priority', label: 'Priority' },
      { key: 'taxInclusive', label: 'Tax Inclusive' },
      { key: 'reverseCharge', label: 'Reverse Charge' },
      { key: 'exemptionCode', label: 'Exemption Code' },
      { key: 'sourceReference', label: 'Source Reference' },
      { key: 'lastVerifiedAt', label: 'Last Verified' },
      { key: 'status', label: 'Status' },
    ]);
  };

  const handleExportCountries = () => {
    exportToCSV(countries, 'Country_Master', [
      { key: 'countryId', label: 'Country ID' },
      { key: 'countryName', label: 'Country' },
      { key: 'isoCode', label: 'ISO Code' },
      { key: 'region', label: 'Region' },
      { key: 'bloc', label: 'Bloc' },
      { key: 'currency', label: 'Currency' },
      { key: 'taxSystem', label: 'Tax System' },
      { key: 'status', label: 'Status' },
    ]);
  };

  const handleExportAudit = () => {
    exportToCSV(auditLogs, 'Tax_Audit_Trail', [
      { key: 'auditId', label: 'Audit ID' },
      { key: 'taxRuleId', label: 'Tax Rule ID' },
      { key: 'taxRuleLabel', label: 'Tax Rule' },
      { key: 'action', label: 'Action' },
      { key: 'oldRate', label: 'Previous Rate' },
      { key: 'newRate', label: 'New Rate' },
      { key: 'oldStatus', label: 'Previous Status' },
      { key: 'newStatus', label: 'New Status' },
      { key: 'changedBy', label: 'Changed By' },
      { key: 'changedAt', label: 'Changed At' },
      { key: 'reason', label: 'Reason' },
    ]);
  };

  const categoryBadge = (category: RateCategory) => {
    const variant =
      category === 'Standard'
        ? 'info'
        : category === 'Reduced' || category === 'Super Reduced'
          ? 'purple'
          : category === 'Zero'
            ? 'amber'
            : 'neutral';
    return (
      <Badge variant={variant} size="sm">
        {category}
      </Badge>
    );
  };

  const countryRuleCount = (isoCode: string) =>
    rules.filter((r) => r.isoCode === isoCode && r.status === 'Active').length;

  return (
    <div className="space-y-4">
      {/* Page header + tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">Tax &amp; VAT Master</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Region: Europe
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Country-wise VAT rules applied by the CDR billing engine when rating telecom calls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 self-start md:self-auto overflow-x-auto">
          {(
            [
              { key: 'rules', label: 'Tax Rules', icon: Percent },
              { key: 'countries', label: 'Country Master', icon: Globe2 },
              { key: 'audit', label: 'Audit History', icon: History },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-teal-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Countries Configured"
          value={kpis.configuredCountries}
          subtitle={`${kpis.activeCountries} active in Country Master`}
          icon={Globe2}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
        />
        <StatCard
          title="Active Tax Rules"
          value={kpis.activeRules}
          subtitle={`${kpis.totalRules} rules incl. historic versions`}
          icon={BadgeEuro}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <StatCard
          title="Standard VAT Range"
          value={`${formatRate(kpis.minRate)} – ${formatRate(kpis.maxRate)}`}
          subtitle="Across configured European countries"
          icon={Percent}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Scheduled Rate Changes"
          value={kpis.futureRules}
          subtitle="Future-dated rules awaiting activation"
          icon={ShieldCheck}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Master-data health */}
      {masterIssues.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Tax master validation — {masterIssues.length} item(s) need attention</span>
          </div>
          <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto">
            {masterIssues.slice(0, 8).map((issue, i) => (
              <li key={i} className="text-[11px] text-slate-600 leading-relaxed">
                • {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TAX RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col xl:flex-row items-center justify-between gap-3">
            <div className="relative w-full xl:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country, ISO, tax name, source..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Countries</option>
                {countries.map((c) => (
                  <option key={c.countryId} value={c.isoCode}>
                    {c.countryName}
                  </option>
                ))}
              </select>

              <select
                value={taxTypeFilter}
                onChange={(e) => setTaxTypeFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Tax Types</option>
                {taxTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Rate Categories</option>
                {RATE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="flex items-center gap-1.5">
                <label className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                  Effective On
                </label>
                <input
                  type="date"
                  value={effectiveOn}
                  onChange={(e) => setEffectiveOn(e.target.value)}
                  className={selectClass}
                />
              </div>

              <button
                type="button"
                onClick={handleExportRules}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tax Rule</span>
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Country-wise Tax Rules — Telecom Services
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                {filteredRules.length} of {rules.length} rules
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                    <th className="py-3 px-3.5">Country</th>
                    <th className="py-3 px-3.5">ISO</th>
                    <th className="py-3 px-3.5">Region</th>
                    <th className="py-3 px-3.5">Tax Type</th>
                    <th className="py-3 px-3.5">Tax Name</th>
                    <th className="py-3 px-3.5 text-right">Rate</th>
                    <th className="py-3 px-3.5 text-center">Rate Category</th>
                    <th className="py-3 px-3.5">Service Type</th>
                    <th className="py-3 px-3.5">Effective From</th>
                    <th className="py-3 px-3.5">Effective To</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRules.map((rule) => (
                    <tr key={rule.taxRuleId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3.5">
                        <span className="font-bold text-foreground block">{rule.countryName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {rule.taxRuleId}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {rule.isoCode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-muted-foreground">{rule.region}</td>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">{rule.taxType}</td>
                      <td className="py-2.5 px-3.5 text-slate-700">
                        {rule.taxName}
                        {(rule.reverseCharge || rule.taxInclusive) && (
                          <span className="block text-[10px] text-slate-400 font-medium">
                            {[
                              rule.reverseCharge ? 'Reverse charge' : null,
                              rule.taxInclusive ? 'Tax inclusive' : null,
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                        {formatRate(rule.rate)}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">{categoryBadge(rule.rateCategory)}</td>
                      <td className="py-2.5 px-3.5 text-muted-foreground">{rule.serviceType}</td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-600">{rule.effectiveFrom}</td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-500">
                        {rule.effectiveTo ?? '—'}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <Badge variant={rule.status === 'Active' ? 'success' : 'neutral'} size="sm">
                          {rule.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingRule(rule)}
                            title="View tax rule"
                            className="p-1.5 rounded-md text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rule)}
                            title="Edit tax rule"
                            className="p-1.5 rounded-md text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(rule)}
                            title={rule.status === 'Active' ? 'Disable tax rule' : 'Enable tax rule'}
                            className={`p-1.5 rounded-md transition-colors ${
                              rule.status === 'Active'
                                ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {rule.status === 'Active' ? (
                              <Ban className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRules.length === 0 && (
                    <tr>
                      <td colSpan={12} className="py-10 text-center text-xs text-slate-400">
                        No tax rules match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed px-1">
            Tax rates are regulatory data. Rates carry effective dates, a source reference and a
            verification timestamp; historic rules are never overwritten so past invoices stay
            reproducible. Where no applicable rule exists the billing engine flags the record for
            review rather than applying a default rate.
          </p>
        </div>
      )}

      {/* COUNTRY MASTER */}
      {activeTab === 'countries' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country or ISO code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:bg-white transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleExportCountries}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Export Country Master</span>
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Country Master — Europe
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                One country can hold many tax rules
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                    <th className="py-3 px-3.5">Country ID</th>
                    <th className="py-3 px-3.5">Country</th>
                    <th className="py-3 px-3.5">ISO Code</th>
                    <th className="py-3 px-3.5">Region</th>
                    <th className="py-3 px-3.5">Bloc</th>
                    <th className="py-3 px-3.5">Currency</th>
                    <th className="py-3 px-3.5">Tax System</th>
                    <th className="py-3 px-3.5 text-right">Active Rules</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {countries
                    .filter(
                      (c) =>
                        !search.trim() ||
                        c.countryName.toLowerCase().includes(search.trim().toLowerCase()) ||
                        c.isoCode.toLowerCase().includes(search.trim().toLowerCase())
                    )
                    .map((country) => (
                      <tr key={country.countryId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500">
                          {country.countryId}
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-foreground">
                          {country.countryName}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {country.isoCode}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-muted-foreground">{country.region}</td>
                        <td className="py-2.5 px-3.5">
                          <Badge variant={country.bloc === 'EU' ? 'info' : 'neutral'} size="sm">
                            {country.bloc === 'EU' ? 'EU' : 'European Non-EU'}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-600">{country.currency}</td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-700">
                          {country.taxSystem}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-700">
                          {countryRuleCount(country.isoCode)}
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <Badge variant={country.status === 'Active' ? 'success' : 'neutral'} size="sm">
                            {country.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rule, user, or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:bg-white transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleExportAudit}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Export Audit Trail</span>
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Tax Rule Audit Trail
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Append-only • historic invoices are never restated
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                    <th className="py-3 px-3.5">Audit ID</th>
                    <th className="py-3 px-3.5">Tax Rule</th>
                    <th className="py-3 px-3.5 text-center">Action</th>
                    <th className="py-3 px-3.5 text-right">Previous</th>
                    <th className="py-3 px-3.5 text-right">New</th>
                    <th className="py-3 px-3.5">Changed By</th>
                    <th className="py-3 px-3.5">Changed At</th>
                    <th className="py-3 px-3.5">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {auditLogs
                    .filter((log) => {
                      const q = search.trim().toLowerCase();
                      return (
                        !q ||
                        log.taxRuleLabel.toLowerCase().includes(q) ||
                        log.changedBy.toLowerCase().includes(q) ||
                        log.reason.toLowerCase().includes(q) ||
                        log.action.toLowerCase().includes(q)
                      );
                    })
                    .slice(0, 200)
                    .map((log) => (
                      <tr key={log.auditId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500">
                          {log.auditId}
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                          {log.taxRuleLabel}
                          <span className="block text-[10px] text-slate-400 font-mono">
                            {log.taxRuleId}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <Badge
                            variant={
                              log.action === 'Rate Changed'
                                ? 'warning'
                                : log.action === 'Deactivated'
                                  ? 'danger'
                                  : log.action === 'Created' || log.action === 'Activated'
                                    ? 'success'
                                    : 'info'
                            }
                            size="sm"
                          >
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                          {log.oldValue ?? (log.oldRate !== null ? formatRate(log.oldRate) : '—')}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-800">
                          {log.newValue ?? (log.newRate !== null ? formatRate(log.newRate) : '—')}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-600">{log.changedBy}</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-500">
                          {log.changedAt.slice(0, 10)}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 max-w-xs">{log.reason}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <TaxRuleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        rule={editingRule}
        countries={countries}
        issues={formIssues}
        saving={saving}
        onSubmit={handleSubmit}
      />

      <TaxRuleDetailDrawer
        rule={viewingRule}
        auditLogs={auditLogs}
        relatedRules={rules.filter((r) => r.isoCode === viewingRule?.isoCode)}
        isOpen={Boolean(viewingRule)}
        onClose={() => setViewingRule(null)}
      />
    </div>
  );
};
