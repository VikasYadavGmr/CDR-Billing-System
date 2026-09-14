import React, { useState, useMemo } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Download,
  Eye,
  FileSpreadsheet,
  Globe2,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { formatCurrency, formatRate } from '../../../../utils/billingCalculator';
import { TAX_STATUS_LABELS } from '../../../../utils/taxEngine';
import { exportToCSV } from '../../../../utils/exportUtils';
import type { ComprehensiveCDRRecord } from '../types';

interface CDRRecordsTableProps {
  records: ComprehensiveCDRRecord[];
  totalFilteredCount: number;
  selectedIds: Set<string>;
  isAllFilteredSelected: boolean;
  isLoading: boolean;
  onToggleSelectRecord: (id: string) => void;
  onSelectAllCurrentPage: () => void;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
  onViewRecord: (record: ComprehensiveCDRRecord) => void;
  onResetFilters: () => void;
}

type SortField = 'dateTime' | 'durationSeconds' | 'totalAmount' | 'extension' | 'department' | 'status';
type SortDirection = 'asc' | 'desc';

export const CDRRecordsTable: React.FC<CDRRecordsTableProps> = ({
  records,
  totalFilteredCount,
  selectedIds,
  isAllFilteredSelected,
  isLoading,
  onToggleSelectRecord,
  onSelectAllCurrentPage,
  onSelectAllFiltered,
  onClearSelection,
  onViewRecord,
  onResetFilters,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sortField, setSortField] = useState<SortField>('dateTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sorting
  const sortedRecords = useMemo(() => {
    const list = [...records];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'dateTime') {
        valA = new Date(a.startDate + ' ' + a.startTime).getTime();
        valB = new Date(b.startDate + ' ' + b.startTime).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [records, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const currentRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const isCurrentPageFullySelected =
    currentRecords.length > 0 &&
    currentRecords.every((r) => isAllFilteredSelected || selectedIds.has(r.id));

  const effectiveSelectedCount = isAllFilteredSelected
    ? totalFilteredCount
    : selectedIds.size;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportSelected = (fmt: 'csv' | 'excel' | 'pdf') => {
    const items = isAllFilteredSelected
      ? sortedRecords
      : sortedRecords.filter((r) => selectedIds.has(r.id));

    exportToCSV(
      items.map((r) => ({
        'CDR ID': r.cdrId,
        'Date & Time': r.dateTime,
        User: r.userName,
        Extension: r.extension,
        Device: r.deviceId,
        Department: r.department,
        Destination: r.destinationName,
        'Destination Number': r.destinationNumber,
        'Call Type': r.callType,
        Duration: r.durationFormatted,
        'Billing Country': r.billingCountry,
        'Billing Country Code': r.billingCountryCode,
        'Tax Rule': r.taxRuleId ?? '',
        'Tax Type': r.taxType ?? '',
        'Tax Name': r.taxName ?? '',
        'Tax Rate (%)': r.taxRate,
        'Taxable Amount (EUR)': r.taxableAmount.toFixed(2),
        'Tax Amount (EUR)': r.taxAmount.toFixed(2),
        'Total (EUR)': r.totalAmount.toFixed(2),
        'Tax Status': r.taxStatus,
        Status: r.status,
      })),
      `CDR_Records_Export_${fmt}`
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-center space-x-2 text-teal-700">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading CDR records...</span>
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="h-4 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-full animate-pulse w-5/6" />
          <div className="h-4 bg-slate-100 rounded-full animate-pulse w-4/6" />
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <FileSpreadsheet className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">No CDR Records Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No call detail records match your current search and filter criteria. Try clearing search keywords or resetting telephony filters.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
      {/* Top Action & Bulk Selection Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">
            Showing <strong className="text-slate-900 font-mono">{currentRecords.length}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{totalFilteredCount.toLocaleString()}</strong> records
          </span>

          {effectiveSelectedCount > 0 && (
            <span className="bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-lg border border-teal-200">
              Selected: <strong className="font-mono">{effectiveSelectedCount.toLocaleString()}</strong>
            </span>
          )}
        </div>

        {/* Selection & Export Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSelectAllCurrentPage}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            {isCurrentPageFullySelected ? 'Deselect Page' : 'Select Page'}
          </button>

          <button
            type="button"
            onClick={onSelectAllFiltered}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
              isAllFilteredSelected
                ? 'bg-teal-700 text-white'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            Select All ({totalFilteredCount.toLocaleString()})
          </button>

          {effectiveSelectedCount > 0 && (
            <button
              type="button"
              onClick={onClearSelection}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
            >
              <span>Clear</span>
            </button>
          )}

          {/* Export Actions */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={() => handleExportSelected('csv')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => handleExportSelected('excel')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
              title="Export as Excel"
            >
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Main CDR Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={isCurrentPageFullySelected}
                  onChange={onSelectAllCurrentPage}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </th>
              <th className="py-2.5 px-3">CDR ID</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-teal-700 select-none"
                onClick={() => handleSort('dateTime')}
              >
                <div className="flex items-center gap-1">
                  <span>Date & Time</span>
                  {sortField === 'dateTime' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3">User</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-teal-700 select-none"
                onClick={() => handleSort('extension')}
              >
                <div className="flex items-center gap-1">
                  <span>Extension</span>
                  {sortField === 'extension' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3">Device</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-teal-700 select-none"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center gap-1">
                  <span>Department</span>
                  {sortField === 'department' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3">Destination</th>
              <th className="py-2.5 px-3">Call Type</th>
              <th className="py-2.5 px-3">Billing Country</th>
              <th
                className="py-2.5 px-3 text-right cursor-pointer hover:text-teal-700 select-none"
                onClick={() => handleSort('durationSeconds')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Duration</span>
                  {sortField === 'durationSeconds' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th
                className="py-2.5 px-3 text-right cursor-pointer hover:text-teal-700 select-none"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  {sortField === 'totalAmount' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th
                className="py-2.5 px-3 text-center cursor-pointer hover:text-teal-700 select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Status</span>
                  {sortField === 'status' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11.5px]">
            {currentRecords.map((row) => {
              const isChecked = isAllFilteredSelected || selectedIds.has(row.id);
              const isHighBilling = row.totalAmount > 50;
              const isLongDuration = row.durationSeconds > 1800; // > 30 min

              return (
                <tr
                  key={row.id}
                  onClick={() => onToggleSelectRecord(row.id)}
                  className={`cursor-pointer transition-colors ${
                    isChecked ? 'bg-teal-50/40 hover:bg-teal-50/70' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelectRecord(row.id)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-700 whitespace-nowrap">
                    {row.cdrId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.dateTime}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {row.userName}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{row.extension}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{row.deviceId}</td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{row.destinationName}</div>
                    <div className="font-mono text-[10.5px] text-slate-500">{row.destinationNumber}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        row.callType === 'Internal'
                          ? 'bg-teal-100 text-teal-800'
                          : row.callType === 'External'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {row.callType === 'International' && <Globe2 className="w-2.5 h-2.5" />}
                      {row.callType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[10.5px]">
                      {row.billingCountryCode}
                    </span>
                    <span
                      className={`block text-[10px] mt-0.5 font-medium ${
                        row.taxStatus === 'TAX_REVIEW_REQUIRED' ? 'text-rose-600' : 'text-slate-400'
                      }`}
                      title={TAX_STATUS_LABELS[row.taxStatus]}
                    >
                      {row.taxRate > 0
                        ? `${row.taxType} ${formatRate(row.taxRate)}`
                        : TAX_STATUS_LABELS[row.taxStatus]}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                    <div className="flex items-center justify-end gap-1">
                      {isLongDuration && (
                        <span title="Long duration call (>30m)">
                          <Clock className="w-3 h-3 text-amber-500" />
                        </span>
                      )}
                      <span>{row.durationFormatted}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-800">
                    <div className="flex items-center justify-end gap-1">
                      {isHighBilling && (
                        <span title="High billing call (>€50)">
                          <Coins className="w-3 h-3 text-amber-600" />
                        </span>
                      )}
                      <span>{formatCurrency(row.totalAmount)}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant={
                        row.status === 'Completed'
                          ? 'success'
                          : row.status === 'Busy'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onViewRecord(row)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-700 font-semibold text-[11px] transition-colors shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:px-5 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div>
            Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
            <strong className="text-slate-900">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-0.5 rounded border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
