import React, { useState, useEffect } from 'react';
import { Upload, X, Trash2, ShieldAlert, Cpu, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { galleryService } from '../../services/galleryService';
import ConfirmModal from '../../components/ConfirmModal';

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [inputTitle, setInputTitle] = useState('');
  const [formFile, setFormFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await galleryService.getAll();
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
      formData.append('image', formFile); // Field name is 'image' in multer config

      const response = await galleryService.create(formData);
      if (response.success) {
        fetchGallery();
        setInputTitle('');
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
          <h3 className="font-display font-extrabold text-slate-950 text-sm">
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
                <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
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
                  className="relative overflow-hidden rounded-xl aspect-square group bg-slate-100 border border-slate-100"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  
                  {/* Overlay Delete buttons */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                    <span className="text-[9px] font-extrabold text-brand-teal uppercase tracking-wider block">
                      Showcase Cell
                    </span>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{item.title}</span>
                      <button
                        onClick={() => handleDeleteClick(item._id)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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

    </div>
  );
}
