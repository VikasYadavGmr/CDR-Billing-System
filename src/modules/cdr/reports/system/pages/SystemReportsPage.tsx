import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  PhoneCall,
} from 'lucide-react';
import { Badge } from '../../../../../components/common/Badge';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { ReportTable } from '../../user/components/ReportTable';
import type { ReportColumn } from '../../user/types';
import { SystemCharts } from '../components/SystemCharts';
import { SystemHealthAndCMR } from '../components/SystemHealthAndCMR';
import { SystemReportFilter } from '../components/SystemReportFilter';
import { SystemSummaryCards } from '../components/SystemSummaryCards';
import {
  callStatusDistribution,
  callTypeDistribution,
  cmrQualitySummary,
  dailyBillingTrend,
  dailySystemSummaryData,
  dailyVolumeTrend,
  departmentUsageData,
  extensionUsageData,
  monthlyVolumeTrend,
  peakUsageMetrics,
  systemHealthIndicators,
  systemSummaryKPIs,
  topDepartmentsByBilling,
  topExtensionsByUsage,
  weeklyVolumeTrend,
} from '../mock/systemReportsData';
import type {
  DailySystemSummaryRow,
  DepartmentUsageRow,
  ExtensionUsageRow,
  SystemReportFilterValues,
} from '../types';

type SystemSubTab = 'overview' | 'departments' | 'extensions' | 'daily';

