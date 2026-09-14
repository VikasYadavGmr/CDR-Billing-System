/**
 * Utility functions for Telephone CDR Billing calculations.
 * Prepared for Node.js backend integration and client-side reactive recalculation.
 *
 * Call charges are computed here; tax is NOT. Tax is resolved from the Tax & VAT
 * master by `taxEngine`/`taxCalculationService` so no rate is ever hard-coded
 * against a country in the billing path.
 */

import type { ServiceType, TaxCalculationResult, TaxRule } from '../types/tax';
import { calculateTax, resolveTaxForTransaction } from './taxEngine';

export const BILLING_CURRENCY = 'EUR';
export const BILLING_LOCALE = 'en-IE';

/** Telecom is the only billable service category in this release. */
export const DEFAULT_SERVICE_TYPE: ServiceType = 'Telecom Services';

export interface CallChargeResult {
  billableMinutes: number;
  /** Net call charge before tax. */
  subtotal: number;
}

export interface CallCostResult extends CallChargeResult {
  taxAmount: number;
  totalAmount: number;
}

/**
 * Calculates the net call charge from duration, per-minute rate and pulse.
 * @param durationSeconds Call duration in seconds
 * @param ratePerMinute Rate per minute in the billing currency
 * @param pulseSeconds Billing pulse (default 60 seconds)
 */
export function calculateCallCharge(
  durationSeconds: number,
  ratePerMinute: number,
  pulseSeconds: number = 60
): CallChargeResult {
  if (durationSeconds <= 0 || ratePerMinute <= 0) {
    return { billableMinutes: 0, subtotal: 0 };
  }
  const pulses = Math.ceil(durationSeconds / pulseSeconds);
  const billableMinutes = (pulses * pulseSeconds) / 60;
  const subtotal = Number((billableMinutes * ratePerMinute).toFixed(2));
  return { billableMinutes, subtotal };
}

/**
 * Full charge + tax for a call. The applicable tax rule must be resolved by the
 * caller (via the Tax & VAT master); passing `null` yields an untaxed result
 * that the validation queue will flag as TAX_REVIEW_REQUIRED.
 */
export function calculateCallCost(
  durationSeconds: number,
  ratePerMinute: number,
  pulseSeconds: number = 60,
  taxRule: TaxRule | null = null
): CallCostResult {
  const charge = calculateCallCharge(durationSeconds, ratePerMinute, pulseSeconds);
  if (charge.subtotal <= 0) {
    return { ...charge, taxAmount: 0, totalAmount: 0 };
  }
  const tax = calculateTax(charge.subtotal, taxRule);
  return {
    billableMinutes: charge.billableMinutes,
    subtotal: tax.taxableAmount,
    taxAmount: tax.taxAmount,
    totalAmount: tax.totalAmount,
  };
}

/** Charges a call and resolves its tax from the configured rules in one step. */
export function rateCall(params: {
  durationSeconds: number;
  ratePerMinute: number;
  pulseSeconds?: number;
  billingCountryCode: string;
  transactionDate: string;
  serviceType?: ServiceType;
  taxRules: TaxRule[];
}): CallChargeResult & { tax: TaxCalculationResult } {
  const charge = calculateCallCharge(
    params.durationSeconds,
    params.ratePerMinute,
    params.pulseSeconds ?? 60
  );
  const tax = resolveTaxForTransaction(params.taxRules, {
    amount: charge.subtotal,
    billingCountryCode: params.billingCountryCode,
    serviceType: params.serviceType ?? DEFAULT_SERVICE_TYPE,
    transactionDate: params.transactionDate,
  });
  return { ...charge, tax };
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats a number as Euro currency (€1,234.56).
 */
export function formatCurrency(amount: number, includeDecimals = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '€0.00';
  return new Intl.NumberFormat(BILLING_LOCALE, {
    style: 'currency',
    currency: BILLING_CURRENCY,
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/** Formats a tax percentage without trailing zeros (19%, 25.5%). */
export function formatRate(rate: number): string {
  if (rate === undefined || rate === null || isNaN(rate)) return '0%';
  return `${Number(rate.toFixed(2))}%`;
}

/** Formats a number using the European billing locale. */
export function formatNumber(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat(BILLING_LOCALE).format(value);
}
