import React from 'react';
import { Building2 } from 'lucide-react';
import { mockDepartmentQualitySummary } from '../mock/cmrRecordsData';
import type { CMRDepartmentSummaryRow } from '../types';

interface CMRDepartmentSummaryTableProps {
  data?: CMRDepartmentSummaryRow[];
}

export const CMRDepartmentSummaryTable: React.FC<CMRDepartmentSummaryTableProps> = ({
  data = mockDepartmentQualitySummary,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Department-wise Voice Quality Summary
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">10 Airport Divisions</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3 text-right">CMR Records</th>
              <th className="py-2.5 px-3 text-right">Good Quality</th>
              <th className="py-2.5 px-3 text-right">Fair Quality</th>
              <th className="py-2.5 px-3 text-right">Poor Quality</th>
              <th className="py-2.5 px-3 text-right">Avg Score</th>
              <th className="py-2.5 px-3 text-right">Avg Loss</th>
              <th className="py-2.5 px-3 text-right">Avg Jitter</th>
              <th className="py-2.5 px-3 text-center">Quality Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11.5px]">
            {data.map((row) => (
              <tr key={row.department} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-900">{row.department}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                  {row.cmrRecords.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">
                  {row.good.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-700">{row.fair}</td>
                <td className="py-2.5 px-3 text-right font-mono text-rose-700 font-semibold">
                  {row.poor}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-800">
                  {row.averageScore.toFixed(1)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.avgPacketLoss}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.avgJitter}</td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-full font-bold ${
                      row.qualityIssues > 20
                        ? 'bg-rose-100 text-rose-800'
                        : row.qualityIssues > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {row.qualityIssues}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
