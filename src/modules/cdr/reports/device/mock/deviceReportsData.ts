import type {
  DepartmentDeviceUsageRow,
  DeviceBillingTrendPoint,
  DeviceInventoryTypeSummary,
  DeviceQualityIssueRow,
  DeviceStatusDistItem,
  DeviceSummaryKPIs,
  DeviceUsageRow,
  DeviceUsageTrendPoint,
  InactiveDeviceRow,
  SingleDeviceDetailData,
  TopDeviceBillingRow,
  TopDeviceVolumeRow,
} from '../types';

export const deviceTypeOptions = [
  'All',
  'IP Phone',
  'Digital Phone',
  'Analog Phone',
  'Softphone',
  'Conference Phone',
];

export const deviceStatusOptions = ['All', 'Active', 'Inactive', 'Maintenance', 'Disabled'];

export const deviceCallTypeOptions = ['All', 'Internal', 'External', 'International'];

export const deviceSummaryKPIs: DeviceSummaryKPIs = {
  totalDevices: 1284,
  activeDevices: 1192,
  inactiveDevices: 92,
  totalCalls: 24586,
  totalCallDuration: '18,426 hrs 32 min',
  totalBilling: 842650,
  devicesWithQualityIssues: 48,
  highUsageDevices: 126,
};

export const deviceInventorySummary: DeviceInventoryTypeSummary[] = [
  { deviceType: 'IP Phone', totalDevices: 842, active: 798, inactive: 44, calls: 17420, billing: 582420 },
  { deviceType: 'Digital Phone', totalDevices: 210, active: 192, inactive: 18, calls: 3840, billing: 134500 },
  { deviceType: 'Analog Phone', totalDevices: 120, active: 105, inactive: 15, calls: 1520, billing: 52400 },
  { deviceType: 'Softphone', totalDevices: 68, active: 60, inactive: 8, calls: 1120, billing: 48200 },
  { deviceType: 'Conference Phone', totalDevices: 44, active: 37, inactive: 7, calls: 686, billing: 25130 },
];

export const deviceUsageTrendData: DeviceUsageTrendPoint[] = [
  { date: '2026-09-01', label: '01 Sep', totalCalls: 3120, activeDevices: 1180, averageCallsPerDevice: 2.64 },
  { date: '2026-09-02', label: '02 Sep', totalCalls: 3480, activeDevices: 1184, averageCallsPerDevice: 2.94 },
  { date: '2026-09-03', label: '03 Sep', totalCalls: 3760, activeDevices: 1188, averageCallsPerDevice: 3.16 },
  { date: '2026-09-04', label: '04 Sep', totalCalls: 3420, activeDevices: 1182, averageCallsPerDevice: 2.89 },
  { date: '2026-09-05', label: '05 Sep', totalCalls: 4120, activeDevices: 1192, averageCallsPerDevice: 3.46 },
  { date: '2026-09-06', label: '06 Sep', totalCalls: 3210, activeDevices: 1175, averageCallsPerDevice: 2.73 },
  { date: '2026-09-07', label: '07 Sep', totalCalls: 3474, activeDevices: 1186, averageCallsPerDevice: 2.93 },
];

export const deviceBillingTrendData: DeviceBillingTrendPoint[] = [
  { date: '2026-09-01', label: '01 Sep', totalBilling: 92400, internalBilling: 0, externalBilling: 58400, internationalBilling: 34000 },
  { date: '2026-09-02', label: '02 Sep', totalBilling: 108200, internalBilling: 0, externalBilling: 69200, internationalBilling: 39000 },
  { date: '2026-09-03', label: '03 Sep', totalBilling: 115600, internalBilling: 0, externalBilling: 72800, internationalBilling: 42800 },
  { date: '2026-09-04', label: '04 Sep', totalBilling: 97400, internalBilling: 0, externalBilling: 61200, internationalBilling: 36200 },
  { date: '2026-09-05', label: '05 Sep', totalBilling: 132800, internalBilling: 0, externalBilling: 81600, internationalBilling: 51200 },
  { date: '2026-09-06', label: '06 Sep', totalBilling: 106200, internalBilling: 0, externalBilling: 66800, internationalBilling: 39400 },
  { date: '2026-09-07', label: '07 Sep', totalBilling: 124050, internalBilling: 0, externalBilling: 76400, internationalBilling: 47650 },
];

