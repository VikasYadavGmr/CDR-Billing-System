import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Coins,
  PhoneCall,
  PhoneMissed,
  RotateCcw,
  Search,
} from 'lucide-react';
import { Badge } from '../../../../../components/common/Badge';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { CallDetailsDrawer } from '../components/CallDetailsDrawer';
import { ExportReportButton } from '../components/ExportReportButton';
import { ReportTable } from '../components/ReportTable';
import {
  callHistoryRows,
  callHistorySummary,
  getCallDetailsFromRow,
  reportBillingStatuses,
  reportCallTypes,
  reportDepartments,
  reportDirections,
  reportGateways,
  reportUsers,
} from '../mock/userReportsData';
import type { CallDetailsData, CallHistoryRow, ReportColumn } from '../types';

export const UserCallHistory: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>('All Users');
  const [extensionFilter, setExtensionFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  const [dateFrom, setDateFrom] = useState<string>('2026-09-01');
  const [dateTo, setDateTo] = useState<string>('2026-09-10');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('All Call Types');
  const [directionFilter, setDirectionFilter] = useState<string>('All Directions');
  const [billingStatusFilter, setBillingStatusFilter] = useState<string>('All Billing Statuses');
  const [destinationFilter, setDestinationFilter] = useState<string>('');
  const [gatewayFilter, setGatewayFilter] = useState<string>('All Gateways');

  const [appliedFilters, setAppliedFilters] = useState({
    user: 'All Users',
    extension: '',
    department: 'All Departments',
    dateFrom: '2026-09-01',
    dateTo: '2026-09-10',
    callType: 'All Call Types',
    direction: 'All Directions',
    billingStatus: 'All Billing Statuses',
    destination: '',
    gateway: 'All Gateways',
  });

  const [activeCallDetail, setActiveCallDetail] = useState<CallDetailsData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = () => {
    setAppliedFilters({
      user: selectedUser,
      extension: extensionFilter,
      department: departmentFilter,
      dateFrom,
      dateTo,
      callType: callTypeFilter,
      direction: directionFilter,
      billingStatus: billingStatusFilter,
      destination: destinationFilter,
      gateway: gatewayFilter,
    });
  };

  const handleReset = () => {
    setSelectedUser('All Users');
    setExtensionFilter('');
    setDepartmentFilter('All Departments');
    setDateFrom('2026-09-01');
    setDateTo('2026-09-10');
    setCallTypeFilter('All Call Types');
    setDirectionFilter('All Directions');
    setBillingStatusFilter('All Billing Statuses');
    setDestinationFilter('');
    setGatewayFilter('All Gateways');

    setAppliedFilters({
      user: 'All Users',
      extension: '',
      department: 'All Departments',
      dateFrom: '2026-09-01',
      dateTo: '2026-09-10',
      callType: 'All Call Types',
      direction: 'All Directions',
      billingStatus: 'All Billing Statuses',
      destination: '',
      gateway: 'All Gateways',
    });
  };

  const filteredRows = useMemo(() => {
    return callHistoryRows.filter((row) => {
      if (appliedFilters.user !== 'All Users' && row.user !== appliedFilters.user) {
        return false;
      }
      if (appliedFilters.extension && !row.extension.includes(appliedFilters.extension)) {
        return false;
      }
      if (appliedFilters.department !== 'All Departments' && row.department !== appliedFilters.department) {
        return false;
      }
      if (appliedFilters.callType !== 'All Call Types' && row.callType !== appliedFilters.callType) {
        return false;
      }
      if (appliedFilters.direction !== 'All Directions' && row.direction !== appliedFilters.direction) {
        return false;
      }
      if (appliedFilters.billingStatus !== 'All Billing Statuses' && row.billingStatus !== appliedFilters.billingStatus) {
        return false;
      }
      if (appliedFilters.destination && !row.calledNumber.includes(appliedFilters.destination)) {
        return false;
      }
      if (appliedFilters.gateway !== 'All Gateways' && row.gateway !== appliedFilters.gateway) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  const openDrawer = (row: CallHistoryRow) => {
    const userObj = reportUsers.find((u) => u.name === row.user);
    const detail = getCallDetailsFromRow(row, userObj);
    setActiveCallDetail(detail);
    setDrawerOpen(true);
  };

  const columns: ReportColumn<CallHistoryRow>[] = [
    {
      key: 'cdrId',
      label: 'CDR ID',
      sortable: true,
      className: 'font-mono font-bold text-teal-700',
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      className: 'text-slate-700 font-medium',
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
      className: 'font-mono text-slate-600',
    },
    {
      key: 'callingNumber',
      label: 'Caller',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900">{row.callingNumber}</span>
          <span className="block text-[10.5px] text-slate-500 truncate max-w-[110px]">{row.user}</span>
        </div>
      ),
    },
    {
      key: 'calledNumber',
      label: 'Destination',
      sortable: true,
      className: 'font-mono font-bold text-slate-900',
    },
    {
      key: 'callType',
      label: 'Call Type',
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {row.callType}
        </span>
      ),
    },
    {
      key: 'direction',
      label: 'Direction',
      sortable: true,
      render: (row) => (
        <Badge
          variant={row.direction === 'Outgoing' ? 'info' : row.direction === 'Incoming' ? 'success' : 'neutral'}
          size="sm"
        >
          {row.direction}
        </Badge>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      align: 'right',
      className: 'font-mono font-semibold text-slate-800',
    },
    {
      key: 'gateway',
      label: 'Gateway',
      sortable: true,
      className: 'font-mono text-slate-600',
    },
    {
      key: 'trunk',
      label: 'Trunk',
      sortable: true,
      className: 'font-mono text-slate-600',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Badge
          variant={row.status === 'Completed' ? 'success' : row.status === 'Failed' ? 'danger' : 'warning'}
          size="sm"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'terminationCause',
      label: 'Termination Cause',
      sortable: true,
      className: 'text-[11px] text-slate-600 truncate max-w-[130px]',
    },
    {
      key: 'cost',
      label: 'Cost',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-teal-700">{formatCurrency(row.cost)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <button
          type="button"
          onClick={() => openDrawer(row)}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/80 transition-colors"
          title="View Call Details"
        >
          View CDR
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. FILTER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900">User Call History Filters</span>
            <span className="text-xs text-slate-400 font-medium">• Search by User, Ext, Gateway, Destination & Status</span>
          </div>
          <ExportReportButton
            filename="User_Call_History_Report"
            data={filteredRows as unknown as Record<string, unknown>[]}
            headers={[
              { key: 'cdrId', label: 'CDR ID' },
              { key: 'date', label: 'Date' },
              { key: 'time', label: 'Time' },
              { key: 'callingNumber', label: 'Caller' },
              { key: 'calledNumber', label: 'Destination' },
              { key: 'callType', label: 'Call Type' },
              { key: 'direction', label: 'Direction' },
              { key: 'duration', label: 'Duration' },
              { key: 'gateway', label: 'Gateway' },
              { key: 'trunk', label: 'Trunk' },
              { key: 'status', label: 'Status' },
              { key: 'terminationCause', label: 'Termination Cause' },
              { key: 'cost', label: 'Cost' },
            ]}
            printElementId="call-history-content"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* User */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="All Users">All Users</option>
              {reportUsers.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name} ({u.extension})
                </option>
              ))}
            </select>
          </div>

          {/* Extension */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Extension</label>
            <input
              type="text"
              value={extensionFilter}
              onChange={(e) => setExtensionFilter(e.target.value)}
              placeholder="e.g. 2451"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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

          {/* Billing Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Billing Status</label>
            <select
              value={billingStatusFilter}
              onChange={(e) => setBillingStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportBillingStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Number */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination Number</label>
            <input
              type="text"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Gateway */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Gateway</label>
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportGateways.map((gw) => (
                <option key={gw} value={gw}>
                  {gw}
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
            <span>Search Call Logs</span>
          </button>
        </div>
      </div>

      <div id="call-history-content" className="space-y-4">
        {/* 2. CALL HISTORY SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Calls</p>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-2">{callHistorySummary.totalCalls}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed</p>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-emerald-700 mt-2">{callHistorySummary.completed}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Failed</p>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-rose-600 mt-2">{callHistorySummary.failed}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Missed</p>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <PhoneMissed className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-amber-600 mt-2">{callHistorySummary.missed}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-base font-mono font-bold text-slate-900 mt-2 truncate">{callHistorySummary.totalDuration}</p>
          </div>

          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Total Cost</p>
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-mono font-extrabold text-teal-800 mt-2">{formatCurrency(callHistorySummary.totalCost)}</p>
          </div>
        </div>

        {/* 3. CALL HISTORY TABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Call Detail Records ({filteredRows.length} Calls)
            </h3>
            <span className="text-[11px] text-slate-500">Includes Carrier Gateway, Trunk and Termination Reason</span>
          </div>

          <ReportTable
            data={filteredRows as unknown as Record<string, unknown>[]}
            columns={columns as unknown as ReportColumn<Record<string, unknown>>[]}
            rowKey={(r) => String(r.id)}
            searchable
            selectable
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* Drawer */}
      <CallDetailsDrawer
        open={drawerOpen}
        data={activeCallDetail}
        onClose={() => {
          setDrawerOpen(false);
          setActiveCallDetail(null);
        }}
      />
    </div>
  );
};
