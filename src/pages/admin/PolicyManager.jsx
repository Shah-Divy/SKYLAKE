import React, { useState } from 'react';
import { Shield, Save, CheckCircle } from 'lucide-react';

export default function PolicyManager() {
  const [activeTab, setActiveTab] = useState('shipping');
  const [successMsg, setSuccessMsg] = useState('');

  // Sample static initial states representing policy paragraphs
  const [shippingContent, setShippingContent] = useState(
    `All standard catalog orders (PLCs, HMIs, drives, and sensors) are dispatched within 24 to 48 hours. We collaborate with Blue Dart and TCI Express. Heavy systems are secured inside heat-treated wooden crates conforming to ISPM 15 guidelines. Notification registers are emailed immediately upon courier pick-up.`
  );

  const [refundContent, setRefundContent] = useState(
    `Standard catalog products with factory seals intact can be returned within 10 days of delivery. Returns are subject to a 15% restocking fee to cover quality checks. Programmed software licenses or custom control panels are non-refundable. Warranty claims carry a 12-month manufacturer validation.`
  );

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg(`Saving ${activeTab} guidelines updates...`);

    setTimeout(() => {
      setSuccessMsg(`Systems ${activeTab === 'shipping' ? 'Shipping' : 'Refunds'} guidelines updated successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
          Regulations Core
        </span>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
          System Policies Settings
        </h1>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor Layout container */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col">
        
        {/* Navigation tabs */}
        <div className="flex bg-slate-50 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-4 font-bold text-xs cursor-pointer border-b-2 transition-all ${
              activeTab === 'shipping'
                ? 'border-brand-teal text-slate-950 bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Shipping &amp; Delivery Policy
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-6 py-4 font-bold text-xs cursor-pointer border-b-2 transition-all ${
              activeTab === 'refund'
                ? 'border-brand-teal text-slate-950 bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Refunds &amp; Cancellations
          </button>
        </div>

        {/* Editor forms body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-extrabold text-slate-950 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Shield className="w-4.5 h-4.5 text-brand-teal" />
            Edit Guidelines Content
          </h3>

          {activeTab === 'shipping' ? (
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Shipping Guidelines Paragraphs</label>
              <textarea
                rows={8}
                required
                value={shippingContent}
                onChange={(e) => setShippingContent(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none font-mono text-[11px]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Returns &amp; Cancellations guidelines</label>
              <textarea
                rows={8}
                required
                value={refundContent}
                onChange={(e) => setRefundContent(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none font-mono text-[11px]"
              />
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-brand-teal" />
              Save Guidelines Configuration
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
