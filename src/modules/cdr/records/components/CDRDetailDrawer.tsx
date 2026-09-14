import React, { useState } from 'react';
import {
  Clock,
  Code2,
  Coins,
  Copy,
  Globe2,
  MapPin,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Printer,
  User,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';
import { Drawer } from '../../../../components/common/Drawer';
import { formatCurrency, formatRate } from '../../../../utils/billingCalculator';
import { TAX_STATUS_LABELS } from '../../../../utils/taxEngine';
import type { ComprehensiveCDRRecord } from '../types';

interface CDRDetailDrawerProps {
  isOpen: boolean;
  record: ComprehensiveCDRRecord | null;
  onClose: () => void;
}

export const CDRDetailDrawer: React.FC<CDRDetailDrawerProps> = ({
  isOpen,
  record,
  onClose,
}) => {
  const [isRawOpen, setIsRawOpen] = useState(false);
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`CDR Details: ${record.cdrId}`}
      subtitle={`Extension: ${record.extension} • Caller: ${record.userName}`}
      width="max-w-4xl"
    >
      <div className="space-y-5 text-xs pb-6 text-slate-800">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sm text-teal-800">{record.cdrId}</span>
            <Badge
              variant={
                record.status === 'Completed'
                  ? 'success'
                  : record.status === 'Busy'
                  ? 'warning'
                  : 'danger'
              }
              size="sm"
            >
              {record.status}
            </Badge>
            <Badge
              variant={
                record.callType === 'Internal'
                  ? 'info'
                  : record.callType === 'External'
                  ? 'purple'
                  : 'amber'
              }
              size="sm"
            >
              {record.callType}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCopy(record.cdrId, 'id')}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Copy className="w-3 h-3 text-slate-500" />
              <span>{copiedField === 'id' ? 'Copied!' : 'Copy CDR ID'}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `CDR: ${record.cdrId}\nDate: ${record.dateTime}\nCaller: ${record.userName} (${record.extension})\nDestination: ${record.destinationName} (${record.destinationNumber})\nDuration: ${record.durationFormatted}\nAmount: EUR ${record.totalAmount.toFixed(2)}`,
                  'details'
                )
              }
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Copy className="w-3 h-3 text-slate-500" />
              <span>{copiedField === 'details' ? 'Details Copied!' : 'Copy Details'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* 1. CALL INFORMATION & TIMELINE (2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Call Information */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
              <span>Call Information</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Call Date</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.startDate}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Direction</p>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  {record.direction === 'Outgoing' ? (
                    <PhoneOutgoing className="w-3 h-3 text-teal-600" />
                  ) : (
                    <PhoneIncoming className="w-3 h-3 text-sky-600" />
                  )}
                  <span>{record.direction}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Start Time</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.startTime}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">End Time</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.endTime}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                <p className="font-mono font-extrabold text-teal-800 mt-0.5">
                  {record.durationFormatted} ({record.durationSeconds}s)
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Disconnect Reason</p>
                <p className="font-semibold text-slate-700 mt-0.5 truncate" title={record.disconnectReason}>
                  {record.disconnectReason}
                </p>
              </div>
            </div>
          </div>

          {/* Call Lifecycle Timeline */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Call Lifecycle Timeline</span>
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-teal-200 ml-2">
              <div className="relative">
                <span className="w-2.5 h-2.5 bg-teal-600 rounded-full absolute -left-[21px] top-1 ring-4 ring-white" />
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">Call Initiated</span>
                  <span className="font-mono text-slate-500">{record.startTime}</span>
                </div>
                <p className="text-[11px] text-slate-500">PBX SIP INVITE dispatched from {record.extension}</p>
              </div>

              {record.status !== 'Failed' && record.status !== 'Cancelled' && (
                <div className="relative">
                  <span className="w-2.5 h-2.5 bg-teal-500 rounded-full absolute -left-[21px] top-1 ring-4 ring-white" />
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">Connection Established</span>
                    <span className="font-mono text-slate-500">
                      {record.startTime} (+3s)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">200 OK Handshake • Trunk Audio Open</p>
                </div>
              )}

              <div className="relative">
                <span
                  className={`w-2.5 h-2.5 rounded-full absolute -left-[21px] top-1 ring-4 ring-white ${
                    record.status === 'Completed' ? 'bg-emerald-600' : 'bg-rose-500'
                  }`}
                />
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">
                    {record.status === 'Completed' ? 'Call Completed' : `Call ${record.status}`}
                  </span>
                  <span className="font-mono text-slate-500">{record.endTime}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {record.status === 'Completed'
                    ? `Normal Release • Total Talk Time: ${record.durationFormatted}`
                    : record.disconnectReason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CALLER & DESTINATION INFORMATION (2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Caller Information */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Caller Information</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">User ID</p>
                <p className="font-mono font-bold text-teal-700 mt-0.5">{record.userId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">User Name</p>
                <p className="font-semibold text-slate-900 mt-0.5">{record.userName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Extension</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.extension}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.department}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Device ID</p>
                <p className="font-mono text-slate-700 mt-0.5">{record.deviceId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Device Location</p>
                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1" title={record.deviceLocation}>
                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  {record.deviceLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Destination Information */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Destination Information</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Destination Name</p>
                <p className="font-semibold text-slate-900 mt-0.5 truncate" title={record.destinationName}>
                  {record.destinationName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Destination Number</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{record.destinationNumber}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Destination Type</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.destinationType}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Number Type</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.numberType}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.destinationLocation}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Country</p>
                <p className="font-semibold text-slate-800 mt-0.5">{record.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BILLING INFORMATION */}
        <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-teal-200/60 pb-2">
            <h4 className="text-xs font-bold text-teal-950 flex items-center gap-1.5 uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5 text-teal-700" />
              <span>Billing & Accounting Details</span>
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 uppercase">
              {record.billingStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tariff Plan</span>
              <span className="font-semibold text-slate-800 block mt-0.5 truncate">{record.tariffName}</span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Billing Unit</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{record.billingUnit}</span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rate / Min</span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {record.ratePerMinute > 0 ? `€${record.ratePerMinute.toFixed(2)}` : '€0.00'}
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Cost</span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {formatCurrency(record.callCost)}
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {record.taxName ? `${record.taxName} ${formatRate(record.taxRate)}` : 'Tax'}
              </span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {formatCurrency(record.taxAmount)}
              </span>
            </div>
            <div className="bg-teal-600 text-white p-2.5 rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold opacity-80 block">Total Amount</span>
              <span className="font-mono font-extrabold text-sm block mt-0.5">
                {formatCurrency(record.totalAmount)}
              </span>
            </div>
          </div>

          {/* Tax jurisdiction — resolved from the Tax & VAT master */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Billing Country
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5 truncate">
                {record.billingCountry}{' '}
                <span className="font-mono text-slate-400">({record.billingCountryCode})</span>
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tax Type</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {record.taxType ?? '—'}
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tax Rule</span>
              <span className="font-mono font-semibold text-slate-800 block mt-0.5 truncate">
                {record.taxRuleId ?? '—'}
              </span>
            </div>
            <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Taxable Amount
              </span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">
                {formatCurrency(record.taxableAmount)}
              </span>
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                record.taxStatus === 'TAX_REVIEW_REQUIRED'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-white/90 border-teal-200/60'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tax Status</span>
              <span
                className={`font-semibold block mt-0.5 ${
                  record.taxStatus === 'TAX_REVIEW_REQUIRED' ? 'text-rose-700' : 'text-slate-800'
                }`}
              >
                {TAX_STATUS_LABELS[record.taxStatus]}
              </span>
            </div>
          </div>
        </div>

        {/* 5. RAW CDR DATA VIEWER (Collapsible) */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl overflow-hidden border border-slate-800">
          <div
            className="p-3 bg-slate-800/80 flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsRawOpen(!isRawOpen)}
          >
            <div className="flex items-center space-x-2">
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-bold tracking-wider uppercase">
                Raw CDR Telemetry Object
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(JSON.stringify(record, null, 2), 'json');
                }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-[10.5px] font-mono font-bold text-white transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedField === 'json' ? 'JSON Copied!' : 'Copy JSON'}</span>
              </button>
              <span className="text-slate-400 text-xs">{isRawOpen ? '▲ Hide' : '▼ View'}</span>
            </div>
          </div>

          {isRawOpen && (
            <div className="p-4 overflow-x-auto max-h-60 font-mono text-[11px] leading-relaxed text-teal-300">
              <pre>{JSON.stringify(record, null, 2)}</pre>
            </div>
          )}
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
