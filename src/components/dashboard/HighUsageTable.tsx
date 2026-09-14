import React from 'react';
import { formatCurrency } from '../../utils/billingCalculator';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HighUsageTableProps {
  data: Array<{
    extension: string;
    department: string;
    employee: string;
    calls: number;
    durationHours: number;
    cost: number;
  }>;
}

export const HighUsageTable: React.FC<HighUsageTableProps> = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">High Usage Analysis</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Extensions with unusually high telephone usage & expenditure
          </p>
        </div>
        <Link
          to="/extensions"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline"
        >
          View All Extensions
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-slate-50/70 text-muted-foreground">
              <th className="py-2.5 px-3 font-semibold">Extension</th>
              <th className="py-2.5 px-3 font-semibold">Employee / Desk</th>
              <th className="py-2.5 px-3 font-semibold">Department</th>
              <th className="py-2.5 px-3 font-semibold text-right">Total Calls</th>
              <th className="py-2.5 px-3 font-semibold text-right">Talk Time</th>
              <th className="py-2.5 px-3 font-semibold text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {data.map((row) => (
              <tr key={row.extension} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3">
                  <span className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {row.extension}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-medium text-foreground">{row.employee}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{row.department}</td>
                <td className="py-2.5 px-3 text-right font-medium">{row.calls.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600">{row.durationHours} hrs</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                  {formatCurrency(row.cost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
