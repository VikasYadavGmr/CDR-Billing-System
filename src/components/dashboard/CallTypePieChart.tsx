import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CallTypePieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    rate: string;
  }>;
}

export const CallTypePieChart: React.FC<CallTypePieChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-[380px] flex flex-col">
      <div className="mb-2">
        <h3 className="font-bold text-sm text-foreground">Call Type Distribution</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Internal vs PSTN / Mobile / STD / ISD</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-between min-h-0">
        {/* Pie */}
        <div className="w-full md:w-1/2 h-48 md:h-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [
                  `${Number(value).toLocaleString()} calls (${((Number(value) / total) * 100).toFixed(1)}%)`,
                  'Volume',
                ]}
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
            <span className="text-xs text-muted-foreground font-medium">Total Calls</span>
            <span className="text-base font-bold text-foreground">{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="w-full md:w-1/2 space-y-2 pl-2">
          {data.map((item) => {
            const pct = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium truncate max-w-[110px]">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-mono text-[11px]">{item.rate}</span>
                  <span className="font-bold text-slate-800">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
