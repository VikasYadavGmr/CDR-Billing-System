import React from 'react';
import { Badge } from '../common/Badge';
import type { GatewayItem } from '../../mock-data/overviewData';
import { Radio } from 'lucide-react';

interface GatewayStatusProps {
  data: GatewayItem[];
}

export const GatewayStatus: React.FC<GatewayStatusProps> = ({ data }) => {
  const statusVariant = (status: GatewayItem['status']) => {
    if (status === 'Active') return 'success' as const;
    if (status === 'Warning') return 'warning' as const;
    return 'danger' as const;
  };

  const barColor = (status: GatewayItem['status'], utilization: number) => {
    if (status === 'Offline') return 'bg-slate-300';
    if (utilization >= 90 || status === 'Warning') return 'bg-amber-500';
    return 'bg-teal-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full">
      <div className="mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
          <Radio className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">Gateway Status</h3>
          <p className="text-xs text-slate-500">Live gateway channel utilization</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((gw) => (
          <div key={gw.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{gw.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{gw.type}</p>
              </div>
              <Badge variant={statusVariant(gw.status)} size="sm">
                {gw.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
              <span>{gw.channels} Channels</span>
              <span className="font-semibold text-slate-800">{gw.utilization}% Utilization</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(gw.status, gw.utilization)}`}
                style={{ width: `${gw.utilization}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
