import React from 'react';
import {
  CheckCircle2,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import type { ExportFormat, ExportMainTab, ExportToggles } from '../types';

interface ExportFormatAndOptionsProps {
  mainTab: ExportMainTab;
  format: ExportFormat;
  fileName: string;
  toggles: ExportToggles;
  selectedCount: number;
  onFormatChange: (fmt: ExportFormat) => void;
  onFileNameChange: (name: string) => void;
  onToggleChange: (key: keyof ExportToggles, val: boolean) => void;
  onTriggerExport: () => void;
}

export const ExportFormatAndOptions: React.FC<ExportFormatAndOptionsProps> = ({
  mainTab,
  format,
  fileName,
  toggles,
  selectedCount,
  onFormatChange,
  onFileNameChange,
  onToggleChange,
  onTriggerExport,
}) => {
  const formats: { id: ExportFormat; name: string; ext: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'csv',
      name: 'CSV Format',
      ext: '.csv',
      desc: 'Standard comma-delimited telecom data',
      icon: FileText,
    },
    {
      id: 'excel',
      name: 'Microsoft Excel',
      ext: '.xlsx',
      desc: 'Formatted spreadsheet with styled headers',
      icon: FileSpreadsheet,
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      ext: '.pdf',
      desc: 'Print-ready telecom statement document',
      icon: FileText,
    },
    {
      id: 'json',
      name: 'JSON Data',
      ext: '.json',
      desc: 'Raw structured JSON for system APIs',
      icon: FileCode,
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
      {/* 1. Format Selection */}
      <div className="space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Select Export File Format
          </h3>
          <p className="text-[11px] text-slate-500">
            Choose the target encoding and file structure for your telephone records
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {formats.map((f) => {
            const Icon = f.icon;
            const isSelected = format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFormatChange(f.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                      {f.ext}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{f.name}</h4>
                    <span className="text-[9.5px] font-mono font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded">
                      {f.ext}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Export Columns & Options Toggles */}
      <div className="space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            2. Export Data Columns & Inclusion Options
          </h3>
          <p className="text-[11px] text-slate-500">
            Control which metadata fields and sub-metrics are included in the generated file
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Include Headers */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <span className="font-semibold text-slate-800">Include Column Headers</span>
            <input
              type="checkbox"
              checked={toggles.includeHeaders}
              onChange={(e) => onToggleChange('includeHeaders', e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>

          {/* Include Billing Info */}
          {mainTab === 'cdr' && (
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <span className="font-semibold text-slate-800">Include Billing & Tariffs</span>
              <input
                type="checkbox"
                checked={toggles.includeBilling}
                onChange={(e) => onToggleChange('includeBilling', e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>
          )}

          {/* Include Call Destination */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <span className="font-semibold text-slate-800">Include Call Destination</span>
            <input
              type="checkbox"
              checked={toggles.includeDestination}
              onChange={(e) => onToggleChange('includeDestination', e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>

          {/* Include User Information */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <span className="font-semibold text-slate-800">Include User Information</span>
            <input
              type="checkbox"
              checked={toggles.includeUser}
              onChange={(e) => onToggleChange('includeUser', e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>

          {/* Include Device Information */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
            <span className="font-semibold text-slate-800">Include Device & IP/MAC</span>
            <input
              type="checkbox"
              checked={toggles.includeDevice}
              onChange={(e) => onToggleChange('includeDevice', e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </label>

          {/* CMR Specific Toggles */}
          {mainTab === 'cmr' && (
            <>
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <span className="font-semibold text-slate-800">Include Quality Metrics (Score/Issue)</span>
                <input
                  type="checkbox"
                  checked={toggles.includeQualityMetrics}
                  onChange={(e) => onToggleChange('includeQualityMetrics', e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                <span className="font-semibold text-slate-800">Include Network QoS (Jitter/Loss/Latency)</span>
                <input
                  type="checkbox"
                  checked={toggles.includeNetworkMetrics}
                  onChange={(e) => onToggleChange('includeNetworkMetrics', e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* 3. Filename & Export Trigger */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Export File Name
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-1 focus-within:ring-teal-500">
            <input
              type="text"
              value={fileName}
              onChange={(e) => {
                // Sanitize filename
                const clean = e.target.value.replace(/[/\\?%*:|"<>]/g, '');
                onFileNameChange(clean);
              }}
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none"
              placeholder="e.g. CDR_Export_2026-09-01_to_2026-09-11"
            />
            <span className="bg-slate-100 px-3 py-2.5 text-xs font-mono font-bold text-slate-600 border-l border-slate-200">
              .{format === 'excel' ? 'xlsx' : format}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerExport}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export {selectedCount.toLocaleString()} Records</span>
        </button>
      </div>
    </div>
  );
};
