import React from 'react';
import { Drawer } from '../../../../../components/common/Drawer';
import { Badge } from '../../../../../components/common/Badge';
import { formatCurrency } from '../../../../../utils/billingCalculator';
import { Printer, Eye, X } from 'lucide-react';
import type { CallDetailsData } from '../types';

interface CallDetailsDrawerProps {
  open: boolean;
  data: CallDetailsData | null;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/80">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200/70 pb-1.5 flex items-center justify-between">
        <span>{title}</span>
      </h4>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</p>
      <div className="text-xs font-semibold text-slate-900 mt-0.5 break-all">{value}</div>
    </div>
  );
}

export const CallDetailsDrawer: React.FC<CallDetailsDrawerProps> = ({ open, data, onClose }) => {
  if (!data) return null;

  const statusVariant =
    data.callStatus === 'Completed' ? 'success' : data.callStatus === 'Failed' ? 'danger' : 'warning';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      title="User Report Call Details"
      subtitle={`CDR Record: ${data.cdrId}`}
      width="max-w-2xl"
    >
      <div className="space-y-4 text-xs pb-4">
        {/* USER INFORMATION */}
        <Section title="User Information">
          <Field label="User Name" value={data.user} />
          <Field label="Employee ID" value={<span className="font-mono font-bold text-slate-800">{data.employeeId || 'EMP-10231'}</span>} />
          <Field label="Department" value={data.department} />
          <Field label="Extension" value={<span className="font-mono text-teal-700 font-bold">{data.extension}</span>} />
          <Field label="Location" value={data.location} />
          <Field label="Status" value={<Badge variant="success" size="sm">Active</Badge>} />
        </Section>

        {/* CALL INFORMATION */}
        <Section title="Call Information">
          <Field label="CDR ID" value={<span className="font-mono font-bold text-teal-700">{data.cdrId}</span>} />
          <Field label="Call Date" value={data.date} />
          <Field label="Start Time" value={<span className="font-mono">{data.startTime}</span>} />
          <Field label="Answer Time" value={<span className="font-mono">{data.answerTime}</span>} />
          <Field label="End Time" value={<span className="font-mono">{data.endTime}</span>} />
          <Field label="Duration" value={<span className="font-mono font-bold text-slate-900">{data.duration}</span>} />
          <Field label="Calling Number" value={<span className="font-mono text-slate-800">{data.extension || '2451'}</span>} />
          <Field label="Destination Number" value={<span className="font-mono font-bold text-slate-900">{data.destinationNumber}</span>} />
          <Field label="Call Type" value={<span className="font-semibold text-slate-800">{data.callType}</span>} />
          <Field label="Direction" value={<Badge variant="info" size="sm">{data.callDirection}</Badge>} />
          <Field label="Status" value={<Badge variant={statusVariant} size="sm">{data.callStatus}</Badge>} />
        </Section>

        {/* ROUTING */}
        <Section title="Routing">
          <Field label="Gateway" value={<span className="font-mono text-slate-700">{data.gateway}</span>} />
          <Field label="Trunk" value={<span className="font-mono text-slate-700">{data.trunk}</span>} />
          <Field label="Route Pattern" value={<span className="font-mono text-teal-700">{data.routePattern}</span>} />
        </Section>

        {/* BILLING */}
        <Section title="Billing">
          <Field label="Rate" value={<span className="font-mono font-bold text-slate-800">{data.rate}</span>} />
          <Field label="Billing Duration" value={<span className="font-mono">{data.billingDuration}</span>} />
          <Field label="Base Charge" value={<span className="font-mono">{formatCurrency(data.baseCharge)}</span>} />
          <Field label="Tax" value={<span className="font-mono">{formatCurrency(data.tax)}</span>} />
          <Field label="Total Charge" value={<span className="font-mono font-bold text-teal-700">{formatCurrency(data.totalCharge)}</span>} />
          <Field label="Billing Status" value={<Badge variant={data.billingStatus === 'Billed' ? 'success' : data.billingStatus === 'Exempt' ? 'neutral' : 'warning'} size="sm">{data.billingStatus}</Badge>} />
        </Section>

        {/* QUALITY */}
        <Section title="Quality">
          <Field label="MOS" value={<span className="font-mono font-bold text-emerald-700">{data.mos > 0 ? data.mos.toFixed(1) : 'N/A'}</span>} />
          <Field label="Jitter" value={<span className="font-mono">{data.jitterMs > 0 ? `${data.jitterMs} ms` : '0 ms'}</span>} />
          <Field label="Latency" value={<span className="font-mono">{data.latencyMs > 0 ? `${data.latencyMs} ms` : '0 ms'}</span>} />
          <Field label="Packet Loss" value={<span className="font-mono">{`${data.packetLossPercent}%`}</span>} />
        </Section>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Close</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={() => alert(`View CDR details for ${data.cdrId}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View CDR</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
};