export const deviceStatusDist: DeviceStatusDistItem[] = [
  { status: 'Active', count: 1192, percentage: 92.8, color: '#10b981' },
  { status: 'Inactive', count: 62, percentage: 4.8, color: '#64748b' },
  { status: 'Maintenance', count: 20, percentage: 1.6, color: '#f59e0b' },
  { status: 'Disabled', count: 10, percentage: 0.8, color: '#ef4444' },
];

export const deviceUsageList: DeviceUsageRow[] = [
  { id: 'dev-1', deviceId: 'DEV-IP-1024', deviceName: 'Airport Operations Phone', deviceType: 'IP Phone', extension: 'EXT-1024', department: 'Airport Operations', location: 'Terminal 1 — Operations Office', totalCalls: 428, totalDuration: '31h 42m', totalDurationMinutes: 1902, billing: 18420, lastActivity: '11 Sep 2026, 09:42', deviceStatus: 'Active', ipAddress: '10.20.14.102', macAddress: '00:1A:2B:3C:4D:5E', model: 'Cisco CP-8841 IP Phone' },
  { id: 'dev-2', deviceId: 'DEV-IP-1048', deviceName: 'Airside Duty Desk Phone', deviceType: 'IP Phone', extension: 'EXT-1048', department: 'Airport Operations', location: 'Terminal 3 — Airside Dispatch', totalCalls: 395, totalDuration: '28h 15m', totalDurationMinutes: 1695, billing: 16200, lastActivity: '11 Sep 2026, 09:38', deviceStatus: 'Active', ipAddress: '10.20.14.104', macAddress: '00:1A:2B:3C:4D:6F', model: 'Cisco CP-8841 IP Phone' },
  { id: 'dev-3', deviceId: 'DEV-IP-2014', deviceName: 'Corporate Security Security Control Desk', deviceType: 'IP Phone', extension: 'EXT-2014', department: 'Security', location: 'Terminal 2 — Security Wing', totalCalls: 380, totalDuration: '26h 50m', totalDurationMinutes: 1610, billing: 12900, lastActivity: '11 Sep 2026, 09:45', deviceStatus: 'Active', ipAddress: '10.20.15.110', macAddress: '00:1A:2B:3C:4D:7A', model: 'Cisco CP-8861 IP Phone' },
  { id: 'dev-4', deviceId: 'DEV-IP-3050', deviceName: 'Information Helpdesk Central', deviceType: 'IP Phone', extension: 'EXT-3050', department: 'Passenger Services', location: 'Terminal 1 — Concourse A', totalCalls: 362, totalDuration: '25h 10m', totalDurationMinutes: 1510, billing: 14800, lastActivity: '11 Sep 2026, 09:40', deviceStatus: 'Active', ipAddress: '10.20.16.120', macAddress: '00:1A:2B:3C:4D:8B', model: 'Cisco CP-7841 IP Phone' },
  { id: 'dev-5', deviceId: 'DEV-IP-2231', deviceName: 'Terminal 1 Security Main', deviceType: 'IP Phone', extension: 'EXT-2231', department: 'Security', location: 'Terminal 1 — Checkpoint North', totalCalls: 345, totalDuration: '23h 40m', totalDurationMinutes: 1420, billing: 11800, lastActivity: '11 Sep 2026, 09:28', deviceStatus: 'Active', ipAddress: '10.20.15.115', macAddress: '00:1A:2B:3C:4D:9C', model: 'Cisco CP-8841 IP Phone' },
  { id: 'dev-6', deviceId: 'DEV-IP-2451', deviceName: 'Operations Lead Station', deviceType: 'IP Phone', extension: 'EXT-2451', department: 'Airport Operations', location: 'Terminal 3 — Command Center', totalCalls: 330, totalDuration: '22h 15m', totalDurationMinutes: 1335, billing: 13600, lastActivity: '11 Sep 2026, 09:35', deviceStatus: 'Active', ipAddress: '10.20.14.108', macAddress: '00:1A:2B:3C:4D:A1', model: 'Cisco CP-8865 Video IP Phone' },
  { id: 'dev-7', deviceId: 'DEV-DIG-4010', deviceName: 'HVAC Maintenance Desk', deviceType: 'Digital Phone', extension: 'EXT-4010', department: 'Engineering', location: 'Engineering Block — Floor 1', totalCalls: 310, totalDuration: '20h 50m', totalDurationMinutes: 1250, billing: 10400, lastActivity: '11 Sep 2026, 09:12', deviceStatus: 'Active', ipAddress: '10.20.18.140', macAddress: '00:1A:2B:3C:4D:B2', model: 'Avaya 9608G Digital Desk' },
  { id: 'dev-8', deviceId: 'DEV-IP-2458', deviceName: 'Network Operations Telecom', deviceType: 'IP Phone', extension: 'EXT-2458', department: 'IT', location: 'Admin Block — Server Room', totalCalls: 295, totalDuration: '19h 30m', totalDurationMinutes: 1170, billing: 9800, lastActivity: '11 Sep 2026, 09:30', deviceStatus: 'Active', ipAddress: '10.20.17.130', macAddress: '00:1A:2B:3C:4D:C3', model: 'Cisco CP-8841 IP Phone' },
  { id: 'dev-9', deviceId: 'DEV-IP-5020', deviceName: 'Terminal Manager Station', deviceType: 'IP Phone', extension: 'EXT-5020', department: 'Terminal Management', location: 'Terminal 3 — Executive Suite', totalCalls: 280, totalDuration: '18h 45m', totalDurationMinutes: 1125, billing: 9200, lastActivity: '11 Sep 2026, 09:18', deviceStatus: 'Active', ipAddress: '10.20.19.150', macAddress: '00:1A:2B:3C:4D:D4', model: 'Cisco CP-8861 IP Phone' },
  { id: 'dev-10', deviceId: 'DEV-SOFT-6015', deviceName: 'Admin Softclient PC-12', deviceType: 'Softphone', extension: 'EXT-6015', department: 'Administration', location: 'Admin Block — Executive Office', totalCalls: 260, totalDuration: '17h 20m', totalDurationMinutes: 1040, billing: 8900, lastActivity: '11 Sep 2026, 08:55', deviceStatus: 'Active', ipAddress: '10.20.20.160', macAddress: '00:1A:2B:3C:4D:E5', model: 'Cisco Jabber Softphone v14' },
  { id: 'dev-11', deviceId: 'DEV-IP-2265', deviceName: 'Accounts Billing Terminal', deviceType: 'IP Phone', extension: 'EXT-2265', department: 'Finance', location: 'Admin Block — Accounts Room', totalCalls: 240, totalDuration: '16h 05m', totalDurationMinutes: 965, billing: 8400, lastActivity: '11 Sep 2026, 09:05', deviceStatus: 'Active', ipAddress: '10.20.21.170', macAddress: '00:1A:2B:3C:4D:F6', model: 'Cisco CP-7841 IP Phone' },
  { id: 'dev-12', deviceId: 'DEV-IP-7010', deviceName: 'Ramp Operations Desk', deviceType: 'IP Phone', extension: 'EXT-7010', department: 'Ground Handling', location: 'Airside Ramp — Gate 14', totalCalls: 220, totalDuration: '14h 50m', totalDurationMinutes: 890, billing: 7800, lastActivity: '11 Sep 2026, 08:40', deviceStatus: 'Active', ipAddress: '10.20.22.180', macAddress: '00:1A:2B:3C:4D:07', model: 'Cisco CP-8841 IP Phone' },
  { id: 'dev-13', deviceId: 'DEV-CONF-7010', deviceName: 'Boardroom Conference Unit', deviceType: 'Conference Phone', extension: 'EXT-7090', department: 'Administration', location: 'Main Terminal — Boardroom A', totalCalls: 195, totalDuration: '13h 10m', totalDurationMinutes: 790, billing: 7100, lastActivity: '11 Sep 2026, 08:32', deviceStatus: 'Active', ipAddress: '10.20.20.165', macAddress: '00:1A:2B:3C:4D:18', model: 'Cisco CP-8832 Conference Station' },
  { id: 'dev-14', deviceId: 'DEV-ANA-8012', deviceName: 'Facility Workshop Phone', deviceType: 'Analog Phone', extension: 'EXT-8012', department: 'Facility Management', location: 'Substation Building — Ground Floor', totalCalls: 180, totalDuration: '12h 00m', totalDurationMinutes: 720, billing: 6400, lastActivity: '11 Sep 2026, 08:15', deviceStatus: 'Active', ipAddress: '10.20.23.190', macAddress: '00:1A:2B:3C:4D:29', model: 'Analog POTS Telephone via VG204' },
  { id: 'dev-15', deviceId: 'DEV-IP-1102', deviceName: 'Terminal 2 Apron Office', deviceType: 'IP Phone', extension: 'EXT-1102', department: 'Airport Operations', location: 'Terminal 2 — Bay 22', totalCalls: 165, totalDuration: '11h 15m', totalDurationMinutes: 675, billing: 5900, lastActivity: '11 Sep 2026, 08:02', deviceStatus: 'Active', ipAddress: '10.20.14.112', macAddress: '00:1A:2B:3C:4D:3A', model: 'Cisco CP-7821 IP Phone' },
  { id: 'dev-16', deviceId: 'DEV-IP-1188', deviceName: 'Perimeter Gate 4 Sentry', deviceType: 'IP Phone', extension: 'EXT-1188', department: 'Security', location: 'Terminal 2 — Gate 4 Checkpost', totalCalls: 12, totalDuration: '0h 45m', totalDurationMinutes: 45, billing: 420, lastActivity: '04 Sep 2026, 14:10', deviceStatus: 'Inactive', ipAddress: '10.20.15.195', macAddress: '00:1A:2B:3C:4D:4B', model: 'Cisco CP-7811 IP Phone' },
  { id: 'dev-17', deviceId: 'DEV-ANA-2044', deviceName: 'Old Baggage Tunnel Hotline', deviceType: 'Analog Phone', extension: 'EXT-2044', department: 'Facility Management', location: 'Basement Baggage Tunnel', totalCalls: 4, totalDuration: '0h 15m', totalDurationMinutes: 15, billing: 140, lastActivity: '01 Sep 2026, 11:20', deviceStatus: 'Inactive', ipAddress: '10.20.23.210', macAddress: '00:1A:2B:3C:4D:5C', model: 'Wall Mounted Analog Phone' },
  { id: 'dev-18', deviceId: 'DEV-DIG-3012', deviceName: 'Sub-Office Backup Line', deviceType: 'Digital Phone', extension: 'EXT-3012', department: 'Passenger Services', location: 'Terminal 3 — Service Desk 8', totalCalls: 8, totalDuration: '0h 25m', totalDurationMinutes: 25, billing: 280, lastActivity: '02 Sep 2026, 09:15', deviceStatus: 'Inactive', ipAddress: '10.20.16.145', macAddress: '00:1A:2B:3C:4D:6D', model: 'Avaya 9608G Digital Desk' },
  { id: 'dev-19', deviceId: 'DEV-SOFT-4002', deviceName: 'Consultant Softphone Line', deviceType: 'Softphone', extension: 'EXT-4002', department: 'IT', location: 'Remote VPN Link', totalCalls: 0, totalDuration: '0h 00m', totalDurationMinutes: 0, billing: 0, lastActivity: '28 Aug 2026, 17:00', deviceStatus: 'Disabled', ipAddress: '10.20.17.250', macAddress: '00:1A:2B:3C:4D:7E', model: 'Cisco Webex App' },
  { id: 'dev-20', deviceId: 'DEV-IP-9900', deviceName: 'Testing Lab Station 01', deviceType: 'IP Phone', extension: 'EXT-9900', department: 'IT', location: 'IT Lab — Rack B', totalCalls: 45, totalDuration: '2h 10m', totalDurationMinutes: 130, billing: 850, lastActivity: '10 Sep 2026, 16:40', deviceStatus: 'Maintenance', ipAddress: '10.20.17.200', macAddress: '00:1A:2B:3C:4D:8F', model: 'Cisco CP-8841 IP Phone' },
];

