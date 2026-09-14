import React from 'react';
import type { IndividualBillInfo } from '../types';

interface BillingSummaryProps {
  info: IndividualBillInfo;
}

export const BillingSummary: React.FC<BillingSummaryProps> = ({ info }) => {
  const fields = [
    { label: 'User', value: info.userName },
    { label: 'Employee ID', value: info.employeeId },
    { label: 'Extension', value: info.extension },
    { label: 'Department', value: info.department },
    { label: 'Location', value: info.location },
    { label: 'Billing Period', value: info.billingPeriod },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Bill Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {fields.map((f) => (
          <div key={f.label} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">{f.label}</p>
            <p className="text-xs font-bold text-slate-900 mt-1">{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
