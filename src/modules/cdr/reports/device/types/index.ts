export type DeviceType =
  | 'IP Phone'
  | 'Digital Phone'
  | 'Analog Phone'
  | 'Softphone'
  | 'Conference Phone'
  | 'Other';

export type DeviceStatus = 'Active' | 'Inactive' | 'Maintenance' | 'Disabled';

export type QualityIssueType =
  | 'Packet Loss'
  | 'High Jitter'
  | 'High Latency'
  | 'Poor Audio Quality'
  | 'Connection Issue';

export interface DeviceReportFilterValues {
  datePreset: 'today' | 'yesterday' | '7days' | '30days' | 'thisMonth' | 'custom';
  fromDate: string;
  toDate: string;
  device: string;
  extension: string;
  department: string;
  deviceType: string;
  callType: string;
  status: string;
  searchQuery: string;
}

export interface DeviceSummaryKPIs {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  totalCalls: number;
  totalCallDuration: string;
  totalBilling: number;
  devicesWithQualityIssues: number;
  highUsageDevices: number;
}

export interface DeviceInventoryTypeSummary {
  deviceType: DeviceType;
  totalDevices: number;
  active: number;
  inactive: number;
  calls: number;
  billing: number;
  iconName?: string;
}

export interface DeviceUsageTrendPoint {
  date: string;
  label: string;
  totalCalls: number;
  activeDevices: number;
  averageCallsPerDevice: number;
}

export interface DeviceBillingTrendPoint {
  date: string;
  label: string;
  totalBilling: number;
  internalBilling: number;
  externalBilling: number;
  internationalBilling: number;
}

export interface DeviceStatusDistItem {
  status: DeviceStatus;
  count: number;
  percentage: number;
  color: string;
}

export interface DeviceUsageRow {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  extension: string;
  department: string;
  location: string;
  totalCalls: number;
  totalDuration: string;
  totalDurationMinutes: number;
  billing: number;
  lastActivity: string;
  deviceStatus: DeviceStatus;
  ipAddress: string;
  macAddress: string;
  model: string;
}

export interface DeviceCallHistoryRow {
  id: string;
  dateTime: string;
  cdrId: string;
  extension: string;
  destination: string;
  callType: 'Internal' | 'External' | 'International';
  duration: string;
  tariff: string;
  amount: number;
  status: 'Completed' | 'Failed' | 'Missed' | 'Busy';
}

export interface DeviceQualityIssueRow {
  id: string;
  dateTime: string;
  cdrId: string;
  device: string;
  extension: string;
  destination: string;
  qualityStatus: 'Good' | 'Fair' | 'Poor';
  issueType: QualityIssueType;
  duration: string;
  packetLoss: number;
  jitterMs: number;
  latencyMs: number;
}

export interface DepartmentDeviceUsageRow {
  id: string;
  department: string;
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  calls: number;
  duration: string;
  billing: number;
  qualityIssues: number;
}

export interface TopDeviceVolumeRow {
  rank: number;
  device: string;
  extension: string;
  department: string;
  calls: number;
  duration: string;
  billing: number;
}

export interface TopDeviceBillingRow {
  rank: number;
  device: string;
  extension: string;
  department: string;
  calls: number;
  duration: string;
  billing: number;
}

export interface InactiveDeviceRow {
  id: string;
  deviceId: string;
  deviceName: string;
  extension: string;
  department: string;
  location: string;
  lastActivity: string;
  daysInactive: number;
  status: DeviceStatus;
}

export interface DevicePeakHourlyData {
  hour: string;
  callCount: number;
  isPeak: boolean;
}

export interface SingleDeviceDetailData {
  deviceInfo: {
    deviceId: string;
    deviceName: string;
    deviceType: DeviceType;
    extension: string;
    department: string;
    location: string;
    ipAddress: string;
    macAddress: string;
    model: string;
    status: DeviceStatus;
    lastActivity: string;
  };
  usageSummary: {
    totalCalls: number;
    totalDuration: string;
    totalBilling: number;
    averageCallDuration: string;
    internalCalls: number;
    externalCalls: number;
    internationalCalls: number;
    successfulCalls: number;
    failedCalls: number;
  };
  callTypeDistribution: {
    category: 'Internal' | 'External' | 'International';
    calls: number;
    percentage: number;
    billing: number;
  }[];
  dailyActivity: {
    date: string;
    calls: number;
    durationMinutes: number;
    durationStr: string;
    billing: number;
  }[];
  peakUsage: {
    peakHour: string;
    peakCallCount: number;
    averageCallsPerHour: number;
    hourlyData: DevicePeakHourlyData[];
  };
  callQuality: {
    callsWithCMR: number;
    goodQuality: number;
    goodPct: number;
    fairQuality: number;
    fairPct: number;
    poorQuality: number;
    poorPct: number;
    qualityIssues: number;
    averageQualityScore: number;
    qualityIssueRate: number;
  };
  callHistory: DeviceCallHistoryRow[];
}
