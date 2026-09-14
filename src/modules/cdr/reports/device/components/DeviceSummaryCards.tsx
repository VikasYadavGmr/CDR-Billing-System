import React from 'react';
import {
  AlertTriangle,
  Clock,
  Coins,
  Cpu,
  Flame,
  PhoneCall,
  PhoneOff,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type { DeviceSummaryKPIs } from '../types';

interface DeviceSummaryCardsProps {
  kpis: DeviceSummaryKPIs;
}

export const DeviceSummaryCards: React.FC<DeviceSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
      {/* 1. Total Devices */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Total Devices</p>
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">
            {kpis.totalDevices.toLocaleString()}
          </p>
          <p className="text-[10.5px] text-slate-500 mt-0.5">Physical & SIP Lines</p>
        </div>
      </div>

      {/* 2. Active Devices */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Active Devices</p>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-extrabold text-emerald-700 tracking-tight">
            {kpis.activeDevices.toLocaleString()}
          </p>
          <p className="text-[10.5px] font-semibold text-emerald-600 mt-0.5">
            {((kpis.activeDevices / kpis.totalDevices) * 100).toFixed(1)}% Online
          </p>
        </div>
      </div>

      {/* 3. Inactive Devices */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Inactive Devices</p>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
            <PhoneOff className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-extrabold text-slate-700 tracking-tight">
            {kpis.inactiveDevices}
          </p>
          <p className="text-[10.5px] text-slate-500 mt-0.5">&gt; 7 Days Idle</p>
        </div>
      </div>

      {/* 4. Total Calls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Total Calls</p>
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-extrabold text-slate-900 tracking-tight">
            {kpis.totalCalls.toLocaleString()}
          </p>
          <p className="text-[10.5px] text-slate-500 mt-0.5">Processed Calls</p>
        </div>
      </div>

      {/* 5. Total Call Duration */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Total Duration</p>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs font-mono font-bold text-slate-900 truncate">
            {kpis.totalCallDuration}
          </p>
          <p className="text-[10.5px] text-slate-500 mt-0.5">Device Talk-Time</p>
        </div>
      </div>

      {/* 6. Total Billing */}
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
          <p className="text-[10.5px] text-teal-700 font-semibold mt-0.5">Device Toll Charges</p>
        </div>
      </div>

      {/* 7. Devices with Quality Issues */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Quality Issues</p>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-extrabold text-rose-600 tracking-tight">
            {kpis.devicesWithQualityIssues}
          </p>
          <p className="text-[10.5px] font-semibold text-rose-500 mt-0.5">CMR Degradation</p>
        </div>
      </div>

      {/* 8. High Usage Devices */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">High Usage</p>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Flame className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xl font-extrabold text-amber-700 tracking-tight">
            {kpis.highUsageDevices}
          </p>
          <p className="text-[10.5px] text-amber-600 mt-0.5">&gt; Threshold Budget</p>
        </div>
      </div>
    </div>
  );
};
