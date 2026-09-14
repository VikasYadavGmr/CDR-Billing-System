import React, { useState } from 'react';
import { ChevronDown, Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { exportToCSV, printElement } from '../../../../../utils/exportUtils';

interface ExportReportButtonProps {
  filename: string;
  data: Record<string, unknown>[];
  headers?: { key: string; label: string }[];
  printElementId?: string;
  className?: string;
}

export const ExportReportButton: React.FC<ExportReportButtonProps> = ({
  filename,
  data,
  headers,
  printElementId,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handle = (type: 'pdf' | 'excel' | 'csv' | 'print') => {
    setOpen(false);
    if (type === 'csv') {
      exportToCSV(data as any, filename, headers as any);
      showToast('CSV exported');
      return;
    }
    if (type === 'print') {
      if (printElementId) printElement(printElementId);
      else window.print();
      showToast('Print dialog opened');
      return;
    }
    if (type === 'pdf') {
      window.print();
      showToast('PDF export opened in print dialog');
      return;
    }
    showToast('Excel export is a demo action (no backend yet)');
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700"
      >
        <Download className="w-3.5 h-3.5" />
        Export
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
          <button type="button" onClick={() => handle('pdf')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
            <FileText className="w-3.5 h-3.5 text-rose-500" /> Export PDF
          </button>
          <button type="button" onClick={() => handle('excel')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export Excel
          </button>
          <button type="button" onClick={() => handle('csv')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
            <Download className="w-3.5 h-3.5 text-sky-600" /> Export CSV
          </button>
          <button type="button" onClick={() => handle('print')} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};
