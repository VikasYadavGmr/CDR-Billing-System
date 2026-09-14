import React from 'react';
import type { TaxAuditLog, TaxRule } from '../../types/tax';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { formatCurrency, formatRate } from '../../utils/billingCalculator';
import { calculateTax } from '../../utils/taxEngine';
import { BookMarked, Clock, History, Percent, ShieldCheck } from 'lucide-react';

interface TaxRuleDetailDrawerProps {
  rule: TaxRule | null;
  auditLogs: TaxAuditLog[];
  /** Other rules for the same country, to show the rate history. */
  relatedRules: TaxRule[];
  isOpen: boolean;
  onClose: () => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <span className="block text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
      {label}
    </span>
    <span className="text-xs font-semibold text-slate-800">{children}</span>
  </div>
);

/** Worked example so an administrator can see what the rule does to an amount. */
const SAMPLE_AMOUNT = 100;

export const TaxRuleDetailDrawer: React.FC<TaxRuleDetailDrawerProps> = ({
  rule,
  auditLogs,
  relatedRules,
  isOpen,
  onClose,
}) => {
  if (!rule) return null;

  const sample = calculateTax(SAMPLE_AMOUNT, rule);
  const ruleAudit = auditLogs.filter((log) => log.taxRuleId === rule.taxRuleId);
  const history = [...relatedRules]
    .filter((r) => r.taxName === rule.taxName && r.serviceType === rule.serviceType)
    .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${rule.countryName} — ${rule.taxName}`}
      subtitle={`${rule.taxType} ${formatRate(rule.rate)} on ${rule.serviceType} • ${rule.taxRuleId}`}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Headline */}
        <div className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-800 tracking-tight leading-none">
                {formatRate(rule.rate)}
              </p>
              <p className="text-[11px] text-teal-700 font-semibold mt-1">
                {rule.rateCategory} • {rule.isoCode} • {rule.region}
              </p>
            </div>
          </div>
          <Badge variant={rule.status === 'Active' ? 'success' : 'neutral'}>{rule.status}</Badge>
        </div>

        {/* Configuration */}
        <section className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Rule Configuration
          </h4>
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <Field label="Country">{rule.countryName}</Field>
            <Field label="ISO Code">
              <span className="font-mono">{rule.isoCode}</span>
            </Field>
            <Field label="Tax Type">{rule.taxType}</Field>
            <Field label="Service Type">{rule.serviceType}</Field>
            <Field label="Effective From">
              <span className="font-mono">{rule.effectiveFrom}</span>
            </Field>
            <Field label="Effective To">
              <span className="font-mono">{rule.effectiveTo ?? 'Open ended'}</span>
            </Field>
            <Field label="Priority">
              <span className="font-mono">{rule.priority}</span>
            </Field>
            <Field label="Exemption Code">
              <span className="font-mono">{rule.exemptionCode ?? '—'}</span>
            </Field>
            <Field label="Tax Inclusive">{rule.taxInclusive ? 'Yes' : 'No'}</Field>
            <Field label="Reverse Charge">{rule.reverseCharge ? 'Yes' : 'No'}</Field>
          </div>
        </section>

        {/* Worked example */}
        <section className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Calculation Example
          </h4>
          <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>
                {rule.taxInclusive ? 'Gross call charge' : 'Call charge (net)'}
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCurrency(SAMPLE_AMOUNT)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxable amount</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCurrency(sample.taxableAmount)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>
                {rule.taxName} {formatRate(rule.rate)}
              </span>
              <span className="font-mono font-semibold text-slate-900">
                {formatCurrency(sample.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-emerald-700">
              <span>Total amount</span>
              <span className="font-mono text-sm">{formatCurrency(sample.totalAmount)}</span>
            </div>
            {sample.message && (
              <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">{sample.message}</p>
            )}
          </div>
        </section>

        {/* Provenance */}
        <section className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Source &amp; Verification
          </h4>
          <div className="rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <BookMarked className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 leading-relaxed">{rule.sourceReference}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>Last verified {rule.lastVerifiedAt.slice(0, 10)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>
                Created {rule.createdAt.slice(0, 10)} • Updated {rule.updatedAt.slice(0, 10)}
              </span>
            </div>
          </div>
        </section>

        {/* Rate versions */}
        {history.length > 1 && (
          <section className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Rate Versions for {rule.countryName}
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-600 font-semibold">
                    <th className="py-2 px-3">Rate</th>
                    <th className="py-2 px-3">Effective From</th>
                    <th className="py-2 px-3">Effective To</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((version) => (
                    <tr
                      key={version.taxRuleId}
                      className={version.taxRuleId === rule.taxRuleId ? 'bg-teal-50/60' : ''}
                    >
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {formatRate(version.rate)}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">{version.effectiveFrom}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">
                        {version.effectiveTo ?? 'Open ended'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={version.status === 'Active' ? 'success' : 'neutral'} size="sm">
                          {version.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Audit */}
        <section className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Change History
          </h4>
          {ruleAudit.length === 0 ? (
            <p className="text-xs text-slate-400">No changes recorded for this rule.</p>
          ) : (
            <ol className="space-y-2.5">
              {ruleAudit.map((log) => (
                <li
                  key={log.auditId}
                  className="rounded-xl border border-slate-200 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={log.action === 'Rate Changed' ? 'warning' : 'info'} size="sm">
                      {log.action}
                    </Badge>
                    <span className="text-[10.5px] font-mono text-slate-400">
                      {log.changedAt.slice(0, 10)} • {log.changedBy}
                    </span>
                  </div>
                  {(log.oldValue || log.newValue) && (
                    <p className="font-mono text-[11px] text-slate-600">
                      {log.oldValue ?? '—'} → {log.newValue ?? '—'}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 leading-relaxed">{log.reason}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </Drawer>
  );
};
