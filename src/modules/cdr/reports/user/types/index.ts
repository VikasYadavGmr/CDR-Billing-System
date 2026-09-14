export type CallDirection = 'Incoming' | 'Outgoing' | 'Internal';
export type CallType =
  | 'Internal'
  | 'Local'
  | 'STD'
  | 'Mobile'
  | 'International'
  | 'Incoming'
  | 'Outgoing';
export type CallStatus = 'Completed' | 'Failed' | 'Missed' | 'Busy' | 'No Answer';
export type BillingStatus = 'Billed' | 'Unbilled' | 'Exempt' | 'Pending';

export interface ReportUserOption {
  id: string;
  name: string;
  employeeId: string;
  extension: string;
  department: string;
  location: string;
}

export interface ReportFilterValues {
  userId?: string;
  employeeId?: string;
  extension?: string;
  department?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  callType?: string;
  callDirection?: string;
  billingStatus?: string;
  callStatus?: string;
  destinationNumber?: string;
  gateway?: string;
  trunk?: string;
  n?: number;
  search?: string;
}

export interface IndividualBillSummary {
  totalCalls: number;
  incomingCalls: number;
  outgoingCalls: number;
  internalCalls: number;
  billableCalls: number;
  totalTalkTime: string;
  subtotal: number;
  vat: number;
  totalAmount: number;
}

export interface IndividualBillInfo {
  userName: string;
  employeeId: string;
  department: string;
  extension: string;
  location: string;
  billingPeriod: string;
  currentStatus: string;
}

export interface UserDailyConsumption {
  date: string;
  formattedDate: string;
  dayOfWeek: string;
  totalCalls: number;
  outgoingCalls: number;
  incomingCalls: number;
  internalCalls: number;
  billableCalls: number;
  totalDurationFormatted: string;
  billableMinutes: number;
  baseCharge: number;
  vat: number;
  totalCost: number;
  avgQoSScore: number;
}

export interface IndividualBillRow {
  id: string;
  date: string;
  time: string;
  cdrId: string;
  callingNumber: string;
  destinationNumber: string;
  callType: string;
  direction: CallDirection;
  duration: string;
  rate: string;
  baseCharge: number;
  tax: number;
  totalCharge: number;
  billingStatus: BillingStatus;
  status: CallStatus;
}

export interface DepartmentBillSummary {
  totalDepartments: number;
  totalCalls: number;
  totalDurationMinutes: number;
  totalBillableCalls: number;
  totalCost: number;
}

export interface DepartmentBillRow {
  id: string;
  department: string;
  users: number;
  extensions: number;
  totalCalls: number;
  incoming: number;
  outgoing: number;
  totalDurationMin: number;
  billableCalls: number;
  baseCost: number;
  tax: number;
  totalCost: number;
}

export interface DepartmentUserDetail {
  user: string;
  extension: string;
  calls: number;
  duration: string;
  cost: number;
}

export interface TopCostSummary {
  totalBilling: number;
  averageUserCost: number;
  highestUserCost: number;
  billableUsers: number;
}

export interface TopChargeRow {
  rank: number;
  user: string;
  employeeId: string;
  extension: string;
  department: string;
  totalCalls: number;
  totalDuration: string;
  billableCalls: number;
  totalCost: number;
}

export interface TopDurationRow {
  rank: number;
  user: string;
  extension: string;
  department: string;
  totalCalls: number;
  totalDuration: string;
  averageCallDuration: string;
  billableDuration: string;
  totalCost: number;
  totalDurationMinutes: number;
  billableDurationMinutes: number;
  averageDurationMinutes: number;
}

export interface TopCallsRow {
  rank: number;
  user: string;
  extension: string;
  department: string;
  incomingCalls: number;
  outgoingCalls: number;
  internalCalls: number;
  failedCalls: number;
  totalCalls: number;
  totalDuration: string;
}

export interface CallHistorySummary {
  totalCalls: number;
  completed: number;
  failed: number;
  missed: number;
  totalDuration: string;
  totalCost: number;
}

export interface CallHistoryRow {
  id: string;
  cdrId: string;
  date: string;
  time: string;
  callingNumber: string;
  calledNumber: string;
  callType: string;
  direction: CallDirection;
  duration: string;
  gateway: string;
  trunk: string;
  status: CallStatus;
  terminationCause: string;
  cost: number;
  user: string;
  employeeId: string;
  extension: string;
  department: string;
  billingStatus: BillingStatus;
}

export interface CallDetailsData {
  cdrId: string;
  callId: string;
  date: string;
  startTime: string;
  answerTime: string;
  endTime: string;
  duration: string;
  callDirection: string;
  callType: string;
  callStatus: CallStatus;
  user: string;
  employeeId: string;
  extension: string;
  department: string;
  device: string;
  location: string;
  destinationNumber: string;
  destinationType: string;
  destinationLocation: string;
  gateway: string;
  trunk: string;
  routePattern: string;
  routeGroup: string;
  ratePlan: string;
  rate: string;
  billingDuration: string;
  baseCharge: number;
  tax: number;
  totalCharge: number;
  billingStatus: BillingStatus;
  currency: string;
  terminationCauseCode: string;
  terminationCause: string;
  disconnectReason: string;
  mos: number;
  jitterMs: number;
  latencyMs: number;
  packetLossPercent: number;
}

export interface ReportColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => unknown;
  className?: string;
}
