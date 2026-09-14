import type { BillingPeriod, RatePlanItem, DepartmentBillBreakdown } from '../types/billing';
import type { TaxSummary } from '../types/tax';
import type { CountryChargeSplit } from '../mock-data/billingData';
import {
  mockBillingPeriods,
  mockRatePlans,
  mockDeptBillBreakdowns,
  buildBillingPeriodFromSplits,
  defaultCountrySplits,
} from '../mock-data/billingData';
import { taxCalculationService } from './taxCalculationService';
import { DEFAULT_SERVICE_TYPE } from '../utils/billingCalculator';
import { mockCountries } from '../mock-data/countryData';

/** Unbilled charges for one jurisdiction, before any tax is applied. */
export interface CountryChargePreview {
  isoCode: string;
  countryName: string;
  calls: number;
  durationHours: number;
  netCharge: number;
}

export type BillingScope = 'consolidated' | 'per-country';

export interface GenerateBillParams {
  periodName: string;
  startDate: string;
  endDate: string;
  /** Jurisdictions to bill. Charges outside this list are left unbilled. */
  countryCodes: string[];
  /**
   * `consolidated` puts every selected jurisdiction on one invoice with a
   * country breakdown; `per-country` raises a separate invoice per jurisdiction.
   */
  scope: BillingScope;
}

export const billingService = {
  getBillingPeriods: async (): Promise<BillingPeriod[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockBillingPeriods]), 50));
  },

  getBillingPeriodById: async (id: string): Promise<BillingPeriod | undefined> => {
    return new Promise((resolve) => {
      const p = mockBillingPeriods.find((item) => item.id === id || item.periodCode === id);
      setTimeout(() => resolve(p), 50);
    });
  },

  getDepartmentBreakdown: async (_periodCode?: string): Promise<DepartmentBillBreakdown[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockDeptBillBreakdowns]), 50));
  },

  getRatePlans: async (): Promise<RatePlanItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockRatePlans]), 50));
  },

  updateRatePlan: async (updated: RatePlanItem): Promise<boolean> => {
    const idx = mockRatePlans.findIndex((r) => r.id === updated.id);
    if (idx !== -1) {
      mockRatePlans[idx] = updated;
      return true;
    }
    return false;
  },

  /**
   * Unbilled charges for the cycle, grouped by billing jurisdiction. Drives the
   * country picker on the generate-bill screen. Net of tax — the Tax & VAT
   * master is only consulted once the jurisdictions have been chosen.
   */
  getUnbilledChargesByCountry: async (
    _startDate: string,
    _endDate: string
  ): Promise<CountryChargePreview[]> => {
    const rows = defaultCountrySplits.map((split) => ({
      isoCode: split.iso,
      countryName: mockCountries.find((c) => c.isoCode === split.iso)?.countryName ?? split.iso,
      calls: split.calls,
      durationHours: split.hours,
      netCharge: split.netCharge,
    }));
    return new Promise((resolve) => setTimeout(() => resolve(rows), 50));
  },

  /**
   * Rates a new cycle for the selected jurisdictions. Call charges are split by
   * billing country, then the Tax & VAT master resolves the rule for each
   * country on the cycle end date. No tax figure is assumed here.
   *
   * Returns one invoice for `consolidated` scope, or one per jurisdiction for
   * `per-country` scope.
   */
  generateBill: async ({
    periodName,
    startDate,
    endDate,
    countryCodes,
    scope,
  }: GenerateBillParams): Promise<BillingPeriod[]> => {
    const selected = defaultCountrySplits.filter((split) => countryCodes.includes(split.iso));
    if (!selected.length) return [];

    const periodCode = startDate.substring(0, 7);
    const generatedDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0];
    const stamp = Date.now();

    // Call volumes are apportioned from the selected splits so a single-country
    // invoice never reports the whole cycle's traffic.
    const rate = (splits: CountryChargeSplit[], suffix: string, label: string) => {
      const calls = splits.reduce((sum, s) => sum + s.calls, 0);
      return buildBillingPeriodFromSplits({
        id: `bill-${stamp}${suffix}`,
        period: label,
        periodCode,
        startDate,
        endDate,
        totalCalls: calls,
        billableCalls: Math.round(calls * 0.74),
        totalDurationHours: splits.reduce((sum, s) => sum + s.hours, 0),
        status: 'Generated',
        generatedDate,
        dueDate,
        invoiceNumber: `INV-HTS-${periodCode}${suffix}`,
        splits,
      });
    };

    const bills =
      scope === 'per-country'
        ? selected
            .map((split) => {
              const name = mockCountries.find((c) => c.isoCode === split.iso)?.countryName ?? split.iso;
              return rate([split], `-${split.iso}`, `${periodName} — ${name}`);
            })
            .sort((a, b) => b.totalAmount - a.totalAmount)
        : [rate(selected, '', periodName)];

    mockBillingPeriods.unshift(...bills);
    return bills;
  },

  /** Tax summary for a billing period, rebuilt from its country splits. */
  getTaxSummary: async (periodCode: string): Promise<TaxSummary | null> => {
    const period = mockBillingPeriods.find((p) => p.periodCode === periodCode || p.id === periodCode);
    if (!period) return null;
    return taxCalculationService.getTaxSummary(
      period.period,
      period.countryBreakdown.map((c) => ({
        amount: c.taxableAmount,
        billingCountryCode: c.isoCode,
        billingCountryName: c.countryName,
        serviceType: DEFAULT_SERVICE_TYPE,
        transactionDate: period.endDate,
        calls: c.calls,
        durationHours: c.durationHours,
      }))
    );
  },
};
