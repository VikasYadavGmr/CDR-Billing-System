import type {
  BillingTrendPoint,
  CallStatusDistItem,
  CallTypeDistItem,
  CMRQualitySummary,
  DailySystemSummaryRow,
  DepartmentUsageRow,
  ExtensionUsageRow,
  PeakUsageMetrics,
  SystemHealthIndicators,
  SystemSummaryKPIs,
  TopDepartmentBillingRow,
  TopExtensionUsageRow,
  VolumeTrendPoint,
} from '../types';

export const systemDepartments = [
  'All Departments',
  'Airport Operations',
  'Security',
  'Passenger Services',
  'Engineering',
  'Administration',
  'IT',
  'Finance',
  'Ground Handling',
  'Terminal Management',
  'Facility Management',
];

export const systemCallTypes = ['All', 'Internal', 'External', 'International'];
export const systemCallStatuses = ['All', 'Completed', 'Failed', 'Busy', 'No Answer', 'Cancelled'];

export const systemSummaryKPIs: SystemSummaryKPIs = {
  totalCalls: 24586,
  totalCallsChangePct: 8.4,
  totalDuration: '18,426 hrs 32 min',
  totalDurationHours: 18426.53,
  totalBilling: 842650,
  internalCalls: 14286,
  internalCallsPct: 58.1,
  externalCalls: 8942,
  externalCallsPct: 36.4,
  internationalCalls: 1358,
  internationalCallsPct: 5.5,
  failedCalls: 1672,
  failedCallsPct: 6.8,
  averageCallDuration: '04m 32s',
};

export const dailyVolumeTrend: VolumeTrendPoint[] = [
  { date: '2026-09-01', label: '01 Sep', totalCalls: 3120, successfulCalls: 2908, failedCalls: 212 },
  { date: '2026-09-02', label: '02 Sep', totalCalls: 3480, successfulCalls: 3245, failedCalls: 235 },
  { date: '2026-09-03', label: '03 Sep', totalCalls: 3760, successfulCalls: 3510, failedCalls: 250 },
  { date: '2026-09-04', label: '04 Sep', totalCalls: 3420, successfulCalls: 3195, failedCalls: 225 },
  { date: '2026-09-05', label: '05 Sep', totalCalls: 4120, successfulCalls: 3840, failedCalls: 280 },
  { date: '2026-09-06', label: '06 Sep', totalCalls: 3210, successfulCalls: 2995, failedCalls: 215 },
  { date: '2026-09-07', label: '07 Sep', totalCalls: 3476, successfulCalls: 3221, failedCalls: 255 },
];

export const weeklyVolumeTrend: VolumeTrendPoint[] = [
  { date: '2026-W32', label: 'Week 1 (Aug)', totalCalls: 22400, successfulCalls: 20980, failedCalls: 1420 },
  { date: '2026-W33', label: 'Week 2 (Aug)', totalCalls: 23850, successfulCalls: 22340, failedCalls: 1510 },
  { date: '2026-W34', label: 'Week 3 (Aug)', totalCalls: 24100, successfulCalls: 22610, failedCalls: 1490 },
  { date: '2026-W35', label: 'Week 4 (Aug)', totalCalls: 23600, successfulCalls: 22090, failedCalls: 1510 },
  { date: '2026-W36', label: 'Week 1 (Sep)', totalCalls: 24586, successfulCalls: 22914, failedCalls: 1672 },
];

export const monthlyVolumeTrend: VolumeTrendPoint[] = [
  { date: '2026-05', label: 'May 2026', totalCalls: 91400, successfulCalls: 85600, failedCalls: 5800 },
  { date: '2026-06', label: 'Jun 2026', totalCalls: 96800, successfulCalls: 90700, failedCalls: 6100 },
  { date: '2026-07', label: 'Jul 2026', totalCalls: 102400, successfulCalls: 95900, failedCalls: 6500 },
  { date: '2026-08', label: 'Aug 2026', totalCalls: 98600, successfulCalls: 92350, failedCalls: 6250 },
  { date: '2026-09', label: 'Sep 2026 (MTD)', totalCalls: 24586, successfulCalls: 22914, failedCalls: 1672 },
];

