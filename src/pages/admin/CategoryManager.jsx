import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCategories } from '../../data/mockData';

export default function CategoryManager() {
  const [categories, setCategories] = useState(mockCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const handleOpenAdd = () => {
    setCurrentCategory(null);
    setFormName('');
    setFormDesc('Direct modular hardware control system components.');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat, idx) => {
    setCurrentCategory({ name: cat, index: idx });
    setFormName(cat);
    setFormDesc('High precision automation systems block.');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (currentCategory) {
      setCategories(
        categories.map((c, i) => (i === currentCategory.index ? formName : c))
      );
    } else {
      setCategories([...categories, formName]);
    }
    setModalOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Remove this category classification?')) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            System Taxonomy
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Category Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add Category Tag
        </button>
      </div>

      {/* Categories list */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4">Standard Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-teal" />
                  {cat}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">
                  High-performance industrial components used inside assembly or heavy plant systems.
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat, idx)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  {currentCategory ? 'Edit Category' : 'Create Category Tag'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Category Name</label>
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
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Short Description</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Category Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
