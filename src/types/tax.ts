/**
 * Tax & VAT domain model for the CDR Billing System.
 *
 * This release carries Europe only: every country, tax rule and tax type in the
 * master data is European VAT on Telecom Services. `Region` stays a plain string
 * so another region could be onboarded later purely as master data, but nothing
 * outside Europe is seeded or selectable anywhere in the application.
 */

export type Region = string;

/** The only region carried by this release. */
export const REGION_EUROPE = 'Europe';

/** Regions offered in the UI. Europe only — no other region is configured. */
export const SUPPORTED_REGIONS: Region[] = [REGION_EUROPE];

export type TaxType = 'VAT' | 'GST' | 'Sales Tax' | 'Other';

/** Tax types selectable for European tax rules. Europe is VAT-only. */
export const EUROPE_TAX_TYPES: TaxType[] = ['VAT'];

export type RateCategory = 'Standard' | 'Reduced' | 'Super Reduced' | 'Zero' | 'Exempt';

export type ServiceType = 'Telecom Services' | 'Data Services' | 'Equipment Rental' | 'Professional Services';

export type RecordStatus = 'Active' | 'Inactive';

/** Sub-classification used only for reporting/filtering inside the Europe region. */
export type EuropeBloc = 'EU' | 'Non-EU';

export interface Country {
  countryId: string;
  countryName: string;
  isoCode: string;
  region: Region;
  bloc?: EuropeBloc;
  currency: string;
  taxSystem: TaxType;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaxRule {
  taxRuleId: string;
  countryId: string;
  countryName: string;
  isoCode: string;
  region: Region;
  taxType: TaxType;
  taxName: string;
  /** Percentage, e.g. 19 means 19%. */
  rate: number;
  rateCategory: RateCategory;
  serviceType: ServiceType;
  effectiveFrom: string; // ISO yyyy-mm-dd
  effectiveTo: string | null; // null = open ended
  status: RecordStatus;
  /** Higher number wins when several rules match the same country/service/date. */
  priority: number;
  taxInclusive: boolean;
  reverseCharge: boolean;
  exemptionCode: string | null;
  sourceReference: string;
  lastVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type TaxAuditAction =
  | 'Created'
  | 'Updated'
  | 'Activated'
  | 'Deactivated'
  | 'Rate Changed'
  | 'Effective Date Changed';

export interface TaxAuditLog {
  auditId: string;
  taxRuleId: string;
  /** Denormalised for readable audit reports without a join. */
  taxRuleLabel: string;
  action: TaxAuditAction;
  oldRate: number | null;
  newRate: number | null;
  oldStatus: RecordStatus | null;
  newStatus: RecordStatus | null;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedAt: string;
  reason: string;
}

/**
 * Outcome of tax resolution for a single billable transaction.
 * TAX_REVIEW_REQUIRED is set when no applicable rule exists — the engine never
 * guesses a rate.
 */
export type TaxStatus =
  | 'NOT_CALCULATED'
  | 'CALCULATED'
  | 'EXEMPT'
  | 'ZERO_RATED'
  | 'REVERSE_CHARGE'
  | 'TAX_REVIEW_REQUIRED';

export interface TaxCalculationResult {
  taxRuleId: string | null;
  taxType: TaxType | null;
  taxName: string | null;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxInclusive: boolean;
  reverseCharge: boolean;
  exemptionCode: string | null;
  taxStatus: TaxStatus;
  /** Human readable explanation shown in the billing validation queue. */
  message?: string;
}

/**
 * Jurisdiction inputs for a billable transaction. These are deliberately kept
 * as separate concepts — tax is resolved from `billingCountryCode` only, unless
 * a business rule says otherwise.
 */
export interface TaxJurisdictionContext {
  billingCountryCode: string;
  serviceCountryCode?: string;
  customerCountryCode?: string;
  destinationCountryCode?: string;
}

export interface TaxValidationIssue {
  code:
    | 'MISSING_BILLING_COUNTRY'
    | 'NO_ACTIVE_RULE'
    | 'RULE_NOT_EFFECTIVE'
    | 'SERVICE_TYPE_UNSUPPORTED'
    | 'INVALID_RATE'
    | 'OVERLAPPING_RULES'
    | 'CALCULATION_MISMATCH'
    | 'INVOICE_TOTAL_MISMATCH'
    | 'INVALID_DATE_RANGE'
    | 'UNKNOWN_COUNTRY';
  severity: 'error' | 'warning';
  message: string;
}

export interface TaxValidationResult {
  isValid: boolean;
  issues: TaxValidationIssue[];
}

/** One row of the per-invoice tax summary (grouped by tax type + rate). */
export interface TaxSummaryLine {
  taxType: TaxType;
  taxName: string;
  rate: number;
  rateCategory: RateCategory;
  taxableAmount: number;
  taxAmount: number;
}

export interface CountryTaxSummary {
  countryName: string;
  isoCode: string;
  calls: number;
  durationHours: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface TaxSummary {
  billingPeriod: string;
  totalTaxableAmount: number;
  totalTaxAmount: number;
  totalVatAmount: number;
  totalAmount: number;
  taxableCalls: number;
  exemptCalls: number;
  zeroRatedCalls: number;
  reverseChargeCalls: number;
  reviewRequiredCalls: number;
  exemptAmount: number;
  lines: TaxSummaryLine[];
  byCountry: CountryTaxSummary[];
}
