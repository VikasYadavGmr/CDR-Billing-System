export type DatePreset = 'today' | 'yesterday' | '7days' | '30days' | 'thisMonth' | 'custom';
export type TrendGranularity = 'daily' | 'weekly' | 'monthly';

export interface SystemReportFilterValues {
  datePreset: DatePreset;
  fromDate: string;
  toDate: string;
  department: string;
  callType: string;
  callStatus: string;
  extensionRange: string;
  searchQuery: string;
}

export interface SystemSummaryKPIs {
  totalCalls: number;
  totalCallsChangePct: number;
  totalDuration: string;
  totalDurationHours: number;
  totalBilling: number;
  internalCalls: number;
  internalCallsPct: number;
  externalCalls: number;
  externalCallsPct: number;
  internationalCalls: number;
  internationalCallsPct: number;
  failedCalls: number;
  failedCallsPct: number;
  averageCallDuration: string;
}

export interface VolumeTrendPoint {
  date: string;
  label: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
}

export interface BillingTrendPoint {
  date: string;
  label: string;
  totalBilling: number;
  internalBilling: number;
  externalBilling: number;
  internationalBilling: number;
}

export interface CallTypeDistItem {
  category: 'Internal' | 'External' | 'International';
  callCount: number;
  percentage: number;
  billingAmount: number;
  color: string;
}

export interface CallStatusDistItem {
  status: 'Completed' | 'Failed' | 'Busy' | 'No Answer' | 'Cancelled';
  callCount: number;
  percentage: number;
  color: string;
}

export interface DepartmentUsageRow {
  id: string;
  department: string;
  activeExtensions: number;
  totalCalls: number;
  totalDuration: string;
  totalDurationMinutes: number;
  internalCalls: number;
  externalCalls: number;
  internationalCalls: number;
  billing: number;
  failedCalls: number;
}

export interface ExtensionUsageRow {
  id: string;
  extension: string;
  department: string;
  totalCalls: number;
  totalDuration: string;
  totalDurationMinutes: number;
  internalCalls: number;
  externalCalls: number;
  internationalCalls: number;
  billing: number;
  lastActivity: string;
  status: 'Active' | 'Idle' | 'Maintenance';
}

export interface PeakHourData {
  hour: string;
  displayTime: string;
  callCount: number;
  isPeak: boolean;
}

export interface PeakUsageMetrics {
  peakHour: string;
  peakCallCount: number;
  lowestUsageHour: string;
  lowestCallCount: number;
  averageCallsPerHour: number;
  hourlyData: PeakHourData[];
}

export interface DailySystemSummaryRow {
  date: string;
  totalCalls: number;
  completed: number;
  failed: number;
  internal: number;
  external: number;
  international: number;
  totalDuration: string;
  totalBilling: number;
  averageDuration: string;
}

export interface CMRQualitySummary {
  totalCallsWithCMR: number;
  goodQualityCalls: number;
  goodPct: number;
  fairQualityCalls: number;
  fairPct: number;
  poorQualityCalls: number;
  poorPct: number;
  callsWithQualityIssues: number;
  averageMOS: number;
  averageJitterMs: number;
  averageLatencyMs: number;
  averagePacketLossPct: number;
}

export interface SystemHealthIndicators {
  activeExtensions: number;
  noActivityExtensions: number;
  highUsageExtensions: number;
  failedCallRate: number;
  averageCallsPerExtension: number;
  averageBillingPerExtension: number;
}

export interface TopDepartmentBillingRow {
  rank: number;
  department: string;
  calls: number;
  duration: string;
  billing: number;
  billingPct: number;
}

export interface TopExtensionUsageRow {
  rank: number;
  extension: string;
  department: string;
  calls: number;
  duration: string;
  billing: number;
}
