import React, { useMemo, useState } from 'react';
import { CDRHeader } from '../components/CDRHeader';
import { CDRQuickFilters } from '../components/CDRQuickFilters';
import { CDRAdvancedFilters } from '../components/CDRAdvancedFilters';
import { CDRRecordsTable } from '../components/CDRRecordsTable';
import { CDRDetailDrawer } from '../components/CDRDetailDrawer';
import {
  initialCDRSummaryKPIs,
  mockComprehensiveCDRRecords,
} from '../mock/cdrRecordsData';
import type {
  CDRFilterOptions,
  CDRQuickFilterKey,
  ComprehensiveCDRRecord,
} from '../types';

export const CDRRecordsPage: React.FC = () => {
  const [records] = useState<ComprehensiveCDRRecord[]>(mockComprehensiveCDRRecords);
  const [isLoading] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ComprehensiveCDRRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<CDRQuickFilterKey>('all');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const initialFilters: CDRFilterOptions = {
    searchQuery: '',
    datePreset: 'last-30-days',
    fromDate: '2026-08-12',
    toDate: '2026-09-11',
    fromTime: '00:00',
    toTime: '23:59',
    extensionMode: 'all',
    extensionValue: '',
    department: 'All Departments',
    device: 'All Devices',
    callType: 'All',
    callStatus: 'All',
    minDurationSec: '',
    maxDurationSec: '',
    minAmount: '',
    maxAmount: '',
  };

  const [filters, setFilters] = useState<CDRFilterOptions>(initialFilters);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAllFilteredSelected, setIsAllFilteredSelected] = useState<boolean>(false);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveQuickFilter('all');
    setFilters(initialFilters);
    setSelectedIds(new Set());
    setIsAllFilteredSelected(false);
  };

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // 1. Text Search across 7 fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          rec.cdrId.toLowerCase().includes(q) ||
          rec.userName.toLowerCase().includes(q) ||
          rec.extension.toLowerCase().includes(q) ||
          rec.deviceId.toLowerCase().includes(q) ||
          rec.destinationName.toLowerCase().includes(q) ||
          rec.destinationNumber.toLowerCase().includes(q) ||
          rec.department.toLowerCase().includes(q);

        if (!matches) return false;
      }

      // 2. Quick Filters
      if (activeQuickFilter === 'internal' && rec.callType !== 'Internal') return false;
      if (activeQuickFilter === 'external' && rec.callType !== 'External') return false;
      if (activeQuickFilter === 'international' && rec.callType !== 'International') return false;
      if (activeQuickFilter === 'completed' && rec.status !== 'Completed') return false;
      if (activeQuickFilter === 'failed' && rec.status === 'Completed') return false;
      if (activeQuickFilter === 'high-billing' && rec.totalAmount <= 50) return false;
      if (activeQuickFilter === 'long-duration' && rec.durationSeconds <= 1800) return false;

      // 3. Advanced Filters: Department
      if (filters.department !== 'All Departments' && rec.department !== filters.department) {
        return false;
      }

      // Advanced Filters: Extension
      if (filters.extensionMode !== 'all' && filters.extensionValue.trim()) {
        const val = filters.extensionValue.toLowerCase().trim();
        if (!rec.extension.toLowerCase().includes(val)) return false;
      }

      // Advanced Filters: Device
      if (filters.device !== 'All Devices') {
        const devId = filters.device.split(' ')[0];
        if (rec.deviceId !== devId) return false;
      }

      // Advanced Filters: Call Type
      if (filters.callType !== 'All' && rec.callType !== filters.callType) {
        return false;
      }

      // Advanced Filters: Call Status
      if (filters.callStatus !== 'All' && rec.status !== filters.callStatus) {
        return false;
      }

      // Advanced Filters: Duration Range
      if (filters.minDurationSec && rec.durationSeconds < Number(filters.minDurationSec)) return false;
      if (filters.maxDurationSec && rec.durationSeconds > Number(filters.maxDurationSec)) return false;

      // Advanced Filters: Billing Range
      if (filters.minAmount && rec.totalAmount < Number(filters.minAmount)) return false;
      if (filters.maxAmount && rec.totalAmount > Number(filters.maxAmount)) return false;

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

  const handleViewRecord = (record: ComprehensiveCDRRecord) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header & Top Summary */}
      <CDRHeader
        kpis={initialCDRSummaryKPIs}
        totalRecordsCount={12486}
        filteredCount={
          filteredRecords.length === records.length
            ? 12486
            : Math.round((filteredRecords.length / records.length) * 12486)
        }
        selectedCount={
          isAllFilteredSelected
            ? Math.round((filteredRecords.length / records.length) * 12486)
            : selectedIds.size
        }
      />

      {/* 2. Prominent Search & Quick Filters Bar */}
      <CDRQuickFilters
        searchQuery={searchQuery}
        activeQuickFilter={activeQuickFilter}
        isAdvancedOpen={isAdvancedOpen}
        onSearchChange={setSearchQuery}
        onQuickFilterChange={setActiveQuickFilter}
        onToggleAdvanced={() => setIsAdvancedOpen(!isAdvancedOpen)}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* 3. Expandable Advanced Filters Panel */}
      <CDRAdvancedFilters
        isOpen={isAdvancedOpen}
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilters={() => {
          setSelectedIds(new Set());
          setIsAllFilteredSelected(false);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Primary CDR Records Table */}
      <CDRRecordsTable
        records={filteredRecords}
        totalFilteredCount={
          filteredRecords.length === records.length
            ? 12486
            : Math.round((filteredRecords.length / records.length) * 12486)
        }
        selectedIds={selectedIds}
        isAllFilteredSelected={isAllFilteredSelected}
        isLoading={isLoading}
        onToggleSelectRecord={handleToggleSelectRecord}
        onSelectAllCurrentPage={handleSelectAllCurrentPage}
        onSelectAllFiltered={handleSelectAllFiltered}
        onClearSelection={handleClearSelection}
        onViewRecord={handleViewRecord}
        onResetFilters={handleResetFilters}
      />

      {/* 5. Detailed CDR Inspection Drawer */}
      <CDRDetailDrawer
        isOpen={isDrawerOpen}
        record={selectedRecord}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
