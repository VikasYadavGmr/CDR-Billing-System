import React from 'react';
import {
  AppWindow,
  Cpu,
  Layers,
  Phone,
  PhoneCall,
  Radio,
  Users2,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import type { DeviceInventoryTypeSummary } from '../types';

interface DeviceInventorySummaryProps {
  inventory: DeviceInventoryTypeSummary[];
}

export const DeviceInventorySummary: React.FC<DeviceInventorySummaryProps> = ({ inventory }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'IP Phone':
        return Phone;
      case 'Digital Phone':
        return Radio;
      case 'Analog Phone':
        return PhoneCall;
      case 'Softphone':
        return AppWindow;
      case 'Conference Phone':
        return Users2;
      default:
        return Cpu;
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Device Inventory Summary</h3>
            <p className="text-[11px] text-slate-500">Distribution by hardware type, active lines, processed calls and billing</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          5 Hardware Profiles
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {inventory.map((item) => {
          const Icon = getIcon(item.deviceType);
          const activePct = Math.round((item.active / item.totalDevices) * 100);

          return (
            <div
              key={item.deviceType}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.deviceType}</h4>
                  <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    {item.totalDevices} Total Units
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-teal-700 shadow-2xs">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Active / Inactive Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-emerald-700 font-semibold">{item.active} Active</span>
                  <span className="text-slate-500 font-medium">{item.inactive} Idle</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div style={{ width: `${activePct}%` }} className="bg-teal-600 h-full rounded-full" />
                </div>
              </div>

              {/* Call volume & Billing metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Calls</p>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">{item.calls.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Billing</p>
                  <p className="font-bold text-teal-800 mt-0.5 font-mono text-[11.5px] truncate">
                    {formatCurrency(item.billing)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
