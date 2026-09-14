export type ExtensionStatus = 'Active' | 'Inactive' | 'Suspended';
export type ExtensionType = 'SIP Phone' | 'Digital IP' | 'Analog' | 'Hot-line' | 'Wireless DECT';

export interface Extension {
  id: string;
  extension: string;
  employeeName: string;
  employeeId: string;
  department: string;
  location: string;
  telephoneNumber: string;
  extensionType: ExtensionType;
  monthlyCalls: number;
  monthlyUsageHours: number;
  monthlyCost: number;
  status: ExtensionStatus;
  macAddress?: string;
  ipAddress?: string;
}
