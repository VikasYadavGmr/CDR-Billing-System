import React, { useMemo, useState } from 'react';
import {
  Clock,
  RotateCcw,
  Search,
  Timer,
  BarChart2,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { ExportReportButton } from '../components/ExportReportButton';
import { ReportTable } from '../components/ReportTable';
import {
  reportCallTypes,
  reportDepartments,
  reportLocations,
  topDurationRows,
  topNOptions,
} from '../mock/userReportsData';
import type { ReportColumn, TopDurationRow } from '../types';

export const TopUsersByDuration: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string>('2026-09-01');
  const [dateTo, setDateTo] = useState<string>('2026-09-10');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('All Call Types');
  const [topN, setTopN] = useState<number>(10);

  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '2026-09-01',
    dateTo: '2026-09-10',
    department: 'All Departments',
    location: 'All Locations',
    callType: 'All Call Types',
    topN: 10,
  });

  const [metric, setMetric] = useState<'total' | 'billable' | 'average'>('total');

  const handleSearch = () => {
    setAppliedFilters({
      dateFrom,
      dateTo,
      department: departmentFilter,
      location: locationFilter,
      callType: callTypeFilter,
      topN,
    });
  };

  const handleReset = () => {
    setDateFrom('2026-09-01');
    setDateTo('2026-09-10');
    setDepartmentFilter('All Departments');
    setLocationFilter('All Locations');
    setCallTypeFilter('All Call Types');
    setTopN(10);
    setAppliedFilters({
      dateFrom: '2026-09-01',
      dateTo: '2026-09-10',
      department: 'All Departments',
      location: 'All Locations',
      callType: 'All Call Types',
      topN: 10,
    });
  };

  const filteredRows = useMemo(() => {
    let rows = topDurationRows.filter((row) => {
      if (appliedFilters.department !== 'All Departments' && row.department !== appliedFilters.department) {
        return false;
      }
      return true;
    });
    return rows.slice(0, appliedFilters.topN);
  }, [appliedFilters]);

  const maxMinutes = useMemo(() => {
    if (metric === 'average') {
      return Math.max(...filteredRows.map((r) => r.averageDurationMinutes), 1);
    }
    if (metric === 'billable') {
      return Math.max(...filteredRows.map((r) => r.billableDurationMinutes), 1);
    }
    return Math.max(...filteredRows.map((r) => r.totalDurationMinutes), 1);
  }, [filteredRows, metric]);

  const columns: ReportColumn<TopDurationRow>[] = [
    {
      key: 'rank',
      label: 'Rank',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${
            row.rank === 1
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : row.rank === 2
              ? 'bg-slate-200 text-slate-800 border border-slate-300'
              : row.rank === 3
              ? 'bg-orange-100 text-orange-800 border border-orange-300'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.rank}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-900">{row.user}</span>,
    },
    {
      key: 'extension',
      label: 'Extension',
      sortable: true,
      className: 'font-mono font-bold text-teal-700',
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      className: 'text-slate-700 font-medium',
    },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      sortable: true,
      align: 'right',
      className: 'font-semibold text-slate-800',
    },
    {
      key: 'totalDuration',
      label: 'Total Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono font-bold text-slate-900',
    },
    {
      key: 'averageCallDuration',
      label: 'Average Call Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono text-slate-700',
    },
    {
      key: 'billableDuration',
      label: 'Billable Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono font-semibold text-teal-700',
    },
    {
      key: 'totalCost',
      label: 'Total Cost',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-teal-800">{formatCurrency(row.totalCost)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. FILTER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900">Top Users by Duration Filters</span>
            <span className="text-xs text-slate-400 font-medium">• Identify longest talk-time talkers</span>
          </div>
          <ExportReportButton
            filename="Top_Users_By_Duration_Report"
            data={filteredRows as unknown as Record<string, unknown>[]}
            headers={[
              { key: 'rank', label: 'Rank' },
              { key: 'user', label: 'User' },
              { key: 'extension', label: 'Extension' },
              { key: 'department', label: 'Department' },
              { key: 'totalCalls', label: 'Total Calls' },
              { key: 'totalDuration', label: 'Total Duration' },
              { key: 'averageCallDuration', label: 'Average Call Duration' },
              { key: 'billableDuration', label: 'Billable Duration' },
              { key: 'totalCost', label: 'Total Cost' },
            ]}
            printElementId="top-duration-content"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Date From */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportLocations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Call Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Call Type</label>
            <select
              value={callTypeFilter}
              onChange={(e) => setCallTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportCallTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Top N */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Top N</label>
            <select
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {topNOptions.map((n) => (
                <option key={n} value={n}>
                  Top {n} Users
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      <div id="top-duration-content" className="space-y-4">
        {/* 2. BAR CHART WITH METRIC SELECTION */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">User vs Duration Analytics</h3>
                <p className="text-[11px] text-slate-500">Compare talk-time durations across extensions</p>
              </div>
            </div>

            {/* Metric Selector Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMetric('total')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  metric === 'total'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Total Duration</span>
              </button>
              <button
                type="button"
                onClick={() => setMetric('billable')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  metric === 'billable'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Billable Duration</span>
              </button>
              <button
                type="button"
                onClick={() => setMetric('average')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  metric === 'average'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Average Duration</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredRows.slice(0, 8).map((r) => {
              const currentVal =
                metric === 'average'
                  ? r.averageDurationMinutes
                  : metric === 'billable'
                  ? r.billableDurationMinutes
                  : r.totalDurationMinutes;

              const labelStr =
                metric === 'average'
                  ? r.averageCallDuration
                  : metric === 'billable'
                  ? r.billableDuration
                  : r.totalDuration;

              const pct = Math.max(10, Math.round((currentVal / maxMinutes) * 100));

              return (
                <div key={r.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-400 w-5">#{r.rank}</span>
                      <span className="font-bold text-slate-900">{r.user}</span>
                      <span className="text-[11px] text-slate-500">({r.department} • Ext {r.extension})</span>
                    </div>
                    <span className="font-mono font-extrabold text-slate-900">{labelStr}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
                        metric === 'average'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : metric === 'billable'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-700'
                          : 'bg-gradient-to-r from-sky-500 to-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    >
                      <span className="text-[9px] font-bold text-white leading-none">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. TABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top Talk-Time Rank Table ({filteredRows.length} Users)
            </h3>
            <span className="text-[11px] text-slate-500">Includes Total, Average and Billable Talk Times</span>
          </div>

          <ReportTable
            data={filteredRows as unknown as Record<string, unknown>[]}
            columns={columns as unknown as ReportColumn<Record<string, unknown>>[]}
            rowKey={(r) => String(r.rank)}
            searchable
            selectable
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </div>
  );
};
