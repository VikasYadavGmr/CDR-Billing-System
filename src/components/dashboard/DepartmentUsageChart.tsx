import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../utils/billingCalculator';
import type { DepartmentUsageItem, DeptMetric } from '../../mock-data/overviewData';

interface DepartmentUsageChartProps {
  data: DepartmentUsageItem[];
  metric: DeptMetric;
  onMetricChange: (metric: DeptMetric) => void;
  highlighted?: boolean;
}

const metricConfig: Record<DeptMetric, { label: string; dataKey: keyof DepartmentUsageItem; color: string }> = {
  calls: { label: 'Calls', dataKey: 'calls', color: '#0ea5e9' },
  duration: { label: 'Duration', dataKey: 'duration', color: '#14b8a6' },
  cost: { label: 'Cost', dataKey: 'cost', color: '#0284c7' },
};

export const DepartmentUsageChart: React.FC<DepartmentUsageChartProps> = ({
  data,
  metric,
  onMetricChange,
  highlighted = false,
}) => {
  const cfg = metricConfig[metric];

  return (
    <div
      id="department-usage"
      className={`bg-white border rounded-xl p-5 shadow-sm h-[420px] flex flex-col transition-all ${
        highlighted ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Department Usage</h3>
          <p className="text-xs text-slate-500 mt-0.5">Telephone usage by department</p>
        </div>
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
          {(Object.keys(metricConfig) as DeptMetric[]).map((key) => (
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
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 24, left: 8, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) =>
                metric === 'cost' ? `€${(val / 1000).toFixed(1)}k` : Number(val).toLocaleString('en-IE')
              }
            />
            <YAxis
              type="category"
              dataKey="department"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#334155' }}
              width={130}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              formatter={(value) => {
                const n = Number(value ?? 0);
                if (metric === 'cost') return [formatCurrency(n, false), 'Total Cost'];
                if (metric === 'duration') return [`${n.toLocaleString('en-IE')} min`, 'Duration'];
                return [n.toLocaleString('en-IE'), 'Calls'];
              }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey={cfg.dataKey} name={cfg.label} fill={cfg.color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
