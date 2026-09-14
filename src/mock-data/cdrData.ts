import type { CDRRecord, CDRDashboardStats } from '../types/cdr';
import { calculateCallCost, formatDuration } from '../utils/billingCalculator';

export const mockDashboardStats: CDRDashboardStats = {
  totalCalls: 24856,
  totalTalkTimeHours: 3842,
  totalBillingAmount: 486240,
  billableCalls: 18425,
  internalCalls: 6431,
  externalCalls: 18425,
  incomingCalls: 11200,
  outgoingCalls: 13656,
};

export const mockDailyCallVolume = [
  { day: 'Monday', internal: 380, local: 420, std: 240, isd: 60, mobile: 440, total: 1540, cost: 28400 },
  { day: 'Tuesday', internal: 410, local: 480, std: 290, isd: 75, mobile: 525, total: 1780, cost: 34200 },
  { day: 'Wednesday', internal: 360, local: 410, std: 260, isd: 55, mobile: 475, total: 1560, cost: 29800 },
  { day: 'Thursday', internal: 440, local: 510, std: 310, isd: 85, mobile: 575, total: 1920, cost: 37600 },
  { day: 'Friday', internal: 490, local: 560, std: 340, isd: 95, mobile: 635, total: 2120, cost: 41500 },
  { day: 'Saturday', internal: 290, local: 340, std: 180, isd: 40, mobile: 370, total: 1220, cost: 21900 },
  { day: 'Sunday', internal: 240, local: 280, std: 150, isd: 35, mobile: 315, total: 1020, cost: 18400 },
];

export const mockDeptUsageData = [
  { department: 'Airport Operations', calls: 5840, durationHours: 920, cost: 118400 },
  { department: 'Security & CISF', calls: 4620, durationHours: 740, cost: 92600 },
  { department: 'Engineering & Maint', calls: 3450, durationHours: 510, cost: 67200 },
  { department: 'Customer Service', calls: 3280, durationHours: 480, cost: 58900 },
  { department: 'Cargo Operations', calls: 2740, durationHours: 410, cost: 52400 },
  { department: 'IT & Telecom', calls: 1980, durationHours: 320, cost: 41200 },
  { department: 'Administration', calls: 1640, durationHours: 260, cost: 32540 },
  { department: 'Finance & Accounts', calls: 1306, durationHours: 202, cost: 23000 },
];

export const mockCallTypeDistribution = [
  { name: 'Internal (Inter-Dept)', value: 6431, color: '#3b82f6', rate: '₹0.00' },
  { name: 'Mobile (Cellular)', value: 8920, color: '#10b981', rate: '₹1.20/m' },
  { name: 'Local Landline', value: 5210, color: '#6366f1', rate: '₹0.80/m' },
  { name: 'STD (National)', value: 3420, color: '#f59e0b', rate: '₹1.50/m' },
  { name: 'ISD (International)', value: 875, color: '#ef4444', rate: '₹8.00/m' },
];

export const mockMonthlyBillingTrend = [
  { month: 'Mar 2026', total: 412500, billableCalls: 16200, internalCalls: 5800 },
  { month: 'Apr 2026', total: 435800, billableCalls: 16900, internalCalls: 6100 },
  { month: 'May 2026', total: 458200, billableCalls: 17400, internalCalls: 6250 },
  { month: 'Jun 2026', total: 472100, billableCalls: 17950, internalCalls: 6380 },
  { month: 'Jul 2026', total: 468900, billableCalls: 17800, internalCalls: 6300 },
  { month: 'Aug 2026', total: 486240, billableCalls: 18425, internalCalls: 6431 },
];

export const mockHighUsageExtensions = [
  { extension: '2451', department: 'Airport Operations', employee: 'Capt. Rajesh Sharma', calls: 842, durationHours: 46, cost: 12420 },
  { extension: '3187', department: 'Security & CISF', employee: 'Vikram Singh (Control)', calls: 764, durationHours: 39, cost: 10850 },
  { extension: '4212', department: 'Engineering & Maint', employee: 'Sanjay Verma', calls: 621, durationHours: 34, cost: 9420 },
  { extension: '2105', department: 'Cargo Operations', employee: 'Amitabh Sen', calls: 589, durationHours: 31, cost: 8760 },
  { extension: '5020', department: 'Customer Service', employee: 'Pooja Nair (Helpdesk)', calls: 542, durationHours: 29, cost: 7980 },
  { extension: '1102', department: 'Administration', employee: 'Director Office Desk', calls: 498, durationHours: 28, cost: 7450 },
];

