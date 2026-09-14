import type { CDRRecord, CDRFilterOptions, CDRDashboardStats } from '../types/cdr';
import { mockCDRRecords, mockDashboardStats, mockDailyCallVolume, mockDeptUsageData, mockCallTypeDistribution, mockMonthlyBillingTrend, mockHighUsageExtensions } from '../mock-data/cdrData';

/**
 * CDR Service - Layered async functions ready to connect to Node.js / Express backend
 */

export const cdrService = {
  getDashboardStats: async (): Promise<CDRDashboardStats> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockDashboardStats), 50));
  },

  getDailyCallVolume: async (): Promise<typeof mockDailyCallVolume> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockDailyCallVolume), 50));
  },

  getDeptUsageData: async (): Promise<typeof mockDeptUsageData> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockDeptUsageData), 50));
  },

  getCallTypeDistribution: async (): Promise<typeof mockCallTypeDistribution> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockCallTypeDistribution), 50));
  },

  getMonthlyBillingTrend: async (): Promise<typeof mockMonthlyBillingTrend> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockMonthlyBillingTrend), 50));
  },

  getHighUsageExtensions: async (): Promise<typeof mockHighUsageExtensions> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockHighUsageExtensions), 50));
  },

  getCDRRecords: async (filters?: CDRFilterOptions): Promise<CDRRecord[]> => {
    return new Promise((resolve) => {
      let filtered = [...mockCDRRecords];

      if (filters) {
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.cdrId.toLowerCase().includes(q) ||
              r.extension.includes(q) ||
              r.callerNumber.includes(q) ||
              r.destinationNumber.includes(q) ||
              r.department.toLowerCase().includes(q)
          );
        }
        if (filters.extension) {
          filtered = filtered.filter((r) => r.extension === filters.extension);
        }
        if (filters.department && filters.department !== 'ALL') {
          filtered = filtered.filter((r) => r.department === filters.department);
        }
        if (filters.callType && filters.callType !== 'ALL') {
          filtered = filtered.filter((r) => r.callType === filters.callType);
        }
        if (filters.direction && filters.direction !== 'ALL') {
          filtered = filtered.filter((r) => r.direction === filters.direction);
        }
        if (filters.billingStatus && filters.billingStatus !== 'ALL') {
          filtered = filtered.filter((r) => r.billingStatus === filters.billingStatus);
        }
        if (filters.dateFrom) {
          filtered = filtered.filter((r) => r.startDate >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          filtered = filtered.filter((r) => r.startDate <= filters.dateTo!);
        }
        if (filters.destinationNumber) {
          filtered = filtered.filter((r) => r.destinationNumber.includes(filters.destinationNumber!));
        }
      }

      setTimeout(() => resolve(filtered), 50);
    });
  },

  getCDRById: async (id: string): Promise<CDRRecord | undefined> => {
    return new Promise((resolve) => {
      const record = mockCDRRecords.find((r) => r.id === id || r.cdrId === id);
      setTimeout(() => resolve(record), 50);
    });
  },
};
