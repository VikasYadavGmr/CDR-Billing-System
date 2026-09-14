import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/billingCalculator';
import { Badge } from '../common/Badge';
import type { TopDestinationItem } from '../../mock-data/overviewData';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';

interface TopDestinationsTableProps {
  data: TopDestinationItem[];
}

type SortKey = 'rank' | 'totalCalls' | 'totalCost';

export const TopDestinationsTable: React.FC<TopDestinationsTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const rows = [...data];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
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

  const SortIcon = asc ? ArrowUpAZ : ArrowDownAZ;

  const typeVariant = (type: string) => {
    if (type === 'Internal') return 'info' as const;
    if (type === 'International') return 'danger' as const;
    if (type === 'STD') return 'warning' as const;
    if (type === 'Mobile') return 'purple' as const;
    return 'neutral' as const;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-sm text-slate-900">Top Destinations</h3>
        <p className="text-xs text-slate-500 mt-0.5">Most frequently dialed destinations</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
              <th className="py-2.5 px-3 font-semibold">
                <button type="button" onClick={() => toggleSort('rank')} className="inline-flex items-center gap-1 hover:text-teal-700">
                  Rank {sortKey === 'rank' && <SortIcon className="w-3 h-3" />}
                </button>
              </th>
              <th className="py-2.5 px-3 font-semibold">Destination</th>
              <th className="py-2.5 px-3 font-semibold">Call Type</th>
              <th className="py-2.5 px-3 font-semibold">
                <button type="button" onClick={() => toggleSort('totalCalls')} className="inline-flex items-center gap-1 hover:text-teal-700">
                  Total Calls {sortKey === 'totalCalls' && <SortIcon className="w-3 h-3" />}
                </button>
              </th>
              <th className="py-2.5 px-3 font-semibold">Total Duration</th>
              <th className="py-2.5 px-3 font-semibold">
                <button type="button" onClick={() => toggleSort('totalCost')} className="inline-flex items-center gap-1 hover:text-teal-700">
                  Total Cost {sortKey === 'totalCost' && <SortIcon className="w-3 h-3" />}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((row) => (
              <tr key={`${row.destination}-${row.rank}`} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-700">{row.rank}</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 tracking-wide whitespace-nowrap">
                  {row.destination}
                </td>
                <td className="py-2.5 px-3">
                  <Badge variant={typeVariant(row.callType)} size="sm">
                    {row.callType}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 font-medium">{row.totalCalls.toLocaleString('en-IE')}</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{row.totalDuration}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{formatCurrency(row.totalCost, false)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
