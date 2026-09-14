import type { Department } from '../types/department';
import { mockDepartments } from '../mock-data/departmentData';

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockDepartments]), 50));
  },
};