export const inactiveDevicesList: InactiveDeviceRow[] = [
  { id: 'in-1', deviceId: 'DEV-IP-1188', deviceName: 'Perimeter Gate 4 Sentry', extension: 'EXT-1188', department: 'Security', location: 'Terminal 2 — Gate 4 Checkpost', lastActivity: '04 Sep 2026, 14:10', daysInactive: 7, status: 'Inactive' },
  { id: 'in-2', deviceId: 'DEV-ANA-2044', deviceName: 'Old Baggage Tunnel Hotline', extension: 'EXT-2044', department: 'Facility Management', location: 'Basement Baggage Tunnel', lastActivity: '01 Sep 2026, 11:20', daysInactive: 10, status: 'Inactive' },
  { id: 'in-3', deviceId: 'DEV-DIG-3012', deviceName: 'Sub-Office Backup Line', extension: 'EXT-3012', department: 'Passenger Services', location: 'Terminal 3 — Service Desk 8', lastActivity: '02 Sep 2026, 09:15', daysInactive: 9, status: 'Inactive' },
  { id: 'in-4', deviceId: 'DEV-SOFT-4002', deviceName: 'Consultant Softphone Line', extension: 'EXT-4002', department: 'IT', location: 'Remote VPN Link', lastActivity: '28 Aug 2026, 17:00', daysInactive: 14, status: 'Disabled' },
  { id: 'in-5', deviceId: 'DEV-IP-8842', deviceName: 'Standby Cargo Weighing Scale', extension: 'EXT-8842', department: 'Ground Handling', location: 'Cargo Complex — Gate 2', lastActivity: '03 Sep 2026, 16:30', daysInactive: 8, status: 'Inactive' },
];

