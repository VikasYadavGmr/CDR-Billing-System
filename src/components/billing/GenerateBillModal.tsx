import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Calculator, CheckCircle2, AlertTriangle, Globe2 } from 'lucide-react';
import type { BillingScope, CountryChargePreview, GenerateBillParams } from '../../services/billingService';
import { billingService } from '../../services/billingService';
import { taxCalculationService } from '../../services/taxCalculationService';
import { DEFAULT_SERVICE_TYPE, formatCurrency, formatRate, formatNumber } from '../../utils/billingCalculator';
import { TAX_STATUS_LABELS } from '../../utils/taxEngine';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: GenerateBillParams) => void;
}

export const GenerateBillModal: React.FC<GenerateBillModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [periodName, setPeriodName] = useState('September 2026');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [scope, setScope] = useState<BillingScope>('consolidated');
  const [charges, setCharges] = useState<CountryChargePreview[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Unbilled charges drive the country list, so only jurisdictions that
  // actually have traffic in the cycle can be selected.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    billingService.getUnbilledChargesByCountry(startDate, endDate).then((rows) => {
      if (cancelled) return;
      setCharges(rows);
      setSelected(rows.map((r) => r.isoCode));
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, startDate, endDate]);

  /** Resolves each selected jurisdiction against the Tax & VAT master. */
  const preview = useMemo(
    () =>
      charges
        .filter((row) => selected.includes(row.isoCode))
        .map((row) => ({
          row,
          tax: taxCalculationService.calculateForTransactionSync({
            amount: row.netCharge,
            billingCountryCode: row.isoCode,
            billingCountryName: row.countryName,
            serviceType: DEFAULT_SERVICE_TYPE,
            transactionDate: endDate,
          }),
        })),
    [charges, selected, endDate]
  );

  const totals = useMemo(
    () =>
      preview.reduce(
        (acc, { tax }) => ({
          taxable: acc.taxable + tax.taxableAmount,
          tax: acc.tax + tax.taxAmount,
          total: acc.total + tax.totalAmount,
        }),
        { taxable: 0, tax: 0, total: 0 }
      ),
    [preview]
  );

  const unresolved = preview.filter(({ tax }) => tax.taxStatus === 'TAX_REVIEW_REQUIRED');

  const toggleCountry = (isoCode: string) =>
    setSelected((prev) =>
      prev.includes(isoCode) ? prev.filter((c) => c !== isoCode) : [...prev, isoCode]
    );

  const allSelected = charges.length > 0 && selected.length === charges.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.length) return;
    setIsProcessing(true);
    setTimeout(() => {
      onGenerate({ periodName, startDate, endDate, countryCodes: selected, scope });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Telecom Billing Invoice"
      subtitle="Process CDR records and compute billing totals per country"
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
            onClick={handleSubmit}
            disabled={isProcessing || !selected.length}
            className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Calculator className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Calculating CDRs...'
                : scope === 'per-country'
                  ? `Generate ${selected.length} Invoice${selected.length === 1 ? '' : 's'}`
                  : 'Run Billing Engine'}
            </span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            Automatic Rate Plan Application
          </p>
          <p className="text-[11px] text-sky-700">
            The billing engine will aggregate all unbilled CDRs within this date range, apply the active rate plans, and resolve VAT from the Tax &amp; VAT master for each selected billing country on the cycle end date.
          </p>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Billing Period Name</label>
          <input
            type="text"
            value={periodName}
            onChange={(e) => setPeriodName(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
            placeholder="e.g. September 2026"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Billing country selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              Billing Country
            </label>
            <button
              type="button"
              onClick={() => setSelected(allSelected ? [] : charges.map((c) => c.isoCode))}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-800"
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1">
            {charges.map((row) => (
              <label
                key={row.isoCode}
                className={`flex items-center gap-2 px-2.5 py-2 border rounded-md cursor-pointer transition-colors ${
                  selected.includes(row.isoCode)
                    ? 'border-sky-300 bg-sky-50'
                    : 'border-border bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(row.isoCode)}
                  onChange={() => toggleCountry(row.isoCode)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-slate-800 truncate">
                    {row.countryName}
                    <span className="ml-1 font-mono text-[10px] text-slate-500">{row.isoCode}</span>
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {formatNumber(row.calls)} calls · {formatCurrency(row.netCharge)} net
                  </span>
                </span>
              </label>
            ))}
          </div>
          {!selected.length && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium">
              Select at least one billing country to rate this cycle.
            </p>
          )}
        </div>

        {/* Invoice scope */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Invoice Scope</label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                {
                  value: 'consolidated' as const,
                  title: 'Consolidated invoice',
                  detail: 'One invoice covering every selected country, with a country-wise breakdown.',
                },
                {
                  value: 'per-country' as const,
                  title: 'Separate invoice per country',
                  detail: 'One invoice per jurisdiction, each carrying only its own VAT.',
                },
              ]
            ).map((option) => (
              <label
                key={option.value}
                className={`flex gap-2 px-3 py-2.5 border rounded-md cursor-pointer transition-colors ${
                  scope === option.value
                    ? 'border-sky-300 bg-sky-50'
                    : 'border-border bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="billing-scope"
                  value={option.value}
                  checked={scope === option.value}
                  onChange={() => setScope(option.value)}
                  className="mt-0.5 border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>
                  <span className="block font-semibold text-slate-800">{option.title}</span>
                  <span className="block text-[10px] text-slate-500 leading-snug">{option.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Country-wise tax preview */}
        {preview.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-border font-semibold text-slate-700">
              Country-wise Preview
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-border text-[10px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-1.5 text-left font-semibold">Country</th>
                  <th className="px-3 py-1.5 text-right font-semibold">Net Charge</th>
                  <th className="px-3 py-1.5 text-left font-semibold">Tax Rule</th>
                  <th className="px-3 py-1.5 text-right font-semibold">VAT</th>
                  <th className="px-3 py-1.5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.map(({ row, tax }) => (
                  <tr key={row.isoCode} className="text-[11px]">
                    <td className="px-3 py-1.5 font-semibold text-slate-800">
                      {row.countryName}
                      <span className="ml-1 font-mono text-[10px] text-slate-500">{row.isoCode}</span>
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-700">
                      {formatCurrency(tax.taxableAmount)}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">
                      {tax.taxName ? (
                        <>
                          {tax.taxName} @ {formatRate(tax.taxRate)}
                        </>
                      ) : (
                        <span className="text-amber-700 font-semibold">
                          {TAX_STATUS_LABELS[tax.taxStatus]}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-slate-700">
                      {formatCurrency(tax.taxAmount)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums font-semibold text-slate-900">
                      {formatCurrency(tax.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t border-border text-[11px] font-bold text-slate-900">
                  <td className="px-3 py-2">
                    {scope === 'per-country'
                      ? `${preview.length} invoice${preview.length === 1 ? '' : 's'}`
                      : 'Invoice total'}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(totals.taxable)}</td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(totals.tax)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(totals.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {unresolved.length > 0 && (
          <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-[11px]">
              No active tax rule applies to{' '}
              <span className="font-semibold">
                {unresolved.map(({ row }) => row.countryName).join(', ')}
              </span>{' '}
              on {endDate}. These charges will be invoiced as{' '}
              <span className="font-semibold">Tax Review Required</span> and must be resolved in the Tax &amp; VAT Master before the invoice is finalised.
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};
