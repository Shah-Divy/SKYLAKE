import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBanners } from '../../data/mockData';

export default function BannerManager() {
  const [banners, setBanners] = useState(mockBanners);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  
  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [formType, setFormType] = useState('image');
  const [formPrimaryCTA, setFormPrimaryCTA] = useState('');
  const [formPrimaryLink, setFormPrimaryLink] = useState('');

  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentBanner(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormMediaUrl('https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800');
    setFormType('image');
    setFormPrimaryCTA('View Products');
    setFormPrimaryLink('/products');
    setModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setCurrentBanner(banner);
    setFormTitle(banner.title);
    setFormSubtitle(banner.subtitle || '');
    setFormMediaUrl(banner.url);
    setFormType(banner.type);
    setFormPrimaryCTA(banner.primaryCTA || '');
    setFormPrimaryLink(banner.primaryLink || '');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (currentBanner) {
      // Editing
      setBanners(
        banners.map((b) =>
          b.id === currentBanner.id
            ? {
                ...b,
                title: formTitle,
                subtitle: formSubtitle,
                url: formMediaUrl,
                type: formType,
                primaryCTA: formPrimaryCTA,
                primaryLink: formPrimaryLink,
              }
            : b
        )
      );
    } else {
      // Adding
      const newBanner = {
        id: Date.now(),
        title: formTitle,
        subtitle: formSubtitle,
        url: formMediaUrl,
        type: formType,
        primaryCTA: formPrimaryCTA,
        primaryLink: formPrimaryLink,
      };
      setBanners([...banners, newBanner]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            System Slider Banners
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Banner Slider Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add Slider Banner
        </button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Visual Box */}
            <div className="relative pt-[45%] bg-slate-950 overflow-hidden shrink-0 border-b border-slate-100">
              {banner.type === 'video' ? (
                <video src={banner.url} muted loop className="absolute inset-0 w-full h-full object-cover opacity-60" />
              ) : (
                <img src={banner.url} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">
                {banner.type}
              </div>
            </div>

            {/* Details and Actions */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                  {banner.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {banner.subtitle}
                </p>
                <div className="text-[10px] font-bold text-brand-teal mt-2">
                  CTA: "{banner.primaryCTA || 'None'}" → {banner.primaryLink || '/'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200/60 cursor-pointer"
                  title="Edit Banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Editor Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0 cursor-default" onClick={() => setModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10"
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentBanner ? 'Edit Banner Slide' : 'Add New Banner Slide'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Slide Header</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Slide Description</label>
                  <textarea
                    rows={2}
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Media Url & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Media Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    >
                      <option value="image">Image Format</option>
                      <option value="video">Video Format (MP4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Media File Link</label>
                    <input
                      type="text"
                      required
                      value={formMediaUrl}
                      onChange={(e) => setFormMediaUrl(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* CTA & Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">CTA Button Label</label>
                    <input
                      type="text"
                      value={formPrimaryCTA}
                      onChange={(e) => setFormPrimaryCTA(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">CTA Link Redirect</label>
                    <input
                      type="text"
                      value={formPrimaryLink}
                      onChange={(e) => setFormPrimaryLink(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Banner Slide Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
