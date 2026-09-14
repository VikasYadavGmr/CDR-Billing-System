/**
 * Demo / dummy data for CDR Analysis and Reporting – Overview
 * No backend dependency — used for UI only.
 */

export type DateRangePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';
export type TrafficMetric = 'calls' | 'duration' | 'cost';
export type DeptMetric = 'calls' | 'duration' | 'cost';
export type GatewayStatusType = 'Active' | 'Warning' | 'Offline';

export interface OverviewKPI {
  id: string;
  title: string;
  value: string;
  comparison: string;
  isPositive: boolean;
  tooltip: string;
  relatedSection: string;
}

export interface HourlyTrafficPoint {
  hour: string;
  calls: number;
  duration: number; // minutes
  cost: number;
}

export interface CallTypeItem {
  name: string;
  value: number;
  color: string;
}

export interface DepartmentUsageItem {
  department: string;
  calls: number;
  duration: number; // minutes
  cost: number;
}

export interface TopUserItem {
  rank: number;
  user: string;
  extension: string;
  department: string;
  totalCalls: number;
  duration: string;
  totalCost: number;
  status: 'Active' | 'Idle' | 'Busy';
}

export interface TopDestinationItem {
  rank: number;
  destination: string;
  callType: string;
  totalCalls: number;
  totalDuration: string;
  totalCost: number;
}

export interface GatewayItem {
  id: string;
  name: string;
  type: string;
  status: GatewayStatusType;
  channels: number;
  utilization: number;
}

export interface TrunkItem {
  trunkName: string;
  provider: string;
  totalChannels: number;
  activeChannels: number;
  utilization: number;
  status: GatewayStatusType;
}

export interface QoSSummaryData {
  good: number;
  acceptable: number;
  fair: number;
  poor: number;
  averageMos: number;
  averageJitterMs: number;
  averageLatencyMs: number;
  packetLossPercent: number;
}

export interface RecentCallItem {
  id: string;
  cdrId: string;
  date: string;
  time: string;
  callingNumber: string;
  calledNumber: string;
  callType: string;
  duration: string;
  status: 'Completed' | 'Failed' | 'Busy' | 'No Answer';
  gateway: string;
  cost: number;
  department: string;
  location: string;
}

export const overviewKPIs: OverviewKPI[] = [
  {
    id: 'total-calls',
    title: 'Total Calls',
    value: '25,430',
    comparison: '+4.2%',
    isPositive: true,
    tooltip: 'Total call attempts recorded in the selected period',
    relatedSection: 'call-traffic',
  },
  {
    id: 'completed-calls',
    title: 'Completed Calls',
    value: '23,821',
    comparison: '+3.8%',
    isPositive: true,
    tooltip: 'Successfully completed calls with talk time',
    relatedSection: 'recent-calls',
  },
  {
    id: 'failed-calls',
    title: 'Failed Calls',
    value: '1,609',
    comparison: '-2.1%',
    isPositive: true,
    tooltip: 'Failed, busy, or unanswered call attempts',
    relatedSection: 'call-types',
  },
  {
    id: 'total-duration',
    title: 'Total Call Duration',
    value: '128,430 min',
    comparison: '+1.9%',
    isPositive: true,
    tooltip: 'Cumulative talk time across all completed calls',
    relatedSection: 'call-traffic',
  },
  {
    id: 'total-cost',
    title: 'Total Call Cost',
    value: '₹48,520',
    comparison: '+5.4%',
    isPositive: false,
    tooltip: 'Estimated billable cost for the selected period (INR)',
    relatedSection: 'department-usage',
  },
  {
    id: 'avg-duration',
    title: 'Average Call Duration',
    value: '5m 04s',
    comparison: '+0.6%',
    isPositive: true,
    tooltip: 'Mean talk time per completed call',
    relatedSection: 'top-users',
  },
];

export const hourlyTrafficData: HourlyTrafficPoint[] = [
  { hour: '08:00', calls: 420, duration: 1680, cost: 1260 },
  { hour: '09:00', calls: 980, duration: 4120, cost: 3180 },
  { hour: '10:00', calls: 1450, duration: 7250, cost: 5420 },
  { hour: '11:00', calls: 1820, duration: 9100, cost: 6840 },
  { hour: '12:00', calls: 1250, duration: 5625, cost: 4120 },
  { hour: '13:00', calls: 900, duration: 3600, cost: 2680 },
  { hour: '14:00', calls: 1320, duration: 6600, cost: 4980 },
  { hour: '15:00', calls: 1580, duration: 7900, cost: 5920 },
  { hour: '16:00', calls: 1740, duration: 8700, cost: 6540 },
  { hour: '17:00', calls: 1210, duration: 5445, cost: 4020 },
];

