import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  Clock,
  Coins,
  CreditCard,
  Eye,
  FileCheck2,
  Layers,
  MapPin,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '../../../../../components/common/Badge';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { CallDetailsDrawer } from '../components/CallDetailsDrawer';
import { ExportReportButton } from '../components/ExportReportButton';
import { ReportTable } from '../components/ReportTable';
import {
  individualBillInfo,
  individualBillRows,
  individualBillSummaries,
  reportCallTypes,
  reportDepartments,
  reportDirections,
  reportLocations,
  reportUsers,
  getCallDetailsFromRow,
  getUserDailyConsumption,
} from '../mock/userReportsData';
import type { CallDetailsData, IndividualBillRow, ReportColumn, UserDailyConsumption } from '../types';

type PeriodPreset = 'today' | 'last-7-days' | 'last-30-days' | 'this-month' | 'last-month' | 'custom';
type BillViewMode = 'daily-breakdown' | 'itemized-calls';

export const IndividualBills: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('u1');
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('last-7-days');
  const [viewMode, setViewMode] = useState<BillViewMode>('daily-breakdown');

  const [employeeIdFilter, setEmployeeIdFilter] = useState<string>('');
  const [extensionFilter, setExtensionFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');
  const [dateFrom, setDateFrom] = useState<string>('2026-09-05');
  const [dateTo, setDateTo] = useState<string>('2026-09-11');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('All Call Types');
  const [directionFilter, setDirectionFilter] = useState<string>('All Directions');

  // Applied filter state for Search/Reset
  const [appliedFilters, setAppliedFilters] = useState({
    userId: 'u1',
    periodPreset: 'last-7-days' as PeriodPreset,
    employeeId: '',
    extension: '',
    department: 'All Departments',
    location: 'All Locations',
    dateFrom: '2026-09-05',
    dateTo: '2026-09-11',
    callType: 'All Call Types',
    direction: 'All Directions',
  });

  const [activeCallDetail, setActiveCallDetail] = useState<CallDetailsData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentUserObj = useMemo(() => {
    return reportUsers.find((u) => u.id === appliedFilters.userId) || reportUsers[0];
  }, [appliedFilters.userId]);

  const defaultSummary = useMemo(() => {
    return individualBillSummaries[appliedFilters.userId] || individualBillSummaries.u1;
  }, [appliedFilters.userId]);

  const userInfo = useMemo(() => {
    return individualBillInfo[appliedFilters.userId] || individualBillInfo.u1;
  }, [appliedFilters.userId]);

  // Daily Consumption data computed for active period & user
  const dailyConsumptions = useMemo(() => {
    return getUserDailyConsumption(appliedFilters.userId, appliedFilters.periodPreset);
  }, [appliedFilters.userId, appliedFilters.periodPreset]);

  // Aggregated summary from daily records
  const dynamicSummary = useMemo(() => {
    if (dailyConsumptions.length === 0) return defaultSummary;

    const totalCalls = dailyConsumptions.reduce((acc, d) => acc + d.totalCalls, 0);
    const incomingCalls = dailyConsumptions.reduce((acc, d) => acc + d.incomingCalls, 0);
    const outgoingCalls = dailyConsumptions.reduce((acc, d) => acc + d.outgoingCalls, 0);
    const internalCalls = dailyConsumptions.reduce((acc, d) => acc + d.internalCalls, 0);
    const billableCalls = dailyConsumptions.reduce((acc, d) => acc + d.billableCalls, 0);
    const totalMinutes = dailyConsumptions.reduce((acc, d) => acc + d.billableMinutes, 0);
    const subtotal = dailyConsumptions.reduce((acc, d) => acc + d.baseCharge, 0);
    const gst = dailyConsumptions.reduce((acc, d) => acc + d.gst, 0);
    const totalAmount = dailyConsumptions.reduce((acc, d) => acc + d.totalCost, 0);

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const totalTalkTime = `${hours > 0 ? `${hours}h ` : ''}${mins}m 00s`;

    return {
      totalCalls,
      incomingCalls,
      outgoingCalls,
      internalCalls,
      billableCalls,
      totalTalkTime,
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(gst.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  }, [dailyConsumptions, defaultSummary]);

  const handleUserChange = (uId: string) => {
    setSelectedUserId(uId);
    const u = reportUsers.find((x) => x.id === uId);
    if (u) {
      setEmployeeIdFilter(u.employeeId);
      setExtensionFilter(u.extension);
      setDepartmentFilter(u.department);
      setLocationFilter(u.location);
    }
  };

  const handlePeriodPresetChange = (preset: PeriodPreset) => {
    setPeriodPreset(preset);
    if (preset === 'today') {
      setDateFrom('2026-09-11');
      setDateTo('2026-09-11');
    } else if (preset === 'last-7-days') {
      setDateFrom('2026-09-05');
      setDateTo('2026-09-11');
    } else if (preset === 'last-30-days') {
      setDateFrom('2026-08-12');
      setDateTo('2026-09-11');
    } else if (preset === 'this-month') {
      setDateFrom('2026-09-01');
      setDateTo('2026-09-11');
    } else if (preset === 'last-month') {
      setDateFrom('2026-08-01');
      setDateTo('2026-08-31');
    }
  };

  const handleSearch = () => {
    setAppliedFilters({
      userId: selectedUserId,
      periodPreset,
      employeeId: employeeIdFilter,
      extension: extensionFilter,
      department: departmentFilter,
      location: locationFilter,
      dateFrom,
      dateTo,
      callType: callTypeFilter,
      direction: directionFilter,
    });
  };

  const handleReset = () => {
    setSelectedUserId('u1');
    setPeriodPreset('last-7-days');
    setEmployeeIdFilter('');
    setExtensionFilter('');
    setDepartmentFilter('All Departments');
    setLocationFilter('All Locations');
    setDateFrom('2026-09-05');
    setDateTo('2026-09-11');
    setCallTypeFilter('All Call Types');
    setDirectionFilter('All Directions');
    setAppliedFilters({
      userId: 'u1',
      periodPreset: 'last-7-days',
      employeeId: '',
      extension: '',
      department: 'All Departments',
      location: 'All Locations',
      dateFrom: '2026-09-05',
      dateTo: '2026-09-11',
      callType: 'All Call Types',
      direction: 'All Directions',
    });
  };

  const filteredRows = useMemo(() => {
    return individualBillRows.filter((row) => {
      if (appliedFilters.callType !== 'All Call Types' && row.callType !== appliedFilters.callType) {
        return false;
      }
      if (appliedFilters.direction !== 'All Directions' && row.direction !== appliedFilters.direction) {
        return false;
      }
      return true;
    });
  }, [appliedFilters]);

  const openCallDetails = (row: IndividualBillRow) => {
    const details = getCallDetailsFromRow(row, currentUserObj);
    setActiveCallDetail(details);
    setDrawerOpen(true);
  };

  const dailyColumns: ReportColumn<UserDailyConsumption>[] = [
    {
      key: 'formattedDate',
      label: 'Date & Day',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.formattedDate}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase">{row.dayOfWeek}</span>
        </div>
      ),
    },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-900">{row.totalCalls}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({row.outgoingCalls} Out / {row.incomingCalls} In)
          </span>
        </div>
      ),
    },
    {
      key: 'billableCalls',
      label: 'Billable Calls',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
          {row.billableCalls} Calls
        </span>
      ),
    },
    {
      key: 'totalDurationFormatted',
      label: 'Talk Time',
      sortable: true,
      className: 'font-mono text-slate-700 font-medium',
    },
    {
      key: 'billableMinutes',
      label: 'Billable Mins',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-slate-800">{row.billableMinutes} min</span>,
    },
    {
      key: 'baseCharge',
      label: 'Tariff Base (₹)',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-slate-700">{formatCurrency(row.baseCharge)}</span>,
    },
    {
      key: 'gst',
      label: 'GST 18% (₹)',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-slate-500">{formatCurrency(row.gst)}</span>,
    },
    {
      key: 'totalCost',
      label: 'Daily Total (₹)',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-teal-700 text-xs">
          {formatCurrency(row.totalCost)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      render: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Billed
        </span>
      ),
    },
  ];

  const columns: ReportColumn<IndividualBillRow>[] = [
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
      key: 'cdrId',
      label: 'CDR ID',
      sortable: true,
      className: 'font-mono font-bold text-teal-700',
    },
    {
      key: 'callingNumber',
      label: 'Calling Number',
      sortable: true,
      className: 'font-mono text-slate-800',
    },
    {
      key: 'destinationNumber',
      label: 'Destination Number',
      sortable: true,
      className: 'font-mono font-semibold text-slate-900',
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
      key: 'rate',
      label: 'Rate',
      sortable: true,
      className: 'font-mono text-slate-600',
    },
    {
      key: 'baseCharge',
      label: 'Base Charge',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-slate-700">{formatCurrency(row.baseCharge)}</span>,
    },
    {
      key: 'tax',
      label: 'Tax (18%)',
      sortable: true,
      align: 'right',
      render: (row) => <span className="font-mono text-slate-600">{formatCurrency(row.tax)}</span>,
    },
    {
      key: 'totalCharge',
      label: 'Total Charge',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span className="font-mono font-bold text-teal-700">{formatCurrency(row.totalCharge)}</span>
      ),
    },
    {
      key: 'billingStatus',
      label: 'Billing Status',
      sortable: true,
      render: (row) => (
        <Badge
          variant={row.billingStatus === 'Billed' ? 'success' : row.billingStatus === 'Exempt' ? 'neutral' : 'warning'}
          size="sm"
        >
          {row.billingStatus}
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
          onClick={() => openCallDetails(row)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 transition-colors border border-teal-200/80"
          title="View Call Details"
        >
          <Eye className="w-3 h-3" />
          <span>Details</span>
        </button>
      ),
    },
  ];

  // Quick Period Presets for tab bar
  const periodPresets: { id: PeriodPreset; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'last-7-days', label: 'Last 7 Days' },
    { id: 'last-30-days', label: 'Last 30 Days' },
    { id: 'this-month', label: 'This Month (Sep 2026)' },
    { id: 'last-month', label: 'Last Month (Aug 2026)' },
    { id: 'custom', label: 'Custom Range' },
  ];

  const maxDailyCost = Math.max(...dailyConsumptions.map((d) => d.totalCost), 1);

  return (
    <div className="space-y-4">
      {/* 1. SELECTION & FILTER BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900">Individual User Telecom Billing Statement</span>
            <span className="text-xs text-slate-400 font-medium">• Daily, 7 Days, 30 Days & Monthly Consumption</span>
          </div>
          <div className="flex items-center gap-2">
            <ExportReportButton
              filename={`User_Bill_${userInfo.userName.replace(/\s+/g, '_')}_${appliedFilters.periodPreset}`}
              data={
                (viewMode === 'daily-breakdown'
                  ? dailyConsumptions
                  : filteredRows) as unknown as Record<string, unknown>[]
              }
              headers={[
                { key: 'formattedDate', label: 'Date' },
                { key: 'totalCalls', label: 'Total Calls' },
                { key: 'billableCalls', label: 'Billable Calls' },
                { key: 'totalDurationFormatted', label: 'Duration' },
                { key: 'baseCharge', label: 'Base Charge' },
                { key: 'gst', label: 'GST' },
                { key: 'totalCost', label: 'Total Amount' },
              ]}
              printElementId="individual-bill-content"
            />
          </div>
        </div>

        {/* Quick Period Horizon Selector */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider mr-1">
            Time Horizon:
          </span>
          {periodPresets.map((p) => {
            const isActive = periodPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePeriodPresetChange(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* User dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Airport User</label>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reportUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (Ext: {u.extension}) — {u.department}
                </option>
              ))}
            </select>
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Employee ID</label>
            <input
              type="text"
              value={employeeIdFilter}
              onChange={(e) => setEmployeeIdFilter(e.target.value)}
              placeholder="e.g. EMP-10231"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
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

          {/* Date From */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPeriodPreset('custom');
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPeriodPreset('custom');
              }}
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

          {/* Action buttons */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div id="individual-bill-content" className="space-y-4">
        {/* 2. USER INFORMATION CARD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">User Account Statement</h3>
                <p className="text-[11px] text-slate-500">Official Telecom Consumption Record</p>
              </div>
            </div>
            <Badge variant="success" size="sm" className="font-semibold">
              <ShieldCheck className="w-3 h-3 mr-1 inline" />
              {userInfo.currentStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">User Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{currentUserObj.name}</p>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Employee ID</p>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{currentUserObj.employeeId}</p>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Department</p>
              <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                {currentUserObj.department}
              </p>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Extension</p>
              <p className="font-mono font-bold text-teal-700 mt-0.5">EXT-{currentUserObj.extension}</p>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location</p>
              <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {currentUserObj.location}
              </p>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 sm:col-span-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Statement Horizon</p>
              <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{appliedFilters.dateFrom} to {appliedFilters.dateTo}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC PERIOD BILL SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Calls</p>
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">{dynamicSummary.totalCalls}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Incoming</p>
              <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">{dynamicSummary.incomingCalls}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Outgoing</p>
              <PhoneOutgoing className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">{dynamicSummary.outgoingCalls}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Internal</p>
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">{dynamicSummary.internalCalls}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Billable</p>
              <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-base font-bold text-teal-700 mt-1">{dynamicSummary.billableCalls}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Talk Time</p>
              <Clock className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-900 mt-1 truncate">{dynamicSummary.totalTalkTime}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">Subtotal</p>
              <Coins className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-800 mt-1">{formatCurrency(dynamicSummary.subtotal)}</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-slate-400">GST (18%)</p>
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-800 mt-1">{formatCurrency(dynamicSummary.gst)}</p>
          </div>

          <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold text-teal-800">Total Billed</p>
              <Coins className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <p className="text-sm font-mono font-extrabold text-teal-800 mt-1">{formatCurrency(dynamicSummary.totalAmount)}</p>
          </div>
        </div>

        {/* 4. VIEW MODE SUB-TABS */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('daily-breakdown')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'daily-breakdown'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Daily Consumption Breakdown ({dailyConsumptions.length} Days)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('itemized-calls')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'itemized-calls'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Itemized Call Logs ({filteredRows.length} Calls)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono pr-3">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              <span>Avg Daily Usage: {formatCurrency(dynamicSummary.totalAmount / (dailyConsumptions.length || 1))}/day</span>
            </div>
          </div>
        </div>

        {/* 5. TAB CONTENT */}
        {viewMode === 'daily-breakdown' && (
          <div className="space-y-4">
            {/* Daily Consumption Trend Visual Bar Chart */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900">
                  Daily Usage & Billing Trend ({appliedFilters.periodPreset.replace('-', ' ').toUpperCase()})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Peak: {formatCurrency(maxDailyCost)}
                </span>
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-14 gap-2 items-end h-32 pt-4 px-2">
                {dailyConsumptions.map((day) => {
                  const heightPercent = Math.max(12, Math.round((day.totalCost / maxDailyCost) * 100));
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        <p className="font-bold">{day.formattedDate}</p>
                        <p>{day.totalCalls} calls • {formatCurrency(day.totalCost)}</p>
                      </div>

                      <div className="w-full bg-slate-100 rounded-t-md h-24 flex items-end justify-center overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-teal-600 hover:bg-teal-500 transition-all rounded-t-sm"
                        />
                      </div>
                      <span className="text-[9.5px] font-mono font-medium text-slate-500 truncate w-full text-center">
                        {day.date.slice(8)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Breakdown Table */}
            <ReportTable
              data={dailyConsumptions as unknown as Record<string, unknown>[]}
              columns={dailyColumns as unknown as ReportColumn<Record<string, unknown>>[]}
              rowKey={(r) => String(r.date)}
              searchable
              selectable
              pageSizeOptions={[7, 14, 30]}
            />
          </div>
        )}

        {viewMode === 'itemized-calls' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Itemized Call Records ({filteredRows.length} Records)
              </h3>
              <span className="text-[11px] text-slate-500">Click &apos;Details&apos; to view itemized CDR call breakdown</span>
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
        )}
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
