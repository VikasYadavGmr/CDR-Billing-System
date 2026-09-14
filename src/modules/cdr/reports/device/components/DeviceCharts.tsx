import React, { useState } from 'react';
import {
  Activity,
  Coins,
  PieChart,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type {
  DeviceBillingTrendPoint,
  DeviceStatusDistItem,
  DeviceUsageTrendPoint,
} from '../types';

interface DeviceChartsProps {
  usageTrend: DeviceUsageTrendPoint[];
  billingTrend: DeviceBillingTrendPoint[];
  statusDist: DeviceStatusDistItem[];
}

export const DeviceCharts: React.FC<DeviceChartsProps> = ({
  usageTrend,
  billingTrend,
  statusDist,
}) => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [hoveredUsage, setHoveredUsage] = useState<DeviceUsageTrendPoint | null>(null);
  const [hoveredBilling, setHoveredBilling] = useState<DeviceBillingTrendPoint | null>(null);

  const maxUsage = Math.max(...usageTrend.map((d) => d.totalCalls), 1);
  const maxBilling = Math.max(...billingTrend.map((d) => d.totalBilling), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Device Call Usage Trend */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Device Call Usage Trend</h3>
              <p className="text-[11px] text-slate-500">Calls generated across active extensions</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
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

        {/* Interactive Bar Grid */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 pb-2 border-b border-slate-100">
            {usageTrend.map((pt) => {
              const totalPct = Math.round((pt.totalCalls / maxUsage) * 100);
              const isHovered = hoveredUsage?.label === pt.label;

              return (
                <div
                  key={pt.label}
                  onMouseEnter={() => setHoveredUsage(pt)}
                  onMouseLeave={() => setHoveredUsage(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {isHovered && (
                    <div className="absolute -top-16 z-30 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-[10.5px] w-38 pointer-events-none -translate-x-1/2 left-1/2">
                      <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{pt.label}</p>
                      <div className="mt-1 space-y-0.5 font-mono">
                        <p className="text-teal-300">Total: {pt.totalCalls.toLocaleString()} calls</p>
                        <p className="text-emerald-400">Active: {pt.activeDevices} devices</p>
                        <p className="text-sky-300">Avg/Dev: {pt.averageCallsPerDevice} calls</p>
                      </div>
                    </div>
                  )}

                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                      isHovered
                        ? 'bg-teal-700 ring-2 ring-teal-500 scale-105'
                        : 'bg-gradient-to-t from-teal-600 to-teal-500 opacity-90 hover:opacity-100'
                    }`}
                    style={{ height: `${Math.max(15, totalPct)}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-600 mt-2 truncate w-full text-center">
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-xl p-2 text-xs flex items-center justify-between border border-slate-100">
            <span className="text-slate-600 text-[11px]">
              {hoveredUsage ? `Active on ${hoveredUsage.label}: ${hoveredUsage.activeDevices} devices` : 'Hover to view device averages'}
            </span>
            <span className="font-mono font-bold text-teal-800">
              {hoveredUsage ? `${hoveredUsage.totalCalls.toLocaleString()} Calls` : `Peak: ${maxUsage.toLocaleString()} Calls`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Device Billing Trend */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Device Billing Trend</h3>
              <p className="text-[11px] text-slate-500">PSTN & International charges in INR</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10.5px] font-bold border border-teal-200">
            INR (₹)
          </span>
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4 pb-2 border-b border-slate-100">
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
                    <div className="absolute -top-16 z-30 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-[10.5px] w-38 pointer-events-none -translate-x-1/2 left-1/2">
                      <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{pt.label}</p>
                      <div className="mt-1 space-y-0.5 font-mono">
                        <p className="text-teal-300">Total: {formatCurrency(pt.totalBilling)}</p>
                        <p className="text-sky-300">External: {formatCurrency(pt.externalBilling)}</p>
                        <p className="text-amber-300">Intl: {formatCurrency(pt.internationalBilling)}</p>
                      </div>
                    </div>
                  )}

                  <div
                    className={`w-full max-w-[32px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all ${
                      isHovered ? 'ring-2 ring-teal-500 scale-105' : 'opacity-90 hover:opacity-100'
                    }`}
                    style={{ height: `${Math.max(15, totalPct)}%` }}
                  >
                    <div style={{ height: `${intlPct}%` }} className="bg-amber-500 w-full" />
                    <div style={{ height: `${extPct}%` }} className="bg-sky-600 w-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-2 truncate w-full text-center">
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-xl p-2 text-xs flex items-center justify-between border border-slate-100">
            <span className="text-slate-600 text-[11px]">
              {hoveredBilling ? `Invoiced: ${hoveredBilling.label}` : 'Hover for carrier breakdown'}
            </span>
            <span className="font-mono font-bold text-teal-800">
              {hoveredBilling ? formatCurrency(hoveredBilling.totalBilling) : `Peak: ${formatCurrency(maxBilling)}`}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Device Status Distribution */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Device Status Distribution</h3>
              <p className="text-[11px] text-slate-500">1,284 configured physical & SIP lines</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {statusDist.map((item) => (
            <div key={item.status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.status}
                </span>
                <div className="font-mono">
                  <span className="font-bold text-slate-900 mr-1.5">{item.count.toLocaleString()}</span>
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

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs flex justify-between">
          <span className="text-slate-600">Active Service Ratio</span>
          <span className="font-bold text-emerald-700">92.8% Operational</span>
        </div>
      </div>
    </div>
  );
};
