import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SummaryCardItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
}

interface ReportSummaryCardsProps {
  items: SummaryCardItem[];
  columns?: string;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({
  items,
  columns = 'grid-cols-2 md:grid-cols-4 xl:grid-cols-4',
}) => {
  return (
    <div className={`grid ${columns} gap-3`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1.5 text-lg font-bold text-slate-900 tracking-tight">{item.value}</p>
              </div>
              {Icon && (
                <div className={`p-2 rounded-lg ${item.accent || 'bg-teal-50 text-teal-700'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
