import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CallTypeItem } from '../../mock-data/overviewData';

interface CallTypeChartProps {
  data: CallTypeItem[];
  highlighted?: boolean;
}

export const CallTypeChart: React.FC<CallTypeChartProps> = ({ data, highlighted = false }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div
      id="call-types"
      className={`bg-white border rounded-xl p-5 shadow-sm h-[400px] flex flex-col transition-all ${
        highlighted ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
      }`}
    >
      <div className="mb-2">
        <h3 className="font-bold text-sm text-slate-900">Call Type Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">Share of calls by type</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-between min-h-0 gap-2">
        <div className="w-full md:w-1/2 h-48 md:h-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const n = Number(value ?? 0);
                  const pct = total ? ((n / total) * 100).toFixed(1) : '0';
                  return [`${n.toLocaleString('en-IE')} (${pct}%)`, String(name)];
                }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Total</span>
            <span className="text-base font-bold text-slate-900">{total.toLocaleString('en-IE')}</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
          {data.map((item) => {
            const pct = total ? ((item.value / total) * 100).toFixed(1) : '0';
            return (
              <div key={item.name} className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-slate-500 font-mono text-[11px]">{item.value.toLocaleString('en-IE')}</span>
                  <span className="font-bold text-slate-800 w-10 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
