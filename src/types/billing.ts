import type { CallType } from './cdr';

export type InvoiceStatus = 'Draft' | 'Generated' | 'Approved' | 'Paid';

export interface BillingPeriod {
  id: string;
  period: string; // e.g., 'August 2026'
  periodCode: string; // e.g., '2026-08'
  startDate: string;
  endDate: string;
  totalCalls: number;
  billableCalls: number;
  totalDurationHours: number;
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  generatedDate: string;
  dueDate: string;
  invoiceNumber: string;
}

export interface RatePlanItem {
  id: string;
  callType: CallType;
  description: string;
  ratePerMinute: number;
  pulseSeconds: number;
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export interface DepartmentBillBreakdown {
  department: string;
  extensionsCount: number;
  totalCalls: number;
  talkTimeHours: number;
  subtotal: number;
  tax: number;
  total: number;
}
