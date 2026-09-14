import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Building2,
  Cpu,
  Eye,
  PhoneOff,
} from 'lucide-react';
import { Badge } from '../../../../../components/common/Badge';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { ReportTable } from '../../user/components/ReportTable';
import type { ReportColumn } from '../../user/types';
import { DeviceCharts } from '../components/DeviceCharts';
import { DeviceDetailDrawer } from '../components/DeviceDetailDrawer';
import { DeviceInventorySummary } from '../components/DeviceInventorySummary';
import { DeviceReportFilter } from '../components/DeviceReportFilter';
import { DeviceSummaryCards } from '../components/DeviceSummaryCards';
import {
  departmentDeviceUsage,
  deviceBillingTrendData,
  deviceInventorySummary,
  deviceQualityIssues,
  deviceStatusDist,
  deviceSummaryKPIs,
  deviceUsageList,
  deviceUsageTrendData,
  getSingleDeviceDetail,
  inactiveDevicesList,
  topDevicesByBilling,
  topDevicesByVolume,
} from '../mock/deviceReportsData';
import type {
  DepartmentDeviceUsageRow,
  DeviceQualityIssueRow,
  DeviceReportFilterValues,
  DeviceUsageRow,
  InactiveDeviceRow,
  SingleDeviceDetailData,
} from '../types';

type DeviceSubTab = 'usage' | 'quality' | 'departments' | 'rankings' | 'inactive';

