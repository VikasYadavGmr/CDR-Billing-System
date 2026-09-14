import React from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '../../../../utils/billingCalculator';
import type { ExportMainTab } from '../types';

interface ExportSummaryCardProps {
  mainTab: ExportMainTab;
  dateRangeStr: string;
  recordsCount: number;
  // CDR metrics
  departmentsCount?: number;
  extensionsCount?: number;
  totalDurationStr?: string;
  totalBilling?: number;
  // CMR metrics
  goodQualityCount?: number;
  fairQualityCount?: number;
  poorQualityCount?: number;
}

export const ExportSummaryCard: React.FC<ExportSummaryCardProps> = ({
  mainTab,
  dateRangeStr,
  recordsCount,
  departmentsCount = 8,
  extensionsCount = 428,
  totalDurationStr = '8,426 hrs 18 min',
  totalBilling = 428640,
  goodQualityCount = 7824,
  fairQualityCount = 612,
  poorQualityCount = 206,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Filtered Export Dataset Summary
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{dateRangeStr}</span>
        </div>
      </div>

      {mainTab === 'cdr' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Records Found */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Records Found
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {recordsCount.toLocaleString()}
            </span>
          </div>

          {/* Departments */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>Departments</span>
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {departmentsCount}
            </span>
          </div>

          {/* Extensions */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-slate-400" />
              <span>Extensions</span>
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {extensionsCount}
            </span>
          </div>

          {/* Total Duration */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Total Duration</span>
            </span>
            <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">
              {totalDurationStr}
            </span>
          </div>

          {/* Total Billing */}
          <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-200 col-span-2 sm:col-span-1 lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block flex items-center gap-1">
              <Coins className="w-3 h-3 text-teal-700" />
              <span>Total Telecom Invoiced</span>
            </span>
            <span className="text-base font-extrabold text-teal-800 font-mono mt-0.5 block">
              {formatCurrency(totalBilling)}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Records Found */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              QoS Records Found
            </span>
            <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
              {recordsCount.toLocaleString()}
            </span>
          </div>

          {/* Good Quality */}
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Good Quality</span>
            </span>
            <span className="text-base font-bold text-emerald-800 font-mono mt-0.5 block">
              {goodQualityCount.toLocaleString()}{' '}
              <span className="text-[10.5px] font-normal opacity-80">
                ({Math.round((goodQualityCount / Math.max(recordsCount, 1)) * 100)}%)
              </span>
            </span>
          </div>

          {/* Fair Quality */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>Fair Quality</span>
            </span>
            <span className="text-base font-bold text-amber-800 font-mono mt-0.5 block">
              {fairQualityCount.toLocaleString()}{' '}
              <span className="text-[10.5px] font-normal opacity-80">
                ({Math.round((fairQualityCount / Math.max(recordsCount, 1)) * 100)}%)
              </span>
            </span>
          </div>

          {/* Poor Quality */}
          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Poor Quality Issues</span>
            </span>
            <span className="text-base font-bold text-rose-800 font-mono mt-0.5 block">
              {poorQualityCount.toLocaleString()}{' '}
              <span className="text-[10.5px] font-normal opacity-80">
                ({Math.round((poorQualityCount / Math.max(recordsCount, 1)) * 100)}%)
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
