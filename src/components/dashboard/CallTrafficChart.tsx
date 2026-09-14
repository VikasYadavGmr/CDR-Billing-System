import React from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { HourlyTrafficPoint, TrafficMetric } from '../../mock-data/overviewData';

interface CallTrafficChartProps {
  data: HourlyTrafficPoint[];
  metric: TrafficMetric;
  onMetricChange: (metric: TrafficMetric) => void;
  highlighted?: boolean;
}

const metricConfig: Record<
  TrafficMetric,
  { label: string; dataKey: keyof HourlyTrafficPoint; color: string; unit: string }
> = {
  calls: { label: 'Calls', dataKey: 'calls', color: '#0ea5e9', unit: 'calls' },
  duration: { label: 'Duration', dataKey: 'duration', color: '#14b8a6', unit: 'min' },
  cost: { label: 'Cost', dataKey: 'cost', color: '#0284c7', unit: '€' },
};

export const CallTrafficChart: React.FC<CallTrafficChartProps> = ({
  data,
  metric,
  onMetricChange,
  highlighted = false,
}) => {
  const cfg = metricConfig[metric];

  return (
    <div
      id="call-traffic"
      className={`bg-white border rounded-xl p-5 shadow-sm h-[400px] flex flex-col transition-all ${
        highlighted ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Call Traffic by Hour</h3>
          <p className="text-xs text-slate-500 mt-0.5">Hourly telephone activity for the selected period</p>
        </div>
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
          {(Object.keys(metricConfig) as TrafficMetric[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onMetricChange(key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                metric === key
                  ? 'bg-white text-teal-700 shadow-sm border border-teal-200'
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              {metricConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              formatter={(value) => {
                const n = Number(value ?? 0);
                if (metric === 'cost') return [`€${n.toLocaleString('en-IE')}`, cfg.label];
                return [`${n.toLocaleString('en-IE')} ${cfg.unit}`, cfg.label];
              }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey={cfg.dataKey} name={cfg.label} fill={cfg.color} radius={[4, 4, 0, 0]} opacity={0.85} />
            <Line
              type="monotone"
              dataKey={cfg.dataKey}
              stroke={cfg.color}
              strokeWidth={2}
              dot={false}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey={cfg.dataKey}
              fill={cfg.color}
              fillOpacity={0.08}
              stroke="none"
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