export const DeviceReportsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<DeviceSubTab>('usage');
  const [selectedDeviceData, setSelectedDeviceData] = useState<SingleDeviceDetailData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState<DeviceReportFilterValues>({
    datePreset: 'thisMonth',
    fromDate: '2026-09-01',
    toDate: '2026-09-10',
    device: '',
    extension: '',
    department: 'All Departments',
    deviceType: 'All',
    callType: 'All',
    status: 'All',
    searchQuery: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<DeviceReportFilterValues>({
    ...filters,
  });

  const handleApply = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    const def: DeviceReportFilterValues = {
      datePreset: 'thisMonth',
      fromDate: '2026-09-01',
      toDate: '2026-09-10',
      device: '',
      extension: '',
      department: 'All Departments',
      deviceType: 'All',
      callType: 'All',
      status: 'All',
      searchQuery: '',
    };
    setFilters(def);
    setAppliedFilters(def);
  };

  const openDeviceDetails = (device: DeviceUsageRow) => {
    const detail = getSingleDeviceDetail(device);
    setSelectedDeviceData(detail);
    setDrawerOpen(true);
  };

  // Filtered primary device usage list
  const filteredDeviceList = useMemo(() => {
    return deviceUsageList.filter((d) => {
      if (appliedFilters.department !== 'All Departments' && d.department !== appliedFilters.department) {
        return false;
      }
      if (appliedFilters.deviceType !== 'All' && d.deviceType !== appliedFilters.deviceType) {
        return false;
      }
      if (appliedFilters.status !== 'All' && d.deviceStatus !== appliedFilters.status) {
        return false;
      }
      if (appliedFilters.device && !d.deviceId.toLowerCase().includes(appliedFilters.device.toLowerCase())) {
        return false;
      }
      if (appliedFilters.extension && !d.extension.toLowerCase().includes(appliedFilters.extension.toLowerCase())) {
        return false;
      }
      if (appliedFilters.searchQuery) {
        const q = appliedFilters.searchQuery.toLowerCase();
        return (
          d.deviceId.toLowerCase().includes(q) ||
          d.deviceName.toLowerCase().includes(q) ||
          d.extension.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appliedFilters]);

  // Primary Device Usage Table Columns
  const deviceColumns: ReportColumn<DeviceUsageRow>[] = [
    {
      key: 'deviceId',
      label: 'Device ID',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-teal-700">{row.deviceId}</span>,
    },
    {
      key: 'deviceName',
      label: 'Device Name',
      sortable: true,
      className: 'font-semibold text-slate-900 truncate max-w-[170px]',
    },
    {
      key: 'deviceType',
      label: 'Device Type',
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {row.deviceType}
        </span>
      ),
    },
    {
      key: 'extension',
      label: 'Extension',
      sortable: true,
      className: 'font-mono font-bold text-slate-800',
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      className: 'text-slate-700 font-medium',
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      className: 'text-slate-500 truncate max-w-[150px]',
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
      className: 'font-mono font-semibold text-slate-800',
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
      key: 'deviceStatus',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge
          variant={
            row.deviceStatus === 'Active'
              ? 'success'
              : row.deviceStatus === 'Inactive'
              ? 'neutral'
              : row.deviceStatus === 'Maintenance'
              ? 'warning'
              : 'danger'
          }
          size="sm"
        >
          {row.deviceStatus}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <button
          type="button"
          onClick={() => openDeviceDetails(row)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 transition-colors border border-teal-200/80"
          title="View Device Report"
        >
          <Eye className="w-3 h-3" />
          <span>Details</span>
        </button>
      ),
    },
  ];

  // Quality Issues Columns
  const qualityColumns: ReportColumn<DeviceQualityIssueRow>[] = [
    { key: 'dateTime', label: 'Date & Time', sortable: true, className: 'font-sans text-slate-700' },
    { key: 'cdrId', label: 'CDR ID', sortable: true, className: 'font-mono font-bold text-teal-700' },
    { key: 'device', label: 'Device', sortable: true, className: 'font-mono text-slate-800' },
    { key: 'extension', label: 'Extension', sortable: true, className: 'font-mono font-bold text-slate-900' },
    { key: 'destination', label: 'Destination', sortable: true, className: 'font-mono text-slate-700' },
    {
      key: 'qualityStatus',
      label: 'Quality Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.qualityStatus === 'Poor' ? 'danger' : 'warning'} size="sm">
          {row.qualityStatus}
        </Badge>
      ),
    },
    {
      key: 'issueType',
      label: 'Issue Type',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
          {row.issueType}
        </span>
      ),
    },
    { key: 'duration', label: 'Duration', sortable: true, align: 'right', className: 'font-mono' },
    {
      key: 'action',
      label: 'Action',
      align: 'center',
      render: () => (
        <button
          type="button"
          onClick={() => alert('View CDR call log diagnostics')}
          className="px-2 py-1 text-[10.5px] font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          Diagnostics
        </button>
      ),
    },
  ];

  // Department Device Summary Columns
  const deptDeviceColumns: ReportColumn<DepartmentDeviceUsageRow>[] = [
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-900">{row.department}</span>,
    },
    { key: 'totalDevices', label: 'Total Devices', sortable: true, align: 'right', className: 'font-bold' },
    {
      key: 'activeDevices',
      label: 'Active',
      sortable: true,
      align: 'right',
      render: (row) => <span className="text-emerald-700 font-semibold font-mono">{row.activeDevices}</span>,
    },
    {
      key: 'inactiveDevices',
      label: 'Inactive',
      sortable: true,
      align: 'right',
      render: (row) => <span className="text-slate-500 font-mono">{row.inactiveDevices}</span>,
    },
    { key: 'calls', label: 'Calls', sortable: true, align: 'right', className: 'font-bold' },
    { key: 'duration', label: 'Duration', sortable: true, align: 'right', className: 'font-mono' },
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
      key: 'qualityIssues',
      label: 'Quality Issues',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className={`font-bold font-mono ${row.qualityIssues > 5 ? 'text-rose-600' : 'text-slate-700'}`}>
          {row.qualityIssues}
        </span>
      ),
    },
  ];

  // Inactive Devices Columns
  const inactiveColumns: ReportColumn<InactiveDeviceRow>[] = [
    { key: 'deviceId', label: 'Device ID', sortable: true, className: 'font-mono font-bold text-teal-700' },
    { key: 'deviceName', label: 'Device Name', sortable: true, className: 'font-semibold text-slate-900' },
    { key: 'extension', label: 'Extension', sortable: true, className: 'font-mono text-slate-800' },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'location', label: 'Location', sortable: true, className: 'text-slate-500' },
    { key: 'lastActivity', label: 'Last Activity', sortable: true, className: 'font-mono text-[11px]' },
    {
      key: 'daysInactive',
      label: 'Days Inactive',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200">
          {row.daysInactive} days
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'Disabled' ? 'danger' : 'warning'} size="sm">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4" id="device-reports-printable-area">
      {/* 1. Page Filter Bar */}
      <DeviceReportFilter
        filters={filters}
        onChange={setFilters}
        onApply={handleApply}
        onReset={handleReset}
        exportData={filteredDeviceList as unknown as Record<string, unknown>[]}
        exportFilename={`Airport_Device_Report_${activeSubTab}`}
        printElementId="device-reports-printable-area"
      />

      {/* 2. Device Summary KPI Cards */}
      <DeviceSummaryCards kpis={deviceSummaryKPIs} />

      {/* 3. Device Inventory Summary Section */}
      <DeviceInventorySummary inventory={deviceInventorySummary} />

      {/* 4. Device Trends & Status Distribution */}
      <DeviceCharts
        usageTrend={deviceUsageTrendData}
        billingTrend={deviceBillingTrendData}
        statusDist={deviceStatusDist}
      />

      {/* 5. Sub Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'usage' as DeviceSubTab, label: 'Device Usage Summary', icon: Cpu },
            { id: 'quality' as DeviceSubTab, label: 'Quality Issues', icon: AlertTriangle },
            { id: 'departments' as DeviceSubTab, label: 'Department Device Usage', icon: Building2 },
            { id: 'rankings' as DeviceSubTab, label: 'Top Devices Rankings', icon: Award },
            { id: 'inactive' as DeviceSubTab, label: 'Inactive Devices', icon: PhoneOff },
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
          Cisco CUCM Device & Endpoint Reports • Release 15
        </div>
      </div>

      {/* 6. Active Sub Tab Content */}
      {/* Tab: Primary Device Usage Summary */}
      {activeSubTab === 'usage' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Device Usage Summary ({filteredDeviceList.length} Endpoints)
              </h3>
              <p className="text-[11px] text-slate-500">
                Click &apos;Details&apos; to view deep-dive device hardware profile, daily activity and call diagnostics
              </p>
            </div>
          </div>

          <ReportTable
            data={filteredDeviceList as unknown as Record<string, unknown>[]}
            columns={deviceColumns as unknown as ReportColumn<Record<string, unknown>>[]}
            rowKey={(r) => String(r.id)}
            searchable
            selectable
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Tab: Quality Issues */}
      {activeSubTab === 'quality' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Device Quality Issues ({deviceQualityIssues.length} Incidents)
              </h3>
              <p className="text-[11px] text-slate-500">
                Audit log of packet loss, jitter, latency, and audio connection anomalies
              </p>
            </div>
          </div>

          <ReportTable
            data={deviceQualityIssues as unknown as Record<string, unknown>[]}
            columns={qualityColumns as unknown as ReportColumn<Record<string, unknown>>[]}
            rowKey={(r) => String(r.id)}
            searchable
            selectable
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Tab: Department Device Usage */}
      {activeSubTab === 'departments' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Department Device Usage ({departmentDeviceUsage.length} Divisions)
              </h3>
              <p className="text-[11px] text-slate-500">
                Hardware distribution, active lines, and billing per airport division
              </p>
            </div>
          </div>

          <ReportTable
            data={departmentDeviceUsage as unknown as Record<string, unknown>[]}
            columns={deptDeviceColumns as unknown as ReportColumn<Record<string, unknown>>[]}
            rowKey={(r) => String(r.id)}
            searchable
            selectable
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Tab: Rankings */}
      {activeSubTab === 'rankings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Devices by Call Volume */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Devices by Call Volume</h3>
                <p className="text-[11px] text-slate-500">Ranked by total calls processed</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2 px-3 text-center">Rank</th>
                    <th className="py-2 px-3">Device & Extension</th>
                    <th className="py-2 px-3">Department</th>
                    <th className="py-2 px-3 text-right">Calls</th>
                    <th className="py-2 px-3 text-right">Billing (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topDevicesByVolume.map((row) => (
                    <tr key={row.rank} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700">
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <p className="font-bold text-slate-900">{row.extension}</p>
                        <p className="text-[10.5px] text-slate-500 truncate max-w-[140px]">{row.device}</p>
                      </td>
                      <td className="py-2 px-3 text-slate-700">{row.department}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{row.calls}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-teal-800">
                        {formatCurrency(row.billing)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Devices by Billing */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Devices by Billing</h3>
                <p className="text-[11px] text-slate-500">Ranked by gross toll expenditure</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2 px-3 text-center">Rank</th>
                    <th className="py-2 px-3">Device & Extension</th>
                    <th className="py-2 px-3">Department</th>
                    <th className="py-2 px-3 text-right">Duration</th>
                    <th className="py-2 px-3 text-right">Billing (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topDevicesByBilling.map((row) => (
                    <tr key={row.rank} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <p className="font-bold text-slate-900">{row.extension}</p>
                        <p className="text-[10.5px] text-slate-500 truncate max-w-[140px]">{row.device}</p>
                      </td>
                      <td className="py-2 px-3 text-slate-700">{row.department}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">{row.duration}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-teal-800">
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

      {/* Tab: Inactive Devices */}
      {activeSubTab === 'inactive' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Inactive & Idle Devices ({inactiveDevicesList.length} Lines)
              </h3>
              <p className="text-[11px] text-slate-500">
                Telephone extensions exceeding inactivity threshold limits (&gt; 7 days idle)
              </p>
            </div>
          </div>

          <ReportTable
            data={inactiveDevicesList as unknown as Record<string, unknown>[]}
            columns={inactiveColumns as unknown as ReportColumn<Record<string, unknown>>[]}
            rowKey={(r) => String(r.id)}
            searchable
            selectable
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* 7. Device Detail Sliding Drawer */}
      <DeviceDetailDrawer
        open={drawerOpen}
        data={selectedDeviceData}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedDeviceData(null);
        }}
      />
    </div>
  );
};