export const callTypeDistribution: CallTypeItem[] = [
  { name: 'Internal', value: 7820, color: '#0ea5e9' },
  { name: 'Incoming', value: 5430, color: '#14b8a6' },
  { name: 'Outgoing', value: 6920, color: '#0284c7' },
  { name: 'Local', value: 2340, color: '#6366f1' },
  { name: 'STD', value: 1820, color: '#f59e0b' },
  { name: 'International', value: 520, color: '#ef4444' },
  { name: 'Failed', value: 580, color: '#94a3b8' },
];

export const departmentUsageData: DepartmentUsageItem[] = [
  { department: 'Airport Operations', calls: 4280, duration: 21400, cost: 12450 },
  { department: 'Security', calls: 3650, duration: 18250, cost: 9860 },
  { department: 'IT', calls: 2980, duration: 14900, cost: 7420 },
  { department: 'Engineering', calls: 2760, duration: 13800, cost: 6890 },
  { department: 'Finance', calls: 2140, duration: 10700, cost: 5240 },
  { department: 'Administration', calls: 1980, duration: 9900, cost: 4680 },
  { department: 'Terminal Management', calls: 2460, duration: 12300, cost: 6120 },
  { department: 'Baggage', calls: 1820, duration: 9100, cost: 3980 },
  { department: 'Cargo', calls: 1560, duration: 7800, cost: 3680 },
];

export const topUsersData: TopUserItem[] = [
  {
    rank: 1,
    user: 'Rahul Sharma',
    extension: '2451',
    department: 'Airport Operations',
    totalCalls: 830,
    duration: '14h 22m',
    totalCost: 2340,
    status: 'Active',
  },
  {
    rank: 2,
    user: 'Amit Kumar',
    extension: '2231',
    department: 'Security',
    totalCalls: 695,
    duration: '11h 45m',
    totalCost: 1920,
    status: 'Busy',
  },
  {
    rank: 3,
    user: 'Priya Singh',
    extension: '2458',
    department: 'IT',
    totalCalls: 620,
    duration: '10h 31m',
    totalCost: 1680,
    status: 'Active',
  },
  {
    rank: 4,
    user: 'Sanjay Verma',
    extension: '3102',
    department: 'Engineering',
    totalCalls: 548,
    duration: '9h 12m',
    totalCost: 1450,
    status: 'Idle',
  },
  {
    rank: 5,
    user: 'Neha Gupta',
    extension: '4015',
    department: 'Finance',
    totalCalls: 492,
    duration: '8h 05m',
    totalCost: 1280,
    status: 'Active',
  },
];

export const topDestinationsData: TopDestinationItem[] = [
  {
    rank: 1,
    destination: '9876543210',
    callType: 'Mobile',
    totalCalls: 412,
    totalDuration: '18h 40m',
    totalCost: 3120,
  },
  {
    rank: 2,
    destination: '01123456789',
    callType: 'Local',
    totalCalls: 356,
    totalDuration: '14h 22m',
    totalCost: 1840,
  },
  {
    rank: 3,
    destination: '02226543210',
    callType: 'STD',
    totalCalls: 268,
    totalDuration: '11h 05m',
    totalCost: 2460,
  },
  {
    rank: 4,
    destination: '+442079460912',
    callType: 'International',
    totalCalls: 94,
    totalDuration: '6h 18m',
    totalCost: 4820,
  },
  {
    rank: 5,
    destination: '2458',
    callType: 'Internal',
    totalCalls: 520,
    totalDuration: '9h 44m',
    totalCost: 0,
  },
];

export const gatewayStatusData: GatewayItem[] = [
  {
    id: 'gw1',
    name: 'GW-DEL-01',
    type: 'SIP Gateway',
    status: 'Active',
    channels: 120,
    utilization: 78,
  },
  {
    id: 'gw2',
    name: 'GW-DEL-02',
    type: 'SIP Gateway',
    status: 'Active',
    channels: 60,
    utilization: 64,
  },
  {
    id: 'gw3',
    name: 'GW-DEL-03',
    type: 'PRI Gateway',
    status: 'Warning',
    channels: 30,
    utilization: 91,
  },
];

export const trunkUtilizationData: TrunkItem[] = [
  {
    trunkName: 'TRK-SIP-01',
    provider: 'Airtel SIP',
    totalChannels: 120,
    activeChannels: 94,
    utilization: 78,
    status: 'Active',
  },
  {
    trunkName: 'TRK-SIP-02',
    provider: 'Jio SIP',
    totalChannels: 60,
    activeChannels: 38,
    utilization: 64,
    status: 'Active',
  },
  {
    trunkName: 'TRK-PRI-01',
    provider: 'BSNL PRI',
    totalChannels: 30,
    activeChannels: 27,
    utilization: 91,
    status: 'Warning',
  },
  {
    trunkName: 'TRK-PRI-02',
    provider: 'Tata PRI',
    totalChannels: 30,
    activeChannels: 0,
    utilization: 0,
    status: 'Offline',
  },
];

