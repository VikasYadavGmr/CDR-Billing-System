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
import { Building2, Clock3, PhoneCall, Receipt, Users } from 'lucide-react';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { ReportFilter } from '../components/ReportFilter';
import { ReportSummaryCards } from '../components/ReportSummaryCards';
import { ReportTable } from '../components/ReportTable';
import { ExportReportButton } from '../components/ExportReportButton';
import {
  departmentBillRows,
  departmentBillSummary,
  departmentUserDetails,
} from '../mock/userReportsData';
import type { DepartmentBillRow, ReportFilterValues } from '../types';

const defaultFilters: ReportFilterValues = {
  department: 'All Departments',
  location: 'All Locations',
  callType: 'All Call Types',
  dateFrom: '2026-09-01',
  dateTo: '2026-09-10',
};

type Metric = 'calls' | 'duration' | 'cost';

export const DepartmentBills: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilterValues>(defaultFilters);
  const [applied, setApplied] = useState<ReportFilterValues>(defaultFilters);
  const [metric, setMetric] = useState<Metric>('cost');
  const [detailDept, setDetailDept] = useState<string | null>(null);

  const rows = useMemo(() => {
    let data = [...departmentBillRows];
    if (applied.department && applied.department !== 'All Departments') {
      data = data.filter((r) => r.department === applied.department);
    }
    return data;
  }, [applied]);

  const chartData = rows.map((r) => ({
    department: r.department,
    calls: r.totalCalls,
    duration: r.totalDurationMin,
    cost: r.totalCost,
  }));

  const columns = [
    { key: 'department', label: 'Department', sortable: true },
    { key: 'users', label: 'Users', sortable: true, align: 'right' as const },
    { key: 'extensions', label: 'Extensions', sortable: true, align: 'right' as const },
    { key: 'totalCalls', label: 'Total Calls', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => r.totalCalls.toLocaleString('en-IE') },
    { key: 'incoming', label: 'Incoming', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => r.incoming.toLocaleString('en-IE') },
    { key: 'outgoing', label: 'Outgoing', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => r.outgoing.toLocaleString('en-IE') },
    { key: 'totalDurationMin', label: 'Total Duration', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => `${r.totalDurationMin.toLocaleString('en-IE')} min` },
    { key: 'billableCalls', label: 'Billable Calls', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => r.billableCalls.toLocaleString('en-IE') },
    { key: 'baseCost', label: 'Base Cost', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => formatCurrency(r.baseCost, false) },
    { key: 'tax', label: 'Tax', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => formatCurrency(r.tax, false) },
    { key: 'totalCost', label: 'Total Cost', sortable: true, align: 'right' as const, render: (r: DepartmentBillRow) => <span className="font-bold">{formatCurrency(r.totalCost, false)}</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (r: DepartmentBillRow) => (
        <button
          type="button"
          onClick={() => setDetailDept(r.department)}
          className="text-teal-700 font-semibold hover:underline"
        >
          View Details
        </button>
      ),
    },
  ];

  const detailUsers = detailDept ? departmentUserDetails[detailDept] || [] : [];

  return (
    <div className="space-y-4" id="department-bills-report">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Department Bills</h2>
        <p className="text-xs text-slate-500 mt-1">
          Show telephone usage and billing aggregated by department.
        </p>
      </div>

      <ReportFilter
        fields={['department', 'location', 'callType', 'dateFrom', 'dateTo']}
        values={filters}
        onChange={setFilters}
        onSearch={() => setApplied(filters)}
        onReset={() => {
          setFilters(defaultFilters);
          setApplied(defaultFilters);
        }}
        extraActions={
          <ExportReportButton
            filename="department_bills"
            data={rows as unknown as Record<string, unknown>[]}
            printElementId="department-bills-report"
          />
        }
      />

      <ReportSummaryCards
        columns="grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
        items={[
          { label: 'Total Departments', value: departmentBillSummary.totalDepartments, icon: Building2 },
          { label: 'Total Calls', value: departmentBillSummary.totalCalls.toLocaleString('en-IE'), icon: PhoneCall },
          { label: 'Total Duration', value: `${departmentBillSummary.totalDurationMinutes.toLocaleString('en-IE')} min`, icon: Clock3 },
          { label: 'Total Billable Calls', value: departmentBillSummary.totalBillableCalls.toLocaleString('en-IE'), icon: Users },
          { label: 'Total Cost', value: formatCurrency(departmentBillSummary.totalCost, false), icon: Receipt },
        ]}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-[360px] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Chart</h3>
            <p className="text-xs text-slate-500">Department vs selected metric</p>
          </div>
          <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200">
            {(['calls', 'duration', 'cost'] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize ${
                  metric === m ? 'bg-white text-teal-700 border border-teal-200 shadow-sm' : 'text-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" width={130} tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => {
                  const n = Number(value ?? 0);
                  if (metric === 'cost') return [formatCurrency(n, false), 'Cost'];
                  if (metric === 'duration') return [`${n.toLocaleString('en-IE')} min`, 'Duration'];
                  return [n.toLocaleString('en-IE'), 'Calls'];
                }}
              />
              <Bar dataKey={metric} fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ReportTable
        data={rows as unknown as Record<string, unknown>[]}
        columns={columns as any}
        rowKey={(row) => String((row as unknown as DepartmentBillRow).id)}
      />

      {detailDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{detailDept} — User Details</h3>
                <p className="text-xs text-slate-500">Department drill-down</p>
              </div>
              <button type="button" onClick={() => setDetailDept(null)} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 px-2 font-semibold">User</th>
                    <th className="py-2 px-2 font-semibold">Extension</th>
                    <th className="py-2 px-2 font-semibold text-right">Calls</th>
                    <th className="py-2 px-2 font-semibold text-right">Duration</th>
                    <th className="py-2 px-2 font-semibold text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detailUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500">
                        No user-level demo details for this department.
                      </td>
                    </tr>
                  ) : (
                    detailUsers.map((u) => (
                      <tr key={u.extension}>
                        <td className="py-2 px-2 font-medium">{u.user}</td>
                        <td className="py-2 px-2 font-mono text-teal-700">{u.extension}</td>
                        <td className="py-2 px-2 text-right">{u.calls}</td>
                        <td className="py-2 px-2 text-right font-mono">{u.duration}</td>
                        <td className="py-2 px-2 text-right font-bold">{formatCurrency(u.cost, false)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
