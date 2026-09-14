import React, { useState, useEffect } from 'react';
import type { Extension } from '../../types/extension';
import { extensionService } from '../../services/extensionService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/billingCalculator';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Plus,
  Search,
  Download,
  MapPin,
} from 'lucide-react';

export const Extensions: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Extension form state
  const [newExt, setNewExt] = useState({
    extension: '',
    employeeName: '',
    employeeId: '',
    department: 'Airport Operations',
    location: 'Terminal 3 - Airside Ops',
    telephoneNumber: '+91 11 2565 ',
    extensionType: 'SIP Phone' as const,
    monthlyCalls: 0,
    monthlyUsageHours: 0,
    monthlyCost: 0,
    status: 'Active' as const,
  });

  useEffect(() => {
    const fetchExts = async () => {
      const data = await extensionService.getExtensions();
      setExtensions(data);
    };
    fetchExts();
  }, []);

  const handleAddExtension = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await extensionService.addExtension(newExt);
    setExtensions([...extensions, created]);
    setIsAddModalOpen(false);
    // Reset
    setNewExt({
      extension: '',
      employeeName: '',
      employeeId: '',
      department: 'Airport Operations',
      location: 'Terminal 3 - Airside Ops',
      telephoneNumber: '+91 11 2565 ',
      extensionType: 'SIP Phone',
      monthlyCalls: 0,
      monthlyUsageHours: 0,
      monthlyCost: 0,
      status: 'Active',
    });
  };

  const filteredExtensions = extensions.filter((ext) => {
    const matchesSearch =
      ext.extension.includes(search) ||
      ext.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      ext.location.toLowerCase().includes(search.toLowerCase()) ||
      ext.telephoneNumber.includes(search);
    const matchesDept = deptFilter === 'ALL' || ext.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || ext.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Active') return <Badge variant="success">Active</Badge>;
    if (status === 'Suspended') return <Badge variant="danger">Suspended</Badge>;
    return <Badge variant="neutral">Inactive</Badge>;
  };

  const handleExport = () => {
    exportToCSV(filteredExtensions, 'Airport_Extensions', [
      { key: 'extension', label: 'Extension' },
      { key: 'employeeName', label: 'Employee Name' },
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'telephoneNumber', label: 'Direct Line' },
      { key: 'extensionType', label: 'Type' },
      { key: 'monthlyUsageHours', label: 'Monthly Hours' },
      { key: 'monthlyCost', label: 'Monthly Cost (₹)' },
      { key: 'status', label: 'Status' },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Unified Action and Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search extension, name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Airport Operations">Airport Operations</option>
            <option value="Security & CISF">Security & CISF</option>
            <option value="Engineering & Maint">Engineering & Maint</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Cargo Operations">Cargo Operations</option>
            <option value="IT & Telecom">IT & Telecom</option>
            <option value="Administration">Administration</option>
            <option value="Finance & Accounts">Finance & Accounts</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Extension</span>
          </button>
        </div>
      </div>


      {/* Extensions Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-border text-muted-foreground font-semibold">
                <th className="py-3 px-3.5">Extension</th>
                <th className="py-3 px-3.5">Employee / Desk</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Physical Location</th>
                <th className="py-3 px-3.5">Direct Line (PSTN)</th>
                <th className="py-3 px-3.5">Phone Type</th>
                <th className="py-3 px-3.5 text-right">Talk Time</th>
                <th className="py-3 px-3.5 text-right">Monthly Cost</th>
                <th className="py-3 px-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredExtensions.map((ext) => (
                <tr key={ext.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 text-xs">
                      {ext.extension}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div>
                      <span className="font-bold text-foreground block">{ext.employeeName}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{ext.employeeId}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-medium text-slate-700">{ext.department}</td>
                  <td className="py-2.5 px-3.5 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span>{ext.location}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-600">{ext.telephoneNumber}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                      {ext.extensionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-medium text-slate-700">
                    {ext.monthlyUsageHours} hrs
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                    {formatCurrency(ext.monthlyCost)}
                  </td>
                  <td className="py-2.5 px-3.5 text-center">{getStatusBadge(ext.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Extension Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Airport Extension"
        subtitle="Provision a new telephone number line on the airport PBX network"
        maxWidth="max-w-xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddExtension}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Save Extension
            </button>
          </>
        }
      >
        <form onSubmit={handleAddExtension} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Extension Number (4-digit)</label>
              <input
                type="text"
                value={newExt.extension}
                onChange={(e) => setNewExt({ ...newExt, extension: e.target.value })}
                placeholder="e.g. 2455"
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Employee / User Name</label>
              <input
                type="text"
                value={newExt.employeeName}
                onChange={(e) => setNewExt({ ...newExt, employeeName: e.target.value })}
                placeholder="e.g. Duty Officer"
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
              <input
                type="text"
                value={newExt.employeeId}
                onChange={(e) => setNewExt({ ...newExt, employeeId: e.target.value })}
                placeholder="e.g. EMP-OPS-109"
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={newExt.department}
                onChange={(e) => setNewExt({ ...newExt, department: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Airport Operations">Airport Operations</option>
                <option value="Security & CISF">Security & CISF</option>
                <option value="Engineering & Maint">Engineering & Maint</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Cargo Operations">Cargo Operations</option>
                <option value="IT & Telecom">IT & Telecom</option>
                <option value="Administration">Administration</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Airport Location</label>
              <input
                type="text"
                value={newExt.location}
                onChange={(e) => setNewExt({ ...newExt, location: e.target.value })}
                placeholder="e.g. Terminal 2 - Gate 3"
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Extension Hardware Type</label>
              <select
                value={newExt.extensionType}
                onChange={(e) => setNewExt({ ...newExt, extensionType: e.target.value as any })}
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              >
                <option value="SIP Phone">SIP Phone</option>
                <option value="Digital IP">Digital IP</option>
                <option value="Analog">Analog</option>
                <option value="Hot-line">Hot-line</option>
                <option value="Wireless DECT">Wireless DECT</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
