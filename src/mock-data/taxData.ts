import type { RateCategory, TaxRule } from '../types/tax';
import { REGION_EUROPE } from '../types/tax';
import { mockCountries } from './countryData';

/**
 * Tax Rule Master — European VAT on Telecom Services.
 *
 * These are *reference* rates for the demo environment. Production data must be
 * populated from authoritative national / EU tax sources; each rule therefore
 * carries a source reference and a verification timestamp.
 *
 * Rules are never overwritten when a rate changes — a new rule is created with
 * its own effective period so historical invoices keep resolving to the rate
 * that applied on their transaction date (see the Germany 2026 / 2027 pair).
 */

const EU_SOURCE = 'European Commission — VAT rates applied in the EU Member States (TAXUD)';
const VERIFIED_AT = '2026-01-15T09:00:00Z';
const SEEDED_AT = '2026-01-01T00:00:00Z';

interface StandardRateSeed {
  iso: string;
  rate: number;
  source?: string;
}

/** Standard VAT reference rates per European country. */
const standardRates: StandardRateSeed[] = [
  { iso: 'AT', rate: 20 },
  { iso: 'BE', rate: 21 },
  { iso: 'BG', rate: 20 },
  { iso: 'HR', rate: 25 },
  { iso: 'CY', rate: 19 },
  { iso: 'CZ', rate: 21 },
  { iso: 'DK', rate: 25 },
  { iso: 'EE', rate: 24 },
  { iso: 'FI', rate: 25.5 },
  { iso: 'FR', rate: 20 },
  { iso: 'DE', rate: 19 },
  { iso: 'EL', rate: 24 },
  { iso: 'HU', rate: 27 },
  { iso: 'IE', rate: 23 },
  { iso: 'IT', rate: 22 },
  { iso: 'LV', rate: 21 },
  { iso: 'LT', rate: 21 },
  { iso: 'LU', rate: 17 },
  { iso: 'MT', rate: 18 },
  { iso: 'NL', rate: 21 },
  { iso: 'PL', rate: 23 },
  { iso: 'PT', rate: 23 },
  { iso: 'RO', rate: 21 },
  { iso: 'SK', rate: 23 },
  { iso: 'SI', rate: 22 },
  { iso: 'ES', rate: 21 },
  { iso: 'SE', rate: 25 },
  { iso: 'GB', rate: 20, source: 'HM Revenue & Customs — VAT rates (GOV.UK)' },
  { iso: 'NO', rate: 25, source: 'Skatteetaten — Norwegian VAT rates' },
  { iso: 'IS', rate: 24, source: 'Skatturinn — Icelandic VAT rates' },
  { iso: 'CH', rate: 8.1, source: 'Eidgenössische Steuerverwaltung — Swiss VAT rates' },
  { iso: 'TR', rate: 20, source: 'Gelir İdaresi Başkanlığı — Turkish VAT rates' },
];

interface ExtraRuleSeed {
  iso: string;
  taxName: string;
  rate: number;
  rateCategory: RateCategory;
  priority?: number;
  taxInclusive?: boolean;
  reverseCharge?: boolean;
  exemptionCode?: string;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  status?: 'Active' | 'Inactive';
  source?: string;
}

/**
 * Non-standard rules. Telecom is normally taxed at the standard rate, so these
 * exist to prove the engine resolves by rule rather than by country default:
 * reduced/zero/exempt categories, reverse charge, tax-inclusive pricing and a
 * future-dated rate change.
 */
