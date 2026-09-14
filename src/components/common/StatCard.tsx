import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  tooltip?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-teal-600',
  iconBg = 'bg-teal-50',
  trend,
  tooltip,
  active = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      title={tooltip}
      onClick={onClick}
      className={`w-full text-left bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
        active
          ? 'border-teal-400 ring-2 ring-teal-100 shadow-md'
          : 'border-slate-200'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>{subtitle || 'vs previous period'}</span>
          {trend && (
            <span
              className={`inline-flex items-center font-semibold ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </button>
  );
};