export const dailyBillingTrend: BillingTrendPoint[] = [
  { date: '2026-09-01', label: '01 Sep', totalBilling: 92400, internalBilling: 0, externalBilling: 58400, internationalBilling: 34000 },
  { date: '2026-09-02', label: '02 Sep', totalBilling: 108200, internalBilling: 0, externalBilling: 69200, internationalBilling: 39000 },
  { date: '2026-09-03', label: '03 Sep', totalBilling: 115600, internalBilling: 0, externalBilling: 72800, internationalBilling: 42800 },
  { date: '2026-09-04', label: '04 Sep', totalBilling: 97400, internalBilling: 0, externalBilling: 61200, internationalBilling: 36200 },
  { date: '2026-09-05', label: '05 Sep', totalBilling: 132800, internalBilling: 0, externalBilling: 81600, internationalBilling: 51200 },
  { date: '2026-09-06', label: '06 Sep', totalBilling: 106200, internalBilling: 0, externalBilling: 66800, internationalBilling: 39400 },
  { date: '2026-09-07', label: '07 Sep', totalBilling: 124050, internalBilling: 0, externalBilling: 76400, internationalBilling: 47650 },
];

export const callTypeDistribution: CallTypeDistItem[] = [
  { category: 'Internal', callCount: 14286, percentage: 58.1, billingAmount: 0, color: '#0d9488' },
  { category: 'External', callCount: 8942, percentage: 36.4, billingAmount: 512400, color: '#0284c7' },
  { category: 'International', callCount: 1358, percentage: 5.5, billingAmount: 330250, color: '#f59e0b' },
];

export const callStatusDistribution: CallStatusDistItem[] = [
  { status: 'Completed', callCount: 22914, percentage: 93.2, color: '#10b981' },
  { status: 'Failed', callCount: 1672, percentage: 6.8, color: '#f43f5e' },
  { status: 'Busy', callCount: 486, percentage: 2.0, color: '#f97316' },
  { status: 'No Answer', callCount: 932, percentage: 3.8, color: '#64748b' },
  { status: 'Cancelled', callCount: 254, percentage: 1.0, color: '#a855f7' },
];

export const peakUsageMetrics: PeakUsageMetrics = {
  peakHour: '15:00',
  peakCallCount: 1106,
  lowestUsageHour: '04:00',
  lowestCallCount: 84,
  averageCallsPerHour: 1024,
  hourlyData: [
    { hour: '08:00', displayTime: '08:00', callCount: 420, isPeak: false },
    { hour: '09:00', displayTime: '09:00', callCount: 684, isPeak: false },
    { hour: '10:00', displayTime: '10:00', callCount: 812, isPeak: false },
    { hour: '11:00', displayTime: '11:00', callCount: 936, isPeak: false },
    { hour: '12:00', displayTime: '12:00', callCount: 1024, isPeak: false },
    { hour: '13:00', displayTime: '13:00', callCount: 842, isPeak: false },
    { hour: '14:00', displayTime: '14:00', callCount: 918, isPeak: false },
    { hour: '15:00', displayTime: '15:00', callCount: 1106, isPeak: true },
    { hour: '16:00', displayTime: '16:00', callCount: 982, isPeak: false },
    { hour: '17:00', displayTime: '17:00', callCount: 756, isPeak: false },
  ],
};

export const cmrQualitySummary: CMRQualitySummary = {
  totalCallsWithCMR: 21840,
  goodQualityCalls: 19450,
  goodPct: 89.1,
  fairQualityCalls: 1820,
  fairPct: 8.3,
  poorQualityCalls: 570,
  poorPct: 2.6,
  callsWithQualityIssues: 2390,
  averageMOS: 4.28,
  averageJitterMs: 5.4,
  averageLatencyMs: 31.2,
  averagePacketLossPct: 0.42,
};

