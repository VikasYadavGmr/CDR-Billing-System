import React from 'react';
import type { DateRangePreset } from '../../mock-data/overviewData';
import { CalendarDays } from 'lucide-react';

interface DateRangeFilterProps {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
  compact?: boolean;
}

const presets: { key: DateRangePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'last30', label: 'Last 30 Days' },
  { key: 'custom', label: 'Custom Range' },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  compact = false,
}) => {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'flex-wrap'}`}>
      {!compact && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
          <CalendarDays className="w-3.5 h-3.5 text-teal-600" />
          Date Range
        </span>
      )}
      <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
        {presets.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(p.key)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              value === p.key
                ? 'bg-white text-teal-700 shadow-sm border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
