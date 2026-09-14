import type { BillingPeriod, RatePlanItem, DepartmentBillBreakdown } from '../types/billing';
import { mockBillingPeriods, mockRatePlans, mockDeptBillBreakdowns } from '../mock-data/billingData';

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

  generateBill: async (periodName: string, startDate: string, endDate: string): Promise<BillingPeriod> => {
    const newBill: BillingPeriod = {
      id: `bill-${Date.now()}`,
      period: periodName,
      periodCode: startDate.substring(0, 7),
      startDate,
      endDate,
      totalCalls: 24900,
      billableCalls: 18450,
      totalDurationHours: 3850,
      subtotal: 415000.00,
      taxRatePercent: 18,
      taxAmount: 74700.00,
      totalAmount: 489700.00,
      status: 'Generated',
      generatedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      invoiceNumber: `INV-AAS-${startDate.substring(0, 7)}`,
    };
    mockBillingPeriods.unshift(newBill);
    return newBill;
  },
};
