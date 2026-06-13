import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Award, Eye, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandService } from '../../services/brandService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function BrandManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formFile, setFormFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await brandService.getAll({ limit: 100, isAdmin: true });
      if (response.success) {
        setBrands(response.data || []);
      } else {
        setError('Failed to fetch partner brands.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading partner brands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((b) =>
    (b.brandName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentBrand(null);
    setFormName('');
    setFormDesc('');
    setFormFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setCurrentBrand(b);
    setFormName(b.brandName);
    setFormDesc(b.description || '');
    setFormFile(null);
    setPreviewUrl(b.logo || '');
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
    if (!formName.trim()) return;
    if (!currentBrand && !formFile) {
      alert('Please upload a logo file for the new brand.');
      return;
    }

    setSubmitLoading(true);
    try {
      let response;
      if (currentBrand) {
        const payload = {
          brand_name: formName,
          description: formDesc,
          status: currentBrand.status === 'active',
        };
        response = await brandService.update(currentBrand._id, payload);
      } else {
        const formData = new FormData();
        formData.append('brand_name', formName);
        formData.append('description', formDesc);
        formData.append('status', '1');
        if (formFile) {
          formData.append('logo', formFile);
        }
        response = await brandService.create(formData);
      }

      if (response.success) {
        fetchBrands();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save brand.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving brand.');
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
      const response = await brandService.delete(deleteId);
      if (response.success) {
        setBrands(brands.filter((b) => b._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete brand.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (brand) => {
    try {
      // Note: We can implement status toggling if needed
      // brandService has toggleStatus, let's call it!
      const response = await brandService.toggleStatus(brand);
      if (response.success) {
        setBrands(
          brands.map((b) =>
            b._id === brand._id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Systems Partners
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Partner Brand Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add Partner Brand
        </button>
      </div>

      {/* Search and reload */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm items-center justify-between">
        <input
          type="text"
          placeholder="Search brands by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white w-64 text-slate-900"
        />
        <button
          onClick={fetchBrands}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer"
          title="Reload Brands"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-sm h-48 animate-pulse space-y-4">
              <div className="bg-slate-200 h-14 rounded-xl w-full" />
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
      ) : filteredBrands.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs w-full col-span-full">
          No manufacturer brands found. Click "Add Partner Brand" to create one.
        </div>
      ) : (
        /* Grid List of Brand cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBrands.map((b) => (
            <div
              key={b._id}
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${
                b.status === 'inactive' ? 'border-slate-200/30 bg-slate-50/50 opacity-75' : 'border-slate-200/50'
              }`}
            >
              <div className="space-y-4">
                {/* Logo frame */}
                <div className="h-14 bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-center overflow-hidden relative">
                  <img src={getFileUrl(b.logo)} alt={b.brandName} className="max-h-full max-w-[120px] object-contain" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-slate-950 text-xs flex items-center justify-between gap-1.5">
                    <span>{b.brandName}</span>
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        b.status === 'active' ? 'text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {b.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>

              {/* Actions & Metrics */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end mt-6">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                    title="Edit Brand"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(b._id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100 cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3 h-3" />
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
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10"
            >
              {!submitLoading && (
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentBrand ? 'Edit Manufacturer Brand' : 'Create Partner Brand'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Brand Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Brand Description Details</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-xs"
                  />
                </div>

                {/* Logo file upload */}
                {!currentBrand && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                      Upload Brand Logo File (Required)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                    />
                  </div>
                )}

                {/* Logo preview */}
                {previewUrl && (
                  <div className="h-20 bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-center overflow-hidden">
                    <img src={getFileUrl(previewUrl)} className="max-h-full object-contain" alt="Logo Preview" />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 text-xs"
                >
                  {submitLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Brand Settings...
                    </>
                  ) : (
                    'Save Brand Settings'
                  )}
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deletion modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        title="Delete Partner Brand"
        message="Are you sure you want to permanently delete this manufacturer brand? It will be removed from partner lists."
      />

    </div>
  );
}
