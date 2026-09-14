import React, { useMemo, useState } from 'react';
import {
  Building2,
  Cpu,
  FileSpreadsheet,
  PieChart,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { CMRHeader } from '../components/CMRHeader';
import { CMRSummaryCards } from '../components/CMRSummaryCards';
import { CMRQuickFilters } from '../components/CMRQuickFilters';
import { CMRAdvancedFilters } from '../components/CMRAdvancedFilters';
import { CMRRecordsTable } from '../components/CMRRecordsTable';
import { CMRQualityIssuesTable } from '../components/CMRQualityIssuesTable';
import { CMRDepartmentSummaryTable } from '../components/CMRDepartmentSummaryTable';
import { CMRDeviceSummaryTable } from '../components/CMRDeviceSummaryTable';
import { CMRDetailDrawer } from '../components/CMRDetailDrawer';
import {
  initialCMRSummaryKPIs,
  mockCMRQualityDistribution,
  mockComprehensiveCMRRecords,
  mockDepartmentQualitySummary,
  mockDeviceQualitySummary,
} from '../mock/cmrRecordsData';
import type {
  CMRFilterOptions,
  CMRQuickFilterKey,
  ComprehensiveCMRRecord,
} from '../types';

type CMRViewSubTab = 'table' | 'issues' | 'departments' | 'devices' | 'distribution';

export const CMRRecordsPage: React.FC = () => {
  const [records] = useState<ComprehensiveCMRRecord[]>(mockComprehensiveCMRRecords);
  const [selectedRecord, setSelectedRecord] = useState<ComprehensiveCMRRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<CMRViewSubTab>('table');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<CMRQuickFilterKey>('all');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const initialFilters: CMRFilterOptions = {
    searchQuery: '',
    datePreset: 'last-30-days',
    fromDate: '2026-08-12',
    toDate: '2026-09-11',
    fromTime: '00:00',
    toTime: '23:59',
    qualityStatus: 'All',
    qualityIssue: 'All',
    extensionMode: 'all',
    extensionValue: '',
    department: 'All Departments',
    device: 'All Devices',
    minScore: '',
    maxScore: '',
  };

  const [filters, setFilters] = useState<CMRFilterOptions>(initialFilters);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAllFilteredSelected, setIsAllFilteredSelected] = useState<boolean>(false);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveQuickFilter('all');
    setFilters(initialFilters);
    setSelectedIds(new Set());
    setIsAllFilteredSelected(false);
  };

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // 1. Text Search across 7 fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          rec.cmrId.toLowerCase().includes(q) ||
          rec.cdrId.toLowerCase().includes(q) ||
          rec.userName.toLowerCase().includes(q) ||
          rec.extension.toLowerCase().includes(q) ||
          rec.deviceId.toLowerCase().includes(q) ||
          rec.department.toLowerCase().includes(q) ||
          rec.destinationName.toLowerCase().includes(q);

        if (!matches) return false;
      }

      // 2. Quick Filters
      if (activeQuickFilter === 'excellent' && rec.qualityScore < 90) return false;
      if (activeQuickFilter === 'good' && (rec.qualityScore < 75 || rec.qualityScore >= 90)) return false;
      if (activeQuickFilter === 'fair' && (rec.qualityScore < 60 || rec.qualityScore >= 75)) return false;
      if (activeQuickFilter === 'poor' && rec.qualityScore >= 60) return false;
      if (activeQuickFilter === 'quality-issues' && rec.qualityIssue === 'None') return false;
      if (activeQuickFilter === 'high-jitter' && rec.jitterMs <= 20) return false;
      if (activeQuickFilter === 'high-packet-loss' && rec.packetLossPct <= 1.0) return false;
      if (activeQuickFilter === 'high-latency' && rec.latencyMs <= 100) return false;

      // 3. Advanced Filters: Quality Status
      if (filters.qualityStatus !== 'All' && rec.qualityStatus !== filters.qualityStatus) {
        return false;
      }

      // Quality Issue Type
      if (filters.qualityIssue !== 'All') {
        if (filters.qualityIssue === 'None' && rec.qualityIssue !== 'None') return false;
        if (filters.qualityIssue !== 'None' && rec.qualityIssue !== filters.qualityIssue) return false;
      }

      // Department
      if (filters.department !== 'All Departments' && rec.department !== filters.department) {
        return false;
      }

      // Extension
      if (filters.extensionMode !== 'all' && filters.extensionValue.trim()) {
        const val = filters.extensionValue.toLowerCase().trim();
        if (!rec.extension.toLowerCase().includes(val)) return false;
      }

      // Device
      if (filters.device !== 'All Devices') {
        const devId = filters.device.split(' ')[0];
        if (rec.deviceId !== devId) return false;
      }

      // Score Range
      if (filters.minScore && rec.qualityScore < Number(filters.minScore)) return false;
      if (filters.maxScore && rec.qualityScore > Number(filters.maxScore)) return false;

      return true;
    });
  }, [records, searchQuery, activeQuickFilter, filters]);

  // Bulk Selection Handlers
  const handleToggleSelectRecord = (id: string) => {
    setIsAllFilteredSelected(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllCurrentPage = () => {
    setIsAllFilteredSelected(false);
    const pageIds = filteredRecords.slice(0, 25).map((r) => r.id);
    const allPageSelected = pageIds.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setIsAllFilteredSelected(true);
    setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
  };

  const handleClearSelection = () => {
    setIsAllFilteredSelected(false);
    setSelectedIds(new Set());
  };

  const handleViewRecord = (record: ComprehensiveCMRRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const subTabs = [
    { id: 'table' as CMRViewSubTab, label: 'CMR Records Log', icon: FileSpreadsheet, count: filteredRecords.length },
    {
      id: 'issues' as CMRViewSubTab,
      label: 'Quality Issues',
      icon: ShieldAlert,
      count: filteredRecords.filter((r) => r.qualityIssue !== 'None').length,
    },
    { id: 'departments' as CMRViewSubTab, label: 'Department Summary', icon: Building2 },
    { id: 'devices' as CMRViewSubTab, label: 'Device Rankings', icon: Cpu },
    { id: 'distribution' as CMRViewSubTab, label: 'QoS Distribution & Thresholds', icon: PieChart },
  ];

  return (
    <div className="space-y-4 text-slate-800">
      {/* 1. Header with live counters */}
      <CMRHeader
        totalRecordsCount={8642}
        filteredCount={
          filteredRecords.length === records.length
            ? 8642
            : Math.round((filteredRecords.length / records.length) * 8642)
        }
        selectedCount={
          isAllFilteredSelected
            ? Math.round((filteredRecords.length / records.length) * 8642)
            : selectedIds.size
        }
      />

      {/* 2. 8 KPI Summary Cards */}
      <CMRSummaryCards kpis={initialCMRSummaryKPIs} />

      {/* 3. Search & Quick Filters Pill Bar */}
      <CMRQuickFilters
        searchQuery={searchQuery}
        activeQuickFilter={activeQuickFilter}
        isAdvancedOpen={isAdvancedOpen}
        onSearchChange={setSearchQuery}
        onQuickFilterChange={setActiveQuickFilter}
        onToggleAdvanced={() => setIsAdvancedOpen(!isAdvancedOpen)}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* 4. Expandable Advanced QoS Filters */}
      <CMRAdvancedFilters
        isOpen={isAdvancedOpen}
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilters={() => {
          setSelectedIds(new Set());
          setIsAllFilteredSelected(false);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* 5. Sub-Navigation Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-1.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.count.toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Active View Content */}
      {activeSubTab === 'table' && (
        <CMRRecordsTable
          records={filteredRecords}
          totalFilteredCount={
            filteredRecords.length === records.length
              ? 8642
              : Math.round((filteredRecords.length / records.length) * 8642)
          }
          selectedIds={selectedIds}
          isAllFilteredSelected={isAllFilteredSelected}
          isLoading={false}
          onToggleSelectRecord={handleToggleSelectRecord}
          onSelectAllCurrentPage={handleSelectAllCurrentPage}
          onSelectAllFiltered={handleSelectAllFiltered}
          onClearSelection={handleClearSelection}
          onViewRecord={handleViewRecord}
          onResetFilters={handleResetFilters}
        />
      )}

      {activeSubTab === 'issues' && (
        <CMRQualityIssuesTable
          records={filteredRecords}
          onViewRecord={handleViewRecord}
        />
      )}

      {activeSubTab === 'departments' && (
        <CMRDepartmentSummaryTable data={mockDepartmentQualitySummary} />
      )}

      {activeSubTab === 'devices' && (
        <CMRDeviceSummaryTable data={mockDeviceQualitySummary} />
      )}

      {activeSubTab === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Quality Distribution Donut Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  CMR Voice Quality Distribution
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                8,642 Calls Analyzed
              </span>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                {mockCMRQualityDistribution.map((item) => (
                  <div
                    key={item.name}
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    className="h-full transition-all duration-300"
                    title={`${item.name}: ${item.percentage}% (${item.count.toLocaleString()} calls)`}
                  />
                ))}
              </div>

              {/* Legend with Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {mockCMRQualityDistribution.map((item) => (
                  <div key={item.name} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-semibold text-slate-800">{item.name.split(' ')[0]}</span>
                    </div>
                    <p className="text-sm font-mono font-bold text-slate-900 pl-4">{item.percentage}%</p>
                    <p className="text-[10px] font-mono text-slate-500 pl-4">{item.count.toLocaleString()} calls</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QoS SLA Reference Thresholds */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Enterprise Telephony QoS Thresholds
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">CUCM Rel 15 Baseline</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 block">Packet Loss Rate (RFC 3550)</span>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  <strong className="text-emerald-700">Good: &lt;1.0%</strong> •{' '}
                  <strong className="text-amber-700">Fair: 1.0%–3.0%</strong> •{' '}
                  <strong className="text-rose-700">Poor: &gt;3.0%</strong> (leads to syllable clipping)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 block">Jitter Buffer Variance</span>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  <strong className="text-emerald-700">Good: &lt;20 ms</strong> •{' '}
                  <strong className="text-amber-700">Fair: 20–30 ms</strong> •{' '}
                  <strong className="text-rose-700">Poor: &gt;30 ms</strong> (results in audio robotic distortion)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 block">One-Way Media Latency (ITU-T G.114)</span>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  <strong className="text-emerald-700">Good: &lt;100 ms</strong> •{' '}
                  <strong className="text-amber-700">Fair: 100–150 ms</strong> •{' '}
                  <strong className="text-rose-700">Poor: &gt;150 ms</strong> (conversational overlap delay)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Detailed CMR Inspection Drawer */}
      <CMRDetailDrawer
        isOpen={isDrawerOpen}
        record={selectedRecord}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
