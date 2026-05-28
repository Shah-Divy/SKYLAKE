import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle, Shield, Database, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Settings() {
  const [maintenance, setMaintenance] = useState(false);
  const [inboundEmail, setInboundEmail] = useState('info@skylakeautomation.com');
  const [alertPhone, setAlertPhone] = useState('+91 98845-67321');
  const [cacheClear, setCacheClear] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Saving administrative settings configuration...');

    setTimeout(() => {
      setSuccessMsg('Settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  const handleClearCache = () => {
    setCacheClear(true);
    setTimeout(() => {
      setCacheClear(false);
      alert('Simulated CDN cached files purged successfully!');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-xs max-w-2xl">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
          Global Settings
        </span>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
          Admin Portal Parameters
        </h1>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Settings form container */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
        
        <h3 className="font-display font-extrabold text-slate-950 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <SettingsIcon className="w-4.5 h-4.5 text-brand-teal" />
          General System Preferences
        </h3>

        {/* Maintenance Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900">Portal Maintenance Mode</h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Enable maintenance splash screens on active frontends. Prevents custom inquiry submits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaintenance(!maintenance)}
            className="p-1 hover:bg-slate-200/60 rounded-lg cursor-pointer transition-colors"
          >
            {maintenance ? (
              <ToggleRight className="w-9 h-9 text-brand-teal" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-400" />
            )}
          </button>
        </div>

        {/* Contact email */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Lead Inbound Email Address</label>
          <input
            type="email"
            required
            value={inboundEmail}
            onChange={(e) => setInboundEmail(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Direct SMS Alert Phone Index</label>
          <input
            type="text"
            required
            value={alertPhone}
            onChange={(e) => setAlertPhone(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
          />
        </div>

        {/* Cache purging actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClearCache}
            disabled={cacheClear}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer border"
          >
            {cacheClear ? 'Clearing cache buffers...' : 'Purge Frontend Asset Cache'}
          </button>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            Save Portal Settings
          </button>
        </div>

      </form>

    </div>
  );
}