export const deviceQualityIssues: DeviceQualityIssueRow[] = [
  { id: 'qi-1', dateTime: '11 Sep 2026, 09:14', cdrId: 'CDR-20260911-0012', device: 'DEV-IP-1024', extension: 'EXT-1024', destination: '+442079460912', qualityStatus: 'Poor', issueType: 'Packet Loss', duration: '04:12', packetLoss: 4.8, jitterMs: 14.2, latencyMs: 145 },
  { id: 'qi-2', dateTime: '11 Sep 2026, 08:50', cdrId: 'CDR-20260911-0008', device: 'DEV-IP-2014', extension: 'EXT-2014', destination: '01123456789', qualityStatus: 'Fair', issueType: 'High Jitter', duration: '05:30', packetLoss: 1.2, jitterMs: 22.5, latencyMs: 65 },
  { id: 'qi-3', dateTime: '10 Sep 2026, 17:22', cdrId: 'CDR-20260910-0095', device: 'DEV-SOFT-6015', extension: 'EXT-6015', destination: '02226543210', qualityStatus: 'Poor', issueType: 'High Latency', duration: '08:45', packetLoss: 2.5, jitterMs: 18.0, latencyMs: 210 },
  { id: 'qi-4', dateTime: '10 Sep 2026, 15:40', cdrId: 'CDR-20260910-0084', device: 'DEV-IP-3050', extension: 'EXT-3050', destination: '9876543210', qualityStatus: 'Fair', issueType: 'Poor Audio Quality', duration: '03:10', packetLoss: 1.8, jitterMs: 15.5, latencyMs: 82 },
  { id: 'qi-5', dateTime: '10 Sep 2026, 11:15', cdrId: 'CDR-20260910-0042', device: 'DEV-ANA-8012', extension: 'EXT-8012', destination: 'EXT-2451', qualityStatus: 'Poor', issueType: 'Connection Issue', duration: '01:05', packetLoss: 5.2, jitterMs: 28.4, latencyMs: 160 },
];