export const systemHealthIndicators: SystemHealthIndicators = {
  activeExtensions: 1248,
  noActivityExtensions: 86,
  highUsageExtensions: 124,
  failedCallRate: 6.8,
  averageCallsPerExtension: 19.7,
  averageBillingPerExtension: 676,
};

export const departmentUsageData: DepartmentUsageRow[] = [
  { id: 'dept-1', department: 'Airport Operations', activeExtensions: 198, totalCalls: 5420, totalDuration: '4,120h 15m', totalDurationMinutes: 247215, internalCalls: 3120, externalCalls: 1980, internationalCalls: 320, billing: 198450, failedCalls: 310 },
  { id: 'dept-2', department: 'Security', activeExtensions: 184, totalCalls: 4860, totalDuration: '3,450h 20m', totalDurationMinutes: 207020, internalCalls: 3240, externalCalls: 1480, internationalCalls: 140, billing: 134200, failedCalls: 285 },
  { id: 'dept-3', department: 'Passenger Services', activeExtensions: 165, totalCalls: 3820, totalDuration: '2,980h 45m', totalDurationMinutes: 178845, internalCalls: 1980, externalCalls: 1640, internationalCalls: 200, billing: 128600, failedCalls: 240 },
  { id: 'dept-4', department: 'Engineering', activeExtensions: 142, totalCalls: 2940, totalDuration: '2,150h 10m', totalDurationMinutes: 129010, internalCalls: 1820, externalCalls: 980, internationalCalls: 140, billing: 94800, failedCalls: 190 },
  { id: 'dept-5', department: 'Terminal Management', activeExtensions: 126, totalCalls: 2450, totalDuration: '1,890h 30m', totalDurationMinutes: 113430, internalCalls: 1450, externalCalls: 860, internationalCalls: 140, billing: 82400, failedCalls: 160 },
  { id: 'dept-6', department: 'IT', activeExtensions: 98, totalCalls: 1890, totalDuration: '1,420h 05m', totalDurationMinutes: 85205, internalCalls: 1120, externalCalls: 640, internationalCalls: 130, billing: 64800, failedCalls: 125 },
  { id: 'dept-7', department: 'Administration', activeExtensions: 92, totalCalls: 1240, totalDuration: '980h 15m', totalDurationMinutes: 58815, internalCalls: 680, externalCalls: 460, internationalCalls: 100, billing: 48900, failedCalls: 98 },
  { id: 'dept-8', department: 'Finance', activeExtensions: 84, totalCalls: 920, totalDuration: '690h 40m', totalDurationMinutes: 41440, internalCalls: 490, externalCalls: 360, internationalCalls: 70, billing: 36800, failedCalls: 110 },
  { id: 'dept-9', department: 'Ground Handling', activeExtensions: 88, totalCalls: 680, totalDuration: '495h 10m', totalDurationMinutes: 29710, internalCalls: 310, externalCalls: 310, internationalCalls: 60, billing: 31200, failedCalls: 84 },
  { id: 'dept-10', department: 'Facility Management', activeExtensions: 71, totalCalls: 366, totalDuration: '179h 17m', totalDurationMinutes: 10757, internalCalls: 76, externalCalls: 232, internationalCalls: 58, billing: 22500, failedCalls: 70 },
];

