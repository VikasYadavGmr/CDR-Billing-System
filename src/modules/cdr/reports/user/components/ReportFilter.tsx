import React from 'react';
import { RotateCcw, Search } from 'lucide-react';
import type { ReportFilterValues } from '../types';
import {
  reportCallTypes,
  reportDepartments,
  reportDirections,
  reportGateways,
  reportLocations,
  reportStatuses,
  reportTrunks,
  reportUsers,
  topNOptions,
} from '../mock/userReportsData';

export type FilterField =
  | 'user'
  | 'extension'
  | 'department'
  | 'location'
  | 'dateFrom'
  | 'dateTo'
  | 'callType'
  | 'callDirection'
  | 'callStatus'
  | 'gateway'
  | 'trunk'
  | 'n';

interface ReportFilterProps {
  fields: FilterField[];
  values: ReportFilterValues;
  onChange: (values: ReportFilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
  extraActions?: React.ReactNode;
}

export const ReportFilter: React.FC<ReportFilterProps> = ({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  extraActions,
}) => {
  const set = (key: keyof ReportFilterValues, value: string | number) => {
    onChange({ ...values, [key]: value });
  };

  const fieldClass =
    'w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2.5">
        {fields.includes('user') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">User</label>
            <select
              className={fieldClass}
              value={values.userId || ''}
              onChange={(e) => set('userId', e.target.value)}
            >
              <option value="">Select User</option>
              {reportUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} - {u.extension}
                </option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('extension') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Extension</label>
            <select
              className={fieldClass}
              value={values.extension || ''}
              onChange={(e) => set('extension', e.target.value)}
            >
              <option value="">All Extensions</option>
              {reportUsers.map((u) => (
                <option key={u.extension} value={u.extension}>
                  {u.extension}
                </option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('department') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department</label>
            <select
              className={fieldClass}
              value={values.department || reportDepartments[0]}
              onChange={(e) => set('department', e.target.value)}
            >
              {reportDepartments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('location') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Location</label>
            <select
              className={fieldClass}
              value={values.location || reportLocations[0]}
              onChange={(e) => set('location', e.target.value)}
            >
              {reportLocations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('dateFrom') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date From</label>
            <input
              type="date"
              className={fieldClass}
              value={values.dateFrom || '2026-09-01'}
              onChange={(e) => set('dateFrom', e.target.value)}
            />
          </div>
        )}

        {fields.includes('dateTo') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date To</label>
            <input
              type="date"
              className={fieldClass}
              value={values.dateTo || '2026-09-10'}
              onChange={(e) => set('dateTo', e.target.value)}
            />
          </div>
        )}

        {fields.includes('callType') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Call Type</label>
            <select
              className={fieldClass}
              value={values.callType || reportCallTypes[0]}
              onChange={(e) => set('callType', e.target.value)}
            >
              {reportCallTypes.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('callDirection') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Call Direction</label>
            <select
              className={fieldClass}
              value={values.callDirection || reportDirections[0]}
              onChange={(e) => set('callDirection', e.target.value)}
            >
              {reportDirections.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('callStatus') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Call Status</label>
            <select
              className={fieldClass}
              value={values.callStatus || reportStatuses[0]}
              onChange={(e) => set('callStatus', e.target.value)}
            >
              {reportStatuses.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('gateway') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Gateway</label>
            <select
              className={fieldClass}
              value={values.gateway || reportGateways[0]}
              onChange={(e) => set('gateway', e.target.value)}
            >
              {reportGateways.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('trunk') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Trunk</label>
            <select
              className={fieldClass}
              value={values.trunk || reportTrunks[0]}
              onChange={(e) => set('trunk', e.target.value)}
            >
              {reportTrunks.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        {fields.includes('n') && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Top N</label>
            <select
              className={fieldClass}
              value={values.n || 10}
              onChange={(e) => set('n', Number(e.target.value))}
            >
              {topNOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onSearch}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {extraActions}
      </div>
    </div>
  );
};
