import React, { useState, useEffect, useMemo } from 'react';
import type { BillingPeriod, DepartmentBillBreakdown } from '../../types/billing';
import type { TaxSummary } from '../../types/tax';
import type { GenerateBillParams } from '../../services/billingService';
import { billingService } from '../../services/billingService';
import { taxCalculationService } from '../../services/taxCalculationService';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { GenerateBillModal } from '../../components/billing/GenerateBillModal';
import { InvoiceModal } from '../../components/billing/InvoiceModal';
import { TaxSummaryPanel } from '../../components/tax/TaxSummaryPanel';
import { IndividualBills } from '../../modules/cdr/reports/user/pages/IndividualBills';
import { DepartmentBills } from '../../modules/cdr/reports/user/pages/DepartmentBills';
import {
  formatCurrency,
  formatNumber,
  formatRate,
  DEFAULT_SERVICE_TYPE,
} from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Receipt,
  FileText,
  Calculator,
  Download,
  Eye,
  BadgeEuro,
  Clock,
  UserCheck,
  Building2,
  Percent,
} from 'lucide-react';

type BillingTab = 'invoices' | 'tax' | 'individual' | 'departments';

const selectClass =
  'px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none';

export const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BillingTab>('invoices');
  const [periods, setPeriods] = useState<BillingPeriod[]>([]);
  const [deptBreakdowns, setDeptBreakdowns] = useState<DepartmentBillBreakdown[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingPeriod | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // Country-wise billing filters
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [taxRateFilter, setTaxRateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Tax summary tab
  const [summaryPeriodCode, setSummaryPeriodCode] = useState('');
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const fetchBillingData = async () => {
      const [p, db] = await Promise.all([
        billingService.getBillingPeriods(),
        billingService.getDepartmentBreakdown(),
      ]);
      setPeriods(p);
      setDeptBreakdowns(db);
      if (p.length) setSummaryPeriodCode(p[0].periodCode);
    };
    fetchBillingData();
  }, []);

  // Tax figures always come from the Tax & VAT master, never from a stored rate.
  useEffect(() => {
    if (!summaryPeriodCode) return;
    const period = periods.find((p) => p.periodCode === summaryPeriodCode);
    if (!period) return;
    let cancelled = false;
    setSummaryLoading(true);
    taxCalculationService
      .getTaxSummary(
        period.period,
        period.countryBreakdown.map((c) => ({
          amount: c.taxableAmount,
          billingCountryCode: c.isoCode,
          billingCountryName: c.countryName,
          serviceType: DEFAULT_SERVICE_TYPE,
          transactionDate: period.endDate,
          calls: c.calls,
          durationHours: c.durationHours,
        }))
      )
      .then((summary) => {
        if (!cancelled) {
          setTaxSummary(summary);
          setSummaryLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [summaryPeriodCode, periods]);

  const handleGenerateBill = async (params: GenerateBillParams) => {
    const newPeriods = await billingService.generateBill(params);
    if (!newPeriods.length) return;
    setPeriods([...newPeriods, ...periods]);
    // Per-country runs raise several invoices; open the largest one.
    setSelectedInvoice(newPeriods[0]);
    setIsInvoiceOpen(true);
  };

  const handleViewInvoice = (period: BillingPeriod) => {
    setSelectedInvoice(period);
    setIsInvoiceOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">Paid</Badge>;
      case 'Approved':
        return <Badge variant="info">Approved</Badge>;
      case 'Generated':
        return <Badge variant="warning">Generated</Badge>;
      case 'Draft':
        return <Badge variant="neutral">Draft</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const countryOptions = useMemo(() => {
    const map = new Map<string, string>();
    periods.forEach((p) => p.countryBreakdown.forEach((c) => map.set(c.isoCode, c.countryName)));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [periods]);

  const rateOptions = useMemo(() => {
    const rates = new Set<number>();
    periods.forEach((p) => p.taxLines.forEach((l) => rates.add(l.rate)));
    return [...rates].sort((a, b) => b - a);
  }, [periods]);

  const filteredPeriods = useMemo(
    () =>
      periods.filter((p) => {
        const matchesCountry =
          countryFilter === 'ALL' || p.countryBreakdown.some((c) => c.isoCode === countryFilter);
        const matchesRate =
          taxRateFilter === 'ALL' || p.taxLines.some((l) => String(l.rate) === taxRateFilter);
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesCountry && matchesRate && matchesStatus;
      }),
    [periods, countryFilter, taxRateFilter, statusFilter]
  );

  /**
   * When a country filter is applied the table shows that country's slice of
   * each invoice, so the figures stay consistent with country-wise reporting.
   */
  const rowFor = (period: BillingPeriod) => {
    if (countryFilter === 'ALL') {
      return {
        calls: period.totalCalls,
        billable: period.billableCalls,
        hours: period.totalDurationHours,
        subtotal: period.subtotal,
        tax: period.taxAmount,
        total: period.totalAmount,
        scope: period.countryBreakdown.length > 1 ? 'Multi-country' : period.billingCountry,
      };
    }
    const slice = period.countryBreakdown.find((c) => c.isoCode === countryFilter);
    return {
      calls: slice?.calls ?? 0,
      billable: slice?.calls ?? 0,
      hours: slice?.durationHours ?? 0,
      subtotal: slice?.taxableAmount ?? 0,
      tax: slice?.taxAmount ?? 0,
      total: slice?.totalAmount ?? 0,
      scope: slice?.countryName ?? '—',
    };
  };

  const currentPeriod = periods[0];
  const ytd = useMemo(
    () => ({
      invoiced: periods.reduce((s, p) => s + p.totalAmount, 0),
      tax: periods.reduce((s, p) => s + p.taxAmount, 0),
      pending: periods
        .filter((p) => p.status !== 'Paid')
        .reduce((s, p) => s + p.totalAmount, 0),
    }),
    [periods]
  );

  const handleExportCSV = () => {
    exportToCSV(
      filteredPeriods.map((p) => {
        const row = rowFor(p);
        return {
          period: p.period,
          invoiceNumber: p.invoiceNumber,
          scope: row.scope,
          totalCalls: row.calls,
          billableCalls: row.billable,
          totalDurationHours: row.hours,
          subtotal: row.subtotal.toFixed(2),
          taxAmount: row.tax.toFixed(2),
          totalAmount: row.total.toFixed(2),
          taxStatus: p.taxStatus,
          status: p.status,
          generatedDate: p.generatedDate,
          dueDate: p.dueDate,
        };
      }),
      'Monthly_Telecom_Invoices',
      [
        { key: 'period', label: 'Billing Period' },
        { key: 'invoiceNumber', label: 'Invoice No.' },
        { key: 'scope', label: 'Billing Country' },
        { key: 'totalCalls', label: 'Total Calls' },
        { key: 'billableCalls', label: 'Billable Calls' },
        { key: 'totalDurationHours', label: 'Total Hours' },
        { key: 'subtotal', label: 'Taxable Amount (EUR)' },
        { key: 'taxAmount', label: 'Tax (EUR)' },
        { key: 'totalAmount', label: 'Total Amount (EUR)' },
        { key: 'taxStatus', label: 'Tax Status' },
        { key: 'status', label: 'Status' },
        { key: 'generatedDate', label: 'Generated Date' },
        { key: 'dueDate', label: 'Due Date' },
      ]
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation & Sub-Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Telecom Billing & Invoices
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                VAT from Tax Master
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly tax cycles, country-wise VAT summaries, individual staff statements, and
              department cost centers.
            </p>
          </div>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 self-start md:self-auto overflow-x-auto">
          {(
            [
              { key: 'invoices', label: 'Monthly Invoices', icon: Receipt },
              { key: 'tax', label: 'Tax Summary', icon: Percent },
              { key: 'individual', label: 'Individual User Bills', icon: UserCheck },
              { key: 'departments', label: 'Department Bills', icon: Building2 },
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

      {/* 1. MONTHLY INVOICES VIEW */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-slate-900">Billing Cycles & Tax Statements</span>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Countries</option>
                {countryOptions.map(([iso, name]) => (
                  <option key={iso} value={iso}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={taxRateFilter}
                onChange={(e) => setTaxRateFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Tax Rates</option>
                {rateOptions.map((rate) => (
                  <option key={rate} value={String(rate)}>
                    {formatRate(rate)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={selectClass}
              >
                <option value="ALL">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Generated">Generated</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export Invoices CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGenerateOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Generate Monthly Bill</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={`Current Cycle (${currentPeriod?.period ?? '—'})`}
              value={formatCurrency(currentPeriod?.totalAmount ?? 0)}
              subtitle={`${formatNumber(currentPeriod?.billableCalls ?? 0)} Billable Calls`}
              icon={Receipt}
              iconColor="text-sky-600"
              iconBg="bg-sky-50"
            />
            <StatCard
              title="Total Invoiced"
              value={formatCurrency(ytd.invoiced)}
              subtitle={`${periods.length} Monthly Billing Cycles`}
              icon={FileText}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-50"
            />
            <StatCard
              title="VAT Collected"
              value={formatCurrency(ytd.tax)}
              subtitle="Per configured country tax rules"
              icon={BadgeEuro}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <StatCard
              title="Pending Settlement"
              value={formatCurrency(ytd.pending)}
              subtitle={`Next due ${currentPeriod?.dueDate ?? '—'}`}
              icon={Clock}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
            />
          </div>

          {/* Billing Periods Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Official Monthly Telecom Tax Invoices
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                {countryFilter === 'ALL'
                  ? 'Tax resolved per billing country'
                  : `Filtered to ${countryOptions.find(([iso]) => iso === countryFilter)?.[1]}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                    <th className="py-3 px-3.5">Invoice No.</th>
                    <th className="py-3 px-3.5">Billing Period</th>
                    <th className="py-3 px-3.5">Billing Country</th>
                    <th className="py-3 px-3.5 text-right">Calls</th>
                    <th className="py-3 px-3.5 text-right">Duration</th>
                    <th className="py-3 px-3.5 text-right">Taxable Amount</th>
                    <th className="py-3 px-3.5 text-right">VAT</th>
                    <th className="py-3 px-3.5 text-right">Total Invoice</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Due Date</th>
                    <th className="py-3 px-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPeriods.map((period) => {
                    const row = rowFor(period);
                    return (
                      <tr key={period.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-sky-700">
                          {period.invoiceNumber}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-foreground">{period.period}</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          {row.scope}
                          <span className="block text-[10px] text-slate-400">
                            {period.taxLines.length} tax rate(s)
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right font-medium">{formatNumber(row.calls)}</td>
                        <td className="py-3 px-3.5 text-right font-mono text-slate-600">
                          {formatNumber(row.hours)} hrs
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono text-slate-700">
                          {formatCurrency(row.subtotal)}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono text-slate-500">
                          {formatCurrency(row.tax)}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="py-3 px-3.5 text-center">{getStatusBadge(period.status)}</td>
                        <td className="py-3 px-3.5 text-center text-muted-foreground">
                          {period.dueDate}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleViewInvoice(period)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-[11px] border border-sky-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Invoice</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPeriods.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-xs text-slate-400">
                        No billing cycles match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAX SUMMARY VIEW */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-900">Tax Summary</span>
              <select
                value={summaryPeriodCode}
                onChange={(e) => setSummaryPeriodCode(e.target.value)}
                className={selectClass}
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.periodCode}>
                    {p.period}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={!taxSummary}
              onClick={() =>
                taxSummary &&
                exportToCSV(taxSummary.byCountry, 'Country_Wise_Tax_Summary', [
                  { key: 'countryName', label: 'Country' },
                  { key: 'isoCode', label: 'ISO Code' },
                  { key: 'calls', label: 'Calls' },
                  { key: 'durationHours', label: 'Duration (hrs)' },
                  { key: 'taxableAmount', label: 'Taxable Amount (EUR)' },
                  { key: 'taxAmount', label: 'Tax (EUR)' },
                  { key: 'totalAmount', label: 'Total (EUR)' },
                ])
              }
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Export Tax Summary</span>
            </button>
          </div>

          <TaxSummaryPanel summary={taxSummary} loading={summaryLoading} />
        </div>
      )}

      {/* 3. INDIVIDUAL USER BILLS VIEW */}
      {activeTab === 'individual' && <IndividualBills />}

      {/* 4. DEPARTMENT BILLS VIEW */}
      {activeTab === 'departments' && <DepartmentBills />}

      {/* Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        deptBreakdowns={deptBreakdowns}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Generate Bill Modal */}
      <GenerateBillModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onGenerate={handleGenerateBill}
      />
    </div>
  );
};
