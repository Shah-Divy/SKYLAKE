import React, { useState } from 'react';
import { Building2, Save, FileText, CheckCircle, Award } from 'lucide-react';
import { mockIntro } from '../../data/mockData';

export default function ProfileManager() {
  const [title, setTitle] = useState(mockIntro.title);
  const [subtitle, setSubtitle] = useState(mockIntro.subtitle);
  const [paragraph1, setParagraph1] = useState(mockIntro.paragraph1);
  const [paragraph2, setParagraph2] = useState(mockIntro.paragraph2);
  const [imageUrl, setImageUrl] = useState(mockIntro.image);
  
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('Saving profile parameters to systems memory...');
    
    setTimeout(() => {
      setSuccessMsg('Company profile updated successfully!');
      // Clear success notification
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
          Corporate Identity
        </span>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
          Company Profile Configuration
        </h1>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form container */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
        
        <h3 className="font-display font-extrabold text-sm text-slate-950 flex items-center gap-1.5 pb-3 border-b border-slate-100">
          <Building2 className="w-4.5 h-4.5 text-brand-teal" />
          Intro Content Settings
        </h3>

        {/* Title */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Profile Header Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Focus Subtitle Tagline</label>
          <input
            type="text"
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Body Paragraph 1 */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Primary Description (Rich Text Editor Mockup)</label>
          <textarea
            rows={4}
            required
            value={paragraph1}
            onChange={(e) => setParagraph1(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none font-mono text-[11px]"
          />
        </div>

        {/* Body Paragraph 2 */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Secondary Details paragraph</label>
          <textarea
            rows={4}
            required
            value={paragraph2}
            onChange={(e) => setParagraph2(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none font-mono text-[11px]"
          />
        </div>

        {/* Image link */}
        <div>
          <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Overview Showcase Image URL</label>
          <input
            type="text"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <Save className="w-4 h-4 text-brand-teal" />
          Save Profile Content
        </button>

      </form>

    </div>
  );
}
