import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Percent,
  PhoneCall,
  Receipt,
  ScrollText,
  Settings,
  Users,
  X,
  Radio,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const menuItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'CDR Records', path: '/cdr', icon: FileText, badge: 'Live' },
    { name: 'Extensions', path: '/extensions', icon: PhoneCall },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Billing', path: '/billing', icon: Receipt },
    { name: 'Tax & VAT', path: '/tax', icon: Percent },
    { name: 'Rate Plans', path: '/rate-plans', icon: Coins },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-30 h-screen bg-white text-slate-800 border-r border-slate-200/90 transition-all duration-300 flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.03)] select-none ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-[76px] flex items-center justify-between px-4 sm:px-5 border-b border-slate-200/90 bg-white">
          {!collapsed && (
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="font-bold text-[15px] tracking-tight text-slate-900 leading-tight truncate">
                  CDR Billing System
                </span>
                <span className="text-[10.5px] text-teal-700 font-bold tracking-wider uppercase leading-snug truncate">
                  Telecom Analytics
                </span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0 ${
              collapsed ? 'hidden' : 'block'
            }`}
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            {!collapsed && 'Main Menu'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                    collapsed ? 'justify-center' : 'justify-between'
                  } ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs border border-teal-200/60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
            {!collapsed && 'Support & System'}
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
            title={collapsed ? 'Help & Documentation' : undefined}
          >
            <div className="flex items-center space-x-3.5">
              <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {!collapsed && <span>Help & Guides</span>}
            </div>
          </button>
        </div>

        {/* PRI / PBX Trunk Live Widget */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-slate-800">PBX Trunks Active</span>
              </div>
              <Radio className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">4 PRI Links • 120 SIP Channels</p>
          </div>
        )}

        {/* Logout Footer */}
        <div className="border-t border-slate-200/90 p-3 bg-white">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-600 hover:bg-red-50/80 transition-colors ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <div className="flex items-center space-x-3.5">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </div>
          </button>

          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mt-2 w-full p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Airport CDR Billing System Help</h3>
                <p className="text-xs text-slate-500">Telephone network and accounting guide</p>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>• Dashboard:</strong> High-level CDR overview, daily volumes, billing trends, and top talk-time analysis.
              </p>
              <p>
                <strong>• CDR Records:</strong> Complete call detail record log with multi-filter search, export, and printable receipts.
              </p>
              <p>
                <strong>• Extensions & Departments:</strong> Manage airport terminals, SIP/analog lines, department allocations, and cost limits.
              </p>
              <p>
                <strong>• Billing & Rate Plans:</strong> Calculate monthly invoices, review tax summaries, and customize per-minute tariffs.
              </p>
              <p>
                <strong>• Tax & VAT:</strong> Maintain the Country Master and country-wise VAT rules the billing engine applies when rating calls.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
