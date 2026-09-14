import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Archive,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  History,
  Layers,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import type { ExportHistoryItem, ExportStats } from '../types';

interface ExportHistorySectionProps {
  stats: ExportStats;
  historyItems: ExportHistoryItem[];
  onDownloadHistoryItem: (item: ExportHistoryItem) => void;
}

export const ExportHistorySection: React.FC<ExportHistorySectionProps> = ({
  stats,
  historyItems,
  onDownloadHistoryItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      if (typeFilter !== 'ALL' && !item.exportType.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      if (formatFilter !== 'ALL' && item.format.toLowerCase() !== formatFilter.toLowerCase()) {
        return false;
      }
      if (statusFilter !== 'ALL' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = item.exportId.toLowerCase().includes(query);
        const matchesFile = item.fileName.toLowerCase().includes(query);
        const matchesUser = item.generatedBy.toLowerCase().includes(query);
        if (!matchesId && !matchesFile && !matchesUser) return false;
      }
      return true;
    });
  }, [historyItems, typeFilter, formatFilter, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Exports</span>
            <Archive className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.totalExports}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">CDR Exports</span>
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.cdrExports}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">CMR Exports</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.cmrExports}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Records Exported</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.recordsExported}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Failed Exports</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl font-bold font-mono text-rose-700 mt-1">{stats.failedExports}</p>
        </div>
      </div>

      {/* 2. Export History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filter & Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-teal-600" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Export Audit Log & History
              </h3>
              <p className="text-[11px] text-slate-500">
                Log of all generated telecom export archives and historical files
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID or File..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Types</option>
              <option value="CDR">CDR Reports</option>
              <option value="CMR">CMR QoS Reports</option>
              <option value="Billing">Billing CDRs</option>
              <option value="Quality">Quality Issues</option>
            </select>

            {/* Format Filter */}
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Formats</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="ALL">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Export ID</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Date Range</th>
                <th className="py-2.5 px-3 text-right">Records</th>
                <th className="py-2.5 px-3">Generated By</th>
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11.5px]">
              {currentItems.map((item) => (
                <tr key={item.exportId} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{item.exportId}</td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{item.dateTime}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {item.exportType}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.format}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    {item.dateRange}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {item.recordCount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{item.generatedBy}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 max-w-[200px] truncate" title={item.fileName}>
                    {item.fileName} ({item.fileSize})
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant={
                        item.status === 'Completed'
                          ? 'success'
                          : item.status === 'Processing'
                          ? 'info'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {item.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => onDownloadHistoryItem(item)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-700 font-semibold text-[11px] transition-colors shadow-2xs"
                        title="Download archive"
                      >
                        <Download className="w-3 h-3 text-teal-600" />
                        <span>Download</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-xs text-slate-500">
                    No export history found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 sm:px-5 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{currentItems.length}</strong> of{' '}
            <strong className="text-slate-900">{filteredItems.length}</strong> export logs
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
    </div>
  );
};
