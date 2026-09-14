import React from 'react';
import {
  Calendar,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { mockCDRDepartmentsList, mockCDRDevicesList } from '../mock/cdrRecordsData';
import type { CDRFilterOptions, CallStatus, CallType } from '../types';

interface CDRAdvancedFiltersProps {
  isOpen: boolean;
  filters: CDRFilterOptions;
  onFilterChange: (filters: CDRFilterOptions) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const CDRAdvancedFilters: React.FC<CDRAdvancedFiltersProps> = ({
  isOpen,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  const quickDates = [
    { id: 'today', label: 'Today', from: '2026-09-11', to: '2026-09-11' },
    { id: 'yesterday', label: 'Yesterday', from: '2026-09-10', to: '2026-09-10' },
    { id: 'last-7-days', label: 'Last 7 Days', from: '2026-09-04', to: '2026-09-11' },
    { id: 'last-30-days', label: 'Last 30 Days', from: '2026-08-12', to: '2026-09-11' },
    { id: 'this-month', label: 'This Month', from: '2026-09-01', to: '2026-09-11' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Advanced Telephony & Transaction Filters
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Filters</span>
          </button>
          <button
            type="button"
            onClick={onApplyFilters}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Date & Time Section */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Date & Time Range</span>
          </span>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap items-center gap-1">
            {quickDates.map((qd) => (
              <button
                key={qd.id}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    datePreset: qd.id,
                    fromDate: qd.from,
                    toDate: qd.to,
                  })
                }
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  filters.fromDate === qd.from && filters.toDate === qd.to
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {qd.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterChange({ ...filters, fromDate: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterChange({ ...filters, toDate: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              From Time
            </label>
            <input
              type="time"
              value={filters.fromTime}
              onChange={(e) => onFilterChange({ ...filters, fromTime: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              To Time
            </label>
            <input
              type="time"
              value={filters.toTime}
              onChange={(e) => onFilterChange({ ...filters, toTime: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Telephony Parameters */}
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
            {mockCDRDepartmentsList.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Extension Filter Mode & Value */}
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
                  extensionMode: e.target.value as CDRFilterOptions['extensionMode'],
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

        {/* Device Endpoints */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Device Endpoint
          </label>
          <select
            value={filters.device}
            onChange={(e) => onFilterChange({ ...filters, device: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {mockCDRDevicesList.map((dev) => (
              <option key={dev} value={dev}>
                {dev}
              </option>
            ))}
          </select>
        </div>

        {/* Call Type */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Call Type
          </label>
          <select
            value={filters.callType}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                callType: e.target.value as 'All' | CallType,
              })
            }
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Call Types</option>
            <option value="Internal">Internal Intercom</option>
            <option value="External">External PSTN/STD</option>
            <option value="International">International ISD</option>
          </select>
        </div>

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
                callStatus: e.target.value as 'All' | CallStatus,
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

        {/* Duration Range */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Duration Threshold (Sec)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Sec"
              value={filters.minDurationSec || ''}
              onChange={(e) => onFilterChange({ ...filters, minDurationSec: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <input
              type="number"
              placeholder="Max Sec"
              value={filters.maxDurationSec || ''}
              onChange={(e) => onFilterChange({ ...filters, maxDurationSec: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Billing Range */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Billing Amount Range (₹ INR)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minAmount || ''}
              onChange={(e) => onFilterChange({ ...filters, minAmount: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxAmount || ''}
              onChange={(e) => onFilterChange({ ...filters, maxAmount: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
