import type { SystemSettings } from '../types/settings';
import { mockSettings } from '../mock-data/userData';

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    return new Promise((resolve) => setTimeout(() => resolve({ ...mockSettings }), 50));
  },
  updateSettings: async (updated: Partial<SystemSettings>): Promise<SystemSettings> => {
    Object.assign(mockSettings, updated);
    return { ...mockSettings };
  },
};
