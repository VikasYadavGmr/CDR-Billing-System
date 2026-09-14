export type CMRQualityStatus = 'Good' | 'Fair' | 'Poor';
export type CMRQualityGrade = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type CMRQualityIssueType =
  | 'None'
  | 'Packet Loss'
  | 'High Jitter'
  | 'High Latency'
  | 'Poor Audio'
  | 'Connection Issue'
  | 'Media Issue';

export interface MinuteQoSPoint {
  time: string;
  score: number;
  jitterMs: number;
  packetLossPct: number;
  latencyMs: number;
}

export interface ComprehensiveCMRRecord {
  id: string;
  cmrId: string;
  cdrId: string;
  dateTime: string;
  startDate: string;
  startTime: string;
  endTime: string;
  durationFormatted: string;
  durationSeconds: number;
  callDirection: 'Incoming' | 'Outgoing';
  callType: 'Internal' | 'External' | 'International';
  callStatus: 'Completed' | 'Failed' | 'Busy' | 'No Answer' | 'Cancelled';

  // Caller & Device Information
  userId: string;
  userName: string;
  extension: string;
  department: string;
  deviceId: string;
  deviceType: string;
  deviceModel: string;
  deviceLocation: string;

  // Destination Information
  destinationName: string;
  destinationNumber: string;

  // Call Quality Metrics
  qualityStatus: CMRQualityStatus;
  qualityGrade: CMRQualityGrade;
  qualityScore: number; // 0 - 100
  audioQualityPct: number;
  mediaQualityPct: number;
  networkQualityPct: number;
  overallQualityPct: number;

  // Network Performance (QoS)
  packetLossPct: number;
  packetLossStr: string;
  jitterMs: number;
  jitterStr: string;
  latencyMs: number;
  latencyStr: string;
  roundTripTimeMs: number;
  roundTripTimeStr: string;
  packetsSent: number;
  packetsReceived: number;
  packetsLost: number;

  // Media & Codec Information
  codec: string;
  sampleRate: string;
  packetSizeMs: number;
  audioPacketsSent: number;
  audioPacketsReceived: number;

  // Quality Issues & Diagnostics
  qualityIssue: CMRQualityIssueType;
  issueSeverity: 'None' | 'Low' | 'Medium' | 'High';
  issueStartTime?: string;
  issueDurationSec?: number;
  issueMetric?: string;
  issueValue?: string;
  recommendedAction?: string;

  // Minute-by-minute QoS telemetry
  timeSeriesQoS: MinuteQoSPoint[];

  // Related CDR Billing Summary
  relatedCdrSummary?: {
    tariffName: string;
    amount: number;
    billingStatus: string;
  };
}

export type CMRQuickFilterKey =
  | 'all'
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'quality-issues'
  | 'high-jitter'
  | 'high-packet-loss'
  | 'high-latency';

export interface CMRFilterOptions {
  searchQuery: string;
  datePreset: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  qualityStatus: 'All' | CMRQualityStatus;
  qualityIssue: 'All' | CMRQualityIssueType;
  extensionMode: 'all' | 'single' | 'multiple' | 'range';
  extensionValue: string;
  department: string;
  device: string;
  minScore?: string;
  maxScore?: string;
}

export interface CMRSummaryKPIs {
  totalRecords: number;
  goodQuality: number;
  fairQuality: number;
  poorQuality: number;
  qualityIssues: number;
  averageQualityScore: number;
  averageJitter: string;
  averagePacketLoss: string;
}

export interface CMRDepartmentSummaryRow {
  department: string;
  cmrRecords: number;
  good: number;
  fair: number;
  poor: number;
  averageScore: number;
  avgPacketLoss: string;
  avgJitter: string;
  qualityIssues: number;
}

export interface CMRDeviceSummaryRow {
  device: string;
  extension: string;
  department: string;
  cmrRecords: number;
  averageScore: number;
  packetLoss: string;
  jitter: string;
  latency: string;
  qualityIssues: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
}