export const departmentDeviceUsage: DepartmentDeviceUsageRow[] = [
  { id: 'ddu-1', department: 'Airport Operations', totalDevices: 245, activeDevices: 236, inactiveDevices: 9, calls: 5420, duration: '4,120h 15m', billing: 198450, qualityIssues: 12 },
  { id: 'ddu-2', department: 'Security', totalDevices: 220, activeDevices: 212, inactiveDevices: 8, calls: 4860, duration: '3,450h 20m', billing: 134200, qualityIssues: 9 },
  { id: 'ddu-3', department: 'Passenger Services', totalDevices: 185, activeDevices: 176, inactiveDevices: 9, calls: 3820, duration: '2,980h 45m', billing: 128600, qualityIssues: 8 },
  { id: 'ddu-4', department: 'Engineering', totalDevices: 160, activeDevices: 151, inactiveDevices: 9, calls: 2940, duration: '2,150h 10m', billing: 94800, qualityIssues: 5 },
  { id: 'ddu-5', department: 'Terminal Management', totalDevices: 140, activeDevices: 132, inactiveDevices: 8, calls: 2450, duration: '1,890h 30m', billing: 82400, qualityIssues: 4 },
  { id: 'ddu-6', department: 'IT', totalDevices: 110, activeDevices: 98, inactiveDevices: 12, calls: 1890, duration: '1,420h 05m', billing: 64800, qualityIssues: 3 },
  { id: 'ddu-7', department: 'Administration', totalDevices: 95, activeDevices: 88, inactiveDevices: 7, calls: 1240, duration: '980h 15m', billing: 48900, qualityIssues: 2 },
  { id: 'ddu-8', department: 'Finance', totalDevices: 85, activeDevices: 80, inactiveDevices: 5, calls: 920, duration: '690h 40m', billing: 36800, qualityIssues: 2 },
  { id: 'ddu-9', department: 'Ground Handling', totalDevices: 80, activeDevices: 74, inactiveDevices: 6, calls: 680, duration: '495h 10m', billing: 31200, qualityIssues: 2 },
  { id: 'ddu-10', department: 'Facility Management', totalDevices: 64, activeDevices: 55, inactiveDevices: 9, calls: 366, duration: '179h 17m', billing: 22500, qualityIssues: 1 },
];

