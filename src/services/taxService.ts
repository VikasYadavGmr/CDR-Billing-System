import type { RecordStatus, ServiceType, TaxRule } from '../types/tax';
import { mockTaxRules, nextTaxRuleId } from '../mock-data/taxData';
import { mockCountries } from '../mock-data/countryData';
import { findApplicableTaxRule } from '../utils/taxEngine';
import { taxAuditService } from './taxAuditService';

const delay = <T,>(value: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Day before the given date — used to close off a superseded rate period. */
function previousDay(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export type NewTaxRuleInput = Omit<
  TaxRule,
  'taxRuleId' | 'countryId' | 'countryName' | 'isoCode' | 'createdAt' | 'updatedAt'
> & { isoCode: string };

export const taxService = {
  getTaxRules: async (): Promise<TaxRule[]> => delay([...mockTaxRules]),

  getTaxRuleById: async (taxRuleId: string): Promise<TaxRule | undefined> =>
    delay(mockTaxRules.find((r) => r.taxRuleId === taxRuleId)),

  getTaxRulesByCountry: async (isoCode: string): Promise<TaxRule[]> =>
    delay(mockTaxRules.filter((r) => r.isoCode.toUpperCase() === isoCode.toUpperCase())),

  /**
   * Resolves the rule governing a transaction. Returns null rather than falling
   * back to the country's standard rate — the caller must flag the record for
   * review instead of guessing.
   */
  findApplicableTaxRule: async (
    countryCode: string,
    serviceType: ServiceType,
    transactionDate: string
  ): Promise<TaxRule | null> =>
    delay(findApplicableTaxRule(mockTaxRules, countryCode, serviceType, transactionDate)),

  addTaxRule: async (input: NewTaxRuleInput, changedBy = 'admin', reason = 'New tax rule created.'): Promise<TaxRule> => {
    const country = mockCountries.find(
      (c) => c.isoCode.toUpperCase() === input.isoCode.toUpperCase()
    );
    if (!country) throw new Error(`Unknown country ISO code: ${input.isoCode}`);

    const now = new Date().toISOString();
    const rule: TaxRule = {
      ...input,
      taxRuleId: nextTaxRuleId(),
      countryId: country.countryId,
      countryName: country.countryName,
      isoCode: country.isoCode,
      region: country.region,
      createdAt: now,
      updatedAt: now,
    };

    mockTaxRules.push(rule);
    await taxAuditService.recordChange({
      rule,
      action: 'Created',
      newRate: rule.rate,
      newStatus: rule.status,
      newValue: `${rule.rate}% ${rule.rateCategory} — effective ${rule.effectiveFrom}`,
      changedBy,
      reason,
    });
    return rule;
  },

  /**
   * Updates rule metadata in place. A rate change is NOT handled here — use
   * `changeTaxRate` so the previous rate survives for historical invoices.
   */
  updateTaxRule: async (
    updated: TaxRule,
    changedBy = 'admin',
    reason = 'Tax rule updated.'
  ): Promise<TaxRule | null> => {
    const idx = mockTaxRules.findIndex((r) => r.taxRuleId === updated.taxRuleId);
    if (idx === -1) return null;

    const previous = mockTaxRules[idx];
    const next: TaxRule = { ...updated, rate: previous.rate, updatedAt: new Date().toISOString() };
    mockTaxRules[idx] = next;

    const effectiveDatesChanged =
      previous.effectiveFrom !== next.effectiveFrom || previous.effectiveTo !== next.effectiveTo;

    await taxAuditService.recordChange({
      rule: next,
      action: effectiveDatesChanged ? 'Effective Date Changed' : 'Updated',
      oldRate: previous.rate,
      newRate: next.rate,
      oldStatus: previous.status,
      newStatus: next.status,
      oldValue: effectiveDatesChanged
        ? `${previous.effectiveFrom} → ${previous.effectiveTo ?? 'open ended'}`
        : `${previous.taxName}, ${previous.rateCategory}, priority ${previous.priority}`,
      newValue: effectiveDatesChanged
        ? `${next.effectiveFrom} → ${next.effectiveTo ?? 'open ended'}`
        : `${next.taxName}, ${next.rateCategory}, priority ${next.priority}`,
      changedBy,
      reason,
    });
    return next;
  },

  /**
   * Versions a rate change: the current rule is closed the day before the new
   * rate takes effect and a new rule is created. Invoices dated in the old
   * period keep resolving to the old rate.
   */
  changeTaxRate: async (
    taxRuleId: string,
    newRate: number,
    effectiveFrom: string,
    changedBy = 'admin',
    reason = 'Rate change.'
  ): Promise<TaxRule | null> => {
    const idx = mockTaxRules.findIndex((r) => r.taxRuleId === taxRuleId);
    if (idx === -1) return null;

    const previous = mockTaxRules[idx];
    const now = new Date().toISOString();

    const closed: TaxRule = {
      ...previous,
      effectiveTo: previousDay(effectiveFrom),
      updatedAt: now,
    };
    mockTaxRules[idx] = closed;

    const version: TaxRule = {
      ...previous,
      taxRuleId: nextTaxRuleId(),
      rate: newRate,
      effectiveFrom,
      effectiveTo: null,
      status: 'Active',
      lastVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    mockTaxRules.push(version);

    await taxAuditService.recordChange({
      rule: version,
      action: 'Rate Changed',
      oldRate: previous.rate,
      newRate,
      oldValue: `${previous.rate}% (until ${closed.effectiveTo})`,
      newValue: `${newRate}% (from ${effectiveFrom})`,
      changedBy,
      reason,
    });
    return version;
  },

  setTaxRuleStatus: async (
    taxRuleId: string,
    status: RecordStatus,
    changedBy = 'admin',
    reason = 'Status change.'
  ): Promise<TaxRule | null> => {
    const idx = mockTaxRules.findIndex((r) => r.taxRuleId === taxRuleId);
    if (idx === -1) return null;

    const previous = mockTaxRules[idx];
    const next: TaxRule = { ...previous, status, updatedAt: new Date().toISOString() };
    mockTaxRules[idx] = next;

    await taxAuditService.recordChange({
      rule: next,
      action: status === 'Active' ? 'Activated' : 'Deactivated',
      oldStatus: previous.status,
      newStatus: status,
      oldValue: previous.status,
      newValue: status,
      changedBy,
      reason,
    });
    return next;
  },

  /** Re-confirms a rate against its official source without changing it. */
  verifyTaxRule: async (taxRuleId: string, changedBy = 'admin'): Promise<TaxRule | null> => {
    const idx = mockTaxRules.findIndex((r) => r.taxRuleId === taxRuleId);
    if (idx === -1) return null;
    const previous = mockTaxRules[idx];
    const next: TaxRule = {
      ...previous,
      lastVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTaxRules[idx] = next;
    await taxAuditService.recordChange({
      rule: next,
      action: 'Updated',
      oldValue: `Last verified ${previous.lastVerifiedAt.slice(0, 10)}`,
      newValue: `Last verified ${todayIso()}`,
      changedBy,
      reason: 'Rate re-verified against its official source.',
    });
    return next;
  },
};
