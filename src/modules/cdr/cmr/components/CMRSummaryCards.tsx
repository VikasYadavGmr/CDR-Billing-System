import React from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  Network,
  Radio,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { CMRSummaryKPIs } from '../types';

interface CMRSummaryCardsProps {
  kpis: CMRSummaryKPIs;
}

export const CMRSummaryCards: React.FC<CMRSummaryCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {/* 1. Total CMR Records */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">Total CMR</span>
          <Activity className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <p className="text-base font-bold font-mono text-slate-900 mt-1">
          {kpis.totalRecords.toLocaleString()}
        </p>
      </div>

      {/* 2. Good Quality */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">Good Quality</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <p className="text-base font-bold font-mono text-emerald-700 mt-1">
          {kpis.goodQuality.toLocaleString()}
        </p>
      </div>

      {/* 3. Fair Quality */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">Fair Quality</span>
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <p className="text-base font-bold font-mono text-amber-700 mt-1">
          {kpis.fairQuality.toLocaleString()}
        </p>
      </div>

      {/* 4. Poor Quality */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">Poor Quality</span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <p className="text-base font-bold font-mono text-rose-700 mt-1">
          {kpis.poorQuality.toLocaleString()}
        </p>
      </div>

      {/* 5. Quality Issues */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">QoS Issues</span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <p className="text-base font-bold font-mono text-amber-800 mt-1">
          {kpis.qualityIssues.toLocaleString()}
        </p>
      </div>

      {/* 6. Average Quality Score */}
      <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-200 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-teal-800">Avg Score</span>
          <Award className="w-3.5 h-3.5 text-teal-700" />
        </div>
        <p className="text-base font-extrabold font-mono text-teal-800 mt-1">
          {kpis.averageQualityScore.toFixed(1)} <span className="text-[10px] font-normal">/ 100</span>
        </p>
      </div>

      {/* 7. Average Jitter */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">Avg Jitter</span>
          <Radio className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <p className="text-base font-bold font-mono text-slate-800 mt-1">{kpis.averageJitter}</p>
      </div>

      {/* 8. Average Packet Loss */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase font-bold text-slate-400">Avg Loss</span>
          <Network className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <p className="text-base font-bold font-mono text-slate-800 mt-1">
          {kpis.averagePacketLoss}
        </p>
      </div>
    </div>
  );
};