const extraRules: ExtraRuleSeed[] = [
  // --- Greece: the primary billing jurisdiction for this deployment ---------
  {
    iso: 'EL',
    taxName: 'Reduced VAT',
    rate: 13,
    rateCategory: 'Reduced',
    priority: 20,
    status: 'Inactive',
    source: 'Ανεξάρτητη Αρχή Δημοσίων Εσόδων (AADE) — Greek VAT rates',
  },
  {
    iso: 'EL',
    taxName: 'Super Reduced VAT',
    rate: 6,
    rateCategory: 'Super Reduced',
    priority: 25,
    status: 'Inactive',
    source: 'Ανεξάρτητη Αρχή Δημοσίων Εσόδων (AADE) — Greek VAT rates',
  },
  {
    iso: 'EL',
    taxName: 'Intra-EU B2B Reverse Charge',
    rate: 0,
    rateCategory: 'Zero',
    priority: 30,
    reverseCharge: true,
    exemptionCode: 'EU-RC-196',
    status: 'Inactive',
    source: 'Council Directive 2006/112/EC Article 196 — reverse charge for B2B services',
  },
  {
    iso: 'DE',
    taxName: 'Standard VAT',
    rate: 20,
    rateCategory: 'Standard',
    effectiveFrom: '2027-01-01',
    effectiveTo: null,
    source: 'Bundesministerium der Finanzen — announced rate change effective 01-Jan-2027',
  },
  {
    iso: 'DE',
    taxName: 'Reduced VAT',
    rate: 7,
    rateCategory: 'Reduced',
    priority: 20,
    status: 'Inactive',
  },
  {
    iso: 'DE',
    taxName: 'Intra-EU B2B Reverse Charge',
    rate: 0,
    rateCategory: 'Zero',
    priority: 30,
    reverseCharge: true,
    exemptionCode: 'EU-RC-196',
    status: 'Inactive',
    source: 'Council Directive 2006/112/EC Article 196 — reverse charge for B2B services',
  },
  {
    iso: 'FR',
    taxName: 'Reduced VAT',
    rate: 10,
    rateCategory: 'Reduced',
    priority: 20,
    status: 'Inactive',
  },
  {
    iso: 'IE',
    taxName: 'Reduced VAT',
    rate: 13.5,
    rateCategory: 'Reduced',
    priority: 20,
    status: 'Inactive',
    source: 'Revenue Commissioners — Irish VAT rates',
  },
  {
    iso: 'IE',
    taxName: 'Zero Rate',
    rate: 0,
    rateCategory: 'Zero',
    priority: 25,
    status: 'Inactive',
    source: 'Revenue Commissioners — zero-rated supplies',
  },
  {
    iso: 'LU',
    taxName: 'Super Reduced VAT',
    rate: 3,
    rateCategory: 'Super Reduced',
    priority: 20,
    status: 'Inactive',
  },
  {
    iso: 'ES',
    taxName: 'Super Reduced VAT',
    rate: 4,
    rateCategory: 'Super Reduced',
    priority: 20,
    status: 'Inactive',
  },
  {
    iso: 'IT',
    taxName: 'Reduced VAT',
    rate: 10,
    rateCategory: 'Reduced',
    priority: 20,
    status: 'Inactive',
  },
  {
    iso: 'NL',
    taxName: 'Exempt — Diplomatic Telecom Services',
    rate: 0,
    rateCategory: 'Exempt',
    priority: 30,
    exemptionCode: 'NL-EXM-DIP-01',
    status: 'Inactive',
    source: 'Belastingdienst — VAT exemption for diplomatic missions',
  },
  {
    iso: 'SE',
    taxName: 'Standard VAT (Tax Inclusive)',
    rate: 25,
    rateCategory: 'Standard',
    priority: 20,
    taxInclusive: true,
    status: 'Inactive',
    source: 'Skatteverket — Swedish VAT rates (gross-priced telecom contracts)',
  },
];

let sequence = 0;
const nextRuleId = () => `TAX-${String(++sequence).padStart(4, '0')}`;

function buildRule(
  iso: string,
  overrides: Partial<TaxRule> & Pick<TaxRule, 'taxName' | 'rate' | 'rateCategory'>
): TaxRule {
  const country = mockCountries.find((c) => c.isoCode === iso);
  if (!country) {
    throw new Error(`Tax rule references unknown country ISO code: ${iso}`);
  }
  return {
    taxRuleId: nextRuleId(),
    countryId: country.countryId,
    countryName: country.countryName,
    isoCode: country.isoCode,
    region: REGION_EUROPE,
    taxType: 'VAT',
    serviceType: 'Telecom Services',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    status: 'Active',
    priority: 10,
    taxInclusive: false,
    reverseCharge: false,
    exemptionCode: null,
    sourceReference: EU_SOURCE,
    lastVerifiedAt: VERIFIED_AT,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    ...overrides,
  };
}

const standardRuleSet: TaxRule[] = standardRates.map((seed) =>
  buildRule(seed.iso, {
    taxName: 'Standard VAT',
    rate: seed.rate,
    rateCategory: 'Standard',
    // Germany's 19% rule is closed off the day before the 2027 rate takes over.
    effectiveTo: seed.iso === 'DE' ? '2026-12-31' : null,
    sourceReference: seed.source ?? EU_SOURCE,
  })
);

const extraRuleSet: TaxRule[] = extraRules.map((seed) =>
  buildRule(seed.iso, {
    taxName: seed.taxName,
    rate: seed.rate,
    rateCategory: seed.rateCategory,
    priority: seed.priority ?? 10,
    taxInclusive: seed.taxInclusive ?? false,
    reverseCharge: seed.reverseCharge ?? false,
    exemptionCode: seed.exemptionCode ?? null,
    effectiveFrom: seed.effectiveFrom ?? '2026-01-01',
    effectiveTo: seed.effectiveTo ?? null,
    status: seed.status ?? 'Active',
    sourceReference: seed.source ?? EU_SOURCE,
  })
);

export const mockTaxRules: TaxRule[] = [...standardRuleSet, ...extraRuleSet];

export const nextTaxRuleId = (): string => nextRuleId();
