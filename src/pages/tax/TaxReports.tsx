import React, { useEffect, useMemo, useState } from 'react';
import type { BillingPeriod } from '../../types/billing';
import type { TaxAuditLog, TaxRule, TaxSummary } from '../../types/tax';
import { billingService } from '../../services/billingService';
import { taxService } from '../../services/taxService';
import { taxAuditService } from '../../services/taxAuditService';
import { taxCalculationService } from '../../services/taxCalculationService';
import { Badge } from '../../components/common/Badge';
import {
  formatCurrency,
  formatNumber,
  formatRate,
  DEFAULT_SERVICE_TYPE,
} from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import { BarChart3, Download, FileSpreadsheet, Globe2, History, Percent } from 'lucide-react';

type ReportKey = 'tax-summary' | 'country-tax' | 'tax-rate' | 'tax-audit';

const REPORTS: { key: ReportKey; label: string; description: string; icon: typeof Percent }[] = [
  {
    key: 'tax-summary',
    label: 'Tax Summary Report',
    description: 'Country, tax type, rate, taxable amount, tax and total for a billing period.',
    icon: Percent,
  },
  {
    key: 'country-tax',
    label: 'Country-wise Tax Report',
    description: 'Calls, billing amount, tax and total grouped by billing country.',
    icon: Globe2,
  },
  {
    key: 'tax-rate',
    label: 'Tax Rate Report',
    description: 'Configured rates with their effective periods and status.',
    icon: FileSpreadsheet,
  },
  {
    key: 'tax-audit',
    label: 'Tax Audit Report',
    description: 'Every change to a tax rule with previous and new values.',
    icon: History,
  },
];

const selectClass =
  'px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none';

const thClass = 'py-3 px-3.5';