// 35 Realistic Airport CDR Records
const rawCdrData = [
  { id: '1', cdrId: 'CDR-100245', ext: '2451', dept: 'Airport Operations', caller: '2451', dest: '01145678901', type: 'STD', dir: 'Outgoing', date: '2026-09-08', time: '10:32:15', dur: 342, rate: 1.50, status: 'Billed' },
  { id: '2', cdrId: 'CDR-100246', ext: '3187', dept: 'Security & CISF', caller: '3187', dest: '9811234567', type: 'Mobile', dir: 'Outgoing', date: '2026-09-08', time: '10:35:40', dur: 185, rate: 1.20, status: 'Billed' },
  { id: '3', cdrId: 'CDR-100247', ext: '4212', dept: 'Engineering & Maint', caller: '4212', dest: '2451', type: 'Internal', dir: 'Internal', date: '2026-09-08', time: '10:41:02', dur: 94, rate: 0.00, status: 'Exempted' },
  { id: '4', cdrId: 'CDR-100248', ext: '1102', dept: 'Administration', caller: '1102', dest: '+442079460912', type: 'ISD', dir: 'Outgoing', date: '2026-09-08', time: '11:05:18', dur: 450, rate: 8.00, status: 'Billed' },
  { id: '5', cdrId: 'CDR-100249', ext: '5020', dept: 'Customer Service', caller: '01126154321', dest: '5020', type: 'Local', dir: 'Incoming', date: '2026-09-08', time: '11:12:30', dur: 210, rate: 0.00, status: 'Billed' },
  { id: '6', cdrId: 'CDR-100250', ext: '2105', dept: 'Cargo Operations', caller: '2105', dest: '02267543210', type: 'STD', dir: 'Outgoing', date: '2026-09-08', time: '11:25:44', dur: 520, rate: 1.50, status: 'Billed' },
  { id: '7', cdrId: 'CDR-100251', ext: '6011', dept: 'IT & Telecom', caller: '6011', dest: '3187', type: 'Internal', dir: 'Internal', date: '2026-09-08', time: '11:40:10', dur: 65, rate: 0.00, status: 'Exempted' },
  { id: '8', cdrId: 'CDR-100252', ext: '7025', dept: 'Finance & Accounts', caller: '7025', dest: '9876543210', type: 'Mobile', dir: 'Outgoing', date: '2026-09-08', time: '11:58:00', dur: 120, rate: 1.20, status: 'Billed' },
  { id: '9', cdrId: 'CDR-100253', ext: '2451', dept: 'Airport Operations', caller: '2451', dest: '03322894512', type: 'STD', dir: 'Outgoing', date: '2026-09-08', time: '12:15:22', dur: 610, rate: 1.50, status: 'Billed' },
  { id: '10', cdrId: 'CDR-100254', ext: '8040', dept: 'HR & Training', caller: '8040', dest: '01123456789', type: 'Local', dir: 'Outgoing', date: '2026-09-08', time: '12:30:15', dur: 145, rate: 0.80, status: 'Billed' },
  { id: '11', cdrId: 'CDR-100255', ext: '3187', dept: 'Security & CISF', caller: '3187', dest: '+97142245555', type: 'ISD', dir: 'Outgoing', date: '2026-09-08', time: '13:05:00', dur: 310, rate: 8.00, status: 'Billed' },
  { id: '12', cdrId: 'CDR-100256', ext: '4212', dept: 'Engineering & Maint', caller: '4212', dest: '9988776655', type: 'Mobile', dir: 'Outgoing', date: '2026-09-08', time: '13:22:45', dur: 275, rate: 1.20, status: 'Billed' },
  { id: '13', cdrId: 'CDR-100257', ext: '5020', dept: 'Customer Service', caller: '1800112233', dest: '5020', type: 'Toll-Free', dir: 'Incoming', date: '2026-09-08', time: '13:45:10', dur: 410, rate: 0.00, status: 'Exempted' },
  { id: '14', cdrId: 'CDR-100258', ext: '2452', dept: 'Airport Operations', caller: '2452', dest: '2451', type: 'Internal', dir: 'Internal', date: '2026-09-08', time: '14:02:18', dur: 180, rate: 0.00, status: 'Exempted' },
  { id: '15', cdrId: 'CDR-100259', ext: '2105', dept: 'Cargo Operations', caller: '2105', dest: '04428123456', type: 'STD', dir: 'Outgoing', date: '2026-09-08', time: '14:20:30', dur: 380, rate: 1.50, status: 'Billed' },
  { id: '16', cdrId: 'CDR-100260', ext: '1102', dept: 'Administration', caller: '1102', dest: '9810012345', type: 'Mobile', dir: 'Outgoing', date: '2026-09-08', time: '14:45:50', dur: 95, rate: 1.20, status: 'Billed' },
  { id: '17', cdrId: 'CDR-100261', ext: '6011', dept: 'IT & Telecom', caller: '6011', dest: '01125651000', type: 'Local', dir: 'Outgoing', date: '2026-09-08', time: '15:10:12', dur: 530, rate: 0.80, status: 'Billed' },
  { id: '18', cdrId: 'CDR-100262', ext: '3188', dept: 'Security & CISF', caller: '3188', dest: '3187', type: 'Internal', dir: 'Internal', date: '2026-09-08', time: '15:30:25', dur: 85, rate: 0.00, status: 'Exempted' },
  { id: '19', cdrId: 'CDR-100263', ext: '7025', dept: 'Finance & Accounts', caller: '7025', dest: '08025589000', type: 'STD', dir: 'Outgoing', date: '2026-09-08', time: '15:55:00', dur: 290, rate: 1.50, status: 'Billed' },
  { id: '20', cdrId: 'CDR-100264', ext: '2451', dept: 'Airport Operations', caller: '2451', dest: '+6565421234', type: 'ISD', dir: 'Outgoing', date: '2026-09-08', time: '16:15:30', dur: 490, rate: 8.00, status: 'Billed' },
  { id: '21', cdrId: 'CDR-100265', ext: '5021', dept: 'Customer Service', caller: '9818812345', dest: '5021', type: 'Mobile', dir: 'Incoming', date: '2026-09-08', time: '16:35:10', dur: 160, rate: 0.00, status: 'Billed' },
  { id: '22', cdrId: 'CDR-100266', ext: '4213', dept: 'Engineering & Maint', caller: '4213', dest: '9820034567', type: 'Mobile', dir: 'Outgoing', date: '2026-09-08', time: '16:50:40', dur: 220, rate: 1.20, status: 'Billed' },
  { id: '23', cdrId: 'CDR-100267', ext: '8040', dept: 'HR & Training', caller: '8040', dest: '1102', type: 'Internal', dir: 'Internal', date: '2026-09-08', time: '17:05:15', dur: 115, rate: 0.00, status: 'Exempted' },
  { id: '24', cdrId: 'CDR-100268', ext: '2106', dept: 'Cargo Operations', caller: '2106', dest: '02026123456', type: 'STD', dir: 'Outgoing', date: '2026-09-08', time: '17:22:00', dur: 310, rate: 1.50, status: 'Billed' },
  { id: '25', cdrId: 'CDR-100269', ext: '3187', dept: 'Security & CISF', caller: '3187', dest: '9910045678', type: 'Mobile', dir: 'Outgoing', date: '2026-09-08', time: '17:40:18', dur: 140, rate: 1.20, status: 'Billed' },
  { id: '26', cdrId: 'CDR-100270', ext: '2451', dept: 'Airport Operations', caller: '2451', dest: '01124610111', type: 'Local', dir: 'Outgoing', date: '2026-09-07', time: '09:15:30', dur: 275, rate: 0.80, status: 'Billed' },
  { id: '27', cdrId: 'CDR-100271', ext: '6011', dept: 'IT & Telecom', caller: '6011', dest: '9871122334', type: 'Mobile', dir: 'Outgoing', date: '2026-09-07', time: '09:45:00', dur: 190, rate: 1.20, status: 'Billed' },
  { id: '28', cdrId: 'CDR-100272', ext: '1102', dept: 'Administration', caller: '1102', dest: '+12125550199', type: 'ISD', dir: 'Outgoing', date: '2026-09-07', time: '10:10:25', dur: 720, rate: 8.00, status: 'Billed' },
  { id: '29', cdrId: 'CDR-100273', ext: '4212', dept: 'Engineering & Maint', caller: '4212', dest: '01202456789', type: 'Local', dir: 'Outgoing', date: '2026-09-07', time: '10:35:10', dur: 340, rate: 0.80, status: 'Billed' },
  { id: '30', cdrId: 'CDR-100274', ext: '5020', dept: 'Customer Service', caller: '5020', dest: '5021', type: 'Internal', dir: 'Internal', date: '2026-09-07', time: '11:00:45', dur: 45, rate: 0.00, status: 'Exempted' },
  { id: '31', cdrId: 'CDR-100275', ext: '7025', dept: 'Finance & Accounts', caller: '7025', dest: '07926567890', type: 'STD', dir: 'Outgoing', date: '2026-09-07', time: '11:20:15', dur: 420, rate: 1.50, status: 'Billed' },
  { id: '32', cdrId: 'CDR-100276', ext: '2105', dept: 'Cargo Operations', caller: '2105', dest: '9840011223', type: 'Mobile', dir: 'Outgoing', date: '2026-09-07', time: '11:45:30', dur: 260, rate: 1.20, status: 'Billed' },
  { id: '33', cdrId: 'CDR-100277', ext: '3187', dept: 'Security & CISF', caller: '3187', dest: '01123015555', type: 'Local', dir: 'Outgoing', date: '2026-09-07', time: '12:10:00', dur: 310, rate: 0.80, status: 'Billed' },
  { id: '34', cdrId: 'CDR-100278', ext: '2452', dept: 'Airport Operations', caller: '2452', dest: '9818899000', type: 'Mobile', dir: 'Outgoing', date: '2026-09-07', time: '12:35:40', dur: 175, rate: 1.20, status: 'Billed' },
  { id: '35', cdrId: 'CDR-100279', ext: '8040', dept: 'HR & Training', caller: '8040', dest: '04027890123', type: 'STD', dir: 'Outgoing', date: '2026-09-07', time: '13:00:20', dur: 230, rate: 1.50, status: 'Billed' },
];

