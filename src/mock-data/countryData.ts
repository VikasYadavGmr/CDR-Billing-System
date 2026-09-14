import type { Country, EuropeBloc, TaxType } from '../types/tax';
import { REGION_EUROPE } from '../types/tax';

/**
 * Country Master — Europe only.
 *
 * A country never carries a rate: rates live in the Tax Rule master so one
 * country can hold many rules (standard / reduced / zero / exempt) across
 * different effective periods.
 */

interface CountrySeed {
  name: string;
  iso: string;
  bloc: EuropeBloc;
  currency: string;
  taxSystem?: TaxType;
}

const europeSeed: CountrySeed[] = [
  { name: 'Austria', iso: 'AT', bloc: 'EU', currency: 'EUR' },
  { name: 'Belgium', iso: 'BE', bloc: 'EU', currency: 'EUR' },
  { name: 'Bulgaria', iso: 'BG', bloc: 'EU', currency: 'BGN' },
  { name: 'Croatia', iso: 'HR', bloc: 'EU', currency: 'EUR' },
  { name: 'Cyprus', iso: 'CY', bloc: 'EU', currency: 'EUR' },
  { name: 'Czechia', iso: 'CZ', bloc: 'EU', currency: 'CZK' },
  { name: 'Denmark', iso: 'DK', bloc: 'EU', currency: 'DKK' },
  { name: 'Estonia', iso: 'EE', bloc: 'EU', currency: 'EUR' },
  { name: 'Finland', iso: 'FI', bloc: 'EU', currency: 'EUR' },
  { name: 'France', iso: 'FR', bloc: 'EU', currency: 'EUR' },
  { name: 'Germany', iso: 'DE', bloc: 'EU', currency: 'EUR' },
  { name: 'Greece', iso: 'EL', bloc: 'EU', currency: 'EUR' },
  { name: 'Hungary', iso: 'HU', bloc: 'EU', currency: 'HUF' },
  { name: 'Ireland', iso: 'IE', bloc: 'EU', currency: 'EUR' },
  { name: 'Italy', iso: 'IT', bloc: 'EU', currency: 'EUR' },
  { name: 'Latvia', iso: 'LV', bloc: 'EU', currency: 'EUR' },
  { name: 'Lithuania', iso: 'LT', bloc: 'EU', currency: 'EUR' },
  { name: 'Luxembourg', iso: 'LU', bloc: 'EU', currency: 'EUR' },
  { name: 'Malta', iso: 'MT', bloc: 'EU', currency: 'EUR' },
  { name: 'Netherlands', iso: 'NL', bloc: 'EU', currency: 'EUR' },
  { name: 'Poland', iso: 'PL', bloc: 'EU', currency: 'PLN' },
  { name: 'Portugal', iso: 'PT', bloc: 'EU', currency: 'EUR' },
  { name: 'Romania', iso: 'RO', bloc: 'EU', currency: 'RON' },
  { name: 'Slovakia', iso: 'SK', bloc: 'EU', currency: 'EUR' },
  { name: 'Slovenia', iso: 'SI', bloc: 'EU', currency: 'EUR' },
  { name: 'Spain', iso: 'ES', bloc: 'EU', currency: 'EUR' },
  { name: 'Sweden', iso: 'SE', bloc: 'EU', currency: 'SEK' },
  { name: 'United Kingdom', iso: 'GB', bloc: 'Non-EU', currency: 'GBP' },
  { name: 'Norway', iso: 'NO', bloc: 'Non-EU', currency: 'NOK' },
  { name: 'Iceland', iso: 'IS', bloc: 'Non-EU', currency: 'ISK' },
  { name: 'Switzerland', iso: 'CH', bloc: 'Non-EU', currency: 'CHF' },
  { name: 'Türkiye', iso: 'TR', bloc: 'Non-EU', currency: 'TRY' },
];

const SEEDED_AT = '2026-01-01T00:00:00Z';

export const mockCountries: Country[] = europeSeed.map((seed, index) => ({
  countryId: `CTY-${String(index + 1).padStart(3, '0')}`,
  countryName: seed.name,
  isoCode: seed.iso,
  region: REGION_EUROPE,
  bloc: seed.bloc,
  currency: seed.currency,
  taxSystem: seed.taxSystem ?? 'VAT',
  status: 'Active',
  createdAt: SEEDED_AT,
  updatedAt: SEEDED_AT,
}));

/** Display currency of the billing entity. Reporting is consolidated in EUR. */
export const BILLING_CURRENCY = 'EUR';

/**
 * Country of the billing entity — drives the default tax jurisdiction.
 * This deployment bills from Greece (EL), so Greek VAT applies unless a charge
 * is attributed to another configured European jurisdiction.
 */
export const DEFAULT_BILLING_COUNTRY_CODE = 'EL';

export const countryByIso = (iso: string): Country | undefined =>
  mockCountries.find((c) => c.isoCode.toUpperCase() === iso.toUpperCase());
