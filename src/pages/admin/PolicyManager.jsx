import React, { useState, useEffect } from 'react';
import { Shield, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { policyService } from '../../services/policyService';

export default function PolicyManager() {
  const [activeTab, setActiveTab] = useState('shipping');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Policy states
  const [shippingTitle, setShippingTitle] = useState('Shipping Policy');
  const [shippingContent, setShippingContent] = useState('');
  const [refundTitle, setRefundTitle] = useState('Refund Policy');
  const [refundContent, setRefundContent] = useState('');

  const fetchPolicies = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [shippingRes, refundRes] = await Promise.all([
        policyService.getByType('shipping'),
        policyService.getByType('refund'),
      ]);

      if (shippingRes.success && shippingRes.data) {
        setShippingTitle(shippingRes.data.title || 'Shipping Policy');
        setShippingContent(shippingRes.data.content || '');
      }
      if (refundRes.success && refundRes.data) {
        setRefundTitle(refundRes.data.title || 'Refund Policy');
        setRefundContent(refundRes.data.content || '');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load system policies from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const type = activeTab;
      const title = type === 'shipping' ? shippingTitle : refundTitle;
      const content = type === 'shipping' ? shippingContent : refundContent;

      const response = await policyService.updateByType(type, title, content);
      if (response.success) {
        setSuccessMsg(`Systems ${type === 'shipping' ? 'Shipping' : 'Refunds'} guidelines updated successfully!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(response.message || 'Failed to save policy updates.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while saving the policy guidelines.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Regulations Core
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            System Policies Settings
          </h1>
        </div>
        <button
          onClick={fetchPolicies}
          disabled={loading}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer shadow-sm disabled:opacity-50"
          title="Reload Policies"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
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
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold w-full">
            <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
            Loading policy configurations...
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-extrabold text-slate-950 text-sm flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Shield className="w-4.5 h-4.5 text-brand-teal" />
              Edit Guidelines Content
            </h3>

            {activeTab === 'shipping' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Policy Header Title</label>
                  <input
                    type="text"
                    required
                    value={shippingTitle}
                    onChange={(e) => setShippingTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Policy Header Title</label>
                  <input
                    type="text"
                    required
                    value={refundTitle}
                    onChange={(e) => setRefundTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Returns &amp; Cancellations Guidelines</label>
                  <textarea
                    rows={8}
                    required
                    value={refundContent}
                    onChange={(e) => setRefundContent(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none font-mono text-[11px]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saveLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {saveLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Guidelines...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-brand-teal" />
                    Save Guidelines Configuration
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