export const TaxReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportKey>('tax-summary');
  const [periods, setPeriods] = useState<BillingPeriod[]>([]);
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<TaxAuditLog[]>([]);
  const [summary, setSummary] = useState<TaxSummary | null>(null);

  const [periodCode, setPeriodCode] = useState('');
  const [countryFilter, setCountryFilter] = useState('ALL');

  useEffect(() => {
    const load = async () => {
      const [p, r, a] = await Promise.all([
        billingService.getBillingPeriods(),
        taxService.getTaxRules(),
        taxAuditService.getAuditLogs(),
      ]);
      setPeriods(p);
      setRules(r);
      setAuditLogs(a);
      if (p.length) setPeriodCode(p[0].periodCode);
    };
    load();
  }, []);

  const selectedPeriod = useMemo(
    () => periods.find((p) => p.periodCode === periodCode) ?? null,
    [periods, periodCode]
  );

  useEffect(() => {
    if (!selectedPeriod) return;
    let cancelled = false;
    taxCalculationService
      .getTaxSummary(
        selectedPeriod.period,
        selectedPeriod.countryBreakdown.map((c) => ({
          amount: c.taxableAmount,
          billingCountryCode: c.isoCode,
          billingCountryName: c.countryName,
          serviceType: DEFAULT_SERVICE_TYPE,
          transactionDate: selectedPeriod.endDate,
          calls: c.calls,
          durationHours: c.durationHours,
        }))
      )
      .then((s) => !cancelled && setSummary(s));
    return () => {
      cancelled = true;
    };
  }, [selectedPeriod]);

  /** Country rows joined with the rule that produced their tax, for reporting. */
  const taxSummaryRows = useMemo(() => {
    if (!selectedPeriod || !summary) return [];
    return summary.byCountry.map((country) => {
      const rule = rules.find(
        (r) =>
          r.isoCode === country.isoCode &&
          r.status === 'Active' &&
          r.serviceType === DEFAULT_SERVICE_TYPE &&
          r.effectiveFrom <= selectedPeriod.endDate &&
          (!r.effectiveTo || r.effectiveTo >= selectedPeriod.endDate)
      );
      return {
        country: country.countryName,
        isoCode: country.isoCode,
        taxType: rule?.taxType ?? '—',
        taxName: rule?.taxName ?? '—',
        rate: rule?.rate ?? 0,
        calls: country.calls,
        durationHours: country.durationHours,
        taxableAmount: country.taxableAmount,
        taxAmount: country.taxAmount,
        totalAmount: country.totalAmount,
      };
    });
  }, [selectedPeriod, summary, rules]);

  const filteredSummaryRows = useMemo(
    () =>
      countryFilter === 'ALL'
        ? taxSummaryRows
        : taxSummaryRows.filter((r) => r.isoCode === countryFilter),
    [taxSummaryRows, countryFilter]
  );

  const filteredRules = useMemo(
    () => (countryFilter === 'ALL' ? rules : rules.filter((r) => r.isoCode === countryFilter)),
    [rules, countryFilter]
  );

  const rateChangeLogs = useMemo(
    () => auditLogs.filter((log) => log.changedBy !== 'system.migration'),
    [auditLogs]
  );

  const handleExport = () => {
    if (activeReport === 'tax-summary') {
      exportToCSV(filteredSummaryRows, `Tax_Summary_${periodCode}`, [
        { key: 'country', label: 'Country' },
        { key: 'taxType', label: 'Tax Type' },
        { key: 'taxName', label: 'Tax Name' },
        { key: 'rate', label: 'Tax Rate (%)' },
        { key: 'taxableAmount', label: 'Taxable Amount (EUR)' },
        { key: 'taxAmount', label: 'Tax Amount (EUR)' },
        { key: 'totalAmount', label: 'Total Amount (EUR)' },
      ]);
    } else if (activeReport === 'country-tax') {
      exportToCSV(filteredSummaryRows, `Country_Wise_Tax_${periodCode}`, [
        { key: 'country', label: 'Country' },
        { key: 'calls', label: 'Calls' },
        { key: 'taxableAmount', label: 'Billing Amount (EUR)' },
        { key: 'taxAmount', label: 'Tax (EUR)' },
        { key: 'totalAmount', label: 'Total (EUR)' },
      ]);
    } else if (activeReport === 'tax-rate') {
      exportToCSV(filteredRules, 'Tax_Rate_Report', [
        { key: 'countryName', label: 'Country' },
        { key: 'taxName', label: 'Tax Name' },
        { key: 'rate', label: 'Rate (%)' },
        { key: 'effectiveFrom', label: 'Effective From' },
        { key: 'effectiveTo', label: 'Effective To' },
        { key: 'status', label: 'Status' },
      ]);
    } else {
      exportToCSV(rateChangeLogs, 'Tax_Audit_Report', [
        { key: 'taxRuleLabel', label: 'Tax Rule' },
        { key: 'oldRate', label: 'Previous Rate' },
        { key: 'newRate', label: 'New Rate' },
        { key: 'changedBy', label: 'Changed By' },
        { key: 'changedAt', label: 'Changed Date' },
        { key: 'reason', label: 'Reason' },
      ]);
    }
  };

  const countryOptions = useMemo(() => {
    const map = new Map<string, string>();
    rules.forEach((r) => map.set(r.isoCode, r.countryName));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [rules]);

  const showsPeriod = activeReport === 'tax-summary' || activeReport === 'country-tax';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Tax &amp; VAT Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tax summary, country-wise tax, configured rates, and the tax rule audit trail.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {showsPeriod && (
            <select
              value={periodCode}
              onChange={(e) => setPeriodCode(e.target.value)}
              className={selectClass}
            >
              {periods.map((p) => (
                <option key={p.id} value={p.periodCode}>
                  {p.period}
                </option>
              ))}
            </select>
          )}
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
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          const active = activeReport === report.key;
          return (
            <button
              key={report.key}
              type="button"
              onClick={() => setActiveReport(report.key)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                active
                  ? 'bg-white border-teal-400 ring-2 ring-teal-100 shadow-md'
                  : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    active ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">{report.label}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{report.description}</p>
            </button>
          );
        })}
      </div>

      {/* TAX SUMMARY REPORT */}
      {activeReport === 'tax-summary' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tax Summary Report — {selectedPeriod?.period ?? '—'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className={thClass}>Country</th>
                  <th className={thClass}>Tax Type</th>
                  <th className={thClass}>Tax Name</th>
                  <th className={`${thClass} text-right`}>Tax Rate</th>
                  <th className={`${thClass} text-right`}>Taxable Amount</th>
                  <th className={`${thClass} text-right`}>Tax Amount</th>
                  <th className={`${thClass} text-right`}>Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSummaryRows.map((row) => (
                  <tr key={row.isoCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-foreground">
                      {row.country}
                      <span className="ml-1.5 text-[10px] font-mono text-slate-400">{row.isoCode}</span>
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">{row.taxType}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">{row.taxName}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                      {formatRate(row.rate)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                      {formatCurrency(row.taxableAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                      {formatCurrency(row.taxAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(row.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td className="py-2.5 px-3.5" colSpan={4}>
                    Total
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    {formatCurrency(filteredSummaryRows.reduce((s, r) => s + r.taxableAmount, 0))}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    {formatCurrency(filteredSummaryRows.reduce((s, r) => s + r.taxAmount, 0))}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-emerald-700">
                    {formatCurrency(filteredSummaryRows.reduce((s, r) => s + r.totalAmount, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* COUNTRY-WISE TAX REPORT */}
      {activeReport === 'country-tax' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Country-wise Tax Report — {selectedPeriod?.period ?? '—'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className={thClass}>Country</th>
                  <th className={`${thClass} text-right`}>Calls</th>
                  <th className={`${thClass} text-right`}>Duration</th>
                  <th className={`${thClass} text-right`}>Billing Amount</th>
                  <th className={`${thClass} text-right`}>Tax</th>
                  <th className={`${thClass} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSummaryRows.map((row) => (
                  <tr key={row.isoCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-foreground">
                      {row.country}
                      <span className="ml-1.5 text-[10px] font-mono text-slate-400">{row.isoCode}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                      {formatNumber(row.calls)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                      {formatNumber(row.durationHours)} hrs
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                      {formatCurrency(row.taxableAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                      {formatCurrency(row.taxAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(row.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAX RATE REPORT */}
      {activeReport === 'tax-rate' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tax Rate Report
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {filteredRules.length} configured rules
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className={thClass}>Country</th>
                  <th className={thClass}>Tax Name</th>
                  <th className={`${thClass} text-right`}>Rate</th>
                  <th className={thClass}>Effective From</th>
                  <th className={thClass}>Effective To</th>
                  <th className={`${thClass} text-center`}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRules.map((rule) => (
                  <tr key={rule.taxRuleId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-foreground">
                      {rule.countryName}
                      <span className="ml-1.5 text-[10px] font-mono text-slate-400">{rule.isoCode}</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-700">
                      {rule.taxName}
                      <Badge variant="neutral" size="sm" className="ml-1.5">
                        {rule.rateCategory}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                      {formatRate(rule.rate)}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-600">{rule.effectiveFrom}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-500">
                      {rule.effectiveTo ?? '—'}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge variant={rule.status === 'Active' ? 'success' : 'neutral'} size="sm">
                        {rule.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAX AUDIT REPORT */}
      {activeReport === 'tax-audit' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tax Audit Report
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Excludes the initial master data load
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className={thClass}>Tax Rule</th>
                  <th className={`${thClass} text-center`}>Action</th>
                  <th className={`${thClass} text-right`}>Previous Rate</th>
                  <th className={`${thClass} text-right`}>New Rate</th>
                  <th className={thClass}>Changed By</th>
                  <th className={thClass}>Changed Date</th>
                  <th className={thClass}>Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rateChangeLogs.map((log) => (
                  <tr key={log.auditId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800">{log.taxRuleLabel}</td>
                    <td className="py-2.5 px-3.5 text-center">
                      <Badge
                        variant={
                          log.action === 'Rate Changed'
                            ? 'warning'
                            : log.action === 'Deactivated'
                              ? 'danger'
                              : 'info'
                        }
                        size="sm"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                      {log.oldRate !== null ? formatRate(log.oldRate) : '—'}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                      {log.newRate !== null ? formatRate(log.newRate) : '—'}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-600">{log.changedBy}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-500">
                      {log.changedAt.slice(0, 10)}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 max-w-sm">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
