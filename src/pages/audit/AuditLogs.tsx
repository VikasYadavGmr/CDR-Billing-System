import React, { useEffect, useMemo, useState } from 'react';
import type { TaxAuditLog } from '../../types/tax';
import { taxAuditService } from '../../services/taxAuditService';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { formatRate } from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import { Download, History, Percent, ScrollText, Search, UserCog } from 'lucide-react';

const selectClass =
  'px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<TaxAuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    taxAuditService.getAuditLogs().then(setLogs);
  }, []);

  const actions = useMemo(() => [...new Set(logs.map((l) => l.action))].sort(), [logs]);
  const users = useMemo(() => [...new Set(logs.map((l) => l.changedBy))].sort(), [logs]);

  const filtered = useMemo(
    () =>
      logs.filter((log) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          log.taxRuleLabel.toLowerCase().includes(q) ||
          log.taxRuleId.toLowerCase().includes(q) ||
          log.reason.toLowerCase().includes(q) ||
          log.changedBy.toLowerCase().includes(q);
        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
        const matchesUser = userFilter === 'ALL' || log.changedBy === userFilter;
        const day = log.changedAt.slice(0, 10);
        const matchesFrom = !fromDate || day >= fromDate;
        const matchesTo = !toDate || day <= toDate;
        return matchesSearch && matchesAction && matchesUser && matchesFrom && matchesTo;
      }),
    [logs, search, actionFilter, userFilter, fromDate, toDate]
  );

  const kpis = useMemo(
    () => ({
      total: logs.length,
      rateChanges: logs.filter((l) => l.action === 'Rate Changed').length,
      statusChanges: logs.filter((l) => l.action === 'Activated' || l.action === 'Deactivated').length,
      users: new Set(logs.map((l) => l.changedBy)).size,
    }),
    [logs]
  );

  const handleExport = () => {
    exportToCSV(filtered, 'Audit_Logs', [
      { key: 'auditId', label: 'Audit ID' },
      { key: 'taxRuleId', label: 'Record ID' },
      { key: 'taxRuleLabel', label: 'Record' },
      { key: 'action', label: 'Action' },
      { key: 'oldValue', label: 'Previous Value' },
      { key: 'newValue', label: 'New Value' },
      { key: 'changedBy', label: 'Changed By' },
      { key: 'changedAt', label: 'Changed At' },
      { key: 'reason', label: 'Reason' },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-2xs flex-shrink-0">
            <ScrollText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Audit Logs</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only change history for tax rules and billing configuration. Entries are never
              edited, so historical invoices stay reproducible.
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Audit Entries"
          value={kpis.total}
          subtitle="Across all configuration records"
          icon={History}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
        />
        <StatCard
          title="Rate Changes"
          value={kpis.rateChanges}
          subtitle="Versioned, never overwritten"
          icon={Percent}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Status Changes"
          value={kpis.statusChanges}
          subtitle="Rules activated or deactivated"
          icon={ScrollText}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Contributing Users"
          value={kpis.users}
          subtitle="Administrators with recorded changes"
          icon={UserCog}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col xl:flex-row items-center justify-between gap-3">
        <div className="relative w-full xl:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search record, user, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={selectClass}
          >
            <option value="ALL">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className={selectClass}
          >
            <option value="ALL">All Users</option>
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={selectClass}
            title="From date"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={selectClass}
            title="To date"
          />

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Configuration Change History
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {filtered.length} of {logs.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                <th className="py-3 px-3.5">Audit ID</th>
                <th className="py-3 px-3.5">Record</th>
                <th className="py-3 px-3.5 text-center">Action</th>
                <th className="py-3 px-3.5">Previous Value</th>
                <th className="py-3 px-3.5">New Value</th>
                <th className="py-3 px-3.5">Changed By</th>
                <th className="py-3 px-3.5">Changed At</th>
                <th className="py-3 px-3.5">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.slice(0, 300).map((log) => (
                <tr key={log.auditId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500">{log.auditId}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                    {log.taxRuleLabel}
                    <span className="block text-[10px] text-slate-400 font-mono">{log.taxRuleId}</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <Badge
                      variant={
                        log.action === 'Rate Changed'
                          ? 'warning'
                          : log.action === 'Deactivated'
                            ? 'danger'
                            : log.action === 'Created' || log.action === 'Activated'
                              ? 'success'
                              : 'info'
                      }
                      size="sm"
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-500">
                    {log.oldValue ?? (log.oldRate !== null ? formatRate(log.oldRate) : '—')}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-800">
                    {log.newValue ?? (log.newRate !== null ? formatRate(log.newRate) : '—')}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-600">{log.changedBy}</td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-500">
                    {log.changedAt.slice(0, 10)}
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 max-w-sm">{log.reason}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-slate-400">
                    No audit entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