export const extensionUsageData: ExtensionUsageRow[] = [
  { id: 'ext-1', extension: 'EXT-1024', department: 'Airport Operations', totalCalls: 428, totalDuration: '31h 42m', totalDurationMinutes: 1902, internalCalls: 214, externalCalls: 192, internationalCalls: 22, billing: 18420, lastActivity: '11 Sep 2026 09:42', status: 'Active' },
  { id: 'ext-2', extension: 'EXT-1048', department: 'Airport Operations', totalCalls: 395, totalDuration: '28h 15m', totalDurationMinutes: 1695, internalCalls: 198, externalCalls: 175, internationalCalls: 22, billing: 16200, lastActivity: '11 Sep 2026 09:38', status: 'Active' },
  { id: 'ext-3', extension: 'EXT-2014', department: 'Security', totalCalls: 380, totalDuration: '26h 50m', totalDurationMinutes: 1610, internalCalls: 240, externalCalls: 130, internationalCalls: 10, billing: 12900, lastActivity: '11 Sep 2026 09:45', status: 'Active' },
  { id: 'ext-4', extension: 'EXT-3050', department: 'Passenger Services', totalCalls: 362, totalDuration: '25h 10m', totalDurationMinutes: 1510, internalCalls: 180, externalCalls: 164, internationalCalls: 18, billing: 14800, lastActivity: '11 Sep 2026 09:40', status: 'Active' },
  { id: 'ext-5', extension: 'EXT-2231', department: 'Security', totalCalls: 345, totalDuration: '23h 40m', totalDurationMinutes: 1420, internalCalls: 210, externalCalls: 125, internationalCalls: 10, billing: 11800, lastActivity: '11 Sep 2026 09:28', status: 'Active' },
  { id: 'ext-6', extension: 'EXT-2451', department: 'Airport Operations', totalCalls: 330, totalDuration: '22h 15m', totalDurationMinutes: 1335, internalCalls: 160, externalCalls: 152, internationalCalls: 18, billing: 13600, lastActivity: '11 Sep 2026 09:35', status: 'Active' },
  { id: 'ext-7', extension: 'EXT-4010', department: 'Engineering', totalCalls: 310, totalDuration: '20h 50m', totalDurationMinutes: 1250, internalCalls: 190, externalCalls: 108, internationalCalls: 12, billing: 10400, lastActivity: '11 Sep 2026 09:12', status: 'Active' },
  { id: 'ext-8', extension: 'EXT-2458', department: 'IT', totalCalls: 295, totalDuration: '19h 30m', totalDurationMinutes: 1170, internalCalls: 175, externalCalls: 105, internationalCalls: 15, billing: 9800, lastActivity: '11 Sep 2026 09:30', status: 'Active' },
  { id: 'ext-9', extension: 'EXT-5020', department: 'Terminal Management', totalCalls: 280, totalDuration: '18h 45m', totalDurationMinutes: 1125, internalCalls: 160, externalCalls: 108, internationalCalls: 12, billing: 9200, lastActivity: '11 Sep 2026 09:18', status: 'Active' },
  { id: 'ext-10', extension: 'EXT-6015', department: 'Administration', totalCalls: 260, totalDuration: '17h 20m', totalDurationMinutes: 1040, internalCalls: 140, externalCalls: 105, internationalCalls: 15, billing: 8900, lastActivity: '11 Sep 2026 08:55', status: 'Active' },
  { id: 'ext-11', extension: 'EXT-2265', department: 'Finance', totalCalls: 240, totalDuration: '16h 05m', totalDurationMinutes: 965, internalCalls: 130, externalCalls: 100, internationalCalls: 10, billing: 8400, lastActivity: '11 Sep 2026 09:05', status: 'Active' },
  { id: 'ext-12', extension: 'EXT-7010', department: 'Ground Handling', totalCalls: 220, totalDuration: '14h 50m', totalDurationMinutes: 890, internalCalls: 110, externalCalls: 100, internationalCalls: 10, billing: 7800, lastActivity: '11 Sep 2026 08:40', status: 'Active' },
  { id: 'ext-13', extension: 'EXT-8012', department: 'Facility Management', totalCalls: 195, totalDuration: '13h 10m', totalDurationMinutes: 790, internalCalls: 95, externalCalls: 90, internationalCalls: 10, billing: 7100, lastActivity: '11 Sep 2026 08:32', status: 'Active' },
  { id: 'ext-14', extension: 'EXT-1102', department: 'Airport Operations', totalCalls: 180, totalDuration: '12h 00m', totalDurationMinutes: 720, internalCalls: 90, externalCalls: 82, internationalCalls: 8, billing: 6400, lastActivity: '11 Sep 2026 08:15', status: 'Active' },
  { id: 'ext-15', extension: 'EXT-1250', department: 'Passenger Services', totalCalls: 165, totalDuration: '11h 15m', totalDurationMinutes: 675, internalCalls: 85, externalCalls: 72, internationalCalls: 8, billing: 5900, lastActivity: '11 Sep 2026 08:02', status: 'Active' },
  { id: 'ext-16', extension: 'EXT-2150', department: 'Security', totalCalls: 150, totalDuration: '10h 30m', totalDurationMinutes: 630, internalCalls: 95, externalCalls: 50, internationalCalls: 5, billing: 4800, lastActivity: '11 Sep 2026 07:50', status: 'Active' },
  { id: 'ext-17', extension: 'EXT-3080', department: 'Engineering', totalCalls: 135, totalDuration: '9h 10m', totalDurationMinutes: 550, internalCalls: 80, externalCalls: 50, internationalCalls: 5, billing: 4200, lastActivity: '11 Sep 2026 07:45', status: 'Active' },
  { id: 'ext-18', extension: 'EXT-4095', department: 'IT', totalCalls: 110, totalDuration: '7h 40m', totalDurationMinutes: 460, internalCalls: 65, externalCalls: 40, internationalCalls: 5, billing: 3600, lastActivity: '11 Sep 2026 07:20', status: 'Idle' },
  { id: 'ext-19', extension: 'EXT-5110', department: 'Administration', totalCalls: 85, totalDuration: '5h 50m', totalDurationMinutes: 350, internalCalls: 50, externalCalls: 32, internationalCalls: 3, billing: 2800, lastActivity: '10 Sep 2026 18:40', status: 'Idle' },
  { id: 'ext-20', extension: 'EXT-9900', department: 'Facility Management', totalCalls: 24, totalDuration: '1h 30m', totalDurationMinutes: 90, internalCalls: 18, externalCalls: 6, internationalCalls: 0, billing: 650, lastActivity: '10 Sep 2026 14:10', status: 'Maintenance' },
];

