export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  contactExtension: string;
  location: string;
  totalExtensions: number;
  totalCalls: number;
  totalDurationHours: number;
  billableCalls: number;
  monthlyCost: number;
  status: 'Active' | 'Inactive';
  budgetAllocation: number;
}
