import type { ServiceType, TaxRule, TaxValidationIssue, TaxValidationResult } from '../types/tax';
import { mockTaxRules } from '../mock-data/taxData';
import { mockCountries } from '../mock-data/countryData';
import { rulesOverlap, validateTaxRule, validateTransactionTax } from '../utils/taxEngine';

const delay = <T,>(value: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export interface BillableTransactionCheck {
  reference: string;
  billingCountryCode: string;
  serviceType: ServiceType;
  transactionDate: string;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface TransactionValidationResult extends TaxValidationResult {
  reference: string;
}

/**
 * Gate that runs before billing is finalised. Anything it rejects lands in the
 * billing validation queue as TAX_REVIEW_REQUIRED rather than being billed at a
 * guessed rate.
 */
export const taxValidationService = {
  validateTaxRule: async (rule: TaxRule): Promise<TaxValidationResult> =>
    delay(
      validateTaxRule(
        rule,
        mockTaxRules.filter((r) => r.taxRuleId !== rule.taxRuleId)
      )
    ),

  validateTransaction: async (txn: BillableTransactionCheck): Promise<TransactionValidationResult> => {
    const result = validateTransactionTax({ ...txn, rules: mockTaxRules });
    return delay({ ...result, reference: txn.reference });
  },

  validateBatch: async (
    transactions: BillableTransactionCheck[]
  ): Promise<TransactionValidationResult[]> =>
    delay(
      transactions.map((txn) => ({
        ...validateTransactionTax({ ...txn, rules: mockTaxRules }),
        reference: txn.reference,
      }))
    ),

  /** Confirms an invoice total equals subtotal plus the tax it declares. */
  validateInvoiceTotals: async (params: {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  }): Promise<TaxValidationResult> => {
    const issues: TaxValidationIssue[] = [];
    if (Math.abs(params.subtotal + params.taxAmount - params.totalAmount) > 0.01) {
      issues.push({
        code: 'INVOICE_TOTAL_MISMATCH',
        severity: 'error',
        message: `Invoice total ${params.totalAmount.toFixed(2)} does not equal subtotal ${params.subtotal.toFixed(
          2
        )} plus tax ${params.taxAmount.toFixed(2)}.`,
      });
    }
    return delay({ isValid: issues.length === 0, issues });
  },

  /** Master-data health check surfaced on the Tax & VAT page. */
  auditTaxMaster: async (): Promise<TaxValidationResult> => {
    const issues: TaxValidationIssue[] = [];

    const seen = new Set<string>();
    mockTaxRules.forEach((rule) => {
      mockTaxRules.forEach((other) => {
        const key = [rule.taxRuleId, other.taxRuleId].sort().join('|');
        if (seen.has(key)) return;
        if (rulesOverlap(rule, other)) {
          seen.add(key);
          issues.push({
            code: 'OVERLAPPING_RULES',
            severity: 'error',
            message: `${rule.countryName}: "${rule.taxName}" and "${other.taxName}" overlap at priority ${rule.priority}.`,
          });
        }
      });
    });

    mockCountries
      .filter((country) => country.status === 'Active')
      .forEach((country) => {
        const hasActiveRule = mockTaxRules.some(
          (rule) => rule.isoCode === country.isoCode && rule.status === 'Active'
        );
        if (!hasActiveRule) {
          issues.push({
            code: 'NO_ACTIVE_RULE',
            severity: 'warning',
            message: `${country.countryName} (${country.isoCode}) is active in the Country Master but has no active tax rule.`,
          });
        }
      });

    return delay({ isValid: !issues.some((i) => i.severity === 'error'), issues });
  },
};
