import React, { useMemo, useState } from 'react';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/billingCalculator';
import type { RecentCallItem } from '../../mock-data/overviewData';
import { Download, Eye, Filter, Search } from 'lucide-react';

interface RecentCallsTableProps {
  data: RecentCallItem[];
  highlighted?: boolean;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
}

const PAGE_SIZE = 5;

export const RecentCallsTable: React.FC<RecentCallsTableProps> = ({
  data,
  highlighted = false,
  onExport,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.cdrId.toLowerCase().includes(q) ||
          r.callingNumber.includes(q) ||
          r.calledNumber.includes(q) ||
          r.callType.toLowerCase().includes(q) ||
          r.gateway.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    rows.sort((a, b) => {
      const at = `${a.date} ${a.time}`;
      const bt = `${b.date} ${b.time}`;
      return sortAsc ? at.localeCompare(bt) : bt.localeCompare(at);
    });
    return rows;
  }, [data, search, statusFilter, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = data.find((r) => r.id === detailId);

  const statusVariant = (status: RecentCallItem['status']) => {
    if (status === 'Completed') return 'success' as const;
    if (status === 'Failed') return 'danger' as const;
    if (status === 'Busy') return 'warning' as const;
    return 'neutral' as const;
  };

  return (
    <div
      id="recent-calls"
      className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
        highlighted ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Recent Call Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest CDR entries</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search CDRs..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 w-44"
            />
          </div>

          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option>All</option>
              <option>Completed</option>
              <option>Failed</option>
              <option>Busy</option>
              <option>No Answer</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Sort by Time {sortAsc ? '↑' : '↓'}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExport(!showExport)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            {showExport && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      onExport?.(fmt);
                      setShowExport(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 capitalize"
                  >
                    Export {fmt === 'pdf' ? 'PDF' : fmt === 'excel' ? 'Excel' : 'CSV'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
              <th className="py-2.5 px-3 font-semibold whitespace-nowrap">CDR ID</th>
              <th className="py-2.5 px-3 font-semibold">Date</th>
              <th className="py-2.5 px-3 font-semibold">Time</th>
              <th className="py-2.5 px-3 font-semibold">Calling Number</th>
              <th className="py-2.5 px-3 font-semibold">Called Number</th>
              <th className="py-2.5 px-3 font-semibold">Call Type</th>
              <th className="py-2.5 px-3 font-semibold">Duration</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold">Gateway</th>
              <th className="py-2.5 px-3 font-semibold text-right">Cost</th>
              <th className="py-2.5 px-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-mono font-semibold text-teal-700 whitespace-nowrap">{row.cdrId}</td>
                <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.date}</td>
                <td className="py-2.5 px-3 font-mono text-slate-700">{row.time}</td>
                <td className="py-2.5 px-3 font-mono tracking-wide whitespace-nowrap">{row.callingNumber}</td>
                <td className="py-2.5 px-3 font-mono tracking-wide whitespace-nowrap">{row.calledNumber}</td>
                <td className="py-2.5 px-3">{row.callType}</td>
                <td className="py-2.5 px-3 font-mono">{row.duration}</td>
                <td className="py-2.5 px-3">
                  <Badge variant={statusVariant(row.status)} size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 text-slate-600">{row.gateway}</td>
                <td className="py-2.5 px-3 text-right font-semibold">{formatCurrency(row.cost)}</td>
                <td className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => setDetailId(row.id)}
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500">
                  No matching CDR records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            Prev
          </button>
          <span className="px-2 font-semibold">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">CDR Details</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selected.cdrId}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Calling</p>
                <p className="font-mono font-semibold text-slate-900">{selected.callingNumber}</p>
              </div>
              <div>
                <p className="text-slate-500">Called</p>
                <p className="font-mono font-semibold text-slate-900">{selected.calledNumber}</p>
              </div>
              <div>
                <p className="text-slate-500">Date / Time</p>
                <p className="font-semibold text-slate-900">
                  {selected.date} {selected.time}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Duration</p>
                <p className="font-mono font-semibold text-slate-900">{selected.duration}</p>
              </div>
              <div>
                <p className="text-slate-500">Call Type</p>
                <p className="font-semibold text-slate-900">{selected.callType}</p>
              </div>
              <div>
                <p className="text-slate-500">Gateway</p>
                <p className="font-semibold text-slate-900">{selected.gateway}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <Badge variant={statusVariant(selected.status)} size="sm">
                  {selected.status}
                </Badge>
              </div>
              <div>
                <p className="text-slate-500">Cost</p>
                <p className="font-bold text-slate-900">{formatCurrency(selected.cost)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
