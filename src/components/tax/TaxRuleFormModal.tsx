import React, { useEffect, useMemo, useState } from 'react';
import type {
  Country,
  RateCategory,
  RecordStatus,
  ServiceType,
  TaxRule,
  TaxType,
  TaxValidationIssue,
} from '../../types/tax';
import { EUROPE_TAX_TYPES, REGION_EUROPE } from '../../types/tax';
import { Modal } from '../common/Modal';
import { AlertTriangle, History, Info } from 'lucide-react';

const RATE_CATEGORIES: RateCategory[] = ['Standard', 'Reduced', 'Super Reduced', 'Zero', 'Exempt'];
const SERVICE_TYPES: ServiceType[] = [
  'Telecom Services',
  'Data Services',
  'Equipment Rental',
  'Professional Services',
];
const TAX_NAME_SUGGESTIONS = [
  'Standard VAT',
  'Reduced VAT',
  'Super Reduced VAT',
  'Zero Rate',
  'Exempt',
];

export interface TaxRuleFormValues {
  isoCode: string;
  taxType: TaxType;
  taxName: string;
  rate: string;
  rateCategory: RateCategory;
  serviceType: ServiceType;
  effectiveFrom: string;
  effectiveTo: string;
  priority: string;
  taxInclusive: boolean;
  reverseCharge: boolean;
  exemptionCode: string;
  sourceReference: string;
  status: RecordStatus;
  reason: string;
}

const emptyForm = (): TaxRuleFormValues => ({
  isoCode: '',
  taxType: 'VAT',
  taxName: 'Standard VAT',
  rate: '',
  rateCategory: 'Standard',
  serviceType: 'Telecom Services',
  effectiveFrom: new Date().toISOString().slice(0, 10),
  effectiveTo: '',
  priority: '10',
  taxInclusive: false,
  reverseCharge: false,
  exemptionCode: '',
  sourceReference: '',
  status: 'Active',
  reason: '',
});

const fromRule = (rule: TaxRule): TaxRuleFormValues => ({
  isoCode: rule.isoCode,
  taxType: rule.taxType,
  taxName: rule.taxName,
  rate: String(rule.rate),
  rateCategory: rule.rateCategory,
  serviceType: rule.serviceType,
  effectiveFrom: rule.effectiveFrom,
  effectiveTo: rule.effectiveTo ?? '',
  priority: String(rule.priority),
  taxInclusive: rule.taxInclusive,
  reverseCharge: rule.reverseCharge,
  exemptionCode: rule.exemptionCode ?? '',
  sourceReference: rule.sourceReference,
  status: rule.status,
  reason: '',
});

interface TaxRuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Rule being edited, or null when creating a new one. */
  rule: TaxRule | null;
  countries: Country[];
  issues: TaxValidationIssue[];
  saving: boolean;
  onSubmit: (values: TaxRuleFormValues, rateVersionFrom: string | null) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-teal-500 focus:outline-none';
const labelClass = 'block text-slate-700 font-semibold mb-1';

