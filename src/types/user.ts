export type UserRole = 'Administrator' | 'Billing Manager' | 'Department Manager' | 'Viewer';

export interface User {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  department: string;
  role: UserRole;
  extension: string;
  location?: string;
  deviceModel?: string;
  monthlyCost?: number;
  monthlyCalls?: number;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar?: string;
}
