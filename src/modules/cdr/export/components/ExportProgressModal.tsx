import React from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportProgressModalProps {
  isOpen: boolean;
  progress: number;
  recordCount: number;
  format: string;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  progress,
  recordCount,
  format,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200 relative">
          <FileSpreadsheet className="w-7 h-7" />
          <Loader2 className="w-4 h-4 text-teal-700 animate-spin absolute -top-1 -right-1" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Preparing Export Dataset...</h3>
          <p className="text-xs text-slate-500">
            Serializing and structuring <strong className="text-slate-800 font-mono">{recordCount.toLocaleString()}</strong> records into{' '}
            <span className="uppercase font-bold text-teal-700">{format}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
            <span>Processing records</span>
            <span className="text-teal-700">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Please wait while the telecom reporting engine compiles your file.
        </p>
      </div>
    </div>
  );
};
