import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, X, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bannerService } from '../../services/bannerService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  
  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formMediaType, setFormMediaType] = useState('image');
  const [formCTAText, setFormCTAText] = useState('');
  const [formCTAUrl, setFormCTAUrl] = useState('');
  const [formOrder, setFormOrder] = useState('0');
  const [formFile, setFormFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await bannerService.getAll();
      if (response.success) {
        // Backend returns response.data directly as an array or paginated object. 
        // Based on controller, it returns `new ApiResponse(..., banners, ...)` where data is banners array.
        setBanners(response.data || []);
      } else {
        setError('Failed to fetch banners.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentBanner(null);
    setFormTitle('');
    setFormMediaType('image');
    setFormCTAText('View Products');
    setFormCTAUrl('/products');
    setFormOrder('0');
    setFormFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setCurrentBanner(banner);
    setFormTitle(banner.title);
    setFormMediaType(banner.mediaType || 'image');
    setFormCTAText(banner.ctaText || '');
    setFormCTAUrl(banner.ctaUrl || '');
    setFormOrder(String(banner.order || 0));
    setFormFile(null);
    setPreviewUrl(banner.mediaUrl || '');
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (!currentBanner && !formFile) {
      alert('Please upload a media file for the new banner.');
      return;
    }

    setSubmitLoading(true);
    try {
      let response;
      if (currentBanner) {
        const payload = {
          title: formTitle,
          cta_text: formCTAText || '',
          cta_url: formCTAUrl || '',
          order: parseInt(formOrder) || 0,
          status: currentBanner.status === 'active',
          media_type: currentBanner.mediaType || 'image',
          media_url: currentBanner.mediaUrl || '',
        };
        response = await bannerService.update(currentBanner._id, payload);
      } else {
        const formData = new FormData();
        formData.append('title', formTitle);
        formData.append('media_type', formMediaType);
        formData.append('cta_text', formCTAText || '');
        formData.append('cta_url', formCTAUrl || '');
        formData.append('order', formOrder);
        formData.append('status', '1');
        formData.append('media_file', formFile);
        response = await bannerService.create(formData);
      }

      if (response.success) {
        fetchBanners();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save banner slide.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving banner slide.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await bannerService.delete(deleteId);
      if (response.success) {
        setBanners(banners.filter((b) => b._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete banner.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (banner) => {
    try {
      const response = await bannerService.toggleStatus(banner._id);
      if (response.success && response.data) {
        setBanners(
          banners.map((b) =>
            b._id === banner._id ? response.data : b
          )
        );
      } else if (response.success) {
        setBanners(
          banners.map((b) =>
            b._id === banner._id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
          )
        );
      }
    } catch (err) {
      console.error(err);
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

      {/* Search and reload */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm items-center justify-between">
        <input
          type="text"
          placeholder="Search banners by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white w-64 text-slate-900"
        />
        <button
          onClick={fetchBanners}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer"
          title="Reload Banners"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden h-72 animate-pulse p-5 space-y-4">
              <div className="bg-slate-200 h-32 rounded-xl w-full" />
              <div className="bg-slate-200 h-4 rounded w-2/3" />
              <div className="bg-slate-200 h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No banners found. Click "Add Slider Banner" to create one.
        </div>
      ) : (
        /* Grid listing */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBanners.map((banner) => (
            <div
              key={banner._id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-colors ${
                banner.status === 'inactive' ? 'border-slate-200/30 bg-slate-50/50 opacity-75' : 'border-slate-200/50'
              }`}
            >
              {/* Visual Box */}
              <div className="relative pt-[45%] bg-slate-950 overflow-hidden shrink-0 border-b border-slate-100">
                {banner.mediaType === 'video' ? (
                  <video src={getFileUrl(banner.mediaUrl)} muted loop className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <img src={getFileUrl(banner.mediaUrl)} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">
                  {banner.mediaType}
                </div>
                <button
                  onClick={() => handleToggleStatus(banner)}
                  className={`absolute top-3 right-3 p-1.5 rounded-lg text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-lg ${
                    banner.status === 'active' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {banner.status === 'active' ? (
                    <>
                      <ToggleRight className="w-3.5 h-3.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3.5 h-3.5" />
                      Inactive
                    </>
                  )}
                </button>
              </div>

              {/* Details and Actions */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                    {banner.title}
                  </h3>
                  <div className="text-[10px] font-bold text-slate-400">Order Priority: {banner.order || 0}</div>
                  {banner.ctaText && (
                    <div className="text-[10px] font-bold text-brand-teal mt-2">
                      CTA: "{banner.ctaText}" → {banner.ctaUrl || '/'}
                    </div>
                  )}
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
                    onClick={() => handleDeleteClick(banner._id)}
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
      )}

      {/* Editor Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0 cursor-default" onClick={() => !submitLoading && setModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {!submitLoading && (
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentBanner ? 'Edit Banner Slide' : 'Add New Banner Slide'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Slide Header / Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Media File Upload & Type */}
                <div className="grid grid-cols-2 gap-4">
                  {!currentBanner && (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Media Type</label>
                      <select
                        value={formMediaType}
                        onChange={(e) => setFormMediaType(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                      >
                        <option value="image">Image Format</option>
                        <option value="video">Video Format</option>
                      </select>
                    </div>
                  )}

                  <div className={currentBanner ? "col-span-2" : ""}>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Order Sequence</label>
                    <input
                      type="number"
                      required
                      value={formOrder}
                      onChange={(e) => setFormOrder(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                    />
                  </div>
                </div>

                {/* File Upload Input */}
                {!currentBanner && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                      Upload Banner File (Required)
                    </label>
                    <input
                      type="file"
                      accept={formMediaType === 'video' ? 'video/*' : 'image/*'}
                      onChange={handleFileChange}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                    />
                  </div>
                )}

                {/* Preview Box */}
                {previewUrl && (
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-950 relative pt-[30%]">
                    {formMediaType === 'video' ? (
                      <video src={getFileUrl(previewUrl)} muted controls className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <img src={getFileUrl(previewUrl)} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                    )}
                  </div>
                )}

                {/* CTA & Link */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">CTA Button Label</label>
                    <input
                      type="text"
                      value={formCTAText}
                      onChange={(e) => setFormCTAText(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">CTA Link Redirect</label>
                    <input
                      type="text"
                      value={formCTAUrl}
                      onChange={(e) => setFormCTAUrl(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
                >
                  {submitLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Slider Settings...
                    </>
                  ) : (
                    'Save Banner Slide Settings'
                  )}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm deletion modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        title="Delete Slide Banner"
        message="Are you sure you want to permanently delete this banner slide? This will remove it from the home hero slider."
      />

    </div>
  );
}
