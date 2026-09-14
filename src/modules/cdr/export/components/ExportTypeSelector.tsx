import React from 'react';
import {
  AlertOctagon,
  Award,
  CheckCircle2,
  Coins,
  FileCheck2,
  FileSpreadsheet,
  Globe2,
  Layers,
  PhoneCall,
  PhoneIncoming,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import type { CdrExportType, CmrExportType, ExportMainTab } from '../types';

interface ExportTypeSelectorProps {
  mainTab: ExportMainTab;
  cdrType: CdrExportType;
  cmrType: CmrExportType;
  onCdrTypeChange: (type: CdrExportType) => void;
  onCmrTypeChange: (type: CmrExportType) => void;
}

export const ExportTypeSelector: React.FC<ExportTypeSelectorProps> = ({
  mainTab,
  cdrType,
  cmrType,
  onCdrTypeChange,
  onCmrTypeChange,
}) => {
  const cdrOptions: { id: CdrExportType; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'cdr-records',
      title: 'CDR Records',
      desc: 'Standard call logs with duration & endpoints',
      icon: PhoneCall,
    },
    {
      id: 'billing-cdrs',
      title: 'Billing CDRs',
      desc: 'PSTN/STD/ISD calls with tariffs & amounts',
      icon: Coins,
    },
    {
      id: 'internal-calls',
      title: 'Internal Calls',
      desc: 'Free intercom and intra-airport calls',
      icon: PhoneIncoming,
    },
    {
      id: 'external-calls',
      title: 'External Calls',
      desc: 'Local PSTN & national outgoing calls',
      icon: FileSpreadsheet,
    },
    {
      id: 'international-calls',
      title: 'International Calls',
      desc: 'Overseas ISD routes and air traffic trunks',
      icon: Globe2,
    },
    {
      id: 'failed-calls',
      title: 'Failed Calls',
      desc: 'Busy, unanswered, and dropped connections',
      icon: AlertOctagon,
    },
    {
      id: 'all-cdrs',
      title: 'All CDRs',
      desc: 'Master comprehensive call detail export',
      icon: Layers,
    },
  ];

  const cmrOptions: { id: CmrExportType; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'cmr-records',
      title: 'CMR Records',
      desc: 'Standard call management QoS logs',
      icon: ShieldCheck,
    },
    {
      id: 'quality-records',
      title: 'Call Quality Records',
      desc: 'VoIP jitter, latency & packet loss logs',
      icon: Award,
    },
    {
      id: 'issue-records',
      title: 'Quality Issue Records',
      desc: 'Fair & poor call quality incidents only',
      icon: ShieldAlert,
    },
    {
      id: 'cmr-summary',
      title: 'CMR Summary',
      desc: 'Aggregated QoS performance metrics',
      icon: FileCheck2,
    },
    {
      id: 'all-cmrs',
      title: 'All CMRs',
      desc: 'Complete full-spectrum QoS dataset',
      icon: Layers,
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Select Export Type
          </h3>
          <p className="text-[11px] text-slate-500">
            {mainTab === 'cdr'
              ? 'Choose which category of Call Detail Records you wish to export'
              : 'Choose the VoIP Call Management Records dataset for export'}
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
          {mainTab === 'cdr' ? cdrType.toUpperCase() : cmrType.toUpperCase()}
        </span>
      </div>

      {mainTab === 'cdr' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {cdrOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = cdrType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onCdrTypeChange(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  )}
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{opt.title}</h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {cmrOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = cmrType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onCmrTypeChange(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  )}
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{opt.title}</h4>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
