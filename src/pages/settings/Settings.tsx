import React, { useState, useEffect } from 'react';
import type { SystemSettings } from '../../types/settings';
import { settingsService } from '../../services/settingsService';
import {
  Save,
  CheckCircle2,
  Building,
  Receipt,
  Server,
  RotateCcw,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  Clock,
  Coins,
  Percent,
  Calendar,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'cdr'>('general');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      setIsSaving(true);
      await settingsService.updateSettings(settings);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all telecom configuration settings to system defaults?')) {
      const data = await settingsService.getSettings();
      setSettings(data);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-xs text-slate-500 font-medium">Loading system configurations...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-12">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-900">System & PBX Parameters</span>
          <span className="text-xs text-slate-400 font-medium">• Live Synced</span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-70 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Settings Successfully Saved & Applied!</span>
              <p className="text-[11px] text-emerald-700">PBX CDR ingestion engine & billing parameters synchronized in real time.</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 font-bold px-2 py-0.5 rounded text-emerald-800">Synced</span>
        </div>
      )}

      {/* Status Bar / PBX Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">PRI Trunk Lines</p>
              <p className="text-sm font-bold text-slate-900">16 / 16 Channels Active</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">CDR Processing Daemon</p>
              <p className="text-sm font-bold text-slate-900">Online & Polling</p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
            {settings.autoProcessIntervalMinutes}m interval
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">Retention Policy</p>
              <p className="text-sm font-bold text-slate-900">{settings.cdrRetentionDays} Days Log Storage</p>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
            Compliant
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-1 bg-slate-200/60 p-1.5 rounded-xl border border-slate-200/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center space-x-2 ${
            activeTab === 'general'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>General Telecom</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center space-x-2 ${
            activeTab === 'billing'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Billing & GST Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cdr')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center space-x-2 ${
            activeTab === 'cdr'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>CDR Engine & Retention</span>
        </button>
      </div>

      {/* Configuration Form Card */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Tab 1: General Telecom */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Organization & Airport Authority Info
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary facility identification details printed on CDR reports, invoices, and billing summaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Organization / Authority Name
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                  placeholder="e.g. Airport Authority Telecom Wing"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Airport IATA / ICAO Code
                </label>
                <input
                  type="text"
                  value={settings.airportCode}
                  onChange={(e) => setSettings({ ...settings, airportCode: e.target.value })}
                  placeholder="e.g. DEL / VIDP"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium uppercase focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-slate-400" />
                  Base Currency
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.currency + " (Indian Rupee - ₹)"}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-600 font-semibold cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                    Fixed
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  System Time Zone
                </label>
                <input
                  type="text"
                  value={settings.timeZone}
                  onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Telecom Billing Support Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="telecom.billing@airport.gov.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Central Telecom Helpdesk Phone / Ext
                </label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  placeholder="+91 11 2565 4400"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Billing & GST */}
        {activeTab === 'billing' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                Taxation & Monthly Invoicing Cycle
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define GST tax rates, monthly billing cutoff dates, and call duration pulse rounding rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-slate-400" />
                    Default GST Rate (%)
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Standard: 18%</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={settings.defaultTaxRate}
                  onChange={(e) => setSettings({ ...settings, defaultTaxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Monthly Invoicing Cutoff Day
                  </span>
                  <span className="text-[10px] text-slate-500">Day 1 to 31 of month</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={settings.billingCycleDay}
                  onChange={(e) => setSettings({ ...settings, billingCycleDay: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Payment Grace Period (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.gracePeriodDays}
                  onChange={(e) => setSettings({ ...settings, gracePeriodDays: parseInt(e.target.value) || 20 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  Call Duration Pulse Rounding Rule
                </label>
                <select
                  value={settings.roundingRule}
                  onChange={(e) => setSettings({ ...settings, roundingRule: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="CeilToMinute">Ceil to Nearest Full Minute (60s Telecom Pulse)</option>
                  <option value="CeilTo30Seconds">Ceil to 30 Seconds Pulse</option>
                  <option value="ActualSeconds">Exact Actual Seconds (Pro-rata)</option>
                </select>
              </div>
            </div>

            {/* Pulse Preview Note */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start space-x-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Telecom Pulse Standard</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  When <strong>60s pulse</strong> is selected, a 74-second call will be billed as 120 seconds (2 full billing minutes) per TRAI/DOT telecom tariff standard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CDR Engine & Retention */}
        {activeTab === 'cdr' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                CDR Storage Retention & Processing Engine
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure data compliance storage duration, real-time ingestion frequency, and duplicate handling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    CDR Data Retention Period (Days)
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    DOT Compliance: 365+ Days
                  </span>
                </label>
                <input
                  type="number"
                  min="30"
                  value={settings.cdrRetentionDays}
                  onChange={(e) => setSettings({ ...settings, cdrRetentionDays: parseInt(e.target.value) || 365 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Auto-Processing Poll Interval
                  </span>
                  <span className="text-[10px] text-slate-500">In Minutes</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.autoProcessIntervalMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, autoProcessIntervalMinutes: parseInt(e.target.value) || 5 })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                  Duplicate Record Handling Strategy
                </label>
                <select
                  value={settings.duplicateRecordHandling}
                  onChange={(e) => setSettings({ ...settings, duplicateRecordHandling: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="FlagForReview">Flag for Review & Quarantine (Recommended for Audit Trail)</option>
                  <option value="Ignore">Ignore & Skip Silently</option>
                  <option value="Overwrite">Overwrite Existing Record with New Timestamp</option>
                </select>
              </div>
            </div>

            {/* Email Notification Toggle Card */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Automated High Usage & ISD Email Alerts</p>
                <p className="text-[11px] text-slate-500">
                  Notify Telecom Admin when international call spikes or department budget exceed threshold.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailAlertsEnabled}
                  onChange={(e) => setSettings({ ...settings, emailAlertsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Footer Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Changes take immediate effect upon saving.
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow disabled:opacity-70 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

