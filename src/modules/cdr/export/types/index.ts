export type ExportMainTab = 'cdr' | 'cmr';

export type CdrExportType =
  | 'cdr-records'
  | 'billing-cdrs'
  | 'internal-calls'
  | 'external-calls'
  | 'international-calls'
  | 'failed-calls'
  | 'all-cdrs';

export type CmrExportType =
  | 'cmr-records'
  | 'quality-records'
  | 'issue-records'
  | 'cmr-summary'
  | 'all-cmrs';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export type ExportDatePreset =
  | 'today'
  | 'yesterday'
  | 'last-7-days'
  | 'last-30-days'
  | 'this-month'
  | 'prev-month'
  | 'custom';

export interface ExportFilters {
  department: string;
  extensionMode: 'all' | 'single' | 'multiple' | 'range';
  extensionValue: string;
  device: string;
  callType: 'All' | 'Internal' | 'External' | 'International';
  callStatus: 'All' | 'Completed' | 'Failed' | 'Busy' | 'No Answer' | 'Cancelled';
  minAmount?: string;
  maxAmount?: string;
  minDuration?: string;
  maxDuration?: string;
  cmrQuality: 'All' | 'Good' | 'Fair' | 'Poor' | 'Quality Issues';
}

export interface ExportToggles {
  includeHeaders: boolean;
  includeBilling: boolean;
  includeDestination: boolean;
  includeUser: boolean;
  includeDevice: boolean;
  includeQualityMetrics: boolean;
  includeNetworkMetrics: boolean;
}

export interface CdrExportRecord {
  id: string;
  cdrId: string;
  dateTime: string;
  user: string;
  extension: string;
  device: string;
  department: string;
  destination: string;
  destinationNumber: string;
  callType: 'Internal' | 'External' | 'International';
  duration: string;
  durationSec: number;
  tariff: string;
  amount: number;
  status: 'Completed' | 'Failed' | 'Busy' | 'No Answer' | 'Cancelled';
}

export interface CmrExportRecord {
  id: string;
  cmrId: string;
  cdrId: string;
  dateTime: string;
  device: string;
  extension: string;
  duration: string;
  durationSec: number;
  qualityStatus: 'Good' | 'Fair' | 'Poor';
  packetLoss: string;
  packetLossVal: number;
  jitter: string;
  jitterVal: number;
  latency: string;
  latencyVal: number;
  qualityIssue: string;
  score: number;
}

export interface ExportHistoryItem {
  exportId: string;
  dateTime: string;
  exportType: string;
  format: 'CSV' | 'Excel' | 'PDF' | 'JSON';
  dateRange: string;
  recordCount: number;
  generatedBy: string;
  fileName: string;
  fileSize: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface ExportStats {
  totalExports: number;
  cdrExports: number;
  cmrExports: number;
  recordsExported: string;
  failedExports: number;
}
