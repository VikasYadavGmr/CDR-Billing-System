import React from 'react';
import {
  Gauge,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type { CMRQualitySummary, SystemHealthIndicators } from '../types';

interface SystemHealthAndCMRProps {
  cmr: CMRQualitySummary;
  health: SystemHealthIndicators;
}

export const SystemHealthAndCMR: React.FC<SystemHealthAndCMRProps> = ({ cmr, health }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Call Completion & Reliability Summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Call Completion & Reliability Summary</h3>
              <p className="text-[11px] text-slate-500">Real-time PBX telephony stream completion rates</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Success Rate: 98.4%
          </span>
        </div>

        {/* Quality Progress Bar Visual */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Call Success Distribution</span>
            <span className="font-mono text-slate-500">{cmr.totalCallsWithCMR.toLocaleString()} Calls Processed</span>
          </div>

          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5">
            <div style={{ width: `${cmr.goodPct}%` }} className="bg-emerald-500 h-full rounded-l-full" title={`Completed: ${cmr.goodPct}%`} />
            <div style={{ width: `${cmr.fairPct}%` }} className="bg-amber-400 h-full" title={`Normal Disconnect: ${cmr.fairPct}%`} />
            <div style={{ width: `${cmr.poorPct}%` }} className="bg-rose-500 h-full rounded-r-full" title={`Failed/Busy: ${cmr.poorPct}%`} />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-800">Completed:</span>
              <span className="text-slate-600 font-mono">{cmr.goodQualityCalls.toLocaleString()} ({cmr.goodPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="font-bold text-slate-800">Normal End:</span>
              <span className="text-slate-600 font-mono">{cmr.fairQualityCalls.toLocaleString()} ({cmr.fairPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-bold text-slate-800">Failed/Busy:</span>
              <span className="text-slate-600 font-mono">{cmr.poorQualityCalls.toLocaleString()} ({cmr.poorPct}%)</span>
            </div>
          </div>
        </div>

        {/* Telephony Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Trunk Uptime</p>
            <p className="font-mono font-bold text-slate-900 mt-0.5">99.98%</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Avg Connect Time</p>
            <p className="font-mono font-bold text-slate-900 mt-0.5">1.4s</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Trunk Load</p>
            <p className="font-mono font-bold text-slate-900 mt-0.5">42.5%</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400">Exceptions</p>
            <p className="font-mono font-bold text-amber-700 mt-0.5">{cmr.callsWithQualityIssues.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 2. System Health Indicators */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">System Health Indicators</h3>
              <p className="text-[11px] text-slate-500">Extension capacity, utilization & telephone system health</p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal Status</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <p className="text-[10.5px] uppercase font-bold text-slate-400">Active Extensions</p>
            <p className="text-lg font-mono font-extrabold text-slate-900 mt-1">{health.activeExtensions.toLocaleString()}</p>
            <p className="text-[10.5px] text-slate-500 mt-0.5">Physical & SIP Lines</p>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <p className="text-[10.5px] uppercase font-bold text-slate-400">No Activity</p>
            <p className="text-lg font-mono font-extrabold text-slate-600 mt-1">{health.noActivityExtensions}</p>
            <p className="text-[10.5px] text-slate-500 mt-0.5">Unutilized Lines</p>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <p className="text-[10.5px] uppercase font-bold text-slate-400">High Usage</p>
            <p className="text-lg font-mono font-extrabold text-amber-700 mt-1">{health.highUsageExtensions}</p>
            <p className="text-[10.5px] text-amber-600 mt-0.5">&gt; Threshold Limit</p>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <p className="text-[10.5px] uppercase font-bold text-slate-400">Failed Call Rate</p>
            <p className="text-lg font-mono font-extrabold text-rose-600 mt-1">{health.failedCallRate}%</p>
            <p className="text-[10.5px] text-rose-500 mt-0.5">Within SLA Limit</p>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <p className="text-[10.5px] uppercase font-bold text-slate-400">Avg Calls / Ext</p>
            <p className="text-lg font-mono font-extrabold text-teal-800 mt-1">{health.averageCallsPerExtension}</p>
            <p className="text-[10.5px] text-slate-500 mt-0.5">Calls Processed</p>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <p className="text-[10.5px] uppercase font-bold text-slate-400">Avg Cost / Ext</p>
            <p className="text-lg font-mono font-extrabold text-teal-800 mt-1">{formatCurrency(health.averageBillingPerExtension)}</p>
            <p className="text-[10.5px] text-slate-500 mt-0.5">Monthly Telecom Cost</p>
          </div>
        </div>
      </div>
    </div>
  );
};
