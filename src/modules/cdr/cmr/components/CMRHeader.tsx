import React from 'react';
import { Activity } from 'lucide-react';

interface CMRHeaderProps {
  totalRecordsCount: number;
  filteredCount: number;
  selectedCount: number;
}

export const CMRHeader: React.FC<CMRHeaderProps> = ({
  totalRecordsCount,
  filteredCount,
  selectedCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                CMR Records
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                VoIP QoS Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              View detailed call quality, media, and network performance records associated with telephone calls.
            </p>
          </div>
        </div>

        {/* Live Status Counters */}
        <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Total CMR</span>
            <span className="font-bold text-slate-900">{totalRecordsCount.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Filtered</span>
            <span className="font-bold text-teal-700">{filteredCount.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Selected</span>
            <span className="font-bold text-slate-900">{selectedCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