export const mockCDRRecords: CDRRecord[] = rawCdrData.map((item) => {
  const costInfo = calculateCallCost(item.dur, item.rate, 60, 18);
  const startParts = item.time.split(':');
  const startSec = parseInt(startParts[0]) * 3600 + parseInt(startParts[1]) * 60 + parseInt(startParts[2]);
  const endSec = startSec + item.dur;
  const endH = Math.floor((endSec % 86400) / 3600).toString().padStart(2, '0');
  const endM = Math.floor((endSec % 3600) / 60).toString().padStart(2, '0');
  const endS = (endSec % 60).toString().padStart(2, '0');

  return {
    id: item.id,
    cdrId: item.cdrId,
    extension: item.ext,
    department: item.dept,
    callerNumber: item.caller,
    destinationNumber: item.dest,
    callType: item.type as any,
    direction: item.dir as any,
    startDate: item.date,
    startTime: item.time,
    endTime: `${endH}:${endM}:${endS}`,
    durationSeconds: item.dur,
    durationFormatted: formatDuration(item.dur),
    ratePerMinute: item.rate,
    callCost: costInfo.subtotal,
    taxAmount: costInfo.taxAmount,
    totalAmount: costInfo.totalAmount,
    billingStatus: item.status as any,
    billingCycle: 'Aug 2026',
    trunkLine: 'PRI-E1-01',
    disconnectReason: 'Normal Clearing (Code 16)',
  };
});
