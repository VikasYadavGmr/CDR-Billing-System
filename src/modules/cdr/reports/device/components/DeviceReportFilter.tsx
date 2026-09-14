import React from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  RotateCcw,
  Search,
} from 'lucide-react';
import { exportToCSV, printElement } from '../../../../../utils/exportUtils';
import { systemDepartments } from '../../system/mock/systemReportsData';
import {
  deviceCallTypeOptions,
  deviceStatusOptions,
  deviceTypeOptions,
} from '../mock/deviceReportsData';
import type { DeviceReportFilterValues } from '../types';

interface DeviceReportFilterProps {
  filters: DeviceReportFilterValues;
  onChange: (filters: DeviceReportFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
  exportData: Record<string, unknown>[];
  exportFilename?: string;
  printElementId?: string;
}

export const DeviceReportFilter: React.FC<DeviceReportFilterProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
  exportData,
  exportFilename = 'Airport_Device_Report',
  printElementId = 'device-reports-printable-area',
}) => {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);

  const handleDatePreset = (preset: DeviceReportFilterValues['datePreset']) => {
    let from = '2026-09-01';
    let to = '2026-09-10';
    if (preset === 'today') {
      from = '2026-09-11';
      to = '2026-09-11';
    } else if (preset === 'yesterday') {
      from = '2026-09-10';
      to = '2026-09-10';
    } else if (preset === '7days') {
      from = '2026-09-04';
      to = '2026-09-10';
    } else if (preset === '30days') {
      from = '2026-08-12';
      to = '2026-09-10';
    } else if (preset === 'thisMonth') {
      from = '2026-09-01';
      to = '2026-09-30';
    }
    onChange({
      ...filters,
      datePreset: preset,
      fromDate: from,
      toDate: to,
    });
  };

  const handleExport = (type: 'csv' | 'excel' | 'pdf' | 'print') => {
    setExportMenuOpen(false);
    if (type === 'csv') {
      exportToCSV(exportData as any, exportFilename);
    } else if (type === 'print' || type === 'pdf') {
      if (printElementId) printElement(printElementId);
      else window.print();
    } else {
      alert('Excel export initiated for current filtered device dataset.');
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
      {/* Top Presets & Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Preset:</span>
          </span>
          {[
            { id: 'today' as const, label: 'Today' },
            { id: 'yesterday' as const, label: 'Yesterday' },
            { id: '7days' as const, label: 'Last 7 Days' },
            { id: '30days' as const, label: 'Last 30 Days' },
            { id: 'thisMonth' as const, label: 'This Month' },
            { id: 'custom' as const, label: 'Custom' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleDatePreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filters.datePreset === preset.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Export Button Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export Report</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-1 text-xs">
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport('excel')}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Excel</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>Export PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport('print')}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium border-t border-slate-100"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* From Date */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              onChange({ ...filters, fromDate: e.target.value, datePreset: 'custom' })
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) =>
              onChange({ ...filters, toDate: e.target.value, datePreset: 'custom' })
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Device */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Device ID</label>
          <input
            type="text"
            value={filters.device}
            onChange={(e) => onChange({ ...filters, device: e.target.value })}
            placeholder="e.g. DEV-IP-1024"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Extension */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Extension</label>
          <input
            type="text"
            value={filters.extension}
            onChange={(e) => onChange({ ...filters, extension: e.target.value })}
            placeholder="e.g. EXT-1024"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {systemDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Device Type */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Device Type</label>
          <select
            value={filters.deviceType}
            onChange={(e) => onChange({ ...filters, deviceType: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {deviceTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Call Type */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Call Type</label>
          <select
            value={filters.callType}
            onChange={(e) => onChange({ ...filters, callType: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {deviceCallTypeOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Device Status</label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {deviceStatusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Search & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by Device ID, Name, Extension, Department or Location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filters</span>
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
