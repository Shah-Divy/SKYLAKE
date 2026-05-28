import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Award, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBrands } from '../../data/mockData';

export default function BrandManager() {
  const [brands, setBrands] = useState(mockBrands);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCount, setFormCount] = useState(0);

  const handleOpenAdd = () => {
    setCurrentBrand(null);
    setFormName('');
    setFormLogo('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Siemens-logo.svg/320px-Siemens-logo.svg.png');
    setFormDesc('');
    setFormCount(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setCurrentBrand(b);
    setFormName(b.name);
    setFormLogo(b.logo);
    setFormDesc(b.description || '');
    setFormCount(b.productsCount || 0);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (currentBrand) {
      setBrands(
        brands.map((b) =>
          b.id === currentBrand.id
            ? {
                ...b,
                name: formName,
                logo: formLogo,
                description: formDesc,
                productsCount: parseInt(formCount) || 0,
              }
            : b
        )
      );
    } else {
      const newBrand = {
        id: formName.toLowerCase().replace(/\s+/g, '-'),
        name: formName,
        logo: formLogo,
        description: formDesc,
        productsCount: parseInt(formCount) || 0,
      };
      setBrands([...brands, newBrand]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this partner manufacturer brand catalog?')) {
      setBrands(brands.filter((b) => b.id !== id));
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

      {/* Grid List of Brand cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Logo frame */}
              <div className="h-14 bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-center overflow-hidden">
                <img src={b.logo} alt={b.name} className="max-h-full max-w-[120px] object-contain" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-display font-bold text-slate-950 text-xs flex items-center gap-1.5">
                  {b.name}
                  <span className="text-[8px] font-bold text-brand-teal bg-brand-teal/10 px-1.5 py-0.5 rounded">
                    Authorized
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>

            {/* Actions & Metrics */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-6">
              <div className="text-[10px] text-slate-400 font-bold">
                {b.productsCount || 0} Products carried
              </div>
              
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100"
                >
                  <Trash2 className="w-3 h-3" />
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
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Brand Description Details</label>
                  <textarea
                    rows={3}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Logo & Product count */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Logo PNG Link</label>
                    <input
                      type="text"
                      required
                      value={formLogo}
                      onChange={(e) => setFormLogo(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Products In Catalog</label>
                    <input
                      type="number"
                      required
                      value={formCount}
                      onChange={(e) => setFormCount(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Brand Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