export const TaxRuleFormModal: React.FC<TaxRuleFormModalProps> = ({
  isOpen,
  onClose,
  rule,
  countries,
  issues,
  saving,
  onSubmit,
}) => {
  const [values, setValues] = useState<TaxRuleFormValues>(emptyForm());
  const [rateVersionFrom, setRateVersionFrom] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const next = rule ? fromRule(rule) : emptyForm();
    setValues(next);
    setRateVersionFrom('');
  }, [isOpen, rule]);

  const set = <K extends keyof TaxRuleFormValues>(key: K, value: TaxRuleFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const selectedCountry = useMemo(
    () => countries.find((c) => c.isoCode === values.isoCode),
    [countries, values.isoCode]
  );

  // Editing an existing rate never overwrites it — it opens a new version.
  const rateChanged = Boolean(rule) && Number(values.rate) !== rule?.rate;

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values, rateChanged ? rateVersionFrom || values.effectiveFrom : null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rule ? `Edit Tax Rule — ${rule.countryName}` : 'Add Tax Rule'}
      subtitle={
        rule
          ? 'Update rule configuration. Changing the rate creates a new version and preserves history.'
          : 'Configure a country-wise tax rule used by the CDR billing engine.'
      }
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {saving ? 'Saving...' : rule ? 'Save Tax Rule' : 'Create Tax Rule'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errors.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Rule cannot be saved</span>
            </div>
            {errors.map((issue, i) => (
              <p key={i} className="text-[11px] text-rose-700 leading-relaxed">
                • {issue.message}
              </p>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <Info className="w-3.5 h-3.5" />
              <span>Review before saving</span>
            </div>
            {warnings.map((issue, i) => (
              <p key={i} className="text-[11px] text-amber-700 leading-relaxed">
                • {issue.message}
              </p>
            ))}
          </div>
        )}

        {/* Jurisdiction */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Country</label>
            <select
              value={values.isoCode}
              onChange={(e) => set('isoCode', e.target.value)}
              disabled={Boolean(rule)}
              className={`${inputClass} ${rule ? 'bg-slate-100 text-slate-500' : ''}`}
              required
            >
              <option value="">Select a country...</option>
              {countries.map((c) => (
                <option key={c.countryId} value={c.isoCode}>
                  {c.countryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>ISO Code</label>
            <input
              type="text"
              value={values.isoCode}
              readOnly
              placeholder="Auto"
              className={`${inputClass} bg-slate-100 text-slate-600 font-mono font-bold`}
            />
          </div>
          <div>
            <label className={labelClass}>Region</label>
            <input
              type="text"
              value={selectedCountry?.region ?? REGION_EUROPE}
              readOnly
              className={`${inputClass} bg-slate-100 text-slate-600`}
            />
          </div>
        </div>

        {/* Tax identity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Tax Type</label>
            <select
              value={values.taxType}
              onChange={(e) => set('taxType', e.target.value as TaxType)}
              className={inputClass}
            >
              {EUROPE_TAX_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tax Name</label>
            <input
              type="text"
              list="tax-name-options"
              value={values.taxName}
              onChange={(e) => set('taxName', e.target.value)}
              placeholder="e.g. Standard VAT"
              className={inputClass}
              required
            />
            <datalist id="tax-name-options">
              {TAX_NAME_SUGGESTIONS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Rate Category</label>
            <select
              value={values.rateCategory}
              onChange={(e) => set('rateCategory', e.target.value as RateCategory)}
              className={inputClass}
            >
              {RATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={values.rate}
                onChange={(e) => set('rate', e.target.value)}
                placeholder="19.00"
                className={`${inputClass} pr-7 font-mono font-bold`}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                %
              </span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Service Type</label>
            <select
              value={values.serviceType}
              onChange={(e) => set('serviceType', e.target.value as ServiceType)}
              className={inputClass}
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Priority</label>
            <input
              type="number"
              min="1"
              value={values.priority}
              onChange={(e) => set('priority', e.target.value)}
              className={`${inputClass} font-mono`}
            />
            <p className="text-[10px] text-slate-400 mt-1">Highest priority wins when rules overlap.</p>
          </div>
        </div>

        {/* Rate versioning notice */}
        {rateChanged && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-800">
              <History className="w-3.5 h-3.5" />
              <span>Rate change creates a new version</span>
            </div>
            <p className="text-[11px] text-sky-700 leading-relaxed">
              The current {rule?.rate}% rule will be closed the day before the new rate starts, and a
              new {values.rate || '—'}% rule will be created. Invoices already issued under {rule?.rate}%
              keep resolving to that rate.
            </p>
            <div className="max-w-xs">
              <label className={labelClass}>New rate effective from</label>
              <input
                type="date"
                value={rateVersionFrom || values.effectiveFrom}
                onChange={(e) => setRateVersionFrom(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Effective period */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Effective From</label>
            <input
              type="date"
              value={values.effectiveFrom}
              onChange={(e) => set('effectiveFrom', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Effective To (optional)</label>
            <input
              type="date"
              value={values.effectiveTo}
              onChange={(e) => set('effectiveTo', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={values.status}
              onChange={(e) => set('status', e.target.value as RecordStatus)}
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Treatment toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Tax Inclusive</label>
            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
              {(['Yes', 'No'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => set('taxInclusive', option === 'Yes')}
                  className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    values.taxInclusive === (option === 'Yes')
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {values.taxInclusive ? 'Charge already includes tax.' : 'Tax is added to the charge.'}
            </p>
          </div>
          <div>
            <label className={labelClass}>Reverse Charge</label>
            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
              {(['Yes', 'No'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => set('reverseCharge', option === 'Yes')}
                  className={`flex-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    values.reverseCharge === (option === 'Yes')
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Recipient accounts for the tax.</p>
          </div>
          <div>
            <label className={labelClass}>Exemption Code (optional)</label>
            <input
              type="text"
              value={values.exemptionCode}
              onChange={(e) => set('exemptionCode', e.target.value)}
              placeholder="e.g. EU-RC-196"
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Source Reference</label>
          <input
            type="text"
            value={values.sourceReference}
            onChange={(e) => set('sourceReference', e.target.value)}
            placeholder="Official tax source used to verify this rate"
            className={inputClass}
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Regulatory rates must cite the authority they were verified against.
          </p>
        </div>

        <div>
          <label className={labelClass}>Change Reason (recorded in the audit trail)</label>
          <textarea
            value={values.reason}
            onChange={(e) => set('reason', e.target.value)}
            rows={2}
            placeholder="e.g. Standard VAT increase announced by the national tax authority"
            className={`${inputClass} resize-none`}
          />
        </div>
      </form>
    </Modal>
  );
};
