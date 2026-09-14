import React, { useMemo, useState, useEffect } from 'react';
import { ExportHeader } from '../components/ExportHeader';
import { ExportTypeSelector } from '../components/ExportTypeSelector';
import { ExportFilterPanel } from '../components/ExportFilterPanel';
import { ExportSummaryCard } from '../components/ExportSummaryCard';
import { ExportDataPreview } from '../components/ExportDataPreview';
import { ExportFormatAndOptions } from '../components/ExportFormatAndOptions';
import { ExportProgressModal } from '../components/ExportProgressModal';
import { ExportSuccessCard } from '../components/ExportSuccessCard';
import { ExportHistorySection } from '../components/ExportHistorySection';
import {
  mockCdrExportRecords,
  mockCmrExportRecords,
  mockExportHistory,
  mockExportStats,
} from '../mock/exportData';
import { exportToCSV } from '../../../../utils/exportUtils';
import type {
  CdrExportType,
  CmrExportType,
  ExportDatePreset,
  ExportFilters,
  ExportFormat,
  ExportHistoryItem,
  ExportMainTab,
  ExportStats,
  ExportToggles,
} from '../types';

export const ExportCdrCmrPage: React.FC = () => {
  // 1. Navigation & Mode State
  const [mainTab, setMainTab] = useState<ExportMainTab>('cdr');
  const [cdrType, setCdrType] = useState<CdrExportType>('cdr-records');
  const [cmrType, setCmrType] = useState<CmrExportType>('cmr-records');

  // 2. Date Range State
  const [datePreset, setDatePreset] = useState<ExportDatePreset>('last-30-days');
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-11');

  // 3. Telephony Filters State
  const [filters, setFilters] = useState<ExportFilters>({
    department: 'All Departments',
    extensionMode: 'all',
    extensionValue: '',
    device: 'All Devices',
    callType: 'All',
    callStatus: 'All',
    cmrQuality: 'All',
    minAmount: '',
    maxAmount: '',
    minDuration: '',
    maxDuration: '',
  });

  // 4. Export Configuration
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [fileName, setFileName] = useState('');
  const [toggles, setToggles] = useState<ExportToggles>({
    includeHeaders: true,
    includeBilling: true,
    includeDestination: true,
    includeUser: true,
    includeDevice: true,
    includeQualityMetrics: true,
    includeNetworkMetrics: true,
  });

  // 5. Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAllFilteredSelected, setIsAllFilteredSelected] = useState<boolean>(true);

  // 6. Generation & Modal States
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState<{
    fileName: string;
    fileSize: string;
    recordCount: number;
    format: ExportFormat;
    generatedTimestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 7. History & Stats State
  const [historyItems, setHistoryItems] = useState<ExportHistoryItem[]>(mockExportHistory);
  const [stats, setStats] = useState<ExportStats>(mockExportStats);

  // Auto-generate sensible default filename whenever tab, type, or date changes
  useEffect(() => {
    const prefix = mainTab === 'cdr' ? 'CDR_Export' : 'CMR_Quality_Export';
    const typeTag =
      mainTab === 'cdr'
        ? cdrType === 'billing-cdrs'
          ? '_Billing'
          : cdrType === 'international-calls'
          ? '_International'
          : ''
        : cmrType === 'issue-records'
        ? '_Issues'
        : '';
    setFileName(`${prefix}${typeTag}_${fromDate}_to_${toDate}`);
  }, [mainTab, cdrType, cmrType, fromDate, toDate]);

  // Update dates when presets change
  const handleDatePresetChange = (preset: ExportDatePreset) => {
    setDatePreset(preset);
    if (preset === 'today') {
      setFromDate('2026-09-11');
      setToDate('2026-09-11');
    } else if (preset === 'yesterday') {
      setFromDate('2026-09-10');
      setToDate('2026-09-10');
    } else if (preset === 'last-7-days') {
      setFromDate('2026-09-04');
      setToDate('2026-09-11');
    } else if (preset === 'last-30-days') {
      setFromDate('2026-08-12');
      setToDate('2026-09-11');
    } else if (preset === 'this-month') {
      setFromDate('2026-09-01');
      setToDate('2026-09-11');
    } else if (preset === 'prev-month') {
      setFromDate('2026-08-01');
      setToDate('2026-08-31');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      department: 'All Departments',
      extensionMode: 'all',
      extensionValue: '',
      device: 'All Devices',
      callType: 'All',
      callStatus: 'All',
      cmrQuality: 'All',
      minAmount: '',
      maxAmount: '',
      minDuration: '',
      maxDuration: '',
    });
    setSelectedIds(new Set());
    setIsAllFilteredSelected(true);
    setErrorMessage(null);
  };

  // Filtered CDR Data
  const filteredCdrRecords = useMemo(() => {
    return mockCdrExportRecords.filter((rec) => {
      // Type filter
      if (cdrType === 'billing-cdrs' && rec.amount <= 0) return false;
      if (cdrType === 'internal-calls' && rec.callType !== 'Internal') return false;
      if (cdrType === 'external-calls' && rec.callType !== 'External') return false;
      if (cdrType === 'international-calls' && rec.callType !== 'International') return false;
      if (cdrType === 'failed-calls' && rec.status === 'Completed') return false;

      // Department filter
      if (filters.department !== 'All Departments' && rec.department !== filters.department) {
        return false;
      }

      // Extension filter
      if (filters.extensionMode !== 'all' && filters.extensionValue.trim()) {
        const extVal = filters.extensionValue.trim().toLowerCase();
        if (!rec.extension.toLowerCase().includes(extVal)) return false;
      }

      // Device filter
      if (filters.device !== 'All Devices') {
        const devId = filters.device.split(' ')[0];
        if (rec.device !== devId) return false;
      }

      // Call Type
      if (filters.callType !== 'All' && rec.callType !== filters.callType) {
        return false;
      }

      // Call Status
      if (filters.callStatus !== 'All' && rec.status !== filters.callStatus) {
        return false;
      }

      // Amount filter
      if (filters.minAmount && rec.amount < Number(filters.minAmount)) return false;
      if (filters.maxAmount && rec.amount > Number(filters.maxAmount)) return false;

      // Duration filter
      if (filters.minDuration && rec.durationSec < Number(filters.minDuration)) return false;
      if (filters.maxDuration && rec.durationSec > Number(filters.maxDuration)) return false;

      return true;
    });
  }, [cdrType, filters]);

  // Filtered CMR Data
  const filteredCmrRecords = useMemo(() => {
    return mockCmrExportRecords.filter((rec) => {
      // CMR Type filter
      if (cmrType === 'quality-records' && rec.qualityStatus === 'Poor') return true;
      if (cmrType === 'issue-records' && rec.qualityIssue === 'None') return false;

      // Device filter
      if (filters.device !== 'All Devices') {
        const devId = filters.device.split(' ')[0];
        if (rec.device !== devId) return false;
      }

      // Extension filter
      if (filters.extensionMode !== 'all' && filters.extensionValue.trim()) {
        const extVal = filters.extensionValue.trim().toLowerCase();
        if (!rec.extension.toLowerCase().includes(extVal)) return false;
      }

      // Quality grade
      if (filters.cmrQuality === 'Good' && rec.qualityStatus !== 'Good') return false;
      if (filters.cmrQuality === 'Fair' && rec.qualityStatus !== 'Fair') return false;
      if (filters.cmrQuality === 'Poor' && rec.qualityStatus !== 'Poor') return false;
      if (filters.cmrQuality === 'Quality Issues' && rec.qualityIssue === 'None') return false;

      // Duration filter
      if (filters.minDuration && rec.durationSec < Number(filters.minDuration)) return false;
      if (filters.maxDuration && rec.durationSec > Number(filters.maxDuration)) return false;

      return true;
    });
  }, [cmrType, filters]);

  // Total filtered records
  const totalFilteredCount = mainTab === 'cdr' ? filteredCdrRecords.length : filteredCmrRecords.length;

  // Selection handlers
  const handleToggleSelectRecord = (id: string) => {
    setIsAllFilteredSelected(false);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllCurrentPage = () => {
    setIsAllFilteredSelected(false);
    const records = mainTab === 'cdr' ? filteredCdrRecords : filteredCmrRecords;
    const pageIds = records.slice(0, 10).map((r) => r.id);
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
    const records = mainTab === 'cdr' ? filteredCdrRecords : filteredCmrRecords;
    setSelectedIds(new Set(records.map((r) => r.id)));
  };

  const handleClearSelection = () => {
    setIsAllFilteredSelected(false);
    setSelectedIds(new Set());
  };

  const effectiveSelectedCount = isAllFilteredSelected ? totalFilteredCount : selectedIds.size;

  // Trigger Export Process
  const handleTriggerExport = () => {
    setErrorMessage(null);

    // Validations
    if (new Date(fromDate) > new Date(toDate)) {
      setErrorMessage('To Date cannot be earlier than From Date. Please correct the date range.');
      return;
    }
    if (totalFilteredCount === 0 || effectiveSelectedCount === 0) {
      setErrorMessage('No records selected for export. Please adjust your filters.');
      return;
    }
    if (!fileName.trim()) {
      setErrorMessage('Please provide a valid file name.');
      return;
    }

    // Launch simulated progress
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);

          // Success result
          const finalRecordCount = isAllFilteredSelected ? 12486 : effectiveSelectedCount * 120;
          const calculatedSize =
            format === 'csv'
              ? `${(finalRecordCount * 0.22 / 1000).toFixed(1)} MB`
              : format === 'excel'
              ? `${(finalRecordCount * 0.28 / 1000).toFixed(1)} MB`
              : format === 'pdf'
              ? `${(finalRecordCount * 0.45 / 1000).toFixed(1)} MB`
              : `${(finalRecordCount * 0.18 / 1000).toFixed(1)} MB`;

          const result = {
            fileName: `${fileName}.${format === 'excel' ? 'xlsx' : format}`,
            fileSize: calculatedSize,
            recordCount: finalRecordCount,
            format,
            generatedTimestamp: '11 Sep 2026, 11:35',
          };
          setExportResult(result);

          // Append to history
          const newHistoryItem: ExportHistoryItem = {
            exportId: `EXP-20260911-${String(historyItems.length + 1).padStart(3, '0')}`,
            dateTime: '11 Sep 2026 11:35',
            exportType: mainTab === 'cdr' ? `${cdrType.replace('-', ' ')}` : `${cmrType.replace('-', ' ')}`,
            format: (format.toUpperCase() === 'EXCEL' ? 'Excel' : format.toUpperCase()) as any,
            dateRange: `${fromDate} – ${toDate}`,
            recordCount: finalRecordCount,
            generatedBy: 'Admin (Rajesh K.)',
            fileName: result.fileName,
            fileSize: calculatedSize,
            status: 'Completed',
          };
          setHistoryItems((prev) => [newHistoryItem, ...prev]);

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalExports: prev.totalExports + 1,
            cdrExports: mainTab === 'cdr' ? prev.cdrExports + 1 : prev.cdrExports,
            cmrExports: mainTab === 'cmr' ? prev.cmrExports + 1 : prev.cmrExports,
          }));

          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  // Perform Actual File Download
  const handleDownloadFile = () => {
    if (mainTab === 'cdr') {
      const recordsToExport = filteredCdrRecords.map((r) => {
        const obj: Record<string, any> = {};
        obj['CDR ID'] = r.cdrId;
        obj['Date & Time'] = r.dateTime;
        if (toggles.includeUser) obj['User'] = r.user;
        obj['Extension'] = r.extension;
        if (toggles.includeDevice) obj['Device'] = r.device;
        obj['Department'] = r.department;
        if (toggles.includeDestination) {
          obj['Destination'] = r.destination;
          obj['Destination Number'] = r.destinationNumber;
        }
        obj['Call Type'] = r.callType;
        obj['Duration'] = r.duration;
        if (toggles.includeBilling) {
          obj['Tariff'] = r.tariff;
          obj['Amount (INR)'] = r.amount.toFixed(2);
        }
        obj['Status'] = r.status;
        return obj;
      });

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(recordsToExport, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        exportToCSV(recordsToExport, fileName);
      }
    } else {
      const recordsToExport = filteredCmrRecords.map((r) => {
        const obj: Record<string, any> = {};
        obj['CMR ID'] = r.cmrId;
        obj['CDR ID'] = r.cdrId;
        obj['Date & Time'] = r.dateTime;
        if (toggles.includeDevice) obj['Device'] = r.device;
        obj['Extension'] = r.extension;
        obj['Duration'] = r.duration;
        if (toggles.includeQualityMetrics) {
          obj['Quality Status'] = r.qualityStatus;
          obj['Quality Issue'] = r.qualityIssue;
          obj['Score'] = r.score;
        }
        if (toggles.includeNetworkMetrics) {
          obj['Packet Loss'] = r.packetLoss;
          obj['Jitter'] = r.jitter;
          obj['Latency'] = r.latency;
        }
        return obj;
      });

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(recordsToExport, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        exportToCSV(recordsToExport, fileName);
      }
    }
  };

  const handleDownloadHistoryItem = (item: ExportHistoryItem) => {
    const dummy = [
      {
        'Export ID': item.exportId,
        'File Name': item.fileName,
        'Date Range': item.dateRange,
        Records: item.recordCount,
        'Generated By': item.generatedBy,
        Status: item.status,
      },
    ];
    exportToCSV(dummy, item.fileName.replace(/\.[^/.]+$/, ''));
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* 1. Page Header & Tab Toggle */}
      <ExportHeader activeTab={mainTab} onTabChange={setMainTab} />

      {/* 2. Export Type Selector */}
      <ExportTypeSelector
        mainTab={mainTab}
        cdrType={cdrType}
        cmrType={cmrType}
        onCdrTypeChange={setCdrType}
        onCmrTypeChange={setCmrType}
      />

      {/* 3. Expandable Filter Panel */}
      <ExportFilterPanel
        mainTab={mainTab}
        datePreset={datePreset}
        fromDate={fromDate}
        toDate={toDate}
        filters={filters}
        onDatePresetChange={handleDatePresetChange}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onFilterChange={setFilters}
        onApplyFilters={() => {
          setSelectedIds(new Set());
          setIsAllFilteredSelected(true);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Export Dataset Summary Card */}
      <ExportSummaryCard
        mainTab={mainTab}
        dateRangeStr={`${fromDate} — ${toDate}`}
        recordsCount={mainTab === 'cdr' ? 12486 : 8642}
        departmentsCount={8}
        extensionsCount={428}
        totalDurationStr="8,426 hrs 18 min"
        totalBilling={428640}
        goodQualityCount={7824}
        fairQualityCount={612}
        poorQualityCount={206}
      />

      {/* Error Feedback if any */}
      {errorMessage && (
        <ExportSuccessCard
          isError={true}
          errorMessage={errorMessage}
          fileName=""
          fileSize=""
          recordCount={0}
          format={format}
          generatedTimestamp=""
          onDownload={() => {}}
          onReset={handleResetFilters}
          onRetry={handleTriggerExport}
        />
      )}

      {/* Success Ready Card */}
      {exportResult && !errorMessage && (
        <ExportSuccessCard
          fileName={exportResult.fileName}
          fileSize={exportResult.fileSize}
          recordCount={exportResult.recordCount}
          format={exportResult.format}
          generatedTimestamp={exportResult.generatedTimestamp}
          onDownload={handleDownloadFile}
          onReset={() => setExportResult(null)}
        />
      )}

      {/* 5. Data Preview Table with Row Selection */}
      <ExportDataPreview
        mainTab={mainTab}
        cdrRecords={filteredCdrRecords}
        cmrRecords={filteredCmrRecords}
        totalFilteredCount={totalFilteredCount}
        selectedIds={selectedIds}
        isAllFilteredSelected={isAllFilteredSelected}
        onToggleSelectRecord={handleToggleSelectRecord}
        onSelectAllCurrentPage={handleSelectAllCurrentPage}
        onSelectAllFiltered={handleSelectAllFiltered}
        onClearSelection={handleClearSelection}
      />

      {/* 6. Export Format & Column Options */}
      <ExportFormatAndOptions
        mainTab={mainTab}
        format={format}
        fileName={fileName}
        toggles={toggles}
        selectedCount={effectiveSelectedCount}
        onFormatChange={setFormat}
        onFileNameChange={setFileName}
        onToggleChange={(k, v) => setToggles((prev) => ({ ...prev, [k]: v }))}
        onTriggerExport={handleTriggerExport}
      />

      {/* 7. Export History & Statistics */}
      <ExportHistorySection
        stats={stats}
        historyItems={historyItems}
        onDownloadHistoryItem={handleDownloadHistoryItem}
      />

      {/* Simulated Live Progress Modal */}
      <ExportProgressModal
        isOpen={isExporting}
        progress={exportProgress}
        recordCount={effectiveSelectedCount}
        format={format}
      />
    </div>
  );
};
