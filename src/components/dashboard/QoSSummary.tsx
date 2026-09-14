import React from 'react';
import type { QoSSummaryData } from '../../mock-data/overviewData';
import { Activity, Gauge, Timer, Wifi } from 'lucide-react';

interface QoSSummaryProps {
  data: QoSSummaryData;
}

const qualityBands = [
  { key: 'good', label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-700' },
  { key: 'acceptable', label: 'Acceptable', color: 'bg-teal-500', text: 'text-teal-700' },
  { key: 'fair', label: 'Fair', color: 'bg-amber-500', text: 'text-amber-700' },
  { key: 'poor', label: 'Poor', color: 'bg-rose-500', text: 'text-rose-700' },
] as const;

export const QoSSummary: React.FC<QoSSummaryProps> = ({ data }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full">
      <div className="mb-4">
        <h3 className="font-bold text-sm text-slate-900">Voice Quality Summary</h3>
        <p className="text-xs text-slate-500 mt-0.5">CMR-based QoS indicators</p>
      </div>

      <div className="h-3 rounded-full overflow-hidden flex bg-slate-100 mb-3">
        {qualityBands.map((band) => (
          <div
            key={band.key}
            className={`${band.color} h-full`}
            style={{ width: `${data[band.key]}%` }}
            title={`${band.label}: ${data[band.key]}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {qualityBands.map((band) => (
          <div key={band.key} className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-sm ${band.color}`} />
              <span className="text-slate-600 font-medium">{band.label}</span>
            </div>
            <span className={`font-bold ${band.text}`}>{data[band.key]}%</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Gauge className="w-3.5 h-3.5 text-teal-600" />
            Average MOS
          </div>
          <p className="text-lg font-bold text-slate-900">{data.averageMos.toFixed(1)}</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Average Jitter
          </div>
          <p className="text-lg font-bold text-slate-900">{data.averageJitterMs} ms</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Timer className="w-3.5 h-3.5 text-teal-600" />
            Average Latency
          </div>
          <p className="text-lg font-bold text-slate-900">{data.averageLatencyMs} ms</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <Wifi className="w-3.5 h-3.5 text-teal-600" />
            Packet Loss
          </div>
          <p className="text-lg font-bold text-slate-900">{data.packetLossPercent}%</p>
        </div>
      </div>
    </div>
  );
};
