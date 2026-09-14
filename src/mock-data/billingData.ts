import type { BillingPeriod, RatePlanItem, DepartmentBillBreakdown, InvoiceStatus } from '../types/billing';
import type { CountryTaxSummary, TaxStatus } from '../types/tax';
import { DEFAULT_SERVICE_TYPE } from '../utils/billingCalculator';
import { buildTaxSummaryLines, findApplicableTaxRule, resolveTaxForTransaction } from '../utils/taxEngine';
import { mockTaxRules } from './taxData';
import { mockCountries } from './countryData';

/**
 * Billing periods are *derived* from per-country charge splits by running them
 * through the tax engine, rather than carrying hand-written tax figures. That
 * keeps subtotal + tax = total by construction and proves the invoice numbers
 * come from the configured Tax & VAT master.
 */

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

/** Net telecom charge attributable to one billing jurisdiction in a cycle. */
export interface CountryChargeSplit {
  iso: string;
  calls: number;
  hours: number;
  netCharge: number;
}

interface PeriodSeed {
  id: string;
  period: string;
  periodCode: string;
  startDate: string;
  endDate: string;
  totalCalls: number;
  billableCalls: number;
  totalDurationHours: number;
  status: InvoiceStatus;
  generatedDate: string;
  dueDate: string;
  invoiceNumber: string;
  splits: CountryChargeSplit[];
}

const periodSeeds: PeriodSeed[] = [
  {
    id: 'bill-1',
    period: 'August 2026',
    periodCode: '2026-08',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    totalCalls: 24856,
    billableCalls: 18425,
    totalDurationHours: 3842,
    status: 'Generated',
    generatedDate: '2026-09-01',
    dueDate: '2026-09-20',
    invoiceNumber: 'INV-HTS-2026-08',
    splits: [
      { iso: 'EL', calls: 9840, hours: 1985, netCharge: 42180.5 },
      { iso: 'FR', calls: 4120, hours: 842, netCharge: 18460.0 },
      { iso: 'NL', calls: 2260, hours: 496, netCharge: 8940.25 },
      { iso: 'AT', calls: 1345, hours: 312, netCharge: 5210.75 },
      { iso: 'IE', calls: 860, hours: 207, netCharge: 3180.4 },
    ],
  },
  {
    id: 'bill-2',
    period: 'July 2026',
    periodCode: '2026-07',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    totalCalls: 24100,
    billableCalls: 17800,
    totalDurationHours: 3720,
    status: 'Paid',
    generatedDate: '2026-08-01',
    dueDate: '2026-08-20',
    invoiceNumber: 'INV-HTS-2026-07',
    splits: [
      { iso: 'EL', calls: 9510, hours: 1922, netCharge: 40760.0 },
      { iso: 'FR', calls: 3980, hours: 815, netCharge: 17840.5 },
      { iso: 'NL', calls: 2185, hours: 481, netCharge: 8620.75 },
      { iso: 'AT', calls: 1290, hours: 301, netCharge: 5030.25 },
      { iso: 'IE', calls: 835, hours: 201, netCharge: 3065.0 },
    ],
  },
  {
    id: 'bill-3',
    period: 'June 2026',
    periodCode: '2026-06',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    totalCalls: 24330,
    billableCalls: 17950,
    totalDurationHours: 3750,
    status: 'Paid',
    generatedDate: '2026-07-01',
    dueDate: '2026-07-20',
    invoiceNumber: 'INV-HTS-2026-06',
    splits: [
      { iso: 'EL', calls: 9620, hours: 1940, netCharge: 41250.75 },
      { iso: 'FR', calls: 4020, hours: 822, netCharge: 18010.25 },
      { iso: 'NL', calls: 2210, hours: 486, netCharge: 8710.5 },
      { iso: 'AT', calls: 1305, hours: 305, netCharge: 5085.0 },
      { iso: 'IE', calls: 845, hours: 197, netCharge: 3098.6 },
    ],
  },
  {
    id: 'bill-4',
    period: 'May 2026',
    periodCode: '2026-05',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    totalCalls: 23650,
    billableCalls: 17400,
    totalDurationHours: 3640,
    status: 'Paid',
    generatedDate: '2026-06-01',
    dueDate: '2026-06-20',
    invoiceNumber: 'INV-HTS-2026-05',
    splits: [
      { iso: 'EL', calls: 9320, hours: 1880, netCharge: 39980.0 },
      { iso: 'FR', calls: 3890, hours: 798, netCharge: 17460.75 },
      { iso: 'NL', calls: 2140, hours: 470, netCharge: 8440.5 },
      { iso: 'AT', calls: 1265, hours: 295, netCharge: 4930.25 },
      { iso: 'IE', calls: 820, hours: 197, netCharge: 3005.0 },
    ],
  },
  {
    id: 'bill-5',
    period: 'April 2026',
    periodCode: '2026-04',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    totalCalls: 23000,
    billableCalls: 16900,
    totalDurationHours: 3510,
    status: 'Paid',
    generatedDate: '2026-05-01',
    dueDate: '2026-05-20',
    invoiceNumber: 'INV-HTS-2026-04',
    splits: [
      { iso: 'EL', calls: 9050, hours: 1815, netCharge: 38420.5 },
      { iso: 'FR', calls: 3780, hours: 770, netCharge: 16780.25 },
      { iso: 'NL', calls: 2075, hours: 454, netCharge: 8110.0 },
      { iso: 'AT', calls: 1225, hours: 285, netCharge: 4735.75 },
      { iso: 'IE', calls: 795, hours: 186, netCharge: 2885.5 },
    ],
  },
  {
    id: 'bill-6',
    period: 'September 2026 (In-Progress)',
    periodCode: '2026-09',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    totalCalls: 7420,
    billableCalls: 5410,
    totalDurationHours: 1120,
    status: 'Draft',
    generatedDate: '2026-09-10',
    dueDate: '2026-10-20',
    invoiceNumber: 'INV-HTS-2026-09-DRAFT',
    splits: [
      { iso: 'EL', calls: 2890, hours: 586, netCharge: 12420.75 },
      { iso: 'FR', calls: 1210, hours: 248, netCharge: 5430.5 },
      { iso: 'NL', calls: 665, hours: 146, netCharge: 2610.25 },
      { iso: 'AT', calls: 395, hours: 92, netCharge: 1530.0 },
      { iso: 'IE', calls: 250, hours: 48, netCharge: 935.4 },
    ],
  },
];

