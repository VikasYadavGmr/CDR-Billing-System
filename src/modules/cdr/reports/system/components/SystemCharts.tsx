import React, { useState } from 'react';
import {
  Activity,
  BarChart2,
  Coins,
  Flame,
  PieChart,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type {
  BillingTrendPoint,
  CallStatusDistItem,
  CallTypeDistItem,
  PeakUsageMetrics,
  TrendGranularity,
  VolumeTrendPoint,
} from '../types';

interface SystemChartsProps {
  volumeTrend: VolumeTrendPoint[];
  weeklyTrend: VolumeTrendPoint[];
  monthlyTrend: VolumeTrendPoint[];
  billingTrend: BillingTrendPoint[];
  callTypeDist: CallTypeDistItem[];
  callStatusDist: CallStatusDistItem[];
  peakUsage: PeakUsageMetrics;
}

export const SystemCharts: React.FC<SystemChartsProps> = ({
  volumeTrend,
  weeklyTrend,
  monthlyTrend,
  billingTrend,
  callTypeDist,
  callStatusDist,
  peakUsage,
}) => {
  const [granularity, setGranularity] = useState<TrendGranularity>('daily');
  const [hoveredPoint, setHoveredPoint] = useState<VolumeTrendPoint | null>(null);
  const [hoveredBilling, setHoveredBilling] = useState<BillingTrendPoint | null>(null);

  const currentVolumeData =
    granularity === 'weekly' ? weeklyTrend : granularity === 'monthly' ? monthlyTrend : volumeTrend;

  const maxVolume = Math.max(...currentVolumeData.map((d) => d.totalCalls), 1);
  const maxBilling = Math.max(...billingTrend.map((d) => d.totalBilling), 1);
  const maxHourly = Math.max(...peakUsage.hourlyData.map((d) => d.callCount), 1);

  return (
    <div className="space-y-4">
      {/* 1. Large Top Grid: Call Volume Trend & Billing Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Call Volume Trend */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">System Call Volume</h3>
                <p className="text-[11px] text-slate-500">Call traffic volume & connection performance over time</p>
              </div>
            </div>

            {/* Granularity Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['daily', 'weekly', 'monthly'] as TrendGranularity[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGranularity(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    granularity === g
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Visual */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="font-semibold text-slate-700">Time Segment</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 inline-block" />
                  Successful Calls
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                  Failed Calls
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 pb-2 border-b border-slate-100">
              {currentVolumeData.map((pt) => {
                const totalPct = Math.round((pt.totalCalls / maxVolume) * 100);
                const successPct = Math.round((pt.successfulCalls / pt.totalCalls) * 100);
                const failPct = 100 - successPct;
                const isHovered = hoveredPoint?.label === pt.label;

                return (
                  <div
                    key={pt.label}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-16 z-30 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-[10.5px] w-36 pointer-events-none -translate-x-1/2 left-1/2">
                        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{pt.label}</p>
                        <div className="mt-1 space-y-0.5 font-mono">
                          <p className="text-teal-300">Total: {pt.totalCalls.toLocaleString()}</p>
                          <p className="text-emerald-400">Success: {pt.successfulCalls.toLocaleString()}</p>
                          <p className="text-rose-400">Failed: {pt.failedCalls.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`w-full max-w-[34px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all ${
                        isHovered ? 'ring-2 ring-teal-500 ring-offset-1 scale-105' : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{ height: `${Math.max(15, totalPct)}%` }}
                    >
                      <div style={{ height: `${failPct}%` }} className="bg-rose-500 w-full" />
                      <div style={{ height: `${successPct}%` }} className="bg-gradient-to-t from-teal-700 to-teal-500 w-full" />
                    </div>
                    <span className="text-[10.5px] font-bold text-slate-600 mt-2 truncate w-full text-center">
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Tooltip Info Bar */}
            <div className="bg-slate-50 rounded-xl p-2.5 text-xs flex items-center justify-between border border-slate-100">
              <span className="text-slate-600 font-medium">
                {hoveredPoint ? `Hovered: ${hoveredPoint.label}` : 'Hover over any bar for call status diagnostics'}
              </span>
              <span className="font-mono font-bold text-teal-800">
                {hoveredPoint ? `${hoveredPoint.totalCalls.toLocaleString()} Calls` : `Peak: ${maxVolume.toLocaleString()} Calls`}
              </span>
            </div>
          </div>
        </div>

        {/* System Billing Trend */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">System Billing Trend</h3>
                <p className="text-[11px] text-slate-500">External PSTN & International Carrier Telecom Expenditure (EUR)</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
              Currency: EUR (€)
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="font-semibold text-slate-700">Billing Period</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-600 inline-block" />
                  External (€)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                  International (€)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4 pb-2 border-b border-slate-100">
              {billingTrend.map((pt) => {
                const totalPct = Math.round((pt.totalBilling / maxBilling) * 100);
                const intlPct = Math.round((pt.internationalBilling / pt.totalBilling) * 100);
                const extPct = 100 - intlPct;
                const isHovered = hoveredBilling?.label === pt.label;

                return (
                  <div
                    key={pt.label}
                    onMouseEnter={() => setHoveredBilling(pt)}
                    onMouseLeave={() => setHoveredBilling(null)}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {isHovered && (
                      <div className="absolute -top-16 z-30 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-[10.5px] w-40 pointer-events-none -translate-x-1/2 left-1/2">
                        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{pt.label}</p>
                        <div className="mt-1 space-y-0.5 font-mono">
                          <p className="text-teal-300">Total: {formatCurrency(pt.totalBilling)}</p>
                          <p className="text-sky-300">External: {formatCurrency(pt.externalBilling)}</p>
                          <p className="text-amber-300">Intl: {formatCurrency(pt.internationalBilling)}</p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`w-full max-w-[34px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all ${
                        isHovered ? 'ring-2 ring-teal-500 ring-offset-1 scale-105' : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{ height: `${Math.max(15, totalPct)}%` }}
                    >
                      <div style={{ height: `${intlPct}%` }} className="bg-amber-500 w-full" />
                      <div style={{ height: `${extPct}%` }} className="bg-gradient-to-t from-sky-700 to-sky-500 w-full" />
                    </div>
                    <span className="text-[10.5px] font-bold text-slate-600 mt-2 truncate w-full text-center">
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 text-xs flex items-center justify-between border border-slate-100">
              <span className="text-slate-600 font-medium">
                {hoveredBilling ? `Selected: ${hoveredBilling.label}` : 'Hover over any bar to view breakdown'}
              </span>
              <span className="font-mono font-bold text-teal-800">
                {hoveredBilling ? formatCurrency(hoveredBilling.totalBilling) : `Peak: ${formatCurrency(maxBilling)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Grid: Call Type Distribution, Call Status, Peak Calling Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Call Type Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Call Type Distribution</h3>
            </div>
            <span className="text-[10.5px] text-slate-400 font-semibold">Volume & Cost</span>
          </div>

          <div className="space-y-3 pt-1">
            {callTypeDist.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.category}
                  </span>
                  <div className="text-right font-mono">
                    <span className="font-extrabold text-slate-900 mr-2">{item.percentage}%</span>
                    <span className="text-slate-500">({item.callCount.toLocaleString()} calls)</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10.5px] text-slate-500">
                  <span>Billing Amount:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {item.billingAmount > 0 ? formatCurrency(item.billingAmount) : '€0.00 (Free)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call Status Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Call Status Distribution</h3>
            </div>
            <span className="text-[10.5px] text-slate-400 font-semibold">24,586 Total</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {callStatusDist.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.status}
                  </span>
                  <div className="font-mono">
                    <span className="font-bold text-slate-900 mr-1.5">{item.callCount.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500">({item.percentage}%)</span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, item.percentage)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Calling Hours */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Peak Calling Hours</h3>
            </div>
            <span className="text-[10.5px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Peak: {peakUsage.peakHour}
            </span>
          </div>

          {/* Peak hourly visual */}
          <div className="grid grid-cols-10 gap-1 items-end h-28 pt-2">
            {peakUsage.hourlyData.map((h) => {
              const pct = Math.round((h.callCount / maxHourly) * 100);
              return (
                <div key={h.hour} className="flex flex-col items-center h-full justify-end group relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      h.isPeak
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 ring-2 ring-amber-400 ring-offset-1'
                        : 'bg-teal-600/80 hover:bg-teal-600'
                    }`}
                    style={{ height: `${Math.max(15, pct)}%` }}
                    title={`${h.displayTime}: ${h.callCount} calls`}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">{h.hour.split(':')[0]}h</span>
                </div>
              );
            })}
          </div>

          {/* Peak KPI summary badge strip */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Peak Hour & Count</p>
              <p className="font-bold text-slate-900 mt-0.5 font-mono">
                {peakUsage.peakHour} ({peakUsage.peakCallCount.toLocaleString()})
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Calls / Hr</p>
              <p className="font-bold text-teal-800 mt-0.5 font-mono">
                {peakUsage.averageCallsPerHour.toLocaleString()} calls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
