import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PhoneCall, Eye, EyeOff, AlertCircle, Radio } from 'lucide-react';
import bgImage from '../../assets/airport_login_bg.jpg';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both employee username and password.');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid employee credentials. Use admin / admin123');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left hero banner (Light theme) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-sky-50 via-slate-100 to-blue-100 border-r border-slate-200">
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Airport Telecom Network"
            className="object-cover w-full h-full opacity-20 mix-blend-multiply scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=2070&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-sky-50/60 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 text-slate-800 w-full">
          {/* Top Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md text-white">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">CDR Billing System</h1>
              <p className="text-xs text-teal-700 font-semibold">Telecom Accounting & Call Detail Analytics</p>
            </div>
          </div>

          {/* Center Message */}
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-semibold shadow-2xs">
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Enterprise Telecom Network Portal</span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
              Centralized Airport Telephone Accounting & Billing
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track multi-department extensions, analyze incoming/outgoing trunks, audit STD/ISD usage, and generate monthly GST-compliant billing reports across all airport terminals.
            </p>
          </div>

          {/* Bottom stats badges (Light card style) */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[11px] font-medium">PBX Trunks</span>
              <span className="text-base font-bold text-sky-700">16 PRI Lines</span>
            </div>
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[11px] font-medium">Extensions</span>
              <span className="text-base font-bold text-slate-900">180+ Active</span>
            </div>
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 block text-[11px] font-medium">Daily Volume</span>
              <span className="text-base font-bold text-emerald-600">~25,000 Calls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form (Pure White Card on Light Background) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white lg:bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-2 text-teal-600 mb-4 lg:hidden">
              <PhoneCall className="w-7 h-7" />
              <h1 className="text-xl font-bold text-slate-900">CDR Billing System</h1>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Telecom Portal Sign In</h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Access CDR records, departmental accounting, and billing cycles
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Employee ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:bg-white transition-all"
                placeholder="e.g. admin or EMP-001"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 focus:bg-white transition-all pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center cursor-pointer text-slate-600 hover:text-slate-800">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-teal-600 mr-2 focus:ring-teal-500/30"
                />
                <span>Remember Me</span>
              </label>
              <a href="#" className="text-teal-600 hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg text-xs font-bold transition-colors shadow-md shadow-teal-600/20 mt-3"
            >
              Sign In to Telecom Console
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              Default Demo Credentials: <span className="font-mono text-teal-700 font-bold">admin</span> / <span className="font-mono text-teal-700 font-bold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
