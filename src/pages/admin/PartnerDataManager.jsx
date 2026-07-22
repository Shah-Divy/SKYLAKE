import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, AlertCircle, RefreshCw, Settings2 } from 'lucide-react';
import { systemService } from '../../services/systemService';

export default function PartnerDataManager() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    data: '',
    button_1: '',
    button_2: '',
  });

  const fetchPartnerData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await systemService.getPartnerData();
      if (response?.success && response?.data) {
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          data: response.data.data || '',
          button_1: response.data.button_1 || '',
          button_2: response.data.button_2 || '',
        });
      } else {
        setErrorMsg(response?.message || 'Failed to load partner data.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || 'Unable to load partner data from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await systemService.updatePartnerData(formData);
      if (response?.success) {
        setSuccessMsg('Partner data updated successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(response?.message || 'Failed to save partner data.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || 'An error occurred while saving partner data.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Partner Content
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Partner Data Settings
          </h1>
          <p className="text-slate-500 text-[11px] mt-1">
            Manage the partner section content and button labels used throughout the site.
          </p>
        </div>
        <button
          onClick={fetchPartnerData}
          disabled={loading}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer shadow-sm disabled:opacity-50"
          title="Reload Partner Data"
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

      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold">
            <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
            Loading partner data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Settings2 className="w-4.5 h-4.5 text-brand-teal" />
              <h3 className="font-display font-extrabold text-slate-950 text-sm">Edit Partner Content</h3>
            </div>

            
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  placeholder="Enter section title"
                />
              </div>
              
            

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Main Content</label>
              <textarea
                name="data"
                rows="6"
                value={formData.data}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                placeholder="Enter main content"
              />
            </div>

<div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Button 1 Label</label>
                <input
                  type="text"
                  name="button_1"
                  value={formData.button_1}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  placeholder="Primary button text"
                />
              </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Button 2 Label</label>
              <input
                type="text"
                name="button_2"
                value={formData.button_2}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                placeholder="Secondary button text"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saveLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {saveLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-brand-teal" />
                    Save Partner Data
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
