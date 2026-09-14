export interface SystemSettings {
  organizationName: string;
  airportCode: string;
  currency: string;
  currencySymbol: string;
  timeZone: string;
  defaultTaxRate: number; // e.g. 18 for VAT
  billingCycleDay: number; // e.g. 1
  gracePeriodDays: number;
  roundingRule: 'CeilToMinute' | 'ActualSeconds' | 'CeilTo30Seconds';
  cdrRetentionDays: number;
  autoProcessIntervalMinutes: number;
  duplicateRecordHandling: 'Ignore' | 'Overwrite' | 'FlagForReview';
  emailAlertsEnabled: boolean;
  contactEmail: string;
  contactPhone: string;
}
