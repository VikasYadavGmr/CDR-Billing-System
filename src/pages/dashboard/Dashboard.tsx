import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BillingPeriod } from '../../types/billing';
import { billingService } from '../../services/billingService';
import { taxService } from '../../services/taxService';
import { formatCurrency } from '../../utils/billingCalculator';
import {
  Percent,
  PhoneCall,
  Clock3,
  Receipt,
  PhoneForwarded,
  Radio,
  Globe,
  TrendingUp,
  Download,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { exportToCSV } from '../../utils/exportUtils';

// 1. Daily Call Volume Data (Monday - Sunday)
const dailyCallVolumeData = [
  { day: 'Mon', internal: 320, local: 410, mobile: 280, std: 180, isd: 50, total: 1240 },
  { day: 'Tue', internal: 390, local: 520, mobile: 360, std: 240, isd: 70, total: 1580 },
  { day: 'Wed', internal: 350, local: 480, mobile: 310, std: 220, isd: 60, total: 1420 },
  { day: 'Thu', internal: 440, local: 590, mobile: 400, std: 250, isd: 80, total: 1760 },
  { day: 'Fri', internal: 490, local: 640, mobile: 430, std: 270, isd: 90, total: 1920 },
  { day: 'Sat', internal: 260, local: 340, mobile: 210, std: 130, isd: 40, total: 980 },
  { day: 'Sun', internal: 190, local: 260, mobile: 160, std: 110, isd: 30, total: 750 },
];

// 2. Department-wise Usage (Operations, Security, Engineering, IT, Finance, HR, Admin, Customer Service)
const departmentUsageData = [
  { department: 'Network Operations', calls: 6420, billing: 19420, durationHours: 1040 },
  { department: 'Security & Compliance', calls: 5180, billing: 15180, durationHours: 890 },
  { department: 'Engineering', calls: 3840, billing: 11040, durationHours: 620 },
  { department: 'IT & Telecom', calls: 2950, billing: 6480, durationHours: 410 },
  { department: 'Customer Service', calls: 2480, billing: 9615, durationHours: 350 },
  { department: 'Finance & Accounts', calls: 1720, billing: 3545, durationHours: 230 },
  { department: 'Administration', calls: 1340, billing: 4930, durationHours: 180 },
  { department: 'Field Operations', calls: 926, billing: 8260, durationHours: 122 },
];

// 3. Call Type Distribution (Internal, Local, STD, ISD, Mobile)
const callTypeDistributionData = [
  { name: 'Internal (Intercom)', value: 6431, cost: '€0.00', color: '#0d9488', rate: 'Free' },
  { name: 'Local (PSTN)', value: 7850, cost: '€18,840', color: '#0284c7', rate: '€0.03/m' },
  { name: 'Mobile', value: 5420, cost: '€21,480', color: '#6366f1', rate: '€0.12/m' },
  { name: 'STD (National)', value: 3840, cost: '€23,040', color: '#f59e0b', rate: '€0.06/m' },
  { name: 'ISD (International)', value: 1315, cost: '€14,612', color: '#f43f5e', rate: '€0.45/m' },
];

// 4. Monthly Billing Trend (Last 6 months)
const monthlyBillingTrendData = [
  { month: 'Mar 2026', billing: 81400, calls: 21400, talkTime: 3250 },
  { month: 'Apr 2026', billing: 85100, calls: 22800, talkTime: 3410 },
  { month: 'May 2026', billing: 88300, calls: 23200, talkTime: 3540 },
  { month: 'Jun 2026', billing: 91200, calls: 24100, talkTime: 3680 },
  { month: 'Jul 2026', billing: 92000, calls: 24400, talkTime: 3750 },
  { month: 'Aug 2026', billing: 95438, calls: 24856, talkTime: 3842 },
];

// 5. High Usage Analysis Table
const highUsageExtensions = [
  {
    extension: '2451',
    user: 'Capt. Rajesh Sharma',
    department: 'Airport Operations',
    terminal: 'Operations Control Center (OCC)',
    calls: 842,
    duration: '46 hrs 15m',
    cost: '€1,842',
    exceeded: true,
  },
  {
    extension: '3187',
    user: 'Amit Kumar (Control Room)',
    department: 'Security & Compliance',
    terminal: 'Terminal 3 - Airside',
    calls: 764,
    duration: '39 hrs 40m',
    cost: '€1,610',
    exceeded: true,
  },
  {
    extension: '4212',
    user: 'Pooja Verma (Duty Mgr)',
    department: 'Engineering',
    terminal: 'Admin Building 2F',
    calls: 621,
    duration: '34 hrs 10m',
    cost: '€1,395',
    exceeded: false,
  },
  {
    extension: '5104',
    user: 'Helpdesk Central',
    department: 'Customer Service',
    terminal: 'Terminal 2 - Arrivals',
    calls: 589,
    duration: '28 hrs 50m',
    cost: '€1,208',
    exceeded: false,
  },
  {
    extension: '1004',
    user: 'Cargo Shift Supervisor',
    department: 'Airport Operations',
    terminal: 'Cargo Terminal Bay 4',
    calls: 452,
    duration: '22 hrs 35m',
    cost: '€1,022',
    exceeded: false,
  },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('Aug 2026');
  const [deptChartType, setDeptChartType] = useState<'billing' | 'calls'>('billing');
  const [currentPeriod, setCurrentPeriod] = useState<BillingPeriod | null>(null);
  const [taxStats, setTaxStats] = useState({ countries: 0, activeRules: 0 });
  const [exemptAmount, setExemptAmount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [periods, rules, summary] = await Promise.all([
        billingService.getBillingPeriods(),
        taxService.getTaxRules(),
        billingService.getBillingPeriods().then((p) =>
          p.length ? billingService.getTaxSummary(p[0].periodCode) : null
        ),
      ]);
      setCurrentPeriod(periods[0] ?? null);
      const activeRules = rules.filter((r) => r.status === 'Active');
      setTaxStats({
        countries: new Set(activeRules.map((r) => r.isoCode)).size,
        activeRules: activeRules.length,
      });
      setExemptAmount(summary?.exemptAmount ?? 0);
    };
    load();
  }, []);

  const handleExportSummary = () => {
    exportToCSV(
      departmentUsageData,
      'Airport_CDR_Department_Summary',
      [
        { key: 'department', label: 'Department' },
        { key: 'calls', label: 'Total Calls' },
        { key: 'billing', label: 'Billing Amount (€)' },
        { key: 'durationHours', label: 'Duration (Hours)' },
      ]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Actions & Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold tracking-wide border border-teal-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Live PBX Metrics
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">• August 2026 Cycle</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Aug 2026">August 2026 (Current Cycle)</option>
              <option value="Jul 2026">July 2026</option>
              <option value="Jun 2026">June 2026</option>
            </select>
          </div>

          <button
            onClick={handleExportSummary}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export Summary</span>
          </button>

          <button
            onClick={() => navigate('/cdr')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>View All CDRs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Core KPI Summary Cards (Exactly matching prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Calls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">Total Calls</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">24,856</h3>
            <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+12.4% vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Talk Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">Total Talk Time</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">3,842 hrs</h3>
            <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Avg 9.2m / call</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Billing Amount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">Total Billing</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-teal-700 tracking-tight">
              {formatCurrency(currentPeriod?.totalAmount ?? 0, false)}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Incl. VAT ({formatCurrency(currentPeriod?.taxAmount ?? 0, false)})
            </p>
          </div>
        </div>

        {/* Card 4: Billable Calls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">Billable Calls</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PhoneForwarded className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">18,425</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">74.1% of total traffic</p>
          </div>
        </div>

        {/* Card 5: Internal Calls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">Internal Calls</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">6,431</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Free Intercom (€0.00)</p>
          </div>
        </div>

        {/* Card 6: External Calls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">External Calls</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">18,425</h3>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Local / STD / ISD / Mobile</p>
          </div>
        </div>
      </div>

      {/* Tax & VAT Overview — figures come from the configured tax master */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tax &amp; VAT Overview</h3>
              <p className="text-xs text-slate-500">
                {currentPeriod?.period ?? 'Current cycle'} • rates resolved from the Tax &amp; VAT master
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tax')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs self-start sm:self-auto"
          >
            <span>Manage Tax Rules</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              label: 'Taxable Amount',
              value: formatCurrency(currentPeriod?.subtotal ?? 0, false),
              tone: 'text-slate-900',
            },
            {
              label: 'VAT Collected',
              value: formatCurrency(currentPeriod?.taxAmount ?? 0, false),
              tone: 'text-teal-700',
            },
            {
              label: 'Tax-Exempt Amount',
              value: formatCurrency(exemptAmount, false),
              tone: 'text-indigo-700',
            },
            {
              label: 'Countries Configured',
              value: String(taxStats.countries),
              tone: 'text-slate-900',
            },
            {
              label: 'Active Tax Rules',
              value: String(taxStats.activeRules),
              tone: 'text-slate-900',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block">
                {item.label}
              </span>
              <span className={`text-lg font-bold tracking-tight mt-1 block ${item.tone}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 1 Charts: Daily Call Volume & Call Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Daily Call Volume (Stacked Bar) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daily Call Volume</h3>
              <p className="text-xs text-slate-500">Day-wise call traffic distribution across call types</p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/50">
              Peak: Friday (1,920 Calls)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCallVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="internal" name="Internal" fill="#0d9488" stackId="a" />
                <Bar dataKey="local" name="Local (PSTN)" fill="#0284c7" stackId="a" />
                <Bar dataKey="mobile" name="Mobile" fill="#6366f1" stackId="a" />
                <Bar dataKey="std" name="STD" fill="#f59e0b" stackId="a" />
                <Bar dataKey="isd" name="ISD" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Call Type Distribution (Donut) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Call Type Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of calls and tariff rates</p>
          </div>

          <div className="h-52 w-full my-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={callTypeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {callTypeDistributionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} calls`, 'Volume']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Total Calls</span>
              <span className="text-lg font-bold text-slate-900">24,856</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {callTypeDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-0.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium truncate max-w-[130px]">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-900">{item.value.toLocaleString()}</span>
                  <span className="text-[10.5px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                    {item.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Department Usage & Monthly Billing Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Department-wise Usage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department-wise Telephone Usage</h3>
              <p className="text-xs text-slate-500">Comparative expenditure and call volume per division</p>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setDeptChartType('billing')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  deptChartType === 'billing' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cost (€)
              </button>
              <button
                onClick={() => setDeptChartType('calls')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  deptChartType === 'calls' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Call Count
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentUsageData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => (deptChartType === 'billing' ? `€${val / 1000}k` : `${val}`)}
                />
                <YAxis
                  dataKey="department"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [
                    deptChartType === 'billing' ? `€${Number(val).toLocaleString()}` : `${Number(val).toLocaleString()} calls`,
                    deptChartType === 'billing' ? 'Monthly Cost' : 'Calls',
                  ]}
                />
                <Bar
                  dataKey={deptChartType === 'billing' ? 'billing' : 'calls'}
                  fill="#0f766e"
                  radius={[0, 6, 6, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Billing Trend (6-Month Area Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Billing Trend (Last 6 Months)</h3>
              <p className="text-xs text-slate-500">Historical telecom expenditure progression</p>
            </div>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.0% YoY</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBillingTrendData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `€${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`€${Number(val).toLocaleString()}`, 'Billing Total']}
                />
                <Area
                  type="monotone"
                  dataKey="billing"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#billingGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: High Usage Analysis Section (Section 15 of Prompt) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">High Usage Analysis (Top Extensions)</h3>
              <p className="text-xs text-slate-500">Extensions with unusually heavy call duration and billing costs</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center space-x-1"
          >
            <span>Full High Usage Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-y border-slate-200/80">
                <th className="py-3 px-4">Extension</th>
                <th className="py-3 px-4">Employee / Line User</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Total Calls</th>
                <th className="py-3 px-4 text-right">Duration</th>
                <th className="py-3 px-4 text-right">Monthly Cost</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {highUsageExtensions.map((row) => (
                <tr key={row.extension} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                      Ext {row.extension}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{row.user}</td>
                  <td className="py-3 px-4 text-slate-600">{row.department}</td>
                  <td className="py-3 px-4 text-slate-500">{row.terminal}</td>
                  <td className="py-3 px-4 text-right font-semibold">{row.calls.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">{row.duration}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{row.cost}</td>
                  <td className="py-3 px-4 text-center">
                    {row.exceeded ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                        Limit Exceeded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => navigate(`/cdr?extension=${row.extension}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                    >
                      Inspect CDRs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
