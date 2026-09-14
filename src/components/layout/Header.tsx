import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Clock, LogOut, Search, User } from 'lucide-react';



const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'CDR Operations Dashboard',
    subtitle: 'Real-time telephone traffic, call volume, and billing analysis',
  },
  '/cdr': {
    title: 'Call Detail Records (CDR)',
    subtitle: 'Filter, inspect, and export all airport extension call logs',
  },
  '/extensions': {
    title: 'Extensions Directory',
    subtitle: 'Manage airport telephone lines, terminal locations, and staff assignments',
  },
  '/departments': {
    title: 'Department Usage & Budgets',
    subtitle: 'Telephone consumption and cost center allocation',
  },
  '/billing': {
    title: 'Billing & Invoices Management',
    subtitle: 'Monthly billing cycles, individual user statements, departmental bills, and VAT tax invoices',
  },
  '/tax': {
    title: 'Tax & VAT Master',
    subtitle: 'Country Master and country-wise VAT rules applied by the CDR billing engine',
  },
  '/tax/reports': {
    title: 'Tax & VAT Reports',
    subtitle: 'Tax summary, country-wise tax, tax rate, and tax audit reporting',
  },
  '/audit-logs': {
    title: 'Audit Logs',
    subtitle: 'Configuration and tax master change history across the billing system',
  },
  '/reports': {
    title: 'CDR Reports & Telecom Analytics',
    subtitle: 'Analyze telephone call logs, top user rankings, trunk traffic, hardware utilization, and raw exports',
  },
  '/rate-plans': {
    title: 'Tariffs & Rate Plans',
    subtitle: 'Configure per-minute rates for Local, Mobile, STD, and ISD calls',
  },
  '/users': {
    title: 'User Management',
    subtitle: 'Manage administrative roles, permissions, and portal access',
  },
  '/settings': {
    title: 'System Settings',
    subtitle: 'Configure CDR parameters, billing policies, and organization profile',
  },
};

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dateTimeStr, setDateTimeStr] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentInfo = routeTitles[location.pathname] || {
    title: 'CDR Billing System',
    subtitle: 'Telecom network accounting & call detail records',
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTimeStr(
        now.toLocaleString('en-IE', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cdr?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 flex items-center justify-between px-4 lg:px-6 gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Page Title & Subtitle */}
      <div className="min-w-0 flex-1 max-w-sm xl:max-w-md">
        <h1 className="text-sm lg:text-base font-bold text-slate-900 truncate">{currentInfo.title}</h1>
        <p className="text-[10px] lg:text-[11px] text-slate-500 truncate hidden sm:block">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-2 lg:gap-3.5 flex-shrink-0">
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ext, CDR ID, number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all"
          />
        </form>

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/90">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px] font-mono font-semibold text-slate-700 whitespace-nowrap">{dateTimeStr}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">System Notifications</span>
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">2 New</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-900">Billing Cycle Ready</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">August 2026 rating generated: €95,438.31 incl. VAT.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-900">High Usage Alert</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Extension 2451 exceeded monthly limit (46 hrs).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || 'Admin Officer'}</p>
              <p className="text-[10px] text-teal-700 font-medium leading-tight">
                {user ? `${user.role} • ${user.region}` : 'Telecom Admin'}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-500">telecom.admin@hts-group.gr</p>
                {user && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {user.region} • {user.billingCountryCode} • {user.currency}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>System Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
