import React, { useState } from 'react';
import type { CDRRecord } from '../../types/cdr';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/billingCalculator';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CDRTableProps {
  records: CDRRecord[];
  onSelectRecord: (record: CDRRecord) => void;
}

type SortField = 'startDate' | 'durationSeconds' | 'totalAmount' | 'extension';

export const CDRTable: React.FC<CDRTableProps> = ({ records, onSelectRecord }) => {
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'startDate') {
      const timeA = `${a.startDate} ${a.startTime}`;
      const timeB = `${b.startDate} ${b.startTime}`;
      comparison = timeA.localeCompare(timeB);
    } else if (sortField === 'durationSeconds') {
      comparison = a.durationSeconds - b.durationSeconds;
    } else if (sortField === 'totalAmount') {
      comparison = a.totalAmount - b.totalAmount;
    } else if (sortField === 'extension') {
      comparison = a.extension.localeCompare(b.extension);
    }
    return sortAsc ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Billed':
        return <Badge variant="success" size="sm">Billed</Badge>;
      case 'Unbilled':
        return <Badge variant="warning" size="sm">Unbilled</Badge>;
      case 'Exempted':
        return <Badge variant="info" size="sm">Exempted</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getDirectionBadge = (dir: string) => {
    if (dir === 'Incoming') {
      return (
        <span className="inline-flex items-center text-[11px] text-emerald-700 font-medium">
          <PhoneIncoming className="w-3 h-3 mr-1" />
          In
        </span>
      );
    }
    if (dir === 'Outgoing') {
      return (
        <span className="inline-flex items-center text-[11px] text-sky-700 font-medium">
          <PhoneOutgoing className="w-3 h-3 mr-1" />
          Out
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] text-indigo-700 font-medium">
        <PhoneCall className="w-3 h-3 mr-1" />
        Int
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Internal':
        return <Badge variant="neutral" size="sm">Internal</Badge>;
      case 'Local':
        return <Badge variant="info" size="sm">Local</Badge>;
      case 'STD':
        return <Badge variant="amber" size="sm">STD</Badge>;
      case 'ISD':
        return <Badge variant="danger" size="sm">ISD</Badge>;
      case 'Mobile':
        return <Badge variant="purple" size="sm">Mobile</Badge>;
      case 'Toll-Free':
        return <Badge variant="success" size="sm">Toll-Free</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{type}</Badge>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
              <th className="py-3 px-3.5">CDR ID</th>
              <th
                className="py-3 px-3.5 cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('extension')}
              >
                <div className="flex items-center gap-1">
                  <span>Extension</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3.5">Department</th>
              <th className="py-3 px-3.5">Caller / Dest No.</th>
              <th className="py-3 px-3.5">Type</th>
              <th className="py-3 px-3.5">Dir</th>
              <th
                className="py-3 px-3.5 cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center gap-1">
                  <span>Date & Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-3.5 text-right cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('durationSeconds')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Duration</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right">Rate</th>
              <th
                className="py-3 px-3.5 text-right cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Cost</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-muted-foreground">
                  No CDR records match the specified filters.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-sky-50/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectRecord(r)}
                >
                  <td className="py-2.5 px-3.5 font-mono text-[11px] font-semibold text-slate-600">
                    {r.cdrId}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {r.extension}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-700 font-medium">{r.department}</td>
                  <td className="py-2.5 px-3.5">
                    <div className="font-mono text-[11px]">
                      <span className="text-slate-400">{r.callerNumber}</span>
                      <span className="text-slate-400 mx-1">&rarr;</span>
                      <span className="font-semibold text-foreground">{r.destinationNumber}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5">{getTypeBadge(r.callType)}</td>
                  <td className="py-2.5 px-3.5">{getDirectionBadge(r.direction)}</td>
                  <td className="py-2.5 px-3.5">
                    <div>
                      <span className="font-medium text-foreground">{r.startDate}</span>
                      <span className="text-muted-foreground font-mono text-[11px] block">{r.startTime}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-medium text-slate-700">
                    {r.durationFormatted}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-muted-foreground text-[11px]">
                    {r.ratePerMinute > 0 ? `€${r.ratePerMinute.toFixed(2)}/m` : 'Free'}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                    {formatCurrency(r.totalAmount)}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">{getStatusBadge(r.billingStatus)}</td>
                  <td className="py-2.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="p-1 rounded-md text-sky-600 hover:text-sky-800 hover:bg-sky-100 transition-colors"
                      title="View CDR Breakdown"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-border bg-slate-50/70 flex items-center justify-between text-xs text-muted-foreground">
        <div>
          Showing <span className="font-semibold text-foreground">{records.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-semibold text-foreground">
            {Math.min(currentPage * pageSize, sortedRecords.length)}
          </span>{' '}
          of <span className="font-semibold text-foreground">{sortedRecords.length}</span> records
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-1.5 rounded-md border border-border bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-md border border-border bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
