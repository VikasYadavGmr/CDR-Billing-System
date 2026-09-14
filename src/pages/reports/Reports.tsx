import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Coins,
  Download,
  FileSpreadsheet,
  FileText,
  HardDrive,
  LayoutGrid,
  Percent,
  PhoneCall,
  Printer,
  Server,
  Timer,
} from 'lucide-react';
import { ExportCdrCmrPage } from '../../modules/cdr/export/pages/ExportCdrCmrPage';
import { DeviceReportsPage } from '../../modules/cdr/reports/device/pages/DeviceReportsPage';
import { SystemReportsPage } from '../../modules/cdr/reports/system/pages/SystemReportsPage';
import { TopUsersByCalls } from '../../modules/cdr/reports/user/pages/TopUsersByCalls';
import { TopUsersByCost } from '../../modules/cdr/reports/user/pages/TopUsersByCost';
import { TopUsersByDuration } from '../../modules/cdr/reports/user/pages/TopUsersByDuration';
import { UserCallHistory } from '../../modules/cdr/reports/user/pages/UserCallHistory';
import { exportToCSV, printElement } from '../../utils/exportUtils';
import { formatCurrency } from '../../utils/billingCalculator';
import { mockCDRRecords, mockDeptUsageData, mockHighUsageExtensions } from '../../mock-data/cdrData';
import { mockExtensions } from '../../mock-data/extensionData';

type ReportCategory = 'all' | 'user' | 'system' | 'device' | 'tax' | 'export' | 'standard';

