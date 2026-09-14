import React, { useMemo, useState } from 'react';
import {
  Coins,
  TrendingUp,
  Users,
  Award,
  Search,
  RotateCcw,
  BarChart2,
} from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { ExportReportButton } from '../components/ExportReportButton';
import { ReportTable } from '../components/ReportTable';
import {
  reportCallTypes,
  reportDepartments,
  reportLocations,
  topChargeRows,
  topCostSummary,
  topNOptions,
} from '../mock/userReportsData';
import type { ReportColumn, TopChargeRow } from '../types';

export const TopUsersByCost: React.FC = () => {
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

  const [chartTopN, setChartTopN] = useState<number>(5);

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
    let rows = topChargeRows.filter((row) => {
      if (appliedFilters.department !== 'All Departments' && row.department !== appliedFilters.department) {
        return false;
      }
      return true;
    });
    return rows.slice(0, appliedFilters.topN);
  }, [appliedFilters]);

  const maxCost = useMemo(() => {
    return Math.max(...topChargeRows.map((r) => r.totalCost), 1);
  }, []);

  const chartRows = useMemo(() => {
    return topChargeRows.slice(0, chartTopN);
  }, [chartTopN]);

  const columns: ReportColumn<TopChargeRow>[] = [
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
      key: 'employeeId',
      label: 'Employee ID',
      sortable: true,
      className: 'font-mono text-slate-700 font-semibold',
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
      className: 'font-mono text-slate-700',
    },
    {
      key: 'billableCalls',
      label: 'Billable Calls',
      sortable: true,
      align: 'right',
      className: 'font-semibold text-teal-700',
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
            <span className="text-xs font-bold text-slate-900">Top Users by Cost Filters</span>
            <span className="text-xs text-slate-400 font-medium">• Identify highest telephone expenditure</span>
          </div>
          <ExportReportButton
            filename="Top_Users_By_Cost_Report"
            data={filteredRows as unknown as Record<string, unknown>[]}
            headers={[
              { key: 'rank', label: 'Rank' },
              { key: 'user', label: 'User' },
              { key: 'employeeId', label: 'Employee ID' },
              { key: 'extension', label: 'Extension' },
              { key: 'department', label: 'Department' },
              { key: 'totalCalls', label: 'Total Calls' },
              { key: 'totalDuration', label: 'Total Duration' },
              { key: 'billableCalls', label: 'Billable Calls' },
              { key: 'totalCost', label: 'Total Cost' },
            ]}
            printElementId="top-cost-content"
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

      <div id="top-cost-content" className="space-y-4">
        {/* 2. SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Billing</p>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-mono font-extrabold text-teal-800 mt-2">{formatCurrency(topCostSummary.totalBilling)}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average User Cost</p>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-mono font-extrabold text-slate-900 mt-2">{formatCurrency(topCostSummary.averageUserCost)}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Highest User Cost</p>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-mono font-extrabold text-amber-700 mt-2">{formatCurrency(topCostSummary.highestUserCost)}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Billable Users</p>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{topCostSummary.billableUsers}</p>
          </div>
        </div>

        {/* 3. HORIZONTAL BAR CHART */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">User vs Total Cost (Horizontal Analysis)</h3>
                <p className="text-[11px] text-slate-500">Expenditure comparison across highest billing extensions</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[5, 10, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setChartTopN(n)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    chartTopN === n
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Top {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {chartRows.map((r) => {
              const pct = Math.max(8, Math.round((r.totalCost / maxCost) * 100));
              return (
                <div key={r.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-400 w-5">#{r.rank}</span>
                      <span className="font-bold text-slate-900">{r.user}</span>
                      <span className="text-[11px] text-slate-500">({r.department} • Ext {r.extension})</span>
                    </div>
                    <span className="font-mono font-extrabold text-teal-800">{formatCurrency(r.totalCost)}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-700 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
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

        {/* 4. TABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top Ranked Cost Generators ({filteredRows.length} Users)
            </h3>
            <span className="text-[11px] text-slate-500">Sorted by Highest Total Expense</span>
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
