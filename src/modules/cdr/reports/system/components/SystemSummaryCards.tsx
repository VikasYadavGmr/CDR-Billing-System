import React from 'react';
import {
  AlertTriangle,
  Clock,
  Coins,
  Globe2,
  Layers,
  PhoneCall,
  PhoneForwarded,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type { SystemSummaryKPIs } from '../types';

interface SystemSummaryCardsProps {
  kpis: SystemSummaryKPIs;
}

export const SystemSummaryCards: React.FC<SystemSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
      {/* 1. Total Calls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Total Calls</p>
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-lg font-extrabold text-slate-900 tracking-tight">
            {kpis.totalCalls.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[10.5px] font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>+{kpis.totalCallsChangePct}% vs prev</span>
          </div>
        </div>
      </div>

      {/* 2. Total Call Duration */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Total Duration</p>
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs font-mono font-bold text-slate-900 truncate">
            {kpis.totalDuration}
          </p>
          <p className="text-[10.5px] text-slate-500 mt-1">System Talk-Time</p>
        </div>
      </div>

      {/* 3. Total Billing */}
      <div className="bg-teal-50/70 border border-teal-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-teal-800">Total Billing</p>
          <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
            <Coins className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-mono font-extrabold text-teal-800 tracking-tight">
            {formatCurrency(kpis.totalBilling)}
          </p>
          <p className="text-[10.5px] text-teal-700 font-semibold mt-1">Gross Invoiced</p>
        </div>
      </div>

      {/* 4. Internal Calls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Internal Calls</p>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-bold text-slate-900 tracking-tight">
            {kpis.internalCalls.toLocaleString()}
          </p>
          <p className="text-[10.5px] font-semibold text-indigo-600 mt-1">{kpis.internalCallsPct}% of total</p>
        </div>
      </div>

      {/* 5. External Calls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">External Calls</p>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
            <PhoneForwarded className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-bold text-slate-900 tracking-tight">
            {kpis.externalCalls.toLocaleString()}
          </p>
          <p className="text-[10.5px] font-semibold text-blue-600 mt-1">{kpis.externalCallsPct}% of total</p>
        </div>
      </div>

      {/* 6. International Calls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">International</p>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Globe2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-bold text-slate-900 tracking-tight">
            {kpis.internationalCalls.toLocaleString()}
          </p>
          <p className="text-[10.5px] font-semibold text-amber-600 mt-1">{kpis.internationalCallsPct}% of total</p>
        </div>
      </div>

      {/* 7. Failed Calls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Failed Calls</p>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-bold text-rose-600 tracking-tight">
            {kpis.failedCalls.toLocaleString()}
          </p>
          <p className="text-[10.5px] font-semibold text-rose-500 mt-1">{kpis.failedCallsPct}% failure rate</p>
        </div>
      </div>

      {/* 8. Average Call Duration */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Avg Duration</p>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <Timer className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-base font-mono font-bold text-slate-900 tracking-tight">
            {kpis.averageCallDuration}
          </p>
          <p className="text-[10.5px] text-slate-500 mt-1">Per Connected Call</p>
        </div>
      </div>
    </div>
  );
};
