import type { TaxAuditAction, TaxAuditLog, TaxRule } from '../types/tax';
import { mockTaxRules } from './taxData';

/**
 * Tax Audit Trail.
 *
 * Every mutation of a tax rule is journalled here. The trail is append-only:
 * historical invoices resolve against the rule version that was effective on
 * their transaction date, so an audit entry never rewrites a past invoice.
 */

const ruleLabel = (rule: TaxRule) => `${rule.countryName} — ${rule.taxName} (${rule.rate}%)`;

const findRule = (iso: string, taxName: string): TaxRule | undefined =>
  mockTaxRules.find((r) => r.isoCode === iso && r.taxName === taxName);

let sequence = 0;
const nextAuditId = () => `AUD-${String(++sequence).padStart(4, '0')}`;

/** Seed entry recorded when the Europe VAT master was first loaded. */
const seedEntries: TaxAuditLog[] = mockTaxRules.map((rule) => ({
  auditId: nextAuditId(),
  taxRuleId: rule.taxRuleId,
  taxRuleLabel: ruleLabel(rule),
  action: 'Created' as TaxAuditAction,
  oldRate: null,
  newRate: rule.rate,
  oldStatus: null,
  newStatus: rule.status,
  oldValue: null,
  newValue: `${rule.rate}% ${rule.rateCategory} — effective ${rule.effectiveFrom}`,
  changedBy: 'system.migration',
  changedAt: '2026-01-01T00:00:00Z',
  reason: 'Initial load of the European VAT master for Telecom Services.',
}));

interface AuditSeed {
  iso: string;
  taxName: string;
  action: TaxAuditAction;
  oldRate?: number | null;
  newRate?: number | null;
  oldStatus?: 'Active' | 'Inactive' | null;
  newStatus?: 'Active' | 'Inactive' | null;
  oldValue?: string | null;
  newValue?: string | null;
  changedBy: string;
  changedAt: string;
  reason: string;
}

const activitySeeds: AuditSeed[] = [
  {
    iso: 'FI',
    taxName: 'Standard VAT',
    action: 'Rate Changed',
    oldRate: 24,
    newRate: 25.5,
    oldValue: '24%',
    newValue: '25.5%',
    changedBy: 'anna.virtanen',
    changedAt: '2026-02-04T10:12:00Z',
    reason: 'Finnish standard VAT increased to 25.5%; verified against national tax authority.',
  },
  {
    iso: 'EE',
    taxName: 'Standard VAT',
    action: 'Rate Changed',
    oldRate: 22,
    newRate: 24,
    oldValue: '22%',
    newValue: '24%',
    changedBy: 'anna.virtanen',
    changedAt: '2026-02-04T10:26:00Z',
    reason: 'Estonian standard VAT increased to 24%.',
  },
  {
    iso: 'DE',
    taxName: 'Standard VAT',
    action: 'Effective Date Changed',
    oldRate: 19,
    newRate: 19,
    oldValue: 'Effective To: open ended',
    newValue: 'Effective To: 2026-12-31',
    changedBy: 'markus.weber',
    changedAt: '2026-03-18T08:45:00Z',
    reason: 'Closed the 19% period ahead of the announced 2027 rate change. Historic invoices unaffected.',
  },
  {
    iso: 'CH',
    taxName: 'Standard VAT',
    action: 'Updated',
    oldRate: 8.1,
    newRate: 8.1,
    oldValue: 'Last verified 2026-01-15',
    newValue: 'Last verified 2026-04-02',
    changedBy: 'markus.weber',
    changedAt: '2026-04-02T13:05:00Z',
    reason: 'Quarterly re-verification of Swiss VAT against the federal tax administration.',
  },
  {
    iso: 'NL',
    taxName: 'Exempt — Diplomatic Telecom Services',
    action: 'Deactivated',
    oldStatus: 'Active',
    newStatus: 'Inactive',
    oldValue: 'Active',
    newValue: 'Inactive',
    changedBy: 'sofie.jansen',
    changedAt: '2026-05-21T15:30:00Z',
    reason: 'No diplomatic telecom contracts in the current billing scope; rule parked for future use.',
  },
  {
    iso: 'IE',
    taxName: 'Reduced VAT',
    action: 'Deactivated',
    oldStatus: 'Active',
    newStatus: 'Inactive',
    oldValue: 'Active',
    newValue: 'Inactive',
    changedBy: 'sofie.jansen',
    changedAt: '2026-06-09T09:15:00Z',
    reason: 'Irish telecom supplies are taxed at the standard rate; reduced rule retained but disabled.',
  },
  {
    iso: 'GB',
    taxName: 'Standard VAT',
    action: 'Updated',
    oldRate: 20,
    newRate: 20,
    oldValue: 'Source: EU TAXUD',
    newValue: 'Source: HM Revenue & Customs — VAT rates (GOV.UK)',
    changedBy: 'markus.weber',
    changedAt: '2026-07-14T11:40:00Z',
    reason: 'Corrected the source reference for a non-EU European jurisdiction.',
  },
  {
    iso: 'DE',
    taxName: 'Intra-EU B2B Reverse Charge',
    action: 'Deactivated',
    oldStatus: 'Active',
    newStatus: 'Inactive',
    oldValue: 'Active',
    newValue: 'Inactive',
    changedBy: 'markus.weber',
    changedAt: '2026-08-03T16:20:00Z',
    reason: 'Reverse charge applies per customer agreement only; enabled on demand during invoicing.',
  },
];

const activityEntries: TaxAuditLog[] = activitySeeds.flatMap((seed) => {
  const rule = findRule(seed.iso, seed.taxName);
  if (!rule) return [];
  return [
    {
      auditId: nextAuditId(),
      taxRuleId: rule.taxRuleId,
      taxRuleLabel: ruleLabel(rule),
      action: seed.action,
      oldRate: seed.oldRate ?? null,
      newRate: seed.newRate ?? null,
      oldStatus: seed.oldStatus ?? null,
      newStatus: seed.newStatus ?? null,
      oldValue: seed.oldValue ?? null,
      newValue: seed.newValue ?? null,
      changedBy: seed.changedBy,
      changedAt: seed.changedAt,
      reason: seed.reason,
    },
  ];
});

export const mockTaxAuditLogs: TaxAuditLog[] = [...seedEntries, ...activityEntries].sort((a, b) =>
  b.changedAt.localeCompare(a.changedAt)
);

export const nextTaxAuditId = (): string => nextAuditId();