/** Worst status wins, so a single unrated charge surfaces on the invoice. */
const TAX_STATUS_SEVERITY: Record<TaxStatus, number> = {
  TAX_REVIEW_REQUIRED: 5,
  NOT_CALCULATED: 4,
  REVERSE_CHARGE: 3,
  EXEMPT: 2,
  ZERO_RATED: 1,
  CALCULATED: 0,
};

function buildPeriod(seed: PeriodSeed): BillingPeriod {
  // Tax is resolved on the cycle end date, the date the charges are invoiced.
  const transactionDate = seed.endDate;

  const taxed = seed.splits.map((split) => {
    const tax = resolveTaxForTransaction(mockTaxRules, {
      amount: split.netCharge,
      billingCountryCode: split.iso,
      serviceType: DEFAULT_SERVICE_TYPE,
      transactionDate,
    });
    const rule = findApplicableTaxRule(mockTaxRules, split.iso, DEFAULT_SERVICE_TYPE, transactionDate);
    const country = mockCountries.find((c) => c.isoCode === split.iso);
    return { split, tax, rule, countryName: country?.countryName ?? split.iso };
  });

  const taxLines = buildTaxSummaryLines(
    taxed
      .filter((t) => t.rule !== null)
      .map((t) => ({
        taxType: t.tax.taxType ?? 'VAT',
        taxName: t.tax.taxName ?? 'VAT',
        rate: t.tax.taxRate,
        rateCategory: t.rule?.rateCategory ?? 'Standard',
        taxableAmount: t.tax.taxableAmount,
        taxAmount: t.tax.taxAmount,
      }))
  );

  const countryBreakdown: CountryTaxSummary[] = taxed
    .map((t) => ({
      countryName: t.countryName,
      isoCode: t.split.iso,
      calls: t.split.calls,
      durationHours: t.split.hours,
      taxableAmount: t.tax.taxableAmount,
      taxAmount: t.tax.taxAmount,
      totalAmount: t.tax.totalAmount,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  const subtotal = round2(taxed.reduce((sum, t) => sum + t.tax.taxableAmount, 0));
  const taxAmount = round2(taxed.reduce((sum, t) => sum + t.tax.taxAmount, 0));
  const totalAmount = round2(subtotal + taxAmount);

  const taxStatus = taxed.reduce<TaxStatus>(
    (worst, t) =>
      TAX_STATUS_SEVERITY[t.tax.taxStatus] > TAX_STATUS_SEVERITY[worst] ? t.tax.taxStatus : worst,
    'CALCULATED'
  );

  const reviewRequiredAmount = round2(
    taxed.reduce(
      (sum, t) => (t.tax.taxStatus === 'TAX_REVIEW_REQUIRED' ? sum + t.tax.taxableAmount : sum),
      0
    )
  );

  const primary = countryBreakdown[0];

  return {
    id: seed.id,
    period: seed.period,
    periodCode: seed.periodCode,
    startDate: seed.startDate,
    endDate: seed.endDate,
    totalCalls: seed.totalCalls,
    billableCalls: seed.billableCalls,
    totalDurationHours: seed.totalDurationHours,
    subtotal,
    taxRatePercent: subtotal > 0 ? round2((taxAmount / subtotal) * 100) : 0,
    taxAmount,
    totalAmount,
    status: seed.status,
    generatedDate: seed.generatedDate,
    dueDate: seed.dueDate,
    invoiceNumber: seed.invoiceNumber,
    billingCountry: primary?.countryName ?? '',
    billingCountryCode: primary?.isoCode ?? '',
    taxLines,
    countryBreakdown,
    taxStatus,
    reviewRequiredAmount,
  };
}

export const mockBillingPeriods: BillingPeriod[] = periodSeeds.map(buildPeriod);

/** Exposed so `billingService.generateBill` can rate a new cycle the same way. */
export function buildBillingPeriodFromSplits(params: {
  id: string;
  period: string;
  periodCode: string;
  startDate: string;
  endDate: string;
  totalCalls: number;
  billableCalls: number;
  totalDurationHours: number;
  status: InvoiceStatus;
  generatedDate: string;
  dueDate: string;
  invoiceNumber: string;
  splits: CountryChargeSplit[];
}): BillingPeriod {
  return buildPeriod(params);
}

/** Default jurisdiction mix used when a new cycle is generated in the demo. */
export const defaultCountrySplits: CountryChargeSplit[] = [
  { iso: 'EL', calls: 9900, hours: 1995, netCharge: 42600.0 },
  { iso: 'FR', calls: 4160, hours: 850, netCharge: 18650.0 },
  { iso: 'NL', calls: 2280, hours: 500, netCharge: 9020.0 },
  { iso: 'AT', calls: 1360, hours: 315, netCharge: 5260.0 },
  { iso: 'IE', calls: 870, hours: 210, netCharge: 3210.0 },
];

export const mockRatePlans: RatePlanItem[] = [
  {
    id: 'rate-1',
    callType: 'Internal',
    description: 'Inter-Department & Internal Extension Calls',
    ratePerMinute: 0.0,
    pulseSeconds: 60,
    effectiveDate: '2025-01-01',
    status: 'Active',
  },
  {
    id: 'rate-2',
    callType: 'Local',
    description: 'Local Fixed-Line PSTN Calls within the City Area',
    ratePerMinute: 0.03,
    pulseSeconds: 60,
    effectiveDate: '2026-01-01',
    status: 'Active',
  },
  {
    id: 'rate-3',
    callType: 'STD',
    description: 'National Long Distance Calls across Europe',
    ratePerMinute: 0.06,
    pulseSeconds: 60,
    effectiveDate: '2026-01-01',
    status: 'Active',
  },
  {
    id: 'rate-4',
    callType: 'Mobile',
    description: 'Cellular Mobile Numbers across all operators',
    ratePerMinute: 0.12,
    pulseSeconds: 60,
    effectiveDate: '2026-01-01',
    status: 'Active',
  },
  {
    id: 'rate-5',
    callType: 'ISD',
    description: 'International Long Distance Calls Worldwide',
    ratePerMinute: 0.45,
    pulseSeconds: 60,
    effectiveDate: '2026-01-01',
    status: 'Active',
  },
  {
    id: 'rate-6',
    callType: 'Toll-Free',
    description: 'Toll-Free Inbound and Helpdesk Numbers',
    ratePerMinute: 0.0,
    pulseSeconds: 60,
    effectiveDate: '2025-01-01',
    status: 'Active',
  },
];

/**
 * Department splits of the current cycle. Tax is applied per department using
 * the billing entity's jurisdiction so the rows reconcile to the invoice.
 */
const departmentSeeds: { department: string; extensionsCount: number; totalCalls: number; talkTimeHours: number; subtotal: number }[] = [
  { department: 'Network Operations', extensionsCount: 28, totalCalls: 5840, talkTimeHours: 920, subtotal: 19420.5 },
  { department: 'Security & Compliance', extensionsCount: 34, totalCalls: 4620, talkTimeHours: 740, subtotal: 15180.25 },
  { department: 'Engineering & Maint', extensionsCount: 22, totalCalls: 3450, talkTimeHours: 510, subtotal: 11040.0 },
  { department: 'Customer Service', extensionsCount: 18, totalCalls: 3280, talkTimeHours: 480, subtotal: 9615.75 },
  { department: 'Field Operations', extensionsCount: 16, totalCalls: 2740, talkTimeHours: 410, subtotal: 8260.4 },
  { department: 'IT & Telecom', extensionsCount: 14, totalCalls: 1980, talkTimeHours: 320, subtotal: 6480.0 },
  { department: 'Administration', extensionsCount: 12, totalCalls: 1640, talkTimeHours: 260, subtotal: 4930.6 },
  { department: 'Finance & Accounts', extensionsCount: 10, totalCalls: 1306, talkTimeHours: 202, subtotal: 3545.4 },
];

export const mockDeptBillBreakdowns: DepartmentBillBreakdown[] = departmentSeeds.map((seed) => {
  const tax = resolveTaxForTransaction(mockTaxRules, {
    amount: seed.subtotal,
    billingCountryCode: 'EL',
    serviceType: DEFAULT_SERVICE_TYPE,
    transactionDate: '2026-08-31',
  });
  return {
    department: seed.department,
    extensionsCount: seed.extensionsCount,
    totalCalls: seed.totalCalls,
    talkTimeHours: seed.talkTimeHours,
    subtotal: tax.taxableAmount,
    tax: tax.taxAmount,
    total: tax.totalAmount,
  };
});
