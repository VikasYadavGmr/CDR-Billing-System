import React, { useState } from 'react';
import {
  Cpu,
  Flame,
  MapPin,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Badge } from '../../../../../components/common/Badge';
import { Drawer } from '../../../../../components/common/Drawer';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type { SingleDeviceDetailData } from '../types';

interface DeviceDetailDrawerProps {
  open: boolean;
  data: SingleDeviceDetailData | null;
  onClose: () => void;
}

export const DeviceDetailDrawer: React.FC<DeviceDetailDrawerProps> = ({
  open,
  data,
  onClose,
}) => {
  const [activeMetric, setActiveMetric] = useState<'calls' | 'duration' | 'billing'>('calls');

  if (!data) return null;

  const { deviceInfo, usageSummary, callTypeDistribution, dailyActivity, peakUsage, callQuality, callHistory } = data;

  const maxDailyVal = Math.max(
    ...dailyActivity.map((d) =>
      activeMetric === 'calls' ? d.calls : activeMetric === 'duration' ? d.durationMinutes : d.billing
    ),
    1
  );

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      title={`Device Report: ${deviceInfo.deviceName}`}
      subtitle={`${deviceInfo.deviceId} • Extension: ${deviceInfo.extension}`}
      width="max-w-4xl"
    >
      <div className="space-y-5 text-xs pb-6">
        {/* 1. DEVICE INFORMATION */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Device Hardware Profile</span>
            </h4>
            <Badge
              variant={
                deviceInfo.status === 'Active'
                  ? 'success'
                  : deviceInfo.status === 'Inactive'
                  ? 'warning'
                  : 'neutral'
              }
              size="sm"
            >
              {deviceInfo.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Device ID</p>
              <p className="font-mono font-bold text-teal-700 mt-0.5">{deviceInfo.deviceId}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Extension</p>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{deviceInfo.extension}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Device Type</p>
              <p className="font-semibold text-slate-800 mt-0.5">{deviceInfo.deviceType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Model</p>
              <p className="font-semibold text-slate-800 mt-0.5 truncate">{deviceInfo.model}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
              <p className="font-semibold text-slate-800 mt-0.5">{deviceInfo.department}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
              <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                {deviceInfo.location}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">IP Address</p>
              <p className="font-mono text-slate-700 mt-0.5">{deviceInfo.ipAddress}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">MAC Address</p>
              <p className="font-mono text-slate-700 mt-0.5">{deviceInfo.macAddress}</p>
            </div>
          </div>
        </div>

        {/* 2. DEVICE USAGE SUMMARY */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 px-1">
            Device Usage Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Calls</p>
              <p className="text-base font-bold text-slate-900 mt-1">{usageSummary.totalCalls}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
              <p className="text-xs font-mono font-bold text-slate-900 mt-1">{usageSummary.totalDuration}</p>
            </div>
            <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-teal-800">Total Billing</p>
              <p className="text-sm font-mono font-extrabold text-teal-800 mt-1">
                {formatCurrency(usageSummary.totalBilling)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Duration</p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">{usageSummary.averageCallDuration}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Success Rate</p>
              <p className="text-xs font-mono font-bold text-emerald-700 mt-1">
                {Math.round((usageSummary.successfulCalls / usageSummary.totalCalls) * 100)}% ({usageSummary.successfulCalls})
              </p>
            </div>
          </div>
        </div>

        {/* 3. Mid Grid: Call Type Distribution & Daily Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Call Type Distribution */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              Device Call Type Distribution
            </h4>
            <div className="space-y-2.5">
              {callTypeDistribution.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.category}</span>
                    <span className="font-mono text-slate-700">
                      {item.calls} calls ({item.percentage}%) • {item.billing > 0 ? formatCurrency(item.billing) : '₹0.00'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.category === 'Internal'
                          ? 'bg-teal-600'
                          : item.category === 'External'
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Activity Chart with Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900">Daily Device Activity</h4>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                {(['calls', 'duration', 'billing'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setActiveMetric(m)}
                    className={`px-2 py-0.5 rounded font-bold capitalize ${
                      activeMetric === m ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 items-end h-28 pt-2">
              {dailyActivity.map((d) => {
                const val = activeMetric === 'calls' ? d.calls : activeMetric === 'duration' ? d.durationMinutes : d.billing;
                const pct = Math.round((val / maxDailyVal) * 100);
                const displayStr =
                  activeMetric === 'calls'
                    ? `${d.calls} calls`
                    : activeMetric === 'duration'
                    ? d.durationStr
                    : formatCurrency(d.billing);

                return (
                  <div key={d.date} className="flex flex-col items-center h-full justify-end group relative">
                    <div
                      className="w-full bg-teal-600 rounded-t hover:bg-teal-700 transition-all"
                      style={{ height: `${Math.max(15, pct)}%` }}
                      title={`${d.date}: ${displayStr}`}
                    />
                    <span className="text-[9.5px] font-mono text-slate-500 mt-1">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Peak Usage & CMR Call Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Peak Usage */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Peak Device Usage Hours</span>
              </h4>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Peak: {peakUsage.peakHour} ({peakUsage.peakCallCount} calls)
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1 items-end h-24 pt-2">
              {peakUsage.hourlyData.map((h) => {
                const pct = Math.round((h.callCount / peakUsage.peakCallCount) * 100);
                return (
                  <div key={h.hour} className="flex flex-col items-center h-full justify-end">
                    <div
                      className={`w-full rounded-t ${h.isPeak ? 'bg-amber-500' : 'bg-teal-500'}`}
                      style={{ height: `${Math.max(15, pct)}%` }}
                      title={`${h.hour}: ${h.callCount} calls`}
                    />
                    <span className="text-[8.5px] font-mono text-slate-400 mt-1">{h.hour.split(':')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CMR Quality */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Device Voice Reliability</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Success: {callQuality.goodPct}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${callQuality.goodPct}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${callQuality.fairPct}%` }} className="bg-amber-400 h-full" />
                <div style={{ width: `${callQuality.poorPct}%` }} className="bg-rose-500 h-full" />
              </div>

              <div className="flex justify-between text-[10.5px] text-slate-600 pt-1">
                <span>Good: {callQuality.goodPct}%</span>
                <span>Fair: {callQuality.fairPct}%</span>
                <span>Poor: {callQuality.poorPct}%</span>
              </div>

              <p className="text-[10.5px] text-slate-500 pt-1">
                Quality Issue Rate: <strong className="text-slate-800 font-mono">{callQuality.qualityIssueRate}%</strong> ({callQuality.qualityIssues} degraded calls)
              </p>
            </div>
          </div>
        </div>

        {/* 5. DEVICE CALL HISTORY TABLE */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider px-1">
            Device Call History ({callHistory.length} Recent Records)
          </h4>
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2 px-3">Date & Time</th>
                  <th className="py-2 px-3">CDR ID</th>
                  <th className="py-2 px-3">Extension</th>
                  <th className="py-2 px-3">Destination</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3 text-right">Duration</th>
                  <th className="py-2 px-3">Tariff</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {callHistory.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-700 font-sans">{ch.dateTime}</td>
                    <td className="py-2 px-3 font-bold text-teal-700">{ch.cdrId}</td>
                    <td className="py-2 px-3 text-slate-800">{ch.extension}</td>
                    <td className="py-2 px-3 text-slate-900">{ch.destination}</td>
                    <td className="py-2 px-3 font-sans text-slate-700">{ch.callType}</td>
                    <td className="py-2 px-3 text-right text-slate-800">{ch.duration}</td>
                    <td className="py-2 px-3 text-slate-600">{ch.tariff}</td>
                    <td className="py-2 px-3 text-right font-bold text-teal-800">
                      {formatCurrency(ch.amount)}
                    </td>
                    <td className="py-2 px-3 text-center font-sans">
                      <Badge variant={ch.status === 'Completed' ? 'success' : 'danger'} size="sm">
                        {ch.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Close</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
};
