import React from 'react';
import type { TaxSummary } from '../../types/tax';
import { Badge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatNumber, formatRate } from '../../utils/billingCalculator';
import { AlertTriangle, BadgeEuro, Ban, Globe2, Receipt } from 'lucide-react';

interface TaxSummaryPanelProps {
  summary: TaxSummary | null;
  loading?: boolean;
}

export const TaxSummaryPanel: React.FC<TaxSummaryPanelProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="bg-card border border-border rounded-xl p-10 text-center text-xs text-slate-400">
        {loading ? 'Calculating tax summary...' : 'No tax summary available for this period.'}
      </div>
    );
  }

  const totalTaxable = summary.totalTaxableAmount || 1;

  return (
    <div className="space-y-4">
      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Taxable Amount"
          value={formatCurrency(summary.totalTaxableAmount)}
          subtitle={`${formatNumber(summary.taxableCalls)} taxable calls`}
          icon={Receipt}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
        />
        <StatCard
          title="Total VAT"
          value={formatCurrency(summary.totalVatAmount)}
          subtitle={`Blended rate ${formatRate((summary.totalTaxAmount / totalTaxable) * 100)}`}
          icon={BadgeEuro}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <StatCard
          title="Non-Taxed Amount"
          value={formatCurrency(summary.exemptAmount)}
          subtitle={`${formatNumber(summary.exemptCalls)} exempt • ${formatNumber(summary.zeroRatedCalls)} zero-rated`}
          icon={Ban}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Total Invoiced"
          value={formatCurrency(summary.totalAmount)}
          subtitle={
            summary.reviewRequiredCalls > 0
              ? `${formatNumber(summary.reviewRequiredCalls)} awaiting tax review`
              : 'All charges successfully taxed'
          }
          icon={summary.reviewRequiredCalls > 0 ? AlertTriangle : Globe2}
          iconColor={summary.reviewRequiredCalls > 0 ? 'text-rose-600' : 'text-emerald-600'}
          iconBg={summary.reviewRequiredCalls > 0 ? 'bg-rose-50' : 'bg-emerald-50'}
        />
      </div>

      {summary.reviewRequiredCalls > 0 && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-rose-700 leading-relaxed">
            <span className="font-bold">{formatNumber(summary.reviewRequiredCalls)} charge(s) are
            flagged TAX_REVIEW_REQUIRED.</span>{' '}
            No applicable tax rule was found for their billing country, service type and date. They are
            held in the billing validation queue — the engine will not apply a guessed rate.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Tax rate distribution */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Tax Rate Distribution
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className="py-3 px-3.5">Tax Type</th>
                  <th className="py-3 px-3.5">Tax Name</th>
                  <th className="py-3 px-3.5 text-right">Rate</th>
                  <th className="py-3 px-3.5 text-right">Taxable Amount</th>
                  <th className="py-3 px-3.5 text-right">Tax</th>
                  <th className="py-3 px-3.5 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {summary.lines.map((line) => (
                  <tr
                    key={`${line.taxType}-${line.rate}-${line.rateCategory}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-2.5 px-3.5 font-semibold text-slate-700">{line.taxType}</td>
                    <td className="py-2.5 px-3.5 text-slate-600">
                      {line.taxName}
                      <Badge variant="neutral" size="sm" className="ml-1.5">
                        {line.rateCategory}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                      {formatRate(line.rate)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                      {formatCurrency(line.taxableAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(line.taxAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                      {formatRate((line.taxableAmount / totalTaxable) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td className="py-2.5 px-3.5" colSpan={3}>
                    Total
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    {formatCurrency(summary.totalTaxableAmount)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-emerald-700">
                    {formatCurrency(summary.totalTaxAmount)}
                  </td>
                  <td className="py-2.5 px-3.5" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Country-wise tax */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Country-wise Tax
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className="py-3 px-3.5">Country</th>
                  <th className="py-3 px-3.5">ISO</th>
                  <th className="py-3 px-3.5 text-right">Calls</th>
                  <th className="py-3 px-3.5 text-right">Taxable Amount</th>
                  <th className="py-3 px-3.5 text-right">Tax</th>
                  <th className="py-3 px-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {summary.byCountry.map((country) => (
                  <tr key={country.isoCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-foreground">{country.countryName}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {country.isoCode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-600">
                      {formatNumber(country.calls)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                      {formatCurrency(country.taxableAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                      {formatCurrency(country.taxAmount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(country.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td className="py-2.5 px-3.5" colSpan={3}>
                    Total
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    {formatCurrency(summary.totalTaxableAmount)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono">
                    {formatCurrency(summary.totalTaxAmount)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-emerald-700">
                    {formatCurrency(summary.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
