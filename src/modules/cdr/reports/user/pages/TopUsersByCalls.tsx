import React, { useMemo, useState } from 'react';
import {
  BarChart2,
  RotateCcw,
  Search,
} from 'lucide-react';
import { ExportReportButton } from '../components/ExportReportButton';
import { ReportTable } from '../components/ReportTable';
import {
  reportCallTypes,
  reportDepartments,
  reportDirections,
  reportLocations,
  topCallsRows,
  topNOptions,
} from '../mock/userReportsData';
import type { ReportColumn, TopCallsRow } from '../types';

export const TopUsersByCalls: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string>('2026-09-01');
  const [dateTo, setDateTo] = useState<string>('2026-09-10');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('All Call Types');
  const [directionFilter, setDirectionFilter] = useState<string>('All Directions');
  const [topN, setTopN] = useState<number>(10);

  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: '2026-09-01',
    dateTo: '2026-09-10',
    department: 'All Departments',
    location: 'All Locations',
    callType: 'All Call Types',
    direction: 'All Directions',
    topN: 10,
  });

  const handleSearch = () => {
    setAppliedFilters({
      dateFrom,
      dateTo,
      department: departmentFilter,
      location: locationFilter,
      callType: callTypeFilter,
      direction: directionFilter,
      topN,
    });
  };

  const handleReset = () => {
    setDateFrom('2026-09-01');
    setDateTo('2026-09-10');
    setDepartmentFilter('All Departments');
    setLocationFilter('All Locations');
    setCallTypeFilter('All Call Types');
    setDirectionFilter('All Directions');
    setTopN(10);
    setAppliedFilters({
      dateFrom: '2026-09-01',
      dateTo: '2026-09-10',
      department: 'All Departments',
      location: 'All Locations',
      callType: 'All Call Types',
      direction: 'All Directions',
      topN: 10,
    });
  };

  const filteredRows = useMemo(() => {
    let rows = topCallsRows.filter((row) => {
      if (appliedFilters.department !== 'All Departments' && row.department !== appliedFilters.department) {
        return false;
      }
      return true;
    });
    return rows.slice(0, appliedFilters.topN);
  }, [appliedFilters]);

  const maxCalls = useMemo(() => {
    return Math.max(...filteredRows.map((r) => r.totalCalls), 1);
  }, [filteredRows]);

  const columns: ReportColumn<TopCallsRow>[] = [
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
      key: 'incomingCalls',
      label: 'Incoming Calls',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-emerald-700">{row.incomingCalls}</span>
      ),
    },
    {
      key: 'outgoingCalls',
      label: 'Outgoing Calls',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-sky-700">{row.outgoingCalls}</span>
      ),
    },
    {
      key: 'internalCalls',
      label: 'Internal Calls',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-indigo-600">{row.internalCalls}</span>
      ),
    },
    {
      key: 'failedCalls',
      label: 'Failed Calls',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-rose-600">{row.failedCalls}</span>
      ),
    },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-extrabold text-slate-900">{row.totalCalls}</span>
      ),
    },
    {
      key: 'totalDuration',
      label: 'Total Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono font-bold text-slate-800',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. FILTER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900">Top Users by Number of Calls Filters</span>
            <span className="text-xs text-slate-400 font-medium">• Analyze high-volume call generators</span>
          </div>
          <ExportReportButton
            filename="Top_Users_By_Calls_Report"
            data={filteredRows as unknown as Record<string, unknown>[]}
            headers={[
              { key: 'rank', label: 'Rank' },
              { key: 'user', label: 'User' },
              { key: 'extension', label: 'Extension' },
              { key: 'department', label: 'Department' },
              { key: 'incomingCalls', label: 'Incoming Calls' },
              { key: 'outgoingCalls', label: 'Outgoing Calls' },
              { key: 'internalCalls', label: 'Internal Calls' },
              { key: 'failedCalls', label: 'Failed Calls' },
              { key: 'totalCalls', label: 'Total Calls' },
              { key: 'totalDuration', label: 'Total Duration' },
            ]}
            printElementId="top-calls-content"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
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

          {/* Call Direction */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Call Direction</label>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportDirections.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
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

      <div id="top-calls-content" className="space-y-4">
        {/* 2. STACKED / BREAKDOWN BAR CHART */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Call Volume Breakdown by User</h3>
                <p className="text-[11px] text-slate-500">Distribution of Incoming, Outgoing, Internal & Failed calls</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Incoming</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-slate-600">Outgoing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-slate-600">Internal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Failed</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredRows.slice(0, 8).map((r) => {
              const inPct = Math.round((r.incomingCalls / r.totalCalls) * 100);
              const outPct = Math.round((r.outgoingCalls / r.totalCalls) * 100);
              const intPct = Math.round((r.internalCalls / r.totalCalls) * 100);
              const failPct = 100 - inPct - outPct - intPct;
              const totalWidthPct = Math.max(15, Math.round((r.totalCalls / maxCalls) * 100));

              return (
                <div key={r.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-400 w-5">#{r.rank}</span>
                      <span className="font-bold text-slate-900">{r.user}</span>
                      <span className="text-[11px] text-slate-500">({r.department} • Ext {r.extension})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">
                        In: {r.incomingCalls} | Out: {r.outgoingCalls} | Int: {r.internalCalls} | Fail: {r.failedCalls}
                      </span>
                      <span className="font-extrabold text-slate-900 font-mono">{r.totalCalls} Calls</span>
                    </div>
                  </div>

                  <div className="h-4.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 flex">
                    <div
                      className="h-full flex rounded-full overflow-hidden transition-all duration-500"
                      style={{ width: `${totalWidthPct}%` }}
                    >
                      <div style={{ width: `${inPct}%` }} className="bg-emerald-500 h-full" title={`Incoming: ${r.incomingCalls}`} />
                      <div style={{ width: `${outPct}%` }} className="bg-sky-500 h-full" title={`Outgoing: ${r.outgoingCalls}`} />
                      <div style={{ width: `${intPct}%` }} className="bg-indigo-500 h-full" title={`Internal: ${r.internalCalls}`} />
                      <div style={{ width: `${failPct}%` }} className="bg-rose-500 h-full" title={`Failed: ${r.failedCalls}`} />
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
              Call Traffic Summary Table ({filteredRows.length} Users)
            </h3>
            <span className="text-[11px] text-slate-500">Breakdown of Traffic Direction & Performance</span>
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
