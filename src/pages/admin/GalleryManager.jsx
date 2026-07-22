import React, { useState, useEffect } from 'react';
import { Upload, X, Trash2, ShieldAlert, Cpu, AlertCircle, RefreshCw, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../../services/galleryService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [formEditTitle, setFormEditTitle] = useState('');
  const [formEditDescription, setFormEditDescription] = useState('');
  const [formEditStatus, setFormEditStatus] = useState(true);
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);

  // Form states
  const [inputTitle, setInputTitle] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [formFile, setFormFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await galleryService.getAllAdmin();
      if (response.success) {
        setGallery(response.data || []);
      } else {
        setError('Failed to fetch gallery items.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading visual assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputTitle.trim()) {
      alert('Please enter an asset label.');
      return;
    }
    if (!formFile) {
      alert('Please upload an image file.');
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', inputTitle.trim());
      formData.append('description', inputDescription.trim());
      formData.append('image', formFile); // Field name is 'image' in multer config

      const response = await galleryService.create(formData);
      if (response.success) {
        fetchGallery();
        setInputTitle('');
        setInputDescription('');
        setFormFile(null);
        setPreviewUrl('');
      } else {
        alert(response.message || 'Failed to add image.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while adding image.');
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
      const response = await galleryService.delete(deleteId);
      if (response.success) {
        setGallery(gallery.filter((item) => item._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete gallery item.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEdit = (item) => {
    setCurrentAsset(item);
    setFormEditTitle(item.title || '');
    setFormEditDescription(item.description || '');
    setFormEditStatus(item.status === true || item.status === 1 || item.status === 'active');
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formEditTitle.trim()) {
      alert('Please enter an asset label.');
      return;
    }

    setEditSubmitLoading(true);
    try {
      const payload = {
        title: formEditTitle.trim(),
        description: formEditDescription.trim(),
        status: formEditStatus,
      };

      const response = await galleryService.update(currentAsset._id, payload);
      if (response.success) {
        fetchGallery();
        setEditModalOpen(false);
      } else {
        alert(response.message || 'Failed to update asset.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while updating asset.');
    } finally {
      setEditSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const response = await galleryService.toggleStatus(item._id);
      if (response.success) {
        setGallery(
          gallery.map((g) =>
            g._id === item._id
              ? { ...g, status: !(g.status === true || g.status === 1 || g.status === 'active') }
              : g
          )
        );
      } else {
        alert(response.message || 'Failed to toggle status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Visual Assets
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Showcase Gallery Management
          </h1>
        </div>
        <button
          onClick={fetchGallery}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer shadow-sm"
          title="Reload Gallery"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Add Image Panel (Col 4) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-6 self-start">
          <h3 className="font-display font-extrabold text-slate-955 text-sm">
            Add Media Assets
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Asset Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Panel fabrication block"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Description (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Detailed description of the gallery asset..."
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Upload Showcase Image</label>
              <input
                type="file"
                required={!previewUrl}
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
            </div>

            {/* Preview Box */}
            {previewUrl && (
              <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 relative pt-[50%]">
                <img src={getFileUrl(previewUrl)} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
            >
              {submitLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                'Add Image to Gallery'
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Visual Showcase listing (Col 8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-display font-extrabold text-slate-950 text-sm">
              Current Gallery Grid ({gallery.length} Images)
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-200 rounded-xl aspect-square w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>{error}</span>
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center text-slate-400 font-semibold py-12">
              No images uploaded. Use the upload panel to fill your showroom gallery.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className={`relative overflow-hidden rounded-xl aspect-square group bg-slate-100 border transition-all ${
                    !(item.status === true || item.status === 1 || item.status === 'active') ? 'border-slate-200 opacity-80' : 'border-slate-100'
                  }`}
                >
                  <img src={getFileUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                  
                  {/* Overlay Action controls */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-[9px] font-extrabold text-brand-teal uppercase tracking-wider block">
                        Showcase Cell
                      </span>
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="p-1 bg-slate-900/90 hover:bg-slate-900 text-white rounded-md text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-lg"
                        title="Toggle status visibility"
                      >
                        {(item.status === true || item.status === 1 || item.status === 'active') ? (
                          <>
                            <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-white truncate flex-grow" title={item.title}>
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer border border-slate-700"
                            title="Edit Photo &amp; Details"
                          >
                            <Edit2 className="w-3 h-3 text-slate-300" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-[9px] text-slate-300 line-clamp-2 leading-tight font-medium" title={item.description}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Confirm deletion modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        title="Remove Visual Asset"
        message="Are you sure you want to permanently delete this photo from the systems showcase gallery?"
      />

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0 cursor-default" onClick={() => !editSubmitLoading && setEditModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10"
            >
              {!editSubmitLoading && (
                <button onClick={() => setEditModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Edit Showcase Asset
                </h3>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Asset Label</label>
                  <input
                    type="text"
                    required
                    value={formEditTitle}
                    onChange={(e) => setFormEditTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={formEditDescription}
                    onChange={(e) => setFormEditDescription(e.target.value)}
                    placeholder="Enter asset description..."
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs resize-none"
                  />
                </div>

                {/* Status Toggle option inside modal */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Display Status</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Toggle to publish or hide from showroom.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormEditStatus(!formEditStatus)}
                    className={`p-1.5 rounded-lg text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-sm ${
                      formEditStatus ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {formEditStatus ? (
                      <>
                        <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                        Active
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                        Inactive
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={editSubmitLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
                >
                  {editSubmitLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    'Save Asset Changes'
                  )}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

