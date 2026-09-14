export type CallType = 'Internal' | 'Local' | 'STD' | 'ISD' | 'Mobile' | 'Toll-Free';
export type CallDirection = 'Incoming' | 'Outgoing' | 'Internal';
export type BillingStatus = 'Billed' | 'Unbilled' | 'Exempted' | 'Pending';

export interface CDRRecord {
  id: string;
  cdrId: string;
  extension: string;
  department: string;
  callerNumber: string;
  destinationNumber: string;
  callType: CallType;
  direction: CallDirection;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string;
  durationSeconds: number;
  durationFormatted: string; // mm:ss or hh:mm:ss
  ratePerMinute: number;
  callCost: number;
  taxAmount: number;
  totalAmount: number;
  billingStatus: BillingStatus;
  billingCycle: string;
  trunkLine?: string;
  disconnectReason?: string;
}

export interface CDRFilterOptions {
  dateFrom?: string;
  dateTo?: string;
  extension?: string;
  department?: string;
  callType?: string;
  direction?: string;
  billingStatus?: string;
  destinationNumber?: string;
  searchQuery?: string;
}

export interface CDRDashboardStats {
  totalCalls: number;
  totalTalkTimeHours: number;
  totalBillingAmount: number;
  billableCalls: number;
  internalCalls: number;
  externalCalls: number;
  incomingCalls: number;
  outgoingCalls: number;
}
