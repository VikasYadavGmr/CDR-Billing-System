import React, { useState, useMemo } from 'react';
import { Cpu } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { mockDeviceQualitySummary } from '../mock/cmrRecordsData';
import type { CMRDeviceSummaryRow } from '../types';

interface CMRDeviceSummaryTableProps {
  data?: CMRDeviceSummaryRow[];
}

type DeviceSortKey =
  | 'lowest-score'
  | 'highest-loss'
  | 'highest-jitter'
  | 'highest-latency'
  | 'most-issues';

export const CMRDeviceSummaryTable: React.FC<CMRDeviceSummaryTableProps> = ({
  data = mockDeviceQualitySummary,
}) => {
  const [sortCriteria, setSortCriteria] = useState<DeviceSortKey>('lowest-score');

  const sortedData = useMemo(() => {
    const list = [...data];
    list.sort((a, b) => {
      if (sortCriteria === 'lowest-score') {
        return a.averageScore - b.averageScore;
      }
      if (sortCriteria === 'highest-loss') {
        return parseFloat(b.packetLoss) - parseFloat(a.packetLoss);
      }
      if (sortCriteria === 'highest-jitter') {
        return parseFloat(b.jitter) - parseFloat(a.jitter);
      }
      if (sortCriteria === 'highest-latency') {
        return parseFloat(b.latency) - parseFloat(a.latency);
      }
      if (sortCriteria === 'most-issues') {
        return b.qualityIssues - a.qualityIssues;
      }
      return 0;
    });
    return list;
  }, [data, sortCriteria]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Device-Level Voice Quality Summary
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Sort By:</span>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value as DeviceSortKey)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="lowest-score">Lowest Score (Needs Attention)</option>
            <option value="highest-loss">Highest Packet Loss</option>
            <option value="highest-jitter">Highest Jitter</option>
            <option value="highest-latency">Highest Latency</option>
            <option value="most-issues">Most Quality Issues</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Device ID</th>
              <th className="py-2.5 px-3">Extension</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3 text-right">CMR Records</th>
              <th className="py-2.5 px-3 text-right">Avg QoS Score</th>
              <th className="py-2.5 px-3 text-right">Packet Loss</th>
              <th className="py-2.5 px-3 text-right">Jitter</th>
              <th className="py-2.5 px-3 text-right">Latency</th>
              <th className="py-2.5 px-3 text-center">Quality Issues</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11.5px]">
            {sortedData.map((row) => (
              <tr key={row.device} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{row.device}</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{row.extension}</td>
                <td className="py-2.5 px-3 text-slate-700">{row.department}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                  {row.cmrRecords.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      row.averageScore >= 90
                        ? 'bg-teal-100 text-teal-800'
                        : row.averageScore >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : row.averageScore >= 60
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800 font-extrabold'
                    }`}
                  >
                    {row.averageScore.toFixed(1)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.packetLoss}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.jitter}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">{row.latency}</td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-full font-bold ${
                      row.qualityIssues > 10
                        ? 'bg-rose-100 text-rose-800'
                        : row.qualityIssues > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {row.qualityIssues}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <Badge
                    variant={
                      row.status === 'Active'
                        ? 'success'
                        : row.status === 'Maintenance'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
