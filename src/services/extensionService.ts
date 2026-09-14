import type { Extension } from '../types/extension';
import { mockExtensions } from '../mock-data/extensionData';

export const extensionService = {
  getExtensions: async (): Promise<Extension[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockExtensions]), 50));
  },
  addExtension: async (ext: Omit<Extension, 'id'>): Promise<Extension> => {
    const newExt: Extension = { ...ext, id: `ext-${Date.now()}` };
    mockExtensions.push(newExt);
    return newExt;
  },
};
