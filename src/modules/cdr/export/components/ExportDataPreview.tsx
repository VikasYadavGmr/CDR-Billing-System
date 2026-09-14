import React, { useState } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { formatCurrency } from '../../../../utils/billingCalculator';
import type { CdrExportRecord, CmrExportRecord, ExportMainTab } from '../types';

interface ExportDataPreviewProps {
  mainTab: ExportMainTab;
  cdrRecords: CdrExportRecord[];
  cmrRecords: CmrExportRecord[];
  totalFilteredCount: number;
  selectedIds: Set<string>;
  isAllFilteredSelected: boolean;
  onToggleSelectRecord: (id: string) => void;
  onSelectAllCurrentPage: () => void;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
}

export const ExportDataPreview: React.FC<ExportDataPreviewProps> = ({
  mainTab,
  cdrRecords,
  cmrRecords,
  totalFilteredCount,
  selectedIds,
  isAllFilteredSelected,
  onToggleSelectRecord,
  onSelectAllCurrentPage,
  onSelectAllFiltered,
  onClearSelection,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const records = mainTab === 'cdr' ? cdrRecords : cmrRecords;
  const totalRecords = records.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const currentRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isCurrentPageFullySelected =
    currentRecords.length > 0 &&
    currentRecords.every((r) => isAllFilteredSelected || selectedIds.has(r.id));

  const effectiveSelectedCount = isAllFilteredSelected
    ? totalFilteredCount
    : selectedIds.size;

  if (totalRecords === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/80">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Records Found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No CDR/CMR records match the selected filters. Try adjusting the date range or telephone parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
      {/* Preview Header & Selection Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {mainTab === 'cdr' ? 'CDR Records Preview' : 'CMR QoS Records Preview'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Showing {Math.min(pageSize, currentRecords.length)} of {totalFilteredCount.toLocaleString()} total filtered records
          </p>
        </div>

        {/* Selection Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80">
            Selected:{' '}
            <strong className="text-teal-800 font-mono">
              {effectiveSelectedCount.toLocaleString()} records
            </strong>
          </span>

          <button
            type="button"
            onClick={onSelectAllCurrentPage}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
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
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {mainTab === 'cdr' ? (
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
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Extension</th>
                <th className="py-2.5 px-3">Device</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Dest. Number</th>
                <th className="py-2.5 px-3">Call Type</th>
                <th className="py-2.5 px-3 text-right">Duration</th>
                <th className="py-2.5 px-3">Tariff</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11.5px]">
              {(currentRecords as CdrExportRecord[]).map((row) => {
                const isChecked = isAllFilteredSelected || selectedIds.has(row.id);
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
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{row.cdrId}</td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.dateTime}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {row.user}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {row.extension}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{row.device}</td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{row.department}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                      {row.destination}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{row.destinationNumber}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          row.callType === 'Internal'
                            ? 'bg-teal-100 text-teal-800'
                            : row.callType === 'External'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {row.callType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                      {row.duration}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[10.5px]">{row.tariff}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-800">
                      {formatCurrency(row.amount)}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
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
                <th className="py-2.5 px-3">CMR ID</th>
                <th className="py-2.5 px-3">CDR ID</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Device</th>
                <th className="py-2.5 px-3">Extension</th>
                <th className="py-2.5 px-3 text-right">Duration</th>
                <th className="py-2.5 px-3 text-center">Quality</th>
                <th className="py-2.5 px-3 text-right">Packet Loss</th>
                <th className="py-2.5 px-3 text-right">Jitter</th>
                <th className="py-2.5 px-3 text-right">Latency</th>
                <th className="py-2.5 px-3">Quality Issue</th>
                <th className="py-2.5 px-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11.5px]">
              {(currentRecords as CmrExportRecord[]).map((row) => {
                const isChecked = isAllFilteredSelected || selectedIds.has(row.id);
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
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{row.cmrId}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{row.cdrId}</td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.dateTime}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">{row.device}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {row.extension}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">{row.duration}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge
                        variant={
                          row.qualityStatus === 'Good'
                            ? 'success'
                            : row.qualityStatus === 'Fair'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {row.qualityStatus}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.packetLoss}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.jitter}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.latency}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {row.qualityIssue === 'None' ? (
                        <span className="text-slate-400">None</span>
                      ) : (
                        <span className="text-rose-700 font-bold">{row.qualityIssue}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {row.score}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:px-5 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <div>
          Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
          <strong className="text-slate-900">{totalPages}</strong>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
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
