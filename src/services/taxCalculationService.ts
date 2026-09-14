import type {
  ServiceType,
  TaxCalculationResult,
  TaxRule,
  TaxStatus,
  TaxSummary,
  CountryTaxSummary,
} from '../types/tax';
import { mockTaxRules } from '../mock-data/taxData';
import {
  buildTaxSummaryLines,
  calculateTax,
  findApplicableTaxRule,
  resolveTaxForTransaction,
} from '../utils/taxEngine';
import type { TaxableLineInput } from '../utils/taxEngine';

const delay = <T,>(value: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

export interface TaxableTransaction {
  /** Net charge for tax-exclusive rules, gross charge for tax-inclusive ones. */
  amount: number;
  billingCountryCode: string;
  billingCountryName?: string;
  serviceType: ServiceType;
  transactionDate: string;
  calls?: number;
  durationHours?: number;
}

export interface TaxedTransaction extends TaxableTransaction {
  tax: TaxCalculationResult;
}

/**
 * Applies the Tax & VAT master to billable amounts. This is the only place the
 * billing pipeline computes tax, so rates are always sourced from configured
 * rules rather than hard-coded per country.
 */
export const taxCalculationService = {
  calculateTax: async (taxableAmount: number, taxRule: TaxRule | null): Promise<TaxCalculationResult> =>
    delay(calculateTax(taxableAmount, taxRule)),

  /** Resolve + calculate in one step for a single transaction. */
  calculateForTransaction: async (txn: TaxableTransaction): Promise<TaxCalculationResult> =>
    delay(resolveTaxForTransaction(mockTaxRules, txn)),

  /** Synchronous variant for tight loops over many CDR rows. */
  calculateForTransactionSync: (txn: TaxableTransaction): TaxCalculationResult =>
    resolveTaxForTransaction(mockTaxRules, txn),

  calculateBatch: async (transactions: TaxableTransaction[]): Promise<TaxedTransaction[]> =>
    delay(
      transactions.map((txn) => ({
        ...txn,
        tax: resolveTaxForTransaction(mockTaxRules, txn),
      }))
    ),

  /**
   * Aggregates taxed transactions into the invoice/billing tax summary:
   * per-rate lines plus a country breakdown and status counters.
   */
  getTaxSummary: async (
    billingPeriod: string,
    transactions: TaxableTransaction[]
  ): Promise<TaxSummary> => {
    const taxed = transactions.map((txn) => ({
      ...txn,
      tax: resolveTaxForTransaction(mockTaxRules, txn),
    }));

    const lineInputs: TaxableLineInput[] = taxed
      .filter((t) => t.tax.taxRuleId !== null)
      .map((t) => {
        const rule = findApplicableTaxRule(
          mockTaxRules,
          t.billingCountryCode,
          t.serviceType,
          t.transactionDate
        );
        return {
          taxType: t.tax.taxType ?? 'VAT',
          taxName: t.tax.taxName ?? 'VAT',
          rate: t.tax.taxRate,
          rateCategory: rule?.rateCategory ?? 'Standard',
          taxableAmount: t.tax.taxableAmount,
          taxAmount: t.tax.taxAmount,
        };
      });

    const countryMap = new Map<string, CountryTaxSummary>();
    taxed.forEach((t) => {
      const key = t.billingCountryCode.toUpperCase();
      const entry = countryMap.get(key) ?? {
        countryName: t.billingCountryName ?? key,
        isoCode: key,
        calls: 0,
        durationHours: 0,
        taxableAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      };
      entry.calls += t.calls ?? 1;
      entry.durationHours = round2(entry.durationHours + (t.durationHours ?? 0));
      entry.taxableAmount = round2(entry.taxableAmount + t.tax.taxableAmount);
      entry.taxAmount = round2(entry.taxAmount + t.tax.taxAmount);
      entry.totalAmount = round2(entry.totalAmount + t.tax.totalAmount);
      countryMap.set(key, entry);
    });

    const countBy = (status: TaxStatus) =>
      taxed.reduce((sum, t) => (t.tax.taxStatus === status ? sum + (t.calls ?? 1) : sum), 0);

    const summary: TaxSummary = {
      billingPeriod,
      totalTaxableAmount: round2(taxed.reduce((s, t) => s + t.tax.taxableAmount, 0)),
      totalTaxAmount: round2(taxed.reduce((s, t) => s + t.tax.taxAmount, 0)),
      totalVatAmount: round2(
        taxed.reduce((s, t) => (t.tax.taxType === 'VAT' ? s + t.tax.taxAmount : s), 0)
      ),
      totalAmount: round2(taxed.reduce((s, t) => s + t.tax.totalAmount, 0)),
      taxableCalls: countBy('CALCULATED'),
      exemptCalls: countBy('EXEMPT'),
      zeroRatedCalls: countBy('ZERO_RATED'),
      reverseChargeCalls: countBy('REVERSE_CHARGE'),
      reviewRequiredCalls: countBy('TAX_REVIEW_REQUIRED'),
      exemptAmount: round2(
        taxed.reduce(
          (s, t) =>
            t.tax.taxStatus === 'EXEMPT' ||
            t.tax.taxStatus === 'ZERO_RATED' ||
            t.tax.taxStatus === 'REVERSE_CHARGE'
              ? s + t.tax.taxableAmount
              : s,
          0
        )
      ),
      lines: buildTaxSummaryLines(lineInputs),
      byCountry: [...countryMap.values()].sort((a, b) => b.totalAmount - a.totalAmount),
    };

    return delay(summary);
  },
};