export const topDevicesByVolume: TopDeviceVolumeRow[] = [
  { rank: 1, device: 'DEV-IP-1024 (Airport Operations Phone)', extension: 'EXT-1024', department: 'Airport Operations', calls: 428, duration: '31h 42m', billing: 18420 },
  { rank: 2, device: 'DEV-IP-1048 (Airside Duty Desk Phone)', extension: 'EXT-1048', department: 'Airport Operations', calls: 395, duration: '28h 15m', billing: 16200 },
  { rank: 3, device: 'DEV-IP-2014 (Corporate Security Security Control Desk)', extension: 'EXT-2014', department: 'Security', calls: 380, duration: '26h 50m', billing: 12900 },
  { rank: 4, device: 'DEV-IP-3050 (Information Helpdesk Central)', extension: 'EXT-3050', department: 'Passenger Services', calls: 362, duration: '25h 10m', billing: 14800 },
  { rank: 5, device: 'DEV-IP-2231 (Terminal 1 Security Main)', extension: 'EXT-2231', department: 'Security', calls: 345, duration: '23h 40m', billing: 11800 },
  { rank: 6, device: 'DEV-IP-2451 (Operations Lead Station)', extension: 'EXT-2451', department: 'Airport Operations', calls: 330, duration: '22h 15m', billing: 13600 },
  { rank: 7, device: 'DEV-DIG-4010 (HVAC Maintenance Desk)', extension: 'EXT-4010', department: 'Engineering', calls: 310, duration: '20h 50m', billing: 10400 },
  { rank: 8, device: 'DEV-IP-2458 (Network Operations Telecom)', extension: 'EXT-2458', department: 'IT', calls: 295, duration: '19h 30m', billing: 9800 },
  { rank: 9, device: 'DEV-IP-5020 (Terminal Manager Station)', extension: 'EXT-5020', department: 'Terminal Management', calls: 280, duration: '18h 45m', billing: 9200 },
  { rank: 10, device: 'DEV-SOFT-6015 (Admin Softclient PC-12)', extension: 'EXT-6015', department: 'Administration', calls: 260, duration: '17h 20m', billing: 8900 },
];

