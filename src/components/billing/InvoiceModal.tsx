import React from 'react';
import type { BillingPeriod, DepartmentBillBreakdown } from '../../types/billing';
import { Modal } from '../common/Modal';
import { formatCurrency } from '../../utils/billingCalculator';
import { printElement } from '../../utils/exportUtils';
import { Printer, PhoneCall, Building2 } from 'lucide-react';

interface InvoiceModalProps {
  invoice: BillingPeriod | null;
  deptBreakdowns: DepartmentBillBreakdown[];
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  deptBreakdowns,
  isOpen,
  onClose,
}) => {
  if (!invoice) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Telecom Invoice: ${invoice.invoiceNumber}`}
      subtitle={`Billing Statement for ${invoice.period}`}
      maxWidth="max-w-4xl"
      footer={
        <>
          <button
            type="button"
            onClick={() => printElement('invoice-print-area')}
            className="flex items-center space-x-1.5 px-4 py-2 border border-border rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Invoice
          </button>
        </>
      }
    >
      <div id="invoice-print-area" className="p-4 bg-white text-slate-900 rounded-lg space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-sky-600">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Airport Authority Telecom Wing</h3>
            </div>
            <p className="text-xs text-slate-500">Indira Gandhi International Airport, Terminal 3 Telecom Bldg</p>
            <p className="text-xs text-slate-500">GSTIN: 07AAACA0123M1Z5 | PAN: AAACA0123M</p>
          </div>

          <div className="text-left sm:text-right mt-4 sm:mt-0">
            <div className="inline-block px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-800 font-mono mb-1">
              {invoice.invoiceNumber}
            </div>
            <p className="text-xs text-slate-600">Billing Cycle: <span className="font-semibold text-slate-900">{invoice.period}</span></p>
            <p className="text-xs text-slate-600">Generated: <span className="font-semibold text-slate-900">{invoice.generatedDate}</span></p>
            <p className="text-xs text-slate-600">Payment Due: <span className="font-semibold text-rose-600">{invoice.dueDate}</span></p>
          </div>
        </div>

        {/* High-level Summary Box */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Total Calls Processed</span>
            <span className="text-base font-bold text-slate-900">{invoice.totalCalls.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Billable Talk Time</span>
            <span className="text-base font-bold text-slate-900">{invoice.totalDurationHours} hrs</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">GST Applied (18%)</span>
            <span className="text-base font-bold text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Total Invoice Amount</span>
            <span className="text-base font-extrabold text-emerald-700">{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>

        {/* Department-wise Billing Breakdown Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            Departmental Cost Distribution
          </h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Ext. Count</th>
                  <th className="py-2.5 px-3 text-right">Total Calls</th>
                  <th className="py-2.5 px-3 text-right">Talk Time</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                  <th className="py-2.5 px-3 text-right">GST (18%)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptBreakdowns.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-800">{d.department}</td>
                    <td className="py-2 px-3 text-center font-mono text-slate-600">{d.extensionsCount}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-700">{d.totalCalls.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">{d.talkTimeHours}h</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">{formatCurrency(d.subtotal)}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500">{formatCurrency(d.tax)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatCurrency(d.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td className="py-2.5 px-3" colSpan={4}>Consolidated Grand Total</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(invoice.subtotal)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(invoice.taxAmount)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 text-sm">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">Payment Terms:</p>
            <p>Inter-departmental cost transfer within 20 days of invoice generation.</p>
            <p>Questions? Contact telecom.billing@airport.gov.in</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-400 mb-1"></div>
            <p className="font-semibold text-slate-900">Authorized Telecom Officer</p>
            <p className="text-[11px]">Airport Authority of India</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