export const qosSummaryData: QoSSummaryData = {
  good: 72,
  acceptable: 18,
  fair: 7,
  poor: 3,
  averageMos: 4.1,
  averageJitterMs: 6.2,
  averageLatencyMs: 34,
  packetLossPercent: 0.8,
};

export const recentCallsData: RecentCallItem[] = [
  {
    id: '1',
    cdrId: 'CDR-20260911-0001',
    date: '10-Sep-2026',
    time: '10:32:21',
    callingNumber: '2451',
    calledNumber: '9876543210',
    callType: 'Mobile',
    duration: '05:21',
    status: 'Completed',
    gateway: 'GW-DEL-01',
    cost: 5.35,
    department: 'Airport Operations',
    location: 'Terminal 1',
  },
  {
    id: '2',
    cdrId: 'CDR-20260911-0002',
    date: '10-Sep-2026',
    time: '10:35:12',
    callingNumber: '2231',
    calledNumber: '2458',
    callType: 'Internal',
    duration: '02:14',
    status: 'Completed',
    gateway: 'Internal',
    cost: 0,
    department: 'Security',
    location: 'Terminal 3',
  },
  {
    id: '3',
    cdrId: 'CDR-20260911-0003',
    date: '10-Sep-2026',
    time: '10:41:55',
    callingNumber: '2458',
    calledNumber: '01123456789',
    callType: 'Local',
    duration: '08:42',
    status: 'Completed',
    gateway: 'GW-DEL-02',
    cost: 4.35,
    department: 'IT',
    location: 'Admin Block',
  },
  {
    id: '4',
    cdrId: 'CDR-20260911-0004',
    date: '10-Sep-2026',
    time: '10:48:03',
    callingNumber: '3102',
    calledNumber: '02226543210',
    callType: 'STD',
    duration: '12:05',
    status: 'Completed',
    gateway: 'GW-DEL-01',
    cost: 9.8,
    department: 'Engineering',
    location: 'Cargo',
  },
  {
    id: '5',
    cdrId: 'CDR-20260911-0005',
    date: '10-Sep-2026',
    time: '10:55:40',
    callingNumber: '4015',
    calledNumber: '+442079460912',
    callType: 'International',
    duration: '04:18',
    status: 'Completed',
    gateway: 'GW-DEL-03',
    cost: 28.5,
    department: 'Finance',
    location: 'Admin Block',
  },
  {
    id: '6',
    cdrId: 'CDR-20260911-0006',
    date: '10-Sep-2026',
    time: '11:02:11',
    callingNumber: '2451',
    calledNumber: '9810012345',
    callType: 'Mobile',
    duration: '00:00',
    status: 'Failed',
    gateway: 'GW-DEL-01',
    cost: 0,
    department: 'Airport Operations',
    location: 'Terminal 1',
  },
  {
    id: '7',
    cdrId: 'CDR-20260911-0007',
    date: '10-Sep-2026',
    time: '11:08:27',
    callingNumber: '5120',
    calledNumber: '2231',
    callType: 'Internal',
    duration: '01:45',
    status: 'Completed',
    gateway: 'Internal',
    cost: 0,
    department: 'Terminal Management',
    location: 'Terminal 2',
  },
  {
    id: '8',
    cdrId: 'CDR-20260911-0008',
    date: '10-Sep-2026',
    time: '11:15:50',
    callingNumber: '6201',
    calledNumber: '01125651000',
    callType: 'Local',
    duration: '06:33',
    status: 'Completed',
    gateway: 'GW-DEL-02',
    cost: 3.2,
    department: 'Baggage',
    location: 'Terminal 3',
  },
];

export const filterOptions = {
  departments: [
    'All Departments',
    'Airport Operations',
    'Security',
    'IT',
    'Engineering',
    'Finance',
    'Administration',
    'Terminal Management',
    'Baggage',
    'Cargo',
  ],
  locations: ['All Locations', 'Terminal 1', 'Terminal 2', 'Terminal 3', 'Admin Block', 'Cargo'],
  callTypes: ['All Call Types', 'Internal', 'Incoming', 'Outgoing', 'Local', 'STD', 'International', 'Mobile', 'Failed'],
  gateways: ['All Gateways', 'GW-DEL-01', 'GW-DEL-02', 'GW-DEL-03', 'Internal'],
  trunks: ['All Trunks', 'TRK-SIP-01', 'TRK-SIP-02', 'TRK-PRI-01', 'TRK-PRI-02'],
};

/** Simple visual variance multipliers for demo filter interaction */
export const dateRangeMultipliers: Record<DateRangePreset, number> = {
  today: 0.35,
  yesterday: 0.32,
  last7: 1,
  last30: 3.8,
  custom: 1.2,
};
