import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/billingCalculator';
import { Badge } from '../common/Badge';
import type { TopUserItem } from '../../mock-data/overviewData';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

interface TopUsersTableProps {
  data: TopUserItem[];
  highlighted?: boolean;
}

type SortKey = 'rank' | 'user' | 'totalCalls' | 'totalCost';

export const TopUsersTable: React.FC<TopUsersTableProps> = ({ data, highlighted = false }) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const rows = [...data];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string' && typeof bv === 'string') {
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return asc ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return rows;
  }, [data, sortKey, asc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  const statusVariant = (status: TopUserItem['status']) => {
    if (status === 'Active') return 'success' as const;
    if (status === 'Busy') return 'warning' as const;
    return 'neutral' as const;
  };

  const SortIcon = asc ? ArrowUpAZ : ArrowDownAZ;

  return (
    <div
      id="top-users"
      className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
        highlighted ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
      }`}
    >
      <div className="mb-4">
        <h3 className="font-bold text-sm text-slate-900">Top Users</h3>
        <p className="text-xs text-slate-500 mt-0.5">Top 5 users by telephone usage</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
              {(
                [
                  ['rank', 'Rank'],
                  ['user', 'User'],
                  ['extension', 'Extension'],
                  ['department', 'Department'],
                  ['totalCalls', 'Total Calls'],
                  ['duration', 'Duration'],
                  ['totalCost', 'Total Cost'],
                  ['status', 'Status'],
                ] as const
              ).map(([key, label]) => (
                <th key={key} className="py-2.5 px-3 font-semibold whitespace-nowrap">
                  {['rank', 'user', 'totalCalls', 'totalCost'].includes(key) ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(key as SortKey)}
                      className="inline-flex items-center gap-1 hover:text-teal-700"
                    >
                      {label}
                      {sortKey === key && <SortIcon className="w-3 h-3" />}
                    </button>
                  ) : (
                    label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((row) => (
              <tr key={row.extension} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-700">{row.rank}</td>
                <td className="py-2.5 px-3 font-medium text-slate-900">{row.user}</td>
                <td className="py-2.5 px-3">
                  <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    {row.extension}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600">{row.department}</td>
                <td className="py-2.5 px-3 font-medium">{row.totalCalls.toLocaleString('en-IN')}</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{row.duration}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{formatCurrency(row.totalCost, false)}</td>
                <td className="py-2.5 px-3">
                  <Badge variant={statusVariant(row.status)} size="sm">
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
