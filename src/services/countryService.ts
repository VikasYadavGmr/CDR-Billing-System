import type { Country } from '../types/tax';
import { mockCountries } from '../mock-data/countryData';

const delay = <T,>(value: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/**
 * Country Master access. Kept separate from tax rules: one country holds many
 * tax rules. Swap the mock arrays for fetch() calls to wire up a real backend.
 */
export const countryService = {
  getCountries: async (): Promise<Country[]> => delay([...mockCountries]),

  getActiveCountries: async (): Promise<Country[]> =>
    delay(mockCountries.filter((c) => c.status === 'Active')),

  getCountryByCode: async (isoCode: string): Promise<Country | undefined> =>
    delay(mockCountries.find((c) => c.isoCode.toUpperCase() === isoCode.toUpperCase())),

  getCountryById: async (countryId: string): Promise<Country | undefined> =>
    delay(mockCountries.find((c) => c.countryId === countryId)),

  updateCountryStatus: async (countryId: string, status: Country['status']): Promise<boolean> => {
    const idx = mockCountries.findIndex((c) => c.countryId === countryId);
    if (idx === -1) return false;
    mockCountries[idx] = {
      ...mockCountries[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    return true;
  },
};
