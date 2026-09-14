import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Department } from '../../types/department';
import { departmentService } from '../../services/departmentService';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Building2,
  ArrowRight,
  Download,
} from 'lucide-react';

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    };
    fetchDepts();
  }, []);

  const handleExport = () => {
    exportToCSV(departments, 'Airport_Department_Telecom_Usage', [
      { key: 'name', label: 'Department' },
      { key: 'code', label: 'Code' },
      { key: 'headOfDepartment', label: 'Head of Department' },
      { key: 'contactExtension', label: 'Primary Extension' },
      { key: 'totalExtensions', label: 'Extensions Count' },
      { key: 'totalCalls', label: 'Total Calls' },
      { key: 'totalDurationHours', label: 'Talk Time (Hours)' },
      { key: 'billableCalls', label: 'Billable Calls' },
      { key: 'monthlyCost', label: 'Monthly Cost (₹)' },
      { key: 'budgetAllocation', label: 'Telecom Budget (₹)' },
      { key: 'status', label: 'Status' },
    ]);
  };

  const handleViewCDRs = (deptName: string) => {
    navigate(`/cdr?department=${encodeURIComponent(deptName)}`);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-900">{departments.length} Active Cost Centers</span>
          <span className="text-xs text-slate-400 font-medium">• Fiscal Year 2026-27</span>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-teal-600" />
          <span>Export Summary</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {departments.map((d) => {
          const budgetPct = Math.min(Math.round((d.monthlyCost / d.budgetAllocation) * 100), 100);
          return (
            <div
              key={d.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{d.name}</h3>
                      <span className="text-[10px] text-muted-foreground font-mono">{d.code}</span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">{d.status}</Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Head:</span>
                    <span className="font-medium text-foreground">{d.headOfDepartment}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Extensions:</span>
                    <span className="font-mono font-bold text-sky-600">{d.totalExtensions} active</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Calls:</span>
                    <span className="font-medium text-foreground">{d.totalCalls.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Monthly Talk Time:</span>
                    <span className="font-mono text-foreground">{d.totalDurationHours} hrs</span>
                  </div>
                </div>

                {/* Budget Utilization bar */}
                <div className="mt-4 pt-3 border-t border-border/80">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">Budget Spent</span>
                    <span className="font-bold text-slate-800">{budgetPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        budgetPct > 85 ? 'bg-amber-500' : 'bg-sky-600'
                      }`}
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Cost: {formatCurrency(d.monthlyCost)}</span>
                    <span>Cap: {formatCurrency(d.budgetAllocation)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleViewCDRs(d.name)}
                className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
              >
                <span>View Department CDRs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Consolidated Department Data Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50/70">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            All Departments Billing Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Primary Contact / Ext</th>
                <th className="py-3 px-3.5 text-center">Extensions</th>
                <th className="py-3 px-3.5 text-right">Total Calls</th>
                <th className="py-3 px-3.5 text-right">Talk Time</th>
                <th className="py-3 px-3.5 text-right">Billable Calls</th>
                <th className="py-3 px-3.5 text-right">Monthly Cost (₹)</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5">
                    <div>
                      <span className="font-bold text-foreground block">{dept.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{dept.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-medium text-slate-700">{dept.headOfDepartment}</span>
                    <span className="text-[11px] font-mono text-sky-600 block">Ext {dept.contactExtension}</span>
                  </td>
                  <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-700">
                    {dept.totalExtensions}
                  </td>
                  <td className="py-3 px-3.5 text-right font-medium">{dept.totalCalls.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-right font-mono text-slate-600">{dept.totalDurationHours} hrs</td>
                  <td className="py-3 px-3.5 text-right font-medium text-slate-700">{dept.billableCalls.toLocaleString()}</td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                    {formatCurrency(dept.monthlyCost)}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleViewCDRs(dept.name)}
                      className="px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-[11px] border border-sky-200 transition-colors"
                    >
                      View Logs
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