export const SystemReportsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SystemSubTab>('overview');

  const [filters, setFilters] = useState<SystemReportFilterValues>({
    datePreset: 'thisMonth',
    fromDate: '2026-09-01',
    toDate: '2026-09-10',
    department: 'All Departments',
    callType: 'All',
    callStatus: 'All',
    extensionRange: '',
    searchQuery: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<SystemReportFilterValues>({
    ...filters,
  });

  const handleApply = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    const defaultVal: SystemReportFilterValues = {
      datePreset: 'thisMonth',
      fromDate: '2026-09-01',
      toDate: '2026-09-10',
      department: 'All Departments',
      callType: 'All',
      callStatus: 'All',
      extensionRange: '',
      searchQuery: '',
    };
    setFilters(defaultVal);
    setAppliedFilters(defaultVal);
  };

  // Filtered Department Usage
  const filteredDepartments = useMemo(() => {
    return departmentUsageData.filter((d) => {
      if (appliedFilters.department !== 'All Departments' && d.department !== appliedFilters.department) {
        return false;
      }
      if (appliedFilters.searchQuery) {
        const q = appliedFilters.searchQuery.toLowerCase();
        return d.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [appliedFilters]);

  // Filtered Extension Usage
  const filteredExtensions = useMemo(() => {
    return extensionUsageData.filter((ext) => {
      if (appliedFilters.department !== 'All Departments' && ext.department !== appliedFilters.department) {
        return false;
      }
      if (appliedFilters.extensionRange && !ext.extension.toLowerCase().includes(appliedFilters.extensionRange.toLowerCase())) {
        return false;
      }
      if (appliedFilters.searchQuery) {
        const q = appliedFilters.searchQuery.toLowerCase();
        return (
          ext.extension.toLowerCase().includes(q) ||
          ext.department.toLowerCase().includes(q) ||
          ext.status.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appliedFilters]);

  // Filtered Daily Summary
  const filteredDailySummary = useMemo(() => {
    return dailySystemSummaryData.filter((row) => {
      if (appliedFilters.searchQuery) {
        const q = appliedFilters.searchQuery.toLowerCase();
        return row.date.toLowerCase().includes(q);
      }
      return true;
    });
  }, [appliedFilters]);

  // Columns for Department Usage Table
  const deptColumns: ReportColumn<DepartmentUsageRow>[] = [
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-slate-900 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
          {row.department}
        </span>
      ),
    },
    {
      key: 'activeExtensions',
      label: 'Active Exts',
      sortable: true,
      align: 'right',
      className: 'font-mono text-slate-700 font-semibold',
    },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-bold text-slate-900">{row.totalCalls.toLocaleString()}</span>,
    },
    {
      key: 'totalDuration',
      label: 'Total Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono text-slate-700',
    },
    {
      key: 'internalCalls',
      label: 'Internal',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-indigo-700 font-semibold">{row.internalCalls.toLocaleString()}</span>,
    },
    {
      key: 'externalCalls',
      label: 'External',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-blue-700 font-semibold">{row.externalCalls.toLocaleString()}</span>,
    },
    {
      key: 'internationalCalls',
      label: 'International',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-amber-700 font-semibold">{row.internationalCalls.toLocaleString()}</span>,
    },
    {
      key: 'billing',
      label: 'Billing (₹)',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-teal-800">{formatCurrency(row.billing)}</span>
      ),
    },
    {
      key: 'failedCalls',
      label: 'Failed',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-rose-600 font-semibold">{row.failedCalls}</span>,
    },
  ];

  // Columns for Extension Usage Table
  const extColumns: ReportColumn<ExtensionUsageRow>[] = [
    {
      key: 'extension',
      label: 'Extension',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-teal-700">{row.extension}</span>,
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
      render: (row) => <span className="font-bold text-slate-900">{row.totalCalls}</span>,
    },
    {
      key: 'totalDuration',
      label: 'Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono text-slate-700 font-semibold',
    },
    {
      key: 'internalCalls',
      label: 'Internal',
      sortable: true,
      align: 'right',
      className: 'font-mono text-indigo-700',
    },
    {
      key: 'externalCalls',
      label: 'External',
      sortable: true,
      align: 'right',
      className: 'font-mono text-blue-700',
    },
    {
      key: 'internationalCalls',
      label: 'International',
      sortable: true,
      align: 'right',
      className: 'font-mono text-amber-700',
    },
    {
      key: 'billing',
      label: 'Billing',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-teal-800">{formatCurrency(row.billing)}</span>
      ),
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      sortable: true,
      className: 'text-[11px] text-slate-500 font-mono',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge
          variant={row.status === 'Active' ? 'success' : row.status === 'Idle' ? 'warning' : 'neutral'}
          size="sm"
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  // Columns for Daily System Summary
  const dailyColumns: ReportColumn<DailySystemSummaryRow>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      className: 'font-bold text-slate-900',
    },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-extrabold text-slate-900">{row.totalCalls.toLocaleString()}</span>,
    },
    {
      key: 'completed',
      label: 'Completed',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold text-emerald-700">{row.completed.toLocaleString()}</span>,
    },
    {
      key: 'failed',
      label: 'Failed',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-semibold text-rose-600">{row.failed}</span>,
    },
    {
      key: 'internal',
      label: 'Internal',
      sortable: true,
      align: 'right',
      className: 'font-mono text-indigo-700',
    },
    {
      key: 'external',
      label: 'External',
      sortable: true,
      align: 'right',
      className: 'font-mono text-blue-700',
    },
    {
      key: 'international',
      label: 'International',
      sortable: true,
      align: 'right',
      className: 'font-mono text-amber-700',
    },
    {
      key: 'totalDuration',
      label: 'Total Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono text-slate-800 font-semibold',
    },
    {
      key: 'totalBilling',
      label: 'Total Billing',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-extrabold text-teal-800">{formatCurrency(row.totalBilling)}</span>
      ),
    },
    {
      key: 'averageDuration',
      label: 'Avg Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono text-slate-600',
    },
  ];

  return (
    <div className="space-y-4" id="system-reports-printable-area">
      {/* 1. Page Filter Bar */}
      <SystemReportFilter
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
        onReset={handleReset}
        exportData={
          activeSubTab === 'departments'
            ? (filteredDepartments as unknown as Record<string, unknown>[])
            : activeSubTab === 'extensions'
            ? (filteredExtensions as unknown as Record<string, unknown>[])
            : (filteredDailySummary as unknown as Record<string, unknown>[])
        }
        exportFilename={`Airport_System_Report_${activeSubTab}`}
        printElementId="system-reports-printable-area"
      />

      {/* 2. System Summary KPI Cards */}
      <SystemSummaryCards kpis={systemSummaryKPIs} />

      {/* 3. Section Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'overview' as SystemSubTab, label: 'Overview & Charts', icon: BarChart3 },
            { id: 'departments' as SystemSubTab, label: 'Department-wise Usage', icon: Building2 },
            { id: 'extensions' as SystemSubTab, label: 'Extension Usage Report', icon: PhoneCall },
            { id: 'daily' as SystemSubTab, label: 'Daily System Summary', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 px-2 font-medium hidden sm:block">
          Cisco CUCM CDR Release 15 Compatible • System Wide
        </div>
      </div>

      {/* 4. Active Tab Content */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Charts Component (Volume & Billing Trends, Distributions, Peak Hours) */}
          <SystemCharts
            volumeTrend={dailyVolumeTrend}
            weeklyTrend={weeklyVolumeTrend}
            monthlyTrend={monthlyVolumeTrend}
            billingTrend={dailyBillingTrend}
            callTypeDist={callTypeDistribution}
            callStatusDist={callStatusDistribution}
            peakUsage={peakUsageMetrics}
          />

          {/* System Health & CMR Call Quality */}
          <SystemHealthAndCMR cmr={cmrQualitySummary} health={systemHealthIndicators} />
        </div>
      )}

      {/* 5. Department-wise System Report */}
      {activeSubTab === 'departments' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Department-wise Telephone Usage ({filteredDepartments.length} Divisions)
                </h3>
                <p className="text-[11px] text-slate-500">Comprehensive breakdown of active extensions, calls, and telephone billing per airport department</p>
              </div>
            </div>

            <ReportTable
              data={filteredDepartments as unknown as Record<string, unknown>[]}
              columns={deptColumns as unknown as ReportColumn<Record<string, unknown>>[]}
              rowKey={(r) => String(r.id)}
              searchable
              selectable
              pageSizeOptions={[5, 10, 20]}
            />
          </div>

          {/* Top 10 Departments by Billing */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Top 10 Departments by Billing</h3>
                  <p className="text-[11px] text-slate-500">Ranked by gross telephone expenditure and system share</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3 text-center">Rank</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Calls Processed</th>
                    <th className="py-2.5 px-3 text-right">Duration</th>
                    <th className="py-2.5 px-3 text-right">Billing (₹)</th>
                    <th className="py-2.5 px-3 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topDepartmentsByBilling.map((row) => (
                    <tr key={row.rank} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-extrabold ${
                            row.rank === 1
                              ? 'bg-amber-100 text-amber-800'
                              : row.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : row.rank === 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{row.department}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.calls.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.duration}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-800">
                        {formatCurrency(row.billing)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-700">
                        {row.billingPct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Extension Usage Report */}
      {activeSubTab === 'extensions' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Extension Usage Report ({filteredExtensions.length} Lines)
                </h3>
                <p className="text-[11px] text-slate-500">Full audit log of active airport telephone extensions, traffic directions, and carrier charges</p>
              </div>
            </div>

            <ReportTable
              data={filteredExtensions as unknown as Record<string, unknown>[]}
              columns={extColumns as unknown as ReportColumn<Record<string, unknown>>[]}
              rowKey={(r) => String(r.id)}
              searchable
              selectable
              pageSizeOptions={[5, 10, 20]}
            />
          </div>

          {/* Top 10 Extensions by Usage */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Top 10 Extensions by Usage</h3>
                  <p className="text-[11px] text-slate-500">Highest volume physical & SIP lines across the airport terminal network</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3 text-center">Rank</th>
                    <th className="py-2.5 px-3">Extension</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Calls</th>
                    <th className="py-2.5 px-3 text-right">Duration</th>
                    <th className="py-2.5 px-3 text-right">Total Billing (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topExtensionsByUsage.map((row) => (
                    <tr key={row.rank} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-extrabold ${
                            row.rank === 1
                              ? 'bg-amber-100 text-amber-800'
                              : row.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : row.rank === 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{row.extension}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{row.department}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{row.calls}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.duration}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-800">
                        {formatCurrency(row.billing)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Daily System Summary Table */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Daily System Summary Log ({filteredDailySummary.length} Days)
                </h3>
                <p className="text-[11px] text-slate-500">Day-by-day executive overview of telephone call volume, completion rate, talk time and carrier expenditure</p>
              </div>
            </div>

            <ReportTable
              data={filteredDailySummary as unknown as Record<string, unknown>[]}
              columns={dailyColumns as unknown as ReportColumn<Record<string, unknown>>[]}
              rowKey={(r) => String(r.date)}
              searchable
              selectable
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
