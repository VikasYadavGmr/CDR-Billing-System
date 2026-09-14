import React from 'react';
import type { CDRRecord } from '../../types/cdr';
import { Drawer } from '../common/Drawer';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/billingCalculator';
import { printElement } from '../../utils/exportUtils';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  CreditCard,
  Printer,
} from 'lucide-react';

interface CDRDetailDrawerProps {
  record: CDRRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CDRDetailDrawer: React.FC<CDRDetailDrawerProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!record) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Billed':
        return <Badge variant="success">Billed</Badge>;
      case 'Unbilled':
        return <Badge variant="warning">Unbilled</Badge>;
      case 'Exempted':
        return <Badge variant="info">Exempted</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getDirectionIcon = (dir: string) => {
    if (dir === 'Incoming') return <PhoneIncoming className="w-4 h-4 text-emerald-600" />;
    if (dir === 'Outgoing') return <PhoneOutgoing className="w-4 h-4 text-sky-600" />;
    return <PhoneCall className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="CDR Record Details"
      subtitle={`Detail record for ${record.cdrId}`}
      width="max-w-xl"
    >
      <div id="cdr-detail-print-area" className="space-y-6">
        {/* Top Summary Banner (Light Theme) */}
        <div className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-sky-50 text-sky-600 border border-sky-200 rounded-xl">
                {getDirectionIcon(record.direction)}
              </div>
              <div>
                <span className="text-xs text-sky-700 font-mono font-bold">{record.cdrId}</span>
                <h4 className="text-base font-bold text-slate-900">
                  Ext {record.extension} &rarr; {record.destinationNumber}
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Total Billed</span>
              <p className="text-xl font-extrabold text-emerald-700">
                {formatCurrency(record.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Call Information */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-border">
            <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
            Call Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Caller Extension</span>
              <span className="font-mono font-bold text-foreground text-sm">{record.extension}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Caller Number</span>
              <span className="font-mono font-medium text-foreground">{record.callerNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Destination Number</span>
              <span className="font-mono font-bold text-sky-600 text-sm">{record.destinationNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Department</span>
              <span className="font-medium text-foreground">{record.department}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Call Type</span>
              <Badge variant="purple" size="sm">{record.callType}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Direction</span>
              <Badge variant="info" size="sm">{record.direction}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Trunk Line</span>
              <span className="font-mono text-muted-foreground">{record.trunkLine || 'PRI-E1-01'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Disconnect Status</span>
              <span className="text-slate-600 font-medium">{record.disconnectReason || 'Normal Clearing'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Timing Information */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-border">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Timing & Duration
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Call Date</span>
              <span className="font-medium text-foreground">{record.startDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Start Time</span>
              <span className="font-mono font-medium text-foreground">{record.startTime}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">End Time</span>
              <span className="font-mono font-medium text-foreground">{record.endTime}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Duration</span>
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {record.durationFormatted} ({record.durationSeconds}s)
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Billing & Cost Breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-border">
            <CreditCard className="w-3.5 h-3.5 text-sky-600" />
            Billing Breakdown
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Tariff Rate per Minute</span>
              <span className="font-mono font-medium text-foreground">{formatCurrency(record.ratePerMinute)} / min</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Billable Pulse (60s)</span>
              <span className="font-mono font-medium text-foreground">{Math.ceil(record.durationSeconds / 60)} min(s)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Call Subtotal</span>
              <span className="font-mono font-semibold text-foreground">{formatCurrency(record.callCost)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-mono font-semibold text-foreground">{formatCurrency(record.taxAmount)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold bg-slate-50 px-2 rounded-lg">
              <span className="text-foreground">Total Charge</span>
              <span className="text-emerald-700 font-mono">{formatCurrency(record.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-muted-foreground">Billing Status</span>
              {getStatusBadge(record.billingStatus)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => printElement('cdr-detail-print-area')}
            className="flex items-center space-x-1.5 px-4 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </Drawer>
  );
};
