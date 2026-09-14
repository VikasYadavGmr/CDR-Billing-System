import React, { useMemo, useState } from 'react';
import { Columns3, Search } from 'lucide-react';
import type { ReportColumn } from '../types';

interface ReportTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ReportColumn<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  searchable?: boolean;
  selectable?: boolean;
  pageSizeOptions?: number[];
  toolbarExtra?: React.ReactNode;
}

export function ReportTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  loading = false,
  error = null,
  searchable = true,
  selectable = false,
  pageSizeOptions = [5, 10, 20],
  toolbarExtra,
}: ReportTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(columns.map((c) => String(c.key)));
  const [showCols, setShowCols] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const visibleColumns = columns.filter((c) => visibleKeys.includes(String(c.key)));

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey as keyof T];
        const bv = b[sortKey as keyof T];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortAsc ? av - bv : bv - av;
        }
        return sortAsc
          ? String(av ?? '').localeCompare(String(bv ?? ''))
          : String(bv ?? '').localeCompare(String(av ?? ''));
      });
    }
    return rows;
  }, [data, search, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map(rowKey)));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          {searchable && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search table..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-48"
              />
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCols(!showCols)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Columns3 className="w-3.5 h-3.5" />
              Columns
            </button>
            {showCols && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 p-2 space-y-1">
                {columns.map((col) => {
                  const key = String(col.key);
                  return (
                    <label key={key} className="flex items-center gap-2 text-xs text-slate-700 px-1 py-1 hover:bg-slate-50 rounded">
                      <input
                        type="checkbox"
                        checked={visibleKeys.includes(key)}
                        onChange={() => {
                          setVisibleKeys((prev) =>
                            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
                          );
                        }}
                      />
                      {col.label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {toolbarExtra}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading report data...</div>
        ) : error ? (
          <div className="py-16 text-center text-xs text-rose-600">{error}</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                {selectable && (
                  <th className="py-2.5 px-3">
                    <input
                      type="checkbox"
                      checked={pageRows.length > 0 && selected.size === pageRows.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                {visibleColumns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`py-2.5 px-3 font-semibold whitespace-nowrap ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                    }`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(String(col.key), true)}
                        className="inline-flex items-center gap-1 hover:text-teal-700"
                      >
                        {col.label}
                        {sortKey === String(col.key) ? (sortAsc ? ' ↑' : ' ↓') : ''}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((row) => {
                const key = rowKey(row);
                return (
                  <tr key={key} className="hover:bg-slate-50/80">
                    {selectable && (
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(key)) next.delete(key);
                              else next.add(key);
                              return next;
                            });
                          }}
                        />
                      </td>
                    )}
                    {visibleColumns.map((col) => {
                      const raw = row[col.key as keyof T];
                      const content = col.render ? (col.render(row) as React.ReactNode) : String(raw ?? '');
                      return (
                        <td
                          key={String(col.key)}
                          className={`py-2.5 px-3 whitespace-nowrap ${
                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                          } ${col.className || ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                    className="py-12 text-center text-slate-500"
                  >
                    No records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded border border-slate-200 bg-white"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            Prev
          </button>
          <span className="px-2 font-semibold">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
