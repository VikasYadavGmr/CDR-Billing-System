import React from 'react';
import {
  FileSpreadsheet,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';
import type { ExportMainTab } from '../types';

interface ExportHeaderProps {
  activeTab: ExportMainTab;
  onTabChange: (tab: ExportMainTab) => void;
}

export const ExportHeader: React.FC<ExportHeaderProps> = () => {
  return (
    <div className="space-y-4">
      {/* Top Banner / Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Export CDR Records
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Telecom Archive
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter, preview, and generate structured Call Detail Records export packages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
          <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
          <span>Call Detail Records (CDR) Archive</span>
        </div>
      </div>

      {/* CDR Informational Banner */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3.5 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-teal-900 leading-relaxed">
          <p>
            <strong className="font-bold text-teal-950">CDR (Call Detail Records):</strong> Contains
            transactional call logs including calling extension, dialed destination, trunk route, duration,
            timestamp, and calculated billing charges across all airport divisions.
          </p>
        </div>
      </div>
    </div>
  );
};