export const topDevicesByBilling: TopDeviceBillingRow[] = [
  { rank: 1, device: 'DEV-IP-1024 (Airport Operations Phone)', extension: 'EXT-1024', department: 'Airport Operations', calls: 428, duration: '31h 42m', billing: 18420 },
  { rank: 2, device: 'DEV-IP-1048 (Airside Duty Desk Phone)', extension: 'EXT-1048', department: 'Airport Operations', calls: 395, duration: '28h 15m', billing: 16200 },
  { rank: 3, device: 'DEV-IP-3050 (Information Helpdesk Central)', extension: 'EXT-3050', department: 'Passenger Services', calls: 362, duration: '25h 10m', billing: 14800 },
  { rank: 4, device: 'DEV-IP-2451 (Operations Lead Station)', extension: 'EXT-2451', department: 'Airport Operations', calls: 330, duration: '22h 15m', billing: 13600 },
  { rank: 5, device: 'DEV-IP-2014 (Corporate Security Security Control Desk)', extension: 'EXT-2014', department: 'Security', calls: 380, duration: '26h 50m', billing: 12900 },
  { rank: 6, device: 'DEV-IP-2231 (Terminal 1 Security Main)', extension: 'EXT-2231', department: 'Security', calls: 345, duration: '23h 40m', billing: 11800 },
  { rank: 7, device: 'DEV-DIG-4010 (HVAC Maintenance Desk)', extension: 'EXT-4010', department: 'Engineering', calls: 310, duration: '20h 50m', billing: 10400 },
  { rank: 8, device: 'DEV-IP-2458 (Network Operations Telecom)', extension: 'EXT-2458', department: 'IT', calls: 295, duration: '19h 30m', billing: 9800 },
  { rank: 9, device: 'DEV-IP-5020 (Terminal Manager Station)', extension: 'EXT-5020', department: 'Terminal Management', calls: 280, duration: '18h 45m', billing: 9200 },
  { rank: 10, device: 'DEV-SOFT-6015 (Admin Softclient PC-12)', extension: 'EXT-6015', department: 'Administration', calls: 260, duration: '17h 20m', billing: 8900 },
];