export const dailySystemSummaryData: DailySystemSummaryRow[] = [
  { date: '10-Sep-2026', totalCalls: 3620, completed: 3380, failed: 240, internal: 2100, external: 1320, international: 200, totalDuration: '2,680 hrs', totalBilling: 128400, averageDuration: '04m 26s' },
  { date: '09-Sep-2026', totalCalls: 3540, completed: 3305, failed: 235, internal: 2050, external: 1290, international: 200, totalDuration: '2,610 hrs', totalBilling: 124800, averageDuration: '04m 25s' },
  { date: '08-Sep-2026', totalCalls: 3500, completed: 3270, failed: 230, internal: 2020, external: 1280, international: 200, totalDuration: '2,580 hrs', totalBilling: 122600, averageDuration: '04m 25s' },
  { date: '07-Sep-2026', totalCalls: 3476, completed: 3221, failed: 255, internal: 2010, external: 1270, international: 196, totalDuration: '2,560 hrs', totalBilling: 124050, averageDuration: '04m 25s' },
  { date: '06-Sep-2026', totalCalls: 3210, completed: 2995, failed: 215, internal: 1880, external: 1160, international: 170, totalDuration: '2,380 hrs', totalBilling: 106200, averageDuration: '04m 27s' },
  { date: '05-Sep-2026', totalCalls: 4120, completed: 3840, failed: 280, internal: 2410, external: 1480, international: 230, totalDuration: '3,080 hrs', totalBilling: 132800, averageDuration: '04m 29s' },
  { date: '04-Sep-2026', totalCalls: 3420, completed: 3195, failed: 225, internal: 1990, external: 1240, international: 190, totalDuration: '2,520 hrs', totalBilling: 97400, averageDuration: '04m 25s' },
  { date: '03-Sep-2026', totalCalls: 3760, completed: 3510, failed: 250, internal: 2180, external: 1370, international: 210, totalDuration: '2,790 hrs', totalBilling: 115600, averageDuration: '04m 27s' },
  { date: '02-Sep-2026', totalCalls: 3480, completed: 3245, failed: 235, internal: 2020, external: 1270, international: 190, totalDuration: '2,570 hrs', totalBilling: 108200, averageDuration: '04m 26s' },
  { date: '01-Sep-2026', totalCalls: 3120, completed: 2908, failed: 212, internal: 1810, external: 1140, international: 170, totalDuration: '2,310 hrs', totalBilling: 92400, averageDuration: '04m 26s' },
];

