import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { exportDepartments, exportDevicesList } from '../mock/exportData';
import type { ExportDatePreset, ExportFilters, ExportMainTab } from '../types';

interface ExportFilterPanelProps {
  mainTab: ExportMainTab;
  datePreset: ExportDatePreset;
  fromDate: string;
  toDate: string;
  filters: ExportFilters;
  onDatePresetChange: (preset: ExportDatePreset) => void;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onFilterChange: (filters: ExportFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const ExportFilterPanel: React.FC<ExportFilterPanelProps> = ({
  mainTab,
  datePreset,
  fromDate,
  toDate,
  filters,
  onDatePresetChange,
  onFromDateChange,
  onToDateChange,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const presets: { id: ExportDatePreset; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last-7-days', label: 'Last 7 Days' },
    { id: 'last-30-days', label: 'Last 30 Days' },
    { id: 'this-month', label: 'This Month' },
    { id: 'prev-month', label: 'Previous Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Date Range Selection Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Export Date Range
            </h3>
          </div>
          <div className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200/70 inline-flex items-center gap-1.5 self-start sm:self-auto">
            <span>Range:</span>
            <span>
              {fromDate} — {toDate}
            </span>
          </div>
        </div>

        {/* Date Presets Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => {
            const isSelected = datePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onDatePresetChange(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom Range Inputs */}
        {datePreset === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Expandable Advanced Filters Header */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-xs font-bold text-slate-800 hover:text-teal-700 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
          <span>Advanced Telephony & Endpoint Filters</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-600 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onApplyFilters}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-[11px] font-bold text-white transition-colors shadow-2xs"
          >
            <Filter className="w-3 h-3" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {/* Department */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {exportDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Extension Mode & Value */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Extension Filter
                </label>
                <select
                  value={filters.extensionMode}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      extensionMode: e.target.value as ExportFilters['extensionMode'],
                    })
                  }
                  className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5"
                >
                  <option value="all">All Exts</option>
                  <option value="single">Single</option>
                  <option value="multiple">Multiple</option>
                  <option value="range">Range</option>
                </select>
              </div>
              <input
                type="text"
                disabled={filters.extensionMode === 'all'}
                placeholder={
                  filters.extensionMode === 'range'
                    ? 'e.g. EXT-1000 - EXT-1999'
                    : filters.extensionMode === 'multiple'
                    ? 'e.g. EXT-1024, EXT-1102, EXT-1215'
                    : 'e.g. EXT-1024'
                }
                value={filters.extensionValue}
                onChange={(e) => onFilterChange({ ...filters, extensionValue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono text-[11.5px]"
              />
            </div>

            {/* Device */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Device Endpoints
              </label>
              <select
                value={filters.device}
                onChange={(e) => onFilterChange({ ...filters, device: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {exportDevicesList.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </select>
            </div>

            {/* Call Type (for CDR) */}
            {mainTab === 'cdr' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Call Type
                </label>
                <select
                  value={filters.callType}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      callType: e.target.value as ExportFilters['callType'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="All">All Call Types</option>
                  <option value="Internal">Internal (Intercom)</option>
                  <option value="External">External (PSTN/STD)</option>
                  <option value="International">International (ISD)</option>
                </select>
              </div>
            )}

            {/* Call Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Call Status
              </label>
              <select
                value={filters.callStatus}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    callStatus: e.target.value as ExportFilters['callStatus'],
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Busy">Busy</option>
                <option value="No Answer">No Answer</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* CMR Quality (for CMR) */}
            {mainTab === 'cmr' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  CMR Voice Quality
                </label>
                <select
                  value={filters.cmrQuality}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      cmrQuality: e.target.value as ExportFilters['cmrQuality'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="All">All Quality Grades</option>
                  <option value="Good">Good Quality (Score &gt; 85)</option>
                  <option value="Fair">Fair Quality (Score 60-85)</option>
                  <option value="Poor">Poor Quality (Score &lt; 60)</option>
                  <option value="Quality Issues">Quality Issues Only</option>
                </select>
              </div>
            )}

            {/* Optional Billing Range (CDR) */}
            {mainTab === 'cdr' && (
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Billing Range (₹ INR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minAmount || ''}
                    onChange={(e) => onFilterChange({ ...filters, minAmount: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxAmount || ''}
                    onChange={(e) => onFilterChange({ ...filters, maxAmount: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Optional Duration Range */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Duration (Seconds)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Sec (e.g. 30)"
                  value={filters.minDuration || ''}
                  onChange={(e) => onFilterChange({ ...filters, minDuration: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
                <input
                  type="number"
                  placeholder="Max Sec (e.g. 600)"
                  value={filters.maxDuration || ''}
                  onChange={(e) => onFilterChange({ ...filters, maxDuration: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
