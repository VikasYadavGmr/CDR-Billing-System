import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, UserRole } from '../../types/user';
import { userService } from '../../services/userService';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { exportToCSV } from '../../utils/exportUtils';
import { formatCurrency } from '../../utils/billingCalculator';
import {
  Plus,
  Search,
  Download,
  Users,
  PhoneCall,
  Building2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    employeeId: '',
    email: '',
    department: 'Airport Operations',
    role: 'Viewer' as UserRole,
    extension: '2451',
    location: 'Terminal 1 — Operations',
    deviceModel: 'Cisco IP Phone 8845',
    status: 'Active' as const,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await userService.getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await userService.addUser(newUser);
    setUsers([...users, created]);
    setIsAddModalOpen(false);
    setNewUser({
      name: '',
      employeeId: '',
      email: '',
      department: 'Airport Operations',
      role: 'Viewer',
      extension: '2451',
      location: 'Terminal 1 — Operations',
      deviceModel: 'Cisco IP Phone 8845',
      status: 'Active',
    });
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      u.extension.includes(search) ||
      (u.location && u.location.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesDept = deptFilter === 'ALL' || u.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const totalMonthlyBilling = users.reduce((acc, u) => acc + (u.monthlyCost || 0), 0);
  const activeUsersCount = users.filter((u) => u.status === 'Active').length;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Administrator':
        return <Badge variant="purple" size="sm">Administrator</Badge>;
      case 'Billing Manager':
        return <Badge variant="info" size="sm">Billing Manager</Badge>;
      case 'Department Manager':
        return <Badge variant="amber" size="sm">Dept Manager</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Staff / Viewer</Badge>;
    }
  };

  const handleExport = () => {
    exportToCSV(filteredUsers, 'Airport_Telecom_System_Users', [
      { key: 'name', label: 'User Name' },
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'email', label: 'Email Address' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Terminal Location' },
      { key: 'role', label: 'System Role' },
      { key: 'extension', label: 'Assigned Extension' },
      { key: 'deviceModel', label: 'Device Model' },
      { key: 'monthlyCalls', label: 'Monthly Calls' },
      { key: 'monthlyCost', label: 'Monthly Cost (INR)' },
      { key: 'status', label: 'Account Status' },
      { key: 'lastLogin', label: 'Last Login' },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header & KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{users.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">All Airport Personnel</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Extensions</span>
            <PhoneCall className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-2">{activeUsersCount}</p>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block font-medium">Online & Assigned</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departments</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">10</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Divisions Covered</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Monthly Usage</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2 font-mono">{formatCurrency(totalMonthlyBilling)}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Billed Usage</span>
        </div>
      </div>

      {/* Unified Action and Filter Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, employee ID, extension, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:bg-white transition-all font-medium text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-slate-700"
          >
            <option value="ALL">All Departments</option>
            <option value="Airport Operations">Airport Operations</option>
            <option value="Security">Security</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Engineering">Engineering</option>
            <option value="Administration">Administration</option>
            <option value="Terminal Management">Terminal Management</option>
            <option value="Passenger Services">Passenger Services</option>
            <option value="Ground Handling">Ground Handling</option>
            <option value="Facility Management">Facility Management</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Billing Manager">Billing Manager</option>
            <option value="Department Manager">Department Manager</option>
            <option value="Viewer">Staff / Viewer</option>
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-3.5">User Name & ID</th>
                <th className="py-3 px-3.5">Assigned Extension</th>
                <th className="py-3 px-3.5">Department</th>
                <th className="py-3 px-3.5">Terminal Location</th>
                <th className="py-3 px-3.5">Device Model</th>
                <th className="py-3 px-3.5 text-right">Monthly Calls</th>
                <th className="py-3 px-3.5 text-right">Usage Cost</th>
                <th className="py-3 px-3.5">System Role</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs border border-teal-200/60 shadow-2xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{u.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-teal-700">
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200/60">
                      EXT-{u.extension}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-700 font-medium">{u.department}</td>
                  <td className="py-2.5 px-3.5 text-slate-500">{u.location || 'Terminal 1'}</td>
                  <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">{u.deviceModel || 'Cisco IP 8845'}</td>
                  <td className="py-2.5 px-3.5 text-right font-medium text-slate-800">
                    {u.monthlyCalls ? u.monthlyCalls.toLocaleString() : '124'}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                    {formatCurrency(u.monthlyCost || 540.0)}
                  </td>
                  <td className="py-2.5 px-3.5">{getRoleBadge(u.role)}</td>
                  <td className="py-2.5 px-3.5 text-center">
                    <Badge variant={u.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate('/reports/user/individual-bill')}
                        title="View Individual User Bill"
                        className="p-1.5 rounded-lg border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        className={`text-[10.5px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                          u.status === 'Active'
                            ? 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Telecom Portal User"
        subtitle="Provision access credentials for airport staff"
        maxWidth="max-w-lg"
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
              onClick={handleAddUser}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Create Account
            </button>
          </>
        }
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Employee ID</label>
              <input
                type="text"
                value={newUser.employeeId}
                onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                placeholder="e.g. EMP-OPS-105"
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official Email Address</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="e.g. ramesh.k@airport.gov.in"
              className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:outline-none"
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

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Role & Permissions</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:outline-none"
              >
                <option value="Viewer">Viewer (Read-Only)</option>
                <option value="Department Manager">Department Manager</option>
                <option value="Billing Manager">Billing Manager</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Primary Extension</label>
            <input
              type="text"
              value={newUser.extension}
              onChange={(e) => setNewUser({ ...newUser, extension: e.target.value })}
              placeholder="e.g. 2451"
              className="w-full px-3 py-2 border border-input rounded-md text-xs bg-background focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
