import type {
  RateCategory,
  ServiceType,
  TaxCalculationResult,
  TaxRule,
  TaxStatus,
  TaxSummaryLine,
  TaxValidationIssue,
  TaxValidationResult,
} from '../types/tax';

/**
 * Tax engine for the CDR Billing System.
 *
 * The engine holds no country rates of its own. Every amount is resolved as
 *
 *   country + service type + transaction date + status + priority -> tax rule
 *
 * so a tax administrator can change rates purely through the Tax & VAT master.
 * When no applicable rule exists the engine refuses to guess and flags the
 * transaction as TAX_REVIEW_REQUIRED instead.
 */

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

/** Normalises a date-like input to a comparable yyyy-mm-dd string. */
export function toIsoDate(value: string | Date): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

export function isRuleEffectiveOn(rule: TaxRule, transactionDate: string): boolean {
  const date = toIsoDate(transactionDate);
  if (!date) return false;
  if (rule.effectiveFrom > date) return false;
  if (rule.effectiveTo && rule.effectiveTo < date) return false;
  return true;
}

/**
 * Selects the rule that governs a transaction. Highest priority wins; ties are
 * broken by the most recently effective rule so a newer rate version supersedes
 * an older one covering the same day.
 */
export function findApplicableTaxRule(
  rules: TaxRule[],
  countryCode: string,
  serviceType: ServiceType,
  transactionDate: string
): TaxRule | null {
  if (!countryCode) return null;
  const iso = countryCode.toUpperCase();

  const candidates = rules.filter(
    (rule) =>
      rule.status === 'Active' &&
      rule.isoCode.toUpperCase() === iso &&
      rule.serviceType === serviceType &&
      isRuleEffectiveOn(rule, transactionDate)
  );

  if (!candidates.length) return null;

  return [...candidates].sort(
    (a, b) => b.priority - a.priority || b.effectiveFrom.localeCompare(a.effectiveFrom)
  )[0];
}

function statusForRule(rule: TaxRule): TaxStatus {
  if (rule.reverseCharge) return 'REVERSE_CHARGE';
  if (rule.rateCategory === 'Exempt') return 'EXEMPT';
  if (rule.rate === 0) return 'ZERO_RATED';
  return 'CALCULATED';
}

/**
 * Applies a rule to an amount.
 *
 * For tax-exclusive rules `amount` is the net taxable amount and tax is added on
 * top. For tax-inclusive rules `amount` is the gross amount and the net is
 * extracted with net = gross / (1 + rate/100).
 */
export function calculateTax(amount: number, rule: TaxRule | null): TaxCalculationResult {
  if (!rule) {
    return {
      taxRuleId: null,
      taxType: null,
      taxName: null,
      taxRate: 0,
      taxableAmount: round2(amount),
      taxAmount: 0,
      totalAmount: round2(amount),
      taxInclusive: false,
      reverseCharge: false,
      exemptionCode: null,
      taxStatus: 'TAX_REVIEW_REQUIRED',
      message: 'No active tax rule applies to this billing country, service type and date.',
    };
  }

  const taxStatus = statusForRule(rule);
  const chargesTax = taxStatus === 'CALCULATED';

  let taxableAmount: number;
  let taxAmount: number;
  let totalAmount: number;

  if (!chargesTax) {
    taxableAmount = round2(amount);
    taxAmount = 0;
    totalAmount = taxableAmount;
  } else if (rule.taxInclusive) {
    const gross = amount;
    const net = gross / (1 + rule.rate / 100);
    taxableAmount = round2(net);
    totalAmount = round2(gross);
    taxAmount = round2(totalAmount - taxableAmount);
  } else {
    taxableAmount = round2(amount);
    taxAmount = round2((taxableAmount * rule.rate) / 100);
    totalAmount = round2(taxableAmount + taxAmount);
  }

  return {
    taxRuleId: rule.taxRuleId,
    taxType: rule.taxType,
    taxName: rule.taxName,
    taxRate: rule.rate,
    taxableAmount,
    taxAmount,
    totalAmount,
    taxInclusive: rule.taxInclusive,
    reverseCharge: rule.reverseCharge,
    exemptionCode: rule.exemptionCode,
    taxStatus,
    message:
      taxStatus === 'REVERSE_CHARGE'
        ? 'Reverse charge — VAT accounted for by the recipient.'
        : taxStatus === 'EXEMPT'
          ? `Exempt supply${rule.exemptionCode ? ` (${rule.exemptionCode})` : ''}.`
          : undefined,
  };
}

