import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Coins,
  Globe2,
  Layers,
  PhoneCall,
  PhoneIncoming,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { CDRQuickFilterKey } from '../types';

interface CDRQuickFiltersProps {
  searchQuery: string;
  activeQuickFilter: CDRQuickFilterKey;
  isAdvancedOpen: boolean;
  onSearchChange: (query: string) => void;
  onQuickFilterChange: (filter: CDRQuickFilterKey) => void;
  onToggleAdvanced: () => void;
  onClearSearch: () => void;
}

export const CDRQuickFilters: React.FC<CDRQuickFiltersProps> = ({
  searchQuery,
  activeQuickFilter,
  isAdvancedOpen,
  onSearchChange,
  onQuickFilterChange,
  onToggleAdvanced,
  onClearSearch,
}) => {
  const quickFilters: { id: CDRQuickFilterKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Calls', icon: Layers },
    { id: 'internal', label: 'Internal', icon: PhoneIncoming },
    { id: 'external', label: 'External', icon: PhoneCall },
    { id: 'international', label: 'International', icon: Globe2 },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'failed', label: 'Failed / Busy', icon: AlertTriangle },
    { id: 'high-billing', label: 'High Billing (>€50)', icon: Coins },
    { id: 'long-duration', label: 'Long Duration (>30m)', icon: Clock },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Prominent Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search CDR ID, extension, destination, user, or device..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Toggle Advanced Filters Button */}
        <button
          type="button"
          onClick={onToggleAdvanced}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            isAdvancedOpen
              ? 'bg-teal-50 text-teal-800 border border-teal-300 ring-1 ring-teal-500/20 shadow-2xs'
              : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Quick Filters Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
        <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider mr-1 whitespace-nowrap">
          Quick Filters:
        </span>
        {quickFilters.map((qf) => {
          const Icon = qf.icon;
          const isActive = activeQuickFilter === qf.id;
          return (
            <button
              key={qf.id}
              type="button"
              onClick={() => onQuickFilterChange(qf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-2xs font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{qf.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
