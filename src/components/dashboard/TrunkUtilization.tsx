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
import { Badge } from '../common/Badge';
import type { TrunkItem } from '../../mock-data/overviewData';

interface TrunkUtilizationProps {
  data: TrunkItem[];
}

export const TrunkUtilization: React.FC<TrunkUtilizationProps> = ({ data }) => {
  const statusVariant = (status: TrunkItem['status']) => {
    if (status === 'Active') return 'success' as const;
    if (status === 'Warning') return 'warning' as const;
    return 'danger' as const;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-sm text-slate-900">Trunk Utilization</h3>
        <p className="text-xs text-slate-500 mt-0.5">Channel usage across SIP and PRI trunks</p>
      </div>

      <div className="h-[180px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="trunkName" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(value) => [`${value ?? 0}%`, 'Utilization']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="utilization" fill="#0d9488" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
              <th className="py-2 px-2.5 font-semibold">Trunk Name</th>
              <th className="py-2 px-2.5 font-semibold">Provider</th>
              <th className="py-2 px-2.5 font-semibold text-right">Total Channels</th>
              <th className="py-2 px-2.5 font-semibold text-right">Active Channels</th>
              <th className="py-2 px-2.5 font-semibold text-right">Utilization</th>
              <th className="py-2 px-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.trunkName} className="hover:bg-slate-50/80">
                <td className="py-2 px-2.5 font-semibold text-slate-900">{row.trunkName}</td>
                <td className="py-2 px-2.5 text-slate-600">{row.provider}</td>
                <td className="py-2 px-2.5 text-right">{row.totalChannels}</td>
                <td className="py-2 px-2.5 text-right">{row.activeChannels}</td>
                <td className="py-2 px-2.5 text-right font-semibold">{row.utilization}%</td>
                <td className="py-2 px-2.5">
                  <Badge variant={statusVariant(row.status)} size="sm">
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
