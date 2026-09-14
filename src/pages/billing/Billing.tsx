import React, { useState, useEffect } from 'react';
import type { BillingPeriod, DepartmentBillBreakdown } from '../../types/billing';
import { billingService } from '../../services/billingService';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { GenerateBillModal } from '../../components/billing/GenerateBillModal';
import { InvoiceModal } from '../../components/billing/InvoiceModal';
import { IndividualBills } from '../../modules/cdr/reports/user/pages/IndividualBills';
import { DepartmentBills } from '../../modules/cdr/reports/user/pages/DepartmentBills';
import { formatCurrency } from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Receipt,
  FileText,
  Calculator,
  Download,
  Eye,
  CheckCircle,
  Clock,
  UserCheck,
  Building2,
} from 'lucide-react';

type BillingTab = 'invoices' | 'individual' | 'departments';

export const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BillingTab>('invoices');
  const [periods, setPeriods] = useState<BillingPeriod[]>([]);
  const [deptBreakdowns, setDeptBreakdowns] = useState<DepartmentBillBreakdown[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingPeriod | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  useEffect(() => {
    const fetchBillingData = async () => {
      const [p, db] = await Promise.all([
        billingService.getBillingPeriods(),
        billingService.getDepartmentBreakdown(),
      ]);
      setPeriods(p);
      setDeptBreakdowns(db);
    };
    fetchBillingData();
  }, []);

  const handleGenerateBill = async (periodName: string, startDate: string, endDate: string) => {
    const newPeriod = await billingService.generateBill(periodName, startDate, endDate);
    setPeriods([newPeriod, ...periods]);
    setSelectedInvoice(newPeriod);
    setIsInvoiceOpen(true);
  };

  const handleViewInvoice = (period: BillingPeriod) => {
    setSelectedInvoice(period);
    setIsInvoiceOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="success">Paid</Badge>;
      case 'Approved':
        return <Badge variant="info">Approved</Badge>;
      case 'Generated':
        return <Badge variant="warning">Generated</Badge>;
      case 'Draft':
        return <Badge variant="neutral">Draft</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleExportCSV = () => {
    exportToCSV(periods, 'Airport_Monthly_Telecom_Invoices', [
      { key: 'period', label: 'Billing Period' },
      { key: 'invoiceNumber', label: 'Invoice No.' },
      { key: 'totalCalls', label: 'Total Calls' },
      { key: 'billableCalls', label: 'Billable Calls' },
      { key: 'totalDurationHours', label: 'Total Hours' },
      { key: 'subtotal', label: 'Subtotal (₹)' },
      { key: 'taxAmount', label: 'GST (₹)' },
      { key: 'totalAmount', label: 'Total Amount (₹)' },
      { key: 'status', label: 'Status' },
      { key: 'generatedDate', label: 'Generated Date' },
      { key: 'dueDate', label: 'Due Date' },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation & Sub-Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Telecom Billing & Invoices
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                18% GST Enabled
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive billing management: monthly tax cycles, individual staff statements, and department cost centers.
            </p>
          </div>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 self-start md:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'invoices'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-teal-600" />
            <span>Monthly Invoices</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('individual')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'individual'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Individual User Bills</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('departments')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'departments'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Department Bills</span>
          </button>
        </div>
      </div>

      {/* 1. MONTHLY INVOICES VIEW */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">Monthly Billing Cycles & Tax Statements</span>
              <span className="text-xs text-slate-400 font-medium">• Fiscal Year 2026-27</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export Invoices CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGenerateOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Generate Monthly Bill</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Current Cycle (Aug 2026)"
              value="₹4,86,240"
              subtitle="18,425 Billable Calls"
              icon={Receipt}
              iconColor="text-sky-600"
              iconBg="bg-sky-50"
            />
            <StatCard
              title="YTD Total Invoiced"
              value="₹27.63 L"
              subtitle="6 Monthly Billing Cycles"
              icon={FileText}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-50"
            />
            <StatCard
              title="GST Collected (18%)"
              value="₹4.21 L"
              subtitle="Remitted to Finance Dept"
              icon={CheckCircle}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <StatCard
              title="Pending Settlement"
              value="₹4,86,240"
              subtitle="Due by 20-Sep-2026"
              icon={Clock}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
            />
          </div>

          {/* Billing Periods Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Official Monthly Telecom Tax Invoices
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Tax Rate: 18% GST Applicable</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                    <th className="py-3 px-3.5">Invoice No.</th>
                    <th className="py-3 px-3.5">Billing Period</th>
                    <th className="py-3 px-3.5 text-right">Total Calls</th>
                    <th className="py-3 px-3.5 text-right">Billable</th>
                    <th className="py-3 px-3.5 text-right">Duration</th>
                    <th className="py-3 px-3.5 text-right">Subtotal (₹)</th>
                    <th className="py-3 px-3.5 text-right">GST 18% (₹)</th>
                    <th className="py-3 px-3.5 text-right">Total Invoice (₹)</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center">Due Date</th>
                    <th className="py-3 px-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {periods.map((period) => (
                    <tr key={period.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-sky-700">
                        {period.invoiceNumber}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-foreground">{period.period}</td>
                      <td className="py-3 px-3.5 text-right font-medium">{period.totalCalls.toLocaleString()}</td>
                      <td className="py-3 px-3.5 text-right text-muted-foreground">{period.billableCalls.toLocaleString()}</td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-600">{period.totalDurationHours} hrs</td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-700">{formatCurrency(period.subtotal)}</td>
                      <td className="py-3 px-3.5 text-right font-mono text-slate-500">{formatCurrency(period.taxAmount)}</td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                        {formatCurrency(period.totalAmount)}
                      </td>
                      <td className="py-3 px-3.5 text-center">{getStatusBadge(period.status)}</td>
                      <td className="py-3 px-3.5 text-center text-muted-foreground">{period.dueDate}</td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleViewInvoice(period)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-[11px] border border-sky-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. INDIVIDUAL USER BILLS VIEW */}
      {activeTab === 'individual' && <IndividualBills />}

      {/* 3. DEPARTMENT BILLS VIEW */}
      {activeTab === 'departments' && <DepartmentBills />}

      {/* Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        deptBreakdowns={deptBreakdowns}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Generate Bill Modal */}
      <GenerateBillModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onGenerate={handleGenerateBill}
      />
    </div>
  );
};