export function getSingleDeviceDetail(device: DeviceUsageRow): SingleDeviceDetailData {
  const isHighCost = device.billing > 12000;
  return {
    deviceInfo: {
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      extension: device.extension,
      department: device.department,
      location: device.location,
      ipAddress: device.ipAddress,
      macAddress: device.macAddress,
      model: device.model,
      status: device.deviceStatus,
      lastActivity: device.lastActivity,
    },
    usageSummary: {
      totalCalls: device.totalCalls,
      totalDuration: device.totalDuration,
      totalBilling: device.billing,
      averageCallDuration: '04m 26s',
      internalCalls: Math.round(device.totalCalls * 0.52),
      externalCalls: Math.round(device.totalCalls * 0.41),
      internationalCalls: Math.round(device.totalCalls * 0.07),
      successfulCalls: Math.round(device.totalCalls * 0.94),
      failedCalls: Math.round(device.totalCalls * 0.06),
    },
    callTypeDistribution: [
      { category: 'Internal', calls: Math.round(device.totalCalls * 0.52), percentage: 52, billing: 0 },
      { category: 'External', calls: Math.round(device.totalCalls * 0.41), percentage: 41, billing: Math.round(device.billing * 0.65) },
      { category: 'International', calls: Math.round(device.totalCalls * 0.07), percentage: 7, billing: Math.round(device.billing * 0.35) },
    ],
    dailyActivity: [
      { date: '05 Sep', calls: Math.round(device.totalCalls * 0.14), durationMinutes: 280, durationStr: '4h 40m', billing: Math.round(device.billing * 0.16) },
      { date: '06 Sep', calls: Math.round(device.totalCalls * 0.11), durationMinutes: 210, durationStr: '3h 30m', billing: Math.round(device.billing * 0.11) },
      { date: '07 Sep', calls: Math.round(device.totalCalls * 0.15), durationMinutes: 305, durationStr: '5h 05m', billing: Math.round(device.billing * 0.17) },
      { date: '08 Sep', calls: Math.round(device.totalCalls * 0.16), durationMinutes: 320, durationStr: '5h 20m', billing: Math.round(device.billing * 0.18) },
      { date: '09 Sep', calls: Math.round(device.totalCalls * 0.15), durationMinutes: 310, durationStr: '5h 10m', billing: Math.round(device.billing * 0.16) },
      { date: '10 Sep', calls: Math.round(device.totalCalls * 0.17), durationMinutes: 345, durationStr: '5h 45m', billing: Math.round(device.billing * 0.19) },
    ],
    peakUsage: {
      peakHour: '15:00',
      peakCallCount: 68,
      averageCallsPerHour: 42,
      hourlyData: [
        { hour: '08:00', callCount: 18, isPeak: false },
        { hour: '09:00', callCount: 32, isPeak: false },
        { hour: '10:00', callCount: 48, isPeak: false },
        { hour: '11:00', callCount: 56, isPeak: false },
        { hour: '12:00', callCount: 62, isPeak: false },
        { hour: '13:00', callCount: 42, isPeak: false },
        { hour: '14:00', callCount: 51, isPeak: false },
        { hour: '15:00', callCount: 68, isPeak: true },
        { hour: '16:00', callCount: 54, isPeak: false },
        { hour: '17:00', callCount: 36, isPeak: false },
      ],
    },
    callQuality: {
      callsWithCMR: Math.round(device.totalCalls * 0.95),
      goodQuality: Math.round(device.totalCalls * 0.88),
      goodPct: 88,
      fairQuality: Math.round(device.totalCalls * 0.08),
      fairPct: 8,
      poorQuality: Math.round(device.totalCalls * 0.04),
      poorPct: 4,
      qualityIssues: isHighCost ? 4 : 1,
      averageQualityScore: 4.25,
      qualityIssueRate: 2.8,
    },
    callHistory: [
      { id: 'ch-d1', dateTime: '11 Sep 2026, 09:42', cdrId: 'CDR-20260911-001', extension: device.extension, destination: '011-45678901', callType: 'External', duration: '04:32', tariff: '€1.20/min', amount: 5.44, status: 'Completed' },
      { id: 'ch-d2', dateTime: '11 Sep 2026, 09:15', cdrId: 'CDR-20260911-002', extension: device.extension, destination: '9876543210', callType: 'External', duration: '06:10', tariff: '€1.20/min', amount: 7.4, status: 'Completed' },
      { id: 'ch-d3', dateTime: '11 Sep 2026, 08:50', cdrId: 'CDR-20260911-003', extension: device.extension, destination: 'EXT-2451', callType: 'Internal', duration: '02:45', tariff: '€0.00/min', amount: 0, status: 'Completed' },
      { id: 'ch-d4', dateTime: '10 Sep 2026, 17:30', cdrId: 'CDR-20260910-044', extension: device.extension, destination: '+442079460912', callType: 'International', duration: '05:12', tariff: '€8.00/min', amount: 41.6, status: 'Completed' },
      { id: 'ch-d5', dateTime: '10 Sep 2026, 15:10', cdrId: 'CDR-20260910-045', extension: device.extension, destination: '02226543210', callType: 'External', duration: '08:20', tariff: '€1.50/min', amount: 12.5, status: 'Completed' },
      { id: 'ch-d6', dateTime: '10 Sep 2026, 11:40', cdrId: 'CDR-20260910-046', extension: device.extension, destination: '9810012345', callType: 'External', duration: '00:00', tariff: '€1.20/min', amount: 0, status: 'Failed' },
    ],
  };
}
