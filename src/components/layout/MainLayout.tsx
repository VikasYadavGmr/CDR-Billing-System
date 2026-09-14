import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { DateRangePreset } from '../../mock-data/overviewData';

export interface OverviewLayoutContext {
  dateRange: DateRangePreset;
  setDateRange: (value: DateRangePreset) => void;
}

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangePreset>('last7');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'pl-20' : 'pl-72'
        }`}
      >
        <Header />

        <main className="flex-1 p-4 lg:p-6 pb-12 overflow-x-hidden">
          <Outlet context={{ dateRange, setDateRange } satisfies OverviewLayoutContext} />
        </main>
      </div>
    </div>
  );
};
