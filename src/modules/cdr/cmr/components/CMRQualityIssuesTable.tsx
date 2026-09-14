import React from 'react';
import {
  AlertTriangle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import type { ComprehensiveCMRRecord } from '../types';

interface CMRQualityIssuesTableProps {
  records: ComprehensiveCMRRecord[];
  onViewRecord: (record: ComprehensiveCMRRecord) => void;
}

export const CMRQualityIssuesTable: React.FC<CMRQualityIssuesTableProps> = ({
  records,
  onViewRecord,
}) => {
  const issueRecords = records.filter((r) => r.qualityIssue !== 'None');

  if (issueRecords.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Quality Issues Detected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          All filtered CMR records meet enterprise voice QoS quality thresholds with no packet loss or jitter anomalies.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Recent Voice Quality & Network Degradation Incidents ({issueRecords.length})
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
          QoS Alert Logs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">CMR ID</th>
              <th className="py-2.5 px-3">CDR ID</th>
              <th className="py-2.5 px-3">Date & Time</th>
              <th className="py-2.5 px-3">Device</th>
              <th className="py-2.5 px-3">Extension</th>
              <th className="py-2.5 px-3">Issue Type</th>
              <th className="py-2.5 px-3 text-center">Severity</th>
              <th className="py-2.5 px-3">Trigger Metric</th>
              <th className="py-2.5 px-3">Peak Value</th>
              <th className="py-2.5 px-3 text-right">Duration</th>
              <th className="py-2.5 px-3 text-center">Quality</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11.5px]">
            {issueRecords.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{row.cmrId}</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{row.cdrId}</td>
                <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.dateTime}</td>
                <td className="py-2.5 px-3 font-mono text-slate-700">{row.deviceId}</td>
                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{row.extension}</td>
                <td className="py-2.5 px-3">
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {row.qualityIssue}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      row.issueSeverity === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : row.issueSeverity === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {row.issueSeverity}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-700">{row.issueMetric || 'N/A'}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{row.issueValue || 'N/A'}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                  {row.issueDurationSec ? `${row.issueDurationSec}s` : row.durationFormatted}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <Badge variant={row.qualityStatus === 'Fair' ? 'warning' : 'danger'} size="sm">
                    {row.qualityStatus}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onViewRecord(row)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-semibold text-[11px] transition-colors shadow-2xs"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
