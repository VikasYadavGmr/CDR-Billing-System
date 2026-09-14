export type CallType = 'Internal' | 'External' | 'International';
export type CallStatus = 'Completed' | 'Failed' | 'Busy' | 'No Answer' | 'Cancelled';
export type CallDirection = 'Incoming' | 'Outgoing';

export interface ComprehensiveCDRRecord {
  id: string;
  cdrId: string;
  dateTime: string;
  startDate: string;
  startTime: string;
  endTime: string;
  direction: CallDirection;

  // Caller Information
  userId: string;
  userName: string;
  extension: string;
  department: string;
  deviceId: string;
  deviceType: string;
  deviceLocation: string;

  // Destination Information
  destinationName: string;
  destinationNumber: string;
  destinationType: 'Internal Intercom' | 'Local PSTN' | 'National STD' | 'International ISD' | 'Toll-Free Helpline';
  destinationLocation: string;
  country: string;
  numberType: 'Landline' | 'Mobile' | 'SIP Extension' | 'Trunk Channel' | 'Toll-Free';

  // Telephony & Call Metrics
  callType: CallType;
  durationFormatted: string;
  durationSeconds: number;
  status: CallStatus;
  disconnectReason: string;

  // Billing Information
  tariffName: string;
  billingUnit: string;
  ratePerMinute: number;
  callCost: number;
  taxAmount: number;
  totalAmount: number;
  currency: 'INR';
  billingStatus: 'Billed' | 'Unbilled' | 'Exempted';

  // Related CMR Quality Data (if available)
  relatedCmr?: {
    cmrId: string;
    qualityStatus: 'Good' | 'Fair' | 'Poor';
    score: number;
    packetLoss: string;
    jitter: string;
    latency: string;
    qualityIssue: string;
  };
}

export type CDRQuickFilterKey =
  | 'all'
  | 'internal'
  | 'external'
  | 'international'
  | 'completed'
  | 'failed'
  | 'high-billing'
  | 'long-duration';

export interface CDRFilterOptions {
  searchQuery: string;
  datePreset: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  extensionMode: 'all' | 'single' | 'multiple' | 'range';
  extensionValue: string;
  department: string;
  device: string;
  callType: 'All' | CallType;
  callStatus: 'All' | CallStatus;
  minDurationSec?: string;
  maxDurationSec?: string;
  minAmount?: string;
  maxAmount?: string;
}

export interface CDRSummaryKPIs {
  totalRecords: number;
  completed: number;
  failed: number;
  totalDurationHours: string;
  totalBilling: number;
}
