import type { CallType } from './cdr';
import type { CountryTaxSummary, TaxStatus, TaxSummaryLine } from './tax';

export type InvoiceStatus = 'Draft' | 'Generated' | 'Approved' | 'Paid';

export interface BillingPeriod {
  id: string;
  period: string; // e.g., 'August 2026'
  periodCode: string; // e.g., '2026-08'
  startDate: string;
  endDate: string;
  totalCalls: number;
  billableCalls: number;
  totalDurationHours: number;
  subtotal: number;
  /**
   * Blended effective tax rate for the period. Present for at-a-glance display
   * only — the authoritative breakdown is `taxLines`, since one invoice can span
   * several countries and rate categories.
   */
  taxRatePercent: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  generatedDate: string;
  dueDate: string;
  invoiceNumber: string;

  /** Primary tax jurisdiction of the billing entity for this cycle. */
  billingCountry: string;
  billingCountryCode: string;
  /** Per tax-type/rate breakdown backing the invoice tax summary. */
  taxLines: TaxSummaryLine[];
  /** Per-country rollup used by country-wise billing and reports. */
  countryBreakdown: CountryTaxSummary[];
  /** Worst tax status across the period's transactions. */
  taxStatus: TaxStatus;
  /** Charges that could not be taxed and await review. */
  reviewRequiredAmount: number;
}

export interface RatePlanItem {
  id: string;
  callType: CallType;
  description: string;
  ratePerMinute: number;
  pulseSeconds: number;
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export interface DepartmentBillBreakdown {
  department: string;
  extensionsCount: number;
  totalCalls: number;
  talkTimeHours: number;
  subtotal: number;
  tax: number;
  total: number;
}
