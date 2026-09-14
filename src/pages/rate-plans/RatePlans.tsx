import React, { useState, useEffect } from 'react';
import type { RatePlanItem } from '../../types/billing';
import { billingService } from '../../services/billingService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import type { TaxRule } from '../../types/tax';
import { taxService } from '../../services/taxService';
import { DEFAULT_BILLING_COUNTRY_CODE } from '../../mock-data/countryData';
import {
  formatCurrency,
  calculateCallCost,
  formatDuration,
  formatRate,
  DEFAULT_SERVICE_TYPE,
} from '../../utils/billingCalculator';
import {
  Edit2,
  Calculator,
} from 'lucide-react';

export const RatePlans: React.FC = () => {
  const [rates, setRates] = useState<RatePlanItem[]>([]);
  const [editingRate, setEditingRate] = useState<RatePlanItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taxRule, setTaxRule] = useState<TaxRule | null>(null);

  // Live Calculator State
  const [calcType, setCalcType] = useState('STD');
  const [calcDurationMin, setCalcDurationMin] = useState(5);
  const [calcDurationSec, setCalcDurationSec] = useState(30);

  useEffect(() => {
    const fetchRates = async () => {
      const data = await billingService.getRatePlans();
      setRates(data);
    };
    fetchRates();
  }, []);

  // The calculator applies the same rule the billing engine would resolve today.
  useEffect(() => {
    const fetchTaxRule = async () => {
      const rule = await taxService.findApplicableTaxRule(
        DEFAULT_BILLING_COUNTRY_CODE,
        DEFAULT_SERVICE_TYPE,
        new Date().toISOString().slice(0, 10)
      );
      setTaxRule(rule);
    };
    fetchTaxRule();
  }, []);

  const handleOpenEdit = (item: RatePlanItem) => {
    setEditingRate({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRate) {
      await billingService.updateRatePlan(editingRate);
      setRates(rates.map((r) => (r.id === editingRate.id ? editingRate : r)));
      setIsEditModalOpen(false);
    }
  };

  // Live calculation demo
  const selectedRateObj = rates.find((r) => r.callType === calcType) || rates[0];
  const totalDurationSeconds = calcDurationMin * 60 + calcDurationSec;
  const calcResult = calculateCallCost(
    totalDurationSeconds,
    selectedRateObj ? selectedRateObj.ratePerMinute : 0,
    60,
    taxRule
  );

  return (
    <div className="space-y-4">

      {/* Grid: Rates Table + Live Billing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rates Table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Active Call Tariffs & Pulse Rules
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Pulse Unit: 60s per block</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                  <th className="py-3 px-3.5">Call Type</th>
                  <th className="py-3 px-3.5">Description</th>
                  <th className="py-3 px-3.5 text-right">Tariff (€/min)</th>
                  <th className="py-3 px-3.5 text-center">Pulse</th>
                  <th className="py-3 px-3.5">Effective Date</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-foreground">{rate.callType}</span>
                    </td>
                    <td className="py-3 px-3.5 text-muted-foreground">{rate.description}</td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-sky-700 text-sm">
                      {formatCurrency(rate.ratePerMinute)}/min
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono text-slate-600">{rate.pulseSeconds}s</td>
                    <td className="py-3 px-3.5 font-mono text-slate-600">{rate.effectiveDate}</td>
                    <td className="py-3 px-3.5 text-center">
                      <Badge variant={rate.status === 'Active' ? 'success' : 'neutral'} size="sm">
                        {rate.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rate)}
                        className="p-1.5 rounded-md text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="Edit Tariff"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Live Billing Test Calculator (Light Card) */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Tariff Test Calculator</h3>
              <p className="text-[11px] text-muted-foreground">
                Rate calculation with VAT resolved from the Tax &amp; VAT master
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Call Type</label>
              <select
                value={calcType}
                onChange={(e) => setCalcType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              >
                {rates.map((r) => (
                  <option key={r.id} value={r.callType}>
                    {r.callType} ({formatCurrency(r.ratePerMinute)}/min)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  value={calcDurationMin}
                  onChange={(e) => setCalcDurationMin(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={calcDurationSec}
                  onChange={(e) => setCalcDurationSec(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculation Result Breakdown Card (Clean Light Theme) */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Duration</span>
                <span className="font-mono font-semibold text-slate-900">{formatDuration(totalDurationSeconds)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Billable Pulses (60s)</span>
                <span className="font-mono font-semibold text-slate-900">{calcResult.billableMinutes} min</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({calcResult.billableMinutes}m × {formatCurrency(selectedRateObj?.ratePerMinute || 0)})</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(calcResult.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>
                  {taxRule
                    ? `${taxRule.taxName} ${formatRate(taxRule.rate)} — ${taxRule.countryName}`
                    : 'No applicable tax rule'}
                </span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(calcResult.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 text-emerald-700">
                <span>Total Amount</span>
                <span className="font-mono text-base">{formatCurrency(calcResult.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Rate Modal */}
      {editingRate && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Rate Plan: ${editingRate.callType}`}
          subtitle="Modify tariff per minute and status"
          maxWidth="max-w-md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRate}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Update Tariff
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveRate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Call Type Name</label>
              <input
                type="text"
                value={editingRate.callType}
                disabled
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-slate-100 text-slate-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Rate per Minute (€)</label>
              <input
                type="number"
                step="0.10"
                min="0"
                value={editingRate.ratePerMinute}
                onChange={(e) =>
                  setEditingRate({ ...editingRate, ratePerMinute: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Billing Pulse (Seconds)</label>
              <input
                type="number"
                min="1"
                value={editingRate.pulseSeconds}
                onChange={(e) =>
                  setEditingRate({ ...editingRate, pulseSeconds: parseInt(e.target.value) || 60 })
                }
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Description</label>
              <input
                type="text"
                value={editingRate.description}
                onChange={(e) => setEditingRate({ ...editingRate, description: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
