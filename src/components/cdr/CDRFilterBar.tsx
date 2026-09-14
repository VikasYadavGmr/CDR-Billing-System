import React from 'react';
import type { CDRFilterOptions } from '../../types/cdr';
import { RotateCcw, Download, Filter } from 'lucide-react';

interface CDRFilterBarProps {
  filters: CDRFilterOptions;
  onFilterChange: (newFilters: CDRFilterOptions) => void;
  onReset: () => void;
  onExport: () => void;
  totalResults: number;
}

export const CDRFilterBar: React.FC<CDRFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  totalResults,
}) => {
  const departments = [
    'ALL',
    'Airport Operations',
    'Security & CISF',
    'Engineering & Maint',
    'Customer Service',
    'Cargo Operations',
    'IT & Telecom',
    'Administration',
    'Finance & Accounts',
  ];

  const callTypes = ['ALL', 'Internal', 'Local', 'STD', 'ISD', 'Mobile', 'Toll-Free'];
  const directions = ['ALL', 'Incoming', 'Outgoing', 'Internal'];
  const statuses = ['ALL', 'Billed', 'Unbilled', 'Exempted'];

  const handleChange = (key: keyof CDRFilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-foreground">CDR Search & Filter Records</h3>
          <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full border border-border">
            {totalResults} records found
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Date From */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Date From</label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Date To</label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleChange('dateTo', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Extension */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Extension</label>
          <input
            type="text"
            placeholder="e.g. 2451"
            value={filters.extension || ''}
            onChange={(e) => handleChange('extension', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        {/* Department */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Department</label>
          <select
            value={filters.department || 'ALL'}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Call Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Call Type</label>
          <select
            value={filters.callType || 'ALL'}
            onChange={(e) => handleChange('callType', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          >
            {callTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Direction */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Direction</label>
          <select
            value={filters.direction || 'ALL'}
            onChange={(e) => handleChange('direction', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          >
            {directions.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Billing Status</label>
          <select
            value={filters.billingStatus || 'ALL'}
            onChange={(e) => handleChange('billingStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground">Destination No.</label>
          <input
            type="text"
            placeholder="Search number..."
            value={filters.destinationNumber || ''}
            onChange={(e) => handleChange('destinationNumber', e.target.value)}
            className="w-full px-2.5 py-1.5 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
