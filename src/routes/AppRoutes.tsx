import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { CDRRecords } from '../pages/cdr/CDRRecords';
import { Extensions } from '../pages/extensions/Extensions';
import { Departments } from '../pages/departments/Departments';
import { Billing } from '../pages/billing/Billing';
import { RatePlans } from '../pages/rate-plans/RatePlans';
import { Reports } from '../pages/reports/Reports';
import { TaxVatMaster } from '../pages/tax/TaxVatMaster';
import { TaxReports } from '../pages/tax/TaxReports';
import { AuditLogs } from '../pages/audit/AuditLogs';
import { UsersPage } from '../pages/users/Users';
import { SettingsPage } from '../pages/settings/Settings';

import { SystemReportsPage } from '../modules/cdr/reports/system/pages/SystemReportsPage';
import { DeviceReportsPage } from '../modules/cdr/reports/device/pages/DeviceReportsPage';
import { ExportCdrCmrPage } from '../modules/cdr/export/pages/ExportCdrCmrPage';
import { IndividualBills } from '../modules/cdr/reports/user/pages/IndividualBills';
import { UserCallHistory } from '../modules/cdr/reports/user/pages/UserCallHistory';
import { TopUsersByCost } from '../modules/cdr/reports/user/pages/TopUsersByCost';
import { TopUsersByDuration } from '../modules/cdr/reports/user/pages/TopUsersByDuration';
import { TopUsersByCalls } from '../modules/cdr/reports/user/pages/TopUsersByCalls';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cdr" element={<CDRRecords />} />
        <Route path="extensions" element={<Extensions />} />
        <Route path="departments" element={<Departments />} />
        <Route path="billing" element={<Billing />} />
        <Route path="rate-plans" element={<RatePlans />} />

        {/* Tax & VAT */}
        <Route path="tax" element={<TaxVatMaster />} />
        <Route path="tax/reports" element={<TaxReports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        
        {/* Reports & Billing Navigation */}
        <Route path="reports" element={<Reports />} />
        <Route path="reports/billing" element={<Billing />} />
        <Route path="reports/export" element={<ExportCdrCmrPage />} />
        <Route path="export" element={<ExportCdrCmrPage />} />
        <Route path="reports/device" element={<DeviceReportsPage />} />
        <Route path="reports/system" element={<SystemReportsPage />} />
        <Route path="reports/user/individual-bill" element={<IndividualBills />} />
        <Route path="reports/user/call-history" element={<UserCallHistory />} />
        <Route path="reports/user/top-by-cost" element={<TopUsersByCost />} />
        <Route path="reports/user/top-by-duration" element={<TopUsersByDuration />} />
        <Route path="reports/user/top-by-calls" element={<TopUsersByCalls />} />
        <Route path="reports/tax" element={<TaxReports />} />

        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
