import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IndianRupee, TrendingUp, Users, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { ReportFilter } from '../components/ReportFilter';
import { ReportSummaryCards } from '../components/ReportSummaryCards';
import { ReportTable } from '../components/ReportTable';
import { ExportReportButton } from '../components/ExportReportButton';
import { topChargeRows, topChargeSummary } from '../mock/userReportsData';
import type { ReportFilterValues, TopChargeRow } from '../types';

const defaultFilters: ReportFilterValues = {
  department: 'All Departments',
  location: 'All Locations',
  callType: 'All Call Types',
  dateFrom: '2026-09-01',
  dateTo: '2026-09-10',
  n: 10,
};

export const TopUsersByCharge: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilterValues>(defaultFilters);
  const [applied, setApplied] = useState<ReportFilterValues>(defaultFilters);

  const rows = useMemo(() => {
    let data = [...topChargeRows];
    if (applied.department && applied.department !== 'All Departments') {
      data = data.filter((r) => r.department === applied.department);
    }
    return data.slice(0, applied.n || 10).map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [applied]);

  const chartRows = rows.slice(0, 10);

  const columns = [
    { key: 'rank', label: 'Rank', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    {
      key: 'extension',
      label: 'Extension',
      render: (r: TopChargeRow) => (
        <span className="font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
          {r.extension}
        </span>
      ),
    },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'calls', label: 'Calls', sortable: true, align: 'right' as const },
    { key: 'duration', label: 'Duration' },
    { key: 'billableCalls', label: 'Billable Calls', sortable: true, align: 'right' as const },
    {
      key: 'totalCost',
      label: 'Total Cost',
      sortable: true,
      align: 'right' as const,
      render: (r: TopChargeRow) => <span className="font-bold">{formatCurrency(r.totalCost, false)}</span>,
    },
  ];

  return (
    <div className="space-y-4" id="top-charge-report">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Top N by Charge</h2>
        <p className="text-xs text-slate-500 mt-1">
          Identify users generating the highest telephone billing cost.
        </p>
      </div>

      <ReportFilter
        fields={['dateFrom', 'dateTo', 'department', 'location', 'callType', 'n']}
        values={filters}
        onChange={setFilters}
        onSearch={() => setApplied(filters)}
        onReset={() => {
          setFilters(defaultFilters);
          setApplied(defaultFilters);
        }}
        extraActions={
          <ExportReportButton
            filename="top_n_by_charge"
            data={rows as unknown as Record<string, unknown>[]}
            printElementId="top-charge-report"
          />
        }
      />

      <ReportSummaryCards
        columns="grid-cols-2 xl:grid-cols-4"
        items={[
          { label: 'Highest User Cost', value: formatCurrency(topChargeSummary.highestUserCost, false), icon: TrendingUp },
          { label: 'Average User Cost', value: formatCurrency(topChargeSummary.averageUserCost, false), icon: Wallet },
          { label: 'Total Cost', value: formatCurrency(topChargeSummary.totalCost, false), icon: IndianRupee },
          { label: 'Total Billable Users', value: topChargeSummary.totalBillableUsers, icon: Users },
        ]}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-[340px] flex flex-col">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Top Users by Cost</h3>
        <p className="text-xs text-slate-500 mb-3">Horizontal bar chart (Top 10)</p>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="user" width={110} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value ?? 0), false), 'Total Cost']} />
              <Bar dataKey="totalCost" fill="#0284c7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ReportTable
        data={rows as unknown as Record<string, unknown>[]}
        columns={columns as any}
        rowKey={(row) => String((row as unknown as TopChargeRow).extension)}
      />
    </div>
  );
};