export const topDepartmentsByBilling: TopDepartmentBillingRow[] = [
  { rank: 1, department: 'Airport Operations', calls: 5420, duration: '4,120h 15m', billing: 198450, billingPct: 23.5 },
  { rank: 2, department: 'Security', calls: 4860, duration: '3,450h 20m', billing: 134200, billingPct: 15.9 },
  { rank: 3, department: 'Passenger Services', calls: 3820, duration: '2,980h 45m', billing: 128600, billingPct: 15.3 },
  { rank: 4, department: 'Engineering', calls: 2940, duration: '2,150h 10m', billing: 94800, billingPct: 11.2 },
  { rank: 5, department: 'Terminal Management', calls: 2450, duration: '1,890h 30m', billing: 82400, billingPct: 9.8 },
  { rank: 6, department: 'IT', calls: 1890, duration: '1,420h 05m', billing: 64800, billingPct: 7.7 },
  { rank: 7, department: 'Administration', calls: 1240, duration: '980h 15m', billing: 48900, billingPct: 5.8 },
  { rank: 8, department: 'Finance', calls: 920, duration: '690h 40m', billing: 36800, billingPct: 4.4 },
  { rank: 9, department: 'Ground Handling', calls: 680, duration: '495h 10m', billing: 31200, billingPct: 3.7 },
  { rank: 10, department: 'Facility Management', calls: 366, duration: '179h 17m', billing: 22500, billingPct: 2.7 },
];

export const topExtensionsByUsage: TopExtensionUsageRow[] = [
  { rank: 1, extension: 'EXT-1024', department: 'Airport Operations', calls: 428, duration: '31h 42m', billing: 18420 },
  { rank: 2, extension: 'EXT-1048', department: 'Airport Operations', calls: 395, duration: '28h 15m', billing: 16200 },
  { rank: 3, extension: 'EXT-2014', department: 'Security', calls: 380, duration: '26h 50m', billing: 12900 },
  { rank: 4, extension: 'EXT-3050', department: 'Passenger Services', calls: 362, duration: '25h 10m', billing: 14800 },
  { rank: 5, extension: 'EXT-2231', department: 'Security', calls: 345, duration: '23h 40m', billing: 11800 },
  { rank: 6, extension: 'EXT-2451', department: 'Airport Operations', calls: 330, duration: '22h 15m', billing: 13600 },
  { rank: 7, extension: 'EXT-4010', department: 'Engineering', calls: 310, duration: '20h 50m', billing: 10400 },
  { rank: 8, extension: 'EXT-2458', department: 'IT', calls: 295, duration: '19h 30m', billing: 9800 },
  { rank: 9, extension: 'EXT-5020', department: 'Terminal Management', calls: 280, duration: '18h 45m', billing: 9200 },
  { rank: 10, extension: 'EXT-6015', department: 'Administration', calls: 260, duration: '17h 20m', billing: 8900 },
];
