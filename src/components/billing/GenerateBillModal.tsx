import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Calculator, CheckCircle2 } from 'lucide-react';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (periodName: string, startDate: string, endDate: string) => void;
}

export const GenerateBillModal: React.FC<GenerateBillModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [periodName, setPeriodName] = useState('September 2026');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onGenerate(periodName, startDate, endDate);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Telecom Billing Invoice"
      subtitle="Process CDR records and compute departmental billing totals"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Calculator className="w-4 h-4" />
            <span>{isProcessing ? 'Calculating CDRs...' : 'Run Billing Engine'}</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            Automatic Rate Plan Application
          </p>
          <p className="text-[11px] text-sky-700">
            The billing engine will aggregate all unbilled CDRs within this date range, apply active rate plans (Local ₹0.80, STD ₹1.50, ISD ₹8.00, Mobile ₹1.20) and calculate 18% GST.
          </p>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Billing Period Name</label>
          <input
            type="text"
            value={periodName}
            onChange={(e) => setPeriodName(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
            placeholder="e.g. September 2026"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
