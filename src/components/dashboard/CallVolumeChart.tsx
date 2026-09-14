import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface CallVolumeChartProps {
  data: Array<{
    day: string;
    internal: number;
    local: number;
    std: number;
    isd: number;
    mobile: number;
    total: number;
  }>;
}

export const CallVolumeChart: React.FC<CallVolumeChartProps> = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-[380px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Daily Call Volume</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Call volume trends by type across the week</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
          This Week
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="internal" name="Internal" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="local" name="Local" fill="#6366f1" stackId="a" />
            <Bar dataKey="mobile" name="Mobile" fill="#10b981" stackId="a" />
            <Bar dataKey="std" name="STD" fill="#f59e0b" stackId="a" />
            <Bar dataKey="isd" name="ISD" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
