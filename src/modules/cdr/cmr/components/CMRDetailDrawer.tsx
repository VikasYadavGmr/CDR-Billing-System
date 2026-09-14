import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Award,
  Copy,
  ExternalLink,
  HelpCircle,
  Network,
  PhoneCall,
  Printer,
  Radio,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Drawer } from '../../../../components/common/Drawer';
import { formatCurrency } from '../../../../utils/billingCalculator';
import type { ComprehensiveCMRRecord } from '../types';

interface CMRDetailDrawerProps {
  isOpen: boolean;
  record: ComprehensiveCMRRecord | null;
  onClose: () => void;
}

export const CMRDetailDrawer: React.FC<CMRDetailDrawerProps> = ({
  isOpen,
  record,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activeChartMetric, setActiveChartMetric] = useState<'score' | 'jitter' | 'packetLoss' | 'latency'>('score');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!record) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const maxChartVal = Math.max(
    ...record.timeSeriesQoS.map((d) =>
      activeChartMetric === 'score'
        ? d.score
        : activeChartMetric === 'jitter'
        ? d.jitterMs
        : activeChartMetric === 'packetLoss'
        ? d.packetLossPct * 20
        : d.latencyMs
    ),
    1
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`CMR QoS Details: ${record.cmrId}`}
      subtitle={`Related CDR: ${record.cdrId} • Device: ${record.deviceId}`}
      width="max-w-4xl"
    >
      <div className="space-y-5 text-xs pb-6 text-slate-800">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sm text-teal-800">{record.cmrId}</span>
            <Badge
              variant={
                record.qualityStatus === 'Good'
                  ? 'success'
                  : record.qualityStatus === 'Fair'
                  ? 'warning'
                  : 'danger'
              }
              size="sm"
            >
              {record.qualityStatus} Quality ({record.qualityScore}/100)
            </Badge>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Ref: <strong className="text-slate-800">{record.cdrId}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCopy(record.cmrId, 'cmrId')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Copy className="w-3 h-3 text-slate-500" />
              <span>{copiedField === 'cmrId' ? 'Copied!' : 'Copy CMR ID'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print QoS Report</span>
            </button>
          </div>
        </div>

        {/* 1. CALL QUALITY SUMMARY CARDS (Progress Gauges) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Call Quality & Voice Performance Index</span>
            </h4>
            <span
              className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full ${
                record.qualityScore >= 90
                  ? 'bg-teal-100 text-teal-800'
                  : record.qualityScore >= 75
                  ? 'bg-emerald-100 text-emerald-800'
                  : record.qualityScore >= 60
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              QoS Score: {record.qualityScore} / 100 ({record.qualityGrade})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Audio Quality */}
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Audio Quality</span>
                <span className="font-mono font-bold text-teal-800">{record.audioQualityPct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: `${record.audioQualityPct}%` }} />
              </div>
            </div>

            {/* Media Quality */}
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Media Stream</span>
                <span className="font-mono font-bold text-sky-700">{record.mediaQualityPct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${record.mediaQualityPct}%` }} />
              </div>
            </div>

            {/* Network Quality */}
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold text-slate-700">Network Transport</span>
                <span className="font-mono font-bold text-amber-700">{record.networkQualityPct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${record.networkQualityPct}%` }} />
              </div>
            </div>

            {/* Overall Fidelity */}
            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="font-bold text-teal-950">Overall Fidelity</span>
                <span className="font-mono font-extrabold text-teal-800">{record.overallQualityPct}%</span>
              </div>
              <div className="h-2 w-full bg-teal-200 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: `${record.overallQualityPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. NETWORK PERFORMANCE & MEDIA INFO (2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Network Metrics */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Network className="w-3.5 h-3.5 text-teal-600" />
              <span>Network Performance QoS</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Packet Loss</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.packetLossStr}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Jitter (Variance)</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.jitterStr}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">One-Way Latency</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.latencyStr}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Round Trip Time</p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{record.roundTripTimeStr}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Packets Sent / Recv</p>
                <p className="font-mono text-[11px] text-slate-700 mt-0.5">
                  {record.packetsSent.toLocaleString()} / {record.packetsReceived.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Packets Dropped</p>
                <p className="font-mono font-bold text-rose-700 mt-0.5">
                  {record.packetsLost} packets
                </p>
              </div>
            </div>
          </div>

          {/* Media & Codec Information */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-teal-600" />
              <span>Media & Audio Payload</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Voice Codec</p>
                <p className="font-mono font-bold text-teal-700 mt-0.5">{record.codec}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Sampling Rate</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.sampleRate}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Packet Size</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.packetSizeMs} ms</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Media Duration</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.durationFormatted}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">RTP Audio Stream</p>
                <p className="font-mono text-xs text-slate-700 mt-0.5">
                  Full Duplex RTP Stream • DSCP EF (Expedited Forwarding 46)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. INTERACTIVE CALL QUALITY OVER TIME CHART */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                <span>Call Quality Over Time Telemetry</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Minute-by-minute streaming QoS measurements captured across the call duration
              </p>
            </div>

            {/* Metric Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10.5px]">
              {(['score', 'jitter', 'packetLoss', 'latency'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setActiveChartMetric(m)}
                  className={`px-2.5 py-1 rounded-md font-bold capitalize transition-all ${
                    activeChartMetric === m
                      ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'score'
                    ? 'QoS Score'
                    : m === 'jitter'
                    ? 'Jitter (ms)'
                    : m === 'packetLoss'
                    ? 'Loss (%)'
                    : 'Latency (ms)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 items-end h-28 pt-2">
            {record.timeSeriesQoS.map((pt) => {
              const val =
                activeChartMetric === 'score'
                  ? pt.score
                  : activeChartMetric === 'jitter'
                  ? pt.jitterMs
                  : activeChartMetric === 'packetLoss'
                  ? pt.packetLossPct * 20
                  : pt.latencyMs;

              const pct = Math.round((val / maxChartVal) * 100);
              const displayVal =
                activeChartMetric === 'score'
                  ? `${pt.score}/100`
                  : activeChartMetric === 'jitter'
                  ? `${pt.jitterMs} ms`
                  : activeChartMetric === 'packetLoss'
                  ? `${pt.packetLossPct}%`
                  : `${pt.latencyMs} ms`;

              return (
                <div key={pt.time} className="flex flex-col items-center h-full justify-end group relative">
                  <span className="text-[10px] font-mono font-bold text-slate-700 mb-1 opacity-80">
                    {displayVal}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      activeChartMetric === 'score'
                        ? 'bg-teal-600 group-hover:bg-teal-700'
                        : activeChartMetric === 'jitter'
                        ? 'bg-amber-500 group-hover:bg-amber-600'
                        : activeChartMetric === 'packetLoss'
                        ? 'bg-rose-500 group-hover:bg-rose-600'
                        : 'bg-sky-500 group-hover:bg-sky-600'
                    }`}
                    style={{ height: `${Math.max(15, pct)}%` }}
                    title={`${pt.time}: ${displayVal}`}
                  />
                  <span className="text-[9.5px] font-mono text-slate-500 mt-1">{pt.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. QUALITY ISSUES & RECOMMENDATIONS */}
        <div
          className={`p-4 rounded-2xl border shadow-xs space-y-3 ${
            record.qualityIssue === 'None'
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-900">
              {record.qualityIssue === 'None' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              )}
              <span>Voice Quality Diagnostics & Recommendations</span>
            </h4>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                record.qualityIssue === 'None'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {record.qualityIssue === 'None' ? 'Nominal Link' : `Alert: ${record.issueSeverity} Severity`}
            </span>
          </div>

          {record.qualityIssue === 'None' ? (
            <p className="text-xs text-emerald-900 font-medium">
              No quality issues detected. All RTP audio streams maintained optimal enterprise latency, jitter, and packet delivery buffers.
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Issue Type</span>
                  <span className="font-bold text-slate-900 block">{record.qualityIssue}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Start Timestamp</span>
                  <span className="font-mono text-slate-900 block">{record.issueStartTime || record.startTime}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Trigger Metric</span>
                  <span className="font-mono text-slate-900 block">{record.issueMetric || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Peak Value</span>
                  <span className="font-mono font-bold text-rose-700 block">{record.issueValue || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/80">
                <span className="text-[10.5px] uppercase font-bold text-amber-900 block">Recommended Action:</span>
                <p className="text-slate-800 font-medium mt-0.5">{record.recommendedAction}</p>
              </div>
            </div>
          )}
        </div>

        {/* 5. QUALITY THRESHOLDS INFORMATIONAL CARD */}
        <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Telephony System QoS Classification Thresholds</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block">Packet Loss:</strong>
              Good: &lt;1% • Fair: 1–3% • Poor: &gt;3%
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block">Jitter Variance:</strong>
              Good: &lt;20 ms • Fair: 20–30 ms • Poor: &gt;30 ms
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block">One-Way Latency:</strong>
              Good: &lt;100 ms • Fair: 100–150 ms • Poor: &gt;150 ms
            </div>
          </div>
        </div>

        {/* 6. RELATED CDR SUMMARY & NAVIGATION */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
              <span>Related Call Detail Record (CDR)</span>
            </h4>
            <span className="font-mono font-bold text-teal-700 text-xs">{record.cdrId}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination</span>
              <span className="font-semibold text-slate-900 block mt-0.5 truncate">{record.destinationName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Call Type / Dir</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {record.callType} ({record.callDirection})
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Talk Duration</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{record.durationFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed Amount</span>
              <span className="font-mono font-bold text-teal-800 block mt-0.5">
                {record.relatedCdrSummary ? formatCurrency(record.relatedCdrSummary.amount) : '€0.00'}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/cdr');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <span>View In CDR Records Module</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </Drawer>
  );
};
