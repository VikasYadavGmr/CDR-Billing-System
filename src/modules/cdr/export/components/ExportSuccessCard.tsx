import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';
import type { ExportFormat } from '../types';

interface ExportSuccessCardProps {
  isError?: boolean;
  errorMessage?: string;
  fileName: string;
  fileSize: string;
  recordCount: number;
  format?: ExportFormat;
  generatedTimestamp: string;
  onDownload: () => void;
  onReset: () => void;
  onRetry?: () => void;
}

export const ExportSuccessCard: React.FC<ExportSuccessCardProps> = ({
  isError = false,
  errorMessage,
  fileName,
  fileSize,
  recordCount,
  generatedTimestamp,
  onDownload,
  onReset,
  onRetry,
}) => {
  if (isError) {
    return (
      <div className="bg-rose-50/70 border border-rose-200 p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950">Export Failed</h3>
            <p className="text-xs text-rose-800 mt-0.5">
              {errorMessage || 'Unable to generate the export. Please verify the selected filters and try again.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Export</span>
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-800 transition-colors"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-teal-50/90 via-emerald-50/70 to-teal-50/90 border border-teal-200/90 p-5 rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200/60 pb-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-teal-950">Export Ready</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Generated
              </span>
            </div>
            <p className="text-xs text-teal-800 mt-0.5">
              Telecom file generated successfully. Your download is ready to save.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-teal-200 bg-white hover:bg-teal-50/60 text-xs font-semibold text-teal-900 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Generate Another Export</span>
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>

      {/* File Metadata Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white/80 p-3 rounded-xl border border-teal-200/60">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">File Name</span>
          <span className="font-mono font-bold text-slate-900 truncate block mt-0.5" title={fileName}>
            {fileName}
          </span>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-teal-200/60">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">Records Exported</span>
          <span className="font-mono font-bold text-slate-900 block mt-0.5">
            {recordCount.toLocaleString()} rows
          </span>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-teal-200/60">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">Estimated Size</span>
          <span className="font-mono font-bold text-slate-900 block mt-0.5">{fileSize}</span>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-teal-200/60">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">Generated At</span>
          <span className="font-mono font-semibold text-slate-700 block mt-0.5 truncate">
            {generatedTimestamp}
          </span>
        </div>
      </div>
    </div>
  );
};