type ReportMainTab =
  | 'hub'
  | 'call-history'
  | 'top-cost'
  | 'top-duration'
  | 'top-calls'
  | 'system-reports'
  | 'device-reports'
  | 'export-cdrs-cmrs'
  | 'standard-catalog';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReportMainTab>('hub');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('all');

  // State for standard catalog tab
  const [selectedReport, setSelectedReport] = useState('dept-usage');
  const [dateRange, setDateRange] = useState('aug-2026');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const reportList = [
    { id: 'dept-usage', name: 'Department Usage Report', desc: 'Call volume & telephone expenses per airport division' },
    { id: 'ext-usage', name: 'Extension Usage Report', desc: 'Detailed metrics for all active extensions' },
    { id: 'daily-call', name: 'Daily Call Report', desc: 'Day-by-day inbound/outbound trunk call aggregations' },
    { id: 'monthly-cdr', name: 'Monthly CDR Summary', desc: 'Consolidated executive overview of call traffic and revenue' },
    { id: 'high-usage', name: 'High Usage Analysis Report', desc: 'Audit report of extensions exceeding threshold budgets' },
    { id: 'billing-report', name: 'Tax & Statement Summary', desc: 'Summary of call expenditures and operational totals' },
  ];

  const handleExportCSV = () => {
    if (selectedReport === 'dept-usage') {
      exportToCSV(mockDeptUsageData, 'Airport_Dept_Usage_Report');
    } else if (selectedReport === 'ext-usage') {
      exportToCSV(mockExtensions, 'Airport_Extension_Usage_Report');
    } else if (selectedReport === 'high-usage') {
      exportToCSV(mockHighUsageExtensions, 'Airport_High_Usage_Report');
    } else {
      exportToCSV(mockCDRRecords, 'Airport_CDR_Report');
    }
  };

  const reportCards = [
    // User Analytics
    {
      id: 'call-history' as ReportMainTab,
      category: 'user',
      title: 'User Call History',
      categoryLabel: 'User Analytics',
      icon: FileText,
      badge: 'CDR Audit',
      desc: 'Full chronological call records per employee with termination causes, durations, gateway routing, and call status.',
      metric: '8,642 Calls Logged',
      route: '/reports/user/call-history',
    },
    {
      id: 'top-cost' as ReportMainTab,
      category: 'user',
      title: 'Top Users by Cost',
      categoryLabel: 'User Analytics',
      icon: Coins,
      badge: 'Expenditure',
      desc: 'Rankings of highest telecom spending staff and departments with billable call ratios and talk-time correlation.',
      metric: '€8,450.20 Top User',
      route: '/reports/user/top-by-cost',
    },
    {
      id: 'top-duration' as ReportMainTab,
      category: 'user',
      title: 'Top Users by Duration',
      categoryLabel: 'User Analytics',
      icon: Timer,
      badge: 'Talk-Time',
      desc: 'Analysis of airport extensions with longest cumulative voice talk-time and average call duration metrics.',
      metric: '184h 30m Peak',
      route: '/reports/user/top-by-duration',
    },
    {
      id: 'top-calls' as ReportMainTab,
      category: 'user',
      title: 'Top Users by Call Count',
      categoryLabel: 'User Analytics',
      icon: PhoneCall,
      badge: 'Call Volume',
      desc: 'Call volume distribution highlighting busy dispatch desks, security control, and passenger service counters.',
      metric: '1,420 Max Calls',
      route: '/reports/user/top-by-calls',
    },

    // System Intelligence
    {
      id: 'system-reports' as ReportMainTab,
      category: 'system',
      title: 'System & Traffic Reports',
      categoryLabel: 'System Wide',
      icon: Server,
      badge: 'PBX Trunks',
      desc: 'Airport-wide telephone system analytics, trunk utilization, concurrent channels, and hourly peak traffic patterns.',
      metric: '120 SIP Channels',
      route: '/reports/system',
    },

    // Hardware & Devices
    {
      id: 'device-reports' as ReportMainTab,
      category: 'device',
      title: 'Device & Hardware Reports',
      categoryLabel: 'Hardware Inventory',
      icon: HardDrive,
      badge: 'Endpoints',
      desc: 'Telephone device-level performance, Cisco IP phone model utilization, location load, and hardware health.',
      metric: '280 IP Phones Active',
      route: '/reports/device',
    },

    // Tax & VAT
    {
      id: 'tax-reports' as ReportMainTab,
      category: 'tax',
      title: 'Tax & VAT Reports',
      categoryLabel: 'Taxation',
      icon: Percent,
      badge: 'VAT',
      desc: 'Tax summary, country-wise tax, configured tax rates, and the tax rule audit trail for European VAT.',
      metric: '4 Tax Reports',
      route: '/tax/reports',
    },

    // Export Tool
    {
      id: 'export-cdrs-cmrs' as ReportMainTab,
      category: 'export',
      title: 'Export CDR Records',
      categoryLabel: 'Data Export',
      icon: FileSpreadsheet,
      badge: 'Data Utility',
      desc: 'Custom data extractor to filter, preview, and generate structured CSV, Excel, and PDF telecom archives.',
      metric: 'CSV / XLS / PDF',
      route: '/reports/export',
    },

    // Standard Catalog
    {
      id: 'standard-catalog' as ReportMainTab,
      category: 'standard',
      title: 'Standard Telecom Reports',
      categoryLabel: 'Pre-formatted',
      icon: BarChart3,
      badge: 'Audit Logs',
      desc: 'Pre-formatted executive statements for departmental call audits, high usage exceptions, and traffic reports.',
      metric: '6 Standard Formats',
      route: '#',
    },
  ];

  const filteredCards = reportCards.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );

  return (
    <div className="space-y-4">
      {/* Top Header & Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {activeTab === 'hub'
                  ? 'CDR Reports & Telecom Analytics'
                  : reportCards.find((c) => c.id === activeTab)?.title || 'Telecom Report'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {activeTab === 'hub' ? 'Executive Portal' : 'Live Report View'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'hub'
                ? 'Centralized airport telecom reporting: user call histories, rankings, trunk traffic, and device performance.'
                : reportCards.find((c) => c.id === activeTab)?.desc || 'Official telecom audit report.'}
            </p>
          </div>
        </div>

        {/* Hub / Sub-page controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {activeTab !== 'hub' && (
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-teal-600" />
              <span>← All Reports Hub</span>
            </button>
          )}

          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as ReportMainTab)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-semibold focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-slate-700"
          >
            <option value="hub">📂 Reports Directory (Overview)</option>
            <optgroup label="User Analytics & Logs">
              <option value="call-history">User Call History</option>
              <option value="top-cost">Top Users by Cost</option>
              <option value="top-duration">Top Users by Duration</option>
              <option value="top-calls">Top Users by Call Count</option>
            </optgroup>
            <optgroup label="System & Hardware">
              <option value="system-reports">System & Traffic Reports</option>
              <option value="device-reports">Device & Hardware Reports</option>
            </optgroup>
            <optgroup label="Data Tools">
              <option value="export-cdrs-cmrs">Export CDR Records</option>
              <option value="standard-catalog">Standard Reports Catalog</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* 1. REPORTS HUB VIEW */}
      {activeTab === 'hub' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider mr-1 whitespace-nowrap">
                Category:
              </span>
              {[
                { id: 'all', label: 'All Reports (8)' },
                { id: 'user', label: 'User Analytics (4)' },
                { id: 'system', label: 'System Traffic (1)' },
                { id: 'device', label: 'Hardware (1)' },
                { id: 'tax', label: 'Tax & VAT (1)' },
                { id: 'export', label: 'Export Tool (1)' },
                { id: 'standard', label: 'Standard Logs (1)' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as ReportCategory)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 shadow-2xs group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-teal-100 text-teal-800">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {card.categoryLabel}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors mt-0.5">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/70">
                      {card.metric}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (card.route !== '#') {
                          navigate(card.route);
                        } else {
                          setActiveTab(card.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <span>Open Report →</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DEDICATED REPORT VIEWS (WHEN TAB IS SELECTED) */}
      {activeTab === 'call-history' && <UserCallHistory />}
      {activeTab === 'top-cost' && <TopUsersByCost />}
      {activeTab === 'top-duration' && <TopUsersByDuration />}
      {activeTab === 'top-calls' && <TopUsersByCalls />}
      {activeTab === 'system-reports' && <SystemReportsPage />}
      {activeTab === 'device-reports' && <DeviceReportsPage />}
      {activeTab === 'export-cdrs-cmrs' && <ExportCdrCmrPage />}

      {/* Standard Reports Catalog */}
      {activeTab === 'standard-catalog' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">Custom Reports Generator</span>
              <span className="text-xs text-slate-400 font-medium">• 6 Standard Formats</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => printElement('report-preview-area')}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Report</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Available Reports
              </h3>
              <div className="space-y-1">
                {reportList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReport(r.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all ${
                      selectedReport === r.id
                        ? 'bg-teal-600 text-white font-semibold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">{r.name}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        selectedReport === r.id ? 'text-teal-100' : 'text-slate-500'
                      }`}
                    >
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-medium text-slate-500">Period:</span>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none"
                    >
                      <option value="aug-2026">August 2026</option>
                      <option value="jul-2026">July 2026</option>
                      <option value="jun-2026">June 2026</option>
                      <option value="ytd">Year to Date (2026)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-medium text-slate-500">Department:</span>
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Airport Operations">Airport Operations</option>
                      <option value="Aviation Security">Aviation Security</option>
                      <option value="Ground Handling">Ground Handling</option>
                      <option value="Terminal Services">Terminal Services</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Showing generated data for <span className="font-semibold text-slate-900">{selectedReport}</span>
                </div>
              </div>

              {/* Printable/Preview Report Canvas */}
              <div id="report-preview-area" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {reportList.find((r) => r.id === selectedReport)?.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Airport Telecommunications System • Period: {dateRange.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">GENERATED ON</span>
                    <span className="text-xs font-mono font-bold text-slate-700">11-SEP-2026 11:30 AM</span>
                  </div>
                </div>

                {/* Table Data Preview */}
                {selectedReport === 'dept-usage' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3 text-right">Total Calls</th>
                          <th className="py-2.5 px-3 text-right">Duration (hrs)</th>
                          <th className="py-2.5 px-3 text-right">Total Cost (€)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {mockDeptUsageData.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{d.department}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{d.calls.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{d.durationHours} hrs</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(d.cost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport === 'ext-usage' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="py-2.5 px-3">Extension</th>
                          <th className="py-2.5 px-3">Assigned User</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3 text-right">Monthly Calls</th>
                          <th className="py-2.5 px-3 text-right">Usage (hrs)</th>
                          <th className="py-2.5 px-3 text-right">Cost (€)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {mockExtensions.slice(0, 8).map((ext) => (
                          <tr key={ext.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-teal-700">{ext.extension}</td>
                            <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{ext.employeeName}</td>
                            <td className="py-2.5 px-3 font-sans text-slate-600">{ext.department}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{ext.monthlyCalls}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{ext.monthlyUsageHours} hrs</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(ext.monthlyCost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedReport !== 'dept-usage' && selectedReport !== 'ext-usage' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="py-2.5 px-3">Timestamp</th>
                          <th className="py-2.5 px-3">Caller</th>
                          <th className="py-2.5 px-3">Called</th>
                          <th className="py-2.5 px-3">Call Type</th>
                          <th className="py-2.5 px-3 text-right">Duration</th>
                          <th className="py-2.5 px-3 text-right">Amount (€)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {mockCDRRecords.slice(0, 8).map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-slate-600">{c.startDate} {c.startTime}</td>
                            <td className="py-2.5 px-3 font-bold text-teal-700">{c.callerNumber}</td>
                            <td className="py-2.5 px-3 text-slate-900">{c.destinationNumber}</td>
                            <td className="py-2.5 px-3 font-sans">{c.callType}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600">{c.durationFormatted}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(c.totalAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