/** Convenience wrapper: resolve the rule for a transaction and apply it. */
export function resolveTaxForTransaction(
  rules: TaxRule[],
  params: {
    amount: number;
    billingCountryCode: string;
    serviceType: ServiceType;
    transactionDate: string;
  }
): TaxCalculationResult {
  if (!params.billingCountryCode) {
    return {
      ...calculateTax(params.amount, null),
      message: 'Transaction has no billing country — tax jurisdiction cannot be determined.',
    };
  }
  const rule = findApplicableTaxRule(
    rules,
    params.billingCountryCode,
    params.serviceType,
    params.transactionDate
  );
  return calculateTax(params.amount, rule);
}

/** Reverses a tax-inclusive gross amount into its net component. */
export function extractNetFromGross(grossAmount: number, ratePercent: number): number {
  if (ratePercent <= 0) return round2(grossAmount);
  return round2(grossAmount / (1 + ratePercent / 100));
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/** Two rules clash when they cover the same scope, priority and overlapping dates. */
export function rulesOverlap(a: TaxRule, b: TaxRule): boolean {
  if (a.taxRuleId === b.taxRuleId) return false;
  if (a.isoCode !== b.isoCode || a.serviceType !== b.serviceType) return false;
  if (a.status !== 'Active' || b.status !== 'Active') return false;
  if (a.priority !== b.priority) return false;
  const aEnd = a.effectiveTo ?? '9999-12-31';
  const bEnd = b.effectiveTo ?? '9999-12-31';
  return a.effectiveFrom <= bEnd && b.effectiveFrom <= aEnd;
}

/** Structural checks run before a tax rule may be saved. */
export function validateTaxRule(rule: TaxRule, existingRules: TaxRule[] = []): TaxValidationResult {
  const issues: TaxValidationIssue[] = [];

  if (!rule.isoCode || !rule.countryId) {
    issues.push({
      code: 'UNKNOWN_COUNTRY',
      severity: 'error',
      message: 'A country must be selected from the Country Master.',
    });
  }

  if (Number.isNaN(rule.rate) || rule.rate < 0 || rule.rate > 100) {
    issues.push({
      code: 'INVALID_RATE',
      severity: 'error',
      message: 'Rate must be a percentage between 0 and 100.',
    });
  }

  const positiveCategories: RateCategory[] = ['Standard', 'Reduced', 'Super Reduced'];
  if (positiveCategories.includes(rule.rateCategory) && rule.rate === 0 && !rule.reverseCharge) {
    issues.push({
      code: 'INVALID_RATE',
      severity: 'warning',
      message: `A ${rule.rateCategory} rate of 0% is unusual — use the Zero or Exempt category instead.`,
    });
  }

  if (!rule.effectiveFrom) {
    issues.push({
      code: 'INVALID_DATE_RANGE',
      severity: 'error',
      message: 'Effective From is required so the rate can be resolved by transaction date.',
    });
  }

  if (rule.effectiveTo && rule.effectiveFrom && rule.effectiveTo < rule.effectiveFrom) {
    issues.push({
      code: 'INVALID_DATE_RANGE',
      severity: 'error',
      message: 'Effective To cannot fall before Effective From.',
    });
  }

  if (!rule.serviceType) {
    issues.push({
      code: 'SERVICE_TYPE_UNSUPPORTED',
      severity: 'error',
      message: 'A service type must be selected.',
    });
  }

  if (!rule.sourceReference?.trim()) {
    issues.push({
      code: 'NO_ACTIVE_RULE',
      severity: 'warning',
      message: 'No source reference recorded — regulatory rates should always cite their source.',
    });
  }

  const clashes = existingRules.filter((other) => rulesOverlap(rule, other));
  if (clashes.length) {
    issues.push({
      code: 'OVERLAPPING_RULES',
      severity: 'error',
      message: `Overlaps ${clashes.length} active rule(s) for ${rule.countryName} at the same priority: ${clashes
        .map((c) => `${c.taxName} ${c.rate}%`)
        .join(', ')}. Close the previous period or change the priority.`,
    });
  }

  return { isValid: !issues.some((i) => i.severity === 'error'), issues };
}

/** Pre-finalisation checks for one billable transaction. */
export function validateTransactionTax(params: {
  billingCountryCode: string;
  serviceType: ServiceType;
  transactionDate: string;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  rules: TaxRule[];
}): TaxValidationResult {
  const issues: TaxValidationIssue[] = [];

  if (!params.billingCountryCode) {
    issues.push({
      code: 'MISSING_BILLING_COUNTRY',
      severity: 'error',
      message: 'Transaction has no billing country.',
    });
    return { isValid: false, issues };
  }

  const rule = findApplicableTaxRule(
    params.rules,
    params.billingCountryCode,
    params.serviceType,
    params.transactionDate
  );

  if (!rule) {
    issues.push({
      code: 'NO_ACTIVE_RULE',
      severity: 'error',
      message: `No active ${params.serviceType} tax rule for ${params.billingCountryCode} on ${toIsoDate(
        params.transactionDate
      )}.`,
    });
    return { isValid: false, issues };
  }

  const expected = calculateTax(
    rule.taxInclusive ? params.totalAmount : params.taxableAmount,
    rule
  );

  if (Math.abs(expected.taxAmount - params.taxAmount) > 0.01) {
    issues.push({
      code: 'CALCULATION_MISMATCH',
      severity: 'error',
      message: `Tax amount ${params.taxAmount.toFixed(2)} does not match the ${rule.rate}% rule (expected ${expected.taxAmount.toFixed(2)}).`,
    });
  }

  if (Math.abs(params.taxableAmount + params.taxAmount - params.totalAmount) > 0.01) {
    issues.push({
      code: 'INVOICE_TOTAL_MISMATCH',
      severity: 'error',
      message: 'Total does not equal taxable amount plus tax.',
    });
  }

  return { isValid: !issues.some((i) => i.severity === 'error'), issues };
}

/* ------------------------------------------------------------------ */
/* Aggregation                                                         */
/* ------------------------------------------------------------------ */

export interface TaxableLineInput {
  taxType: TaxSummaryLine['taxType'];
  taxName: string;
  rate: number;
  rateCategory: RateCategory;
  taxableAmount: number;
  taxAmount: number;
}

/** Groups billed lines into the per-rate tax summary shown on invoices. */
export function buildTaxSummaryLines(lines: TaxableLineInput[]): TaxSummaryLine[] {
  const grouped = new Map<string, TaxSummaryLine>();

  lines.forEach((line) => {
    const key = `${line.taxType}|${line.rate}|${line.rateCategory}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.taxableAmount = round2(existing.taxableAmount + line.taxableAmount);
      existing.taxAmount = round2(existing.taxAmount + line.taxAmount);
    } else {
      grouped.set(key, {
        taxType: line.taxType,
        taxName: line.taxName,
        rate: line.rate,
        rateCategory: line.rateCategory,
        taxableAmount: round2(line.taxableAmount),
        taxAmount: round2(line.taxAmount),
      });
    }
  });

  return [...grouped.values()].sort((a, b) => b.rate - a.rate);
}

export const TAX_STATUS_LABELS: Record<TaxStatus, string> = {
  NOT_CALCULATED: 'Not Calculated',
  CALCULATED: 'Calculated',
  EXEMPT: 'Exempt',
  ZERO_RATED: 'Zero Rated',
  REVERSE_CHARGE: 'Reverse Charge',
  TAX_REVIEW_REQUIRED: 'Tax Review Required',
};
