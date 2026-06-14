import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryService } from '../../services/categoryService';
import ConfirmModal from '../../components/ConfirmModal';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await categoryService.getAll({ limit: 100, isAdmin: true });
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError('Failed to fetch categories.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((c) =>
    (c.categoryName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentCategory(null);
    setFormName('');
    setFormDesc('Direct modular hardware control system components.');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setCurrentCategory(cat);
    setFormName(cat.categoryName);
    setFormDesc(cat.description || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSubmitLoading(true);
    try {
      let response;
      if (currentCategory) {
        const payload = {
          category_name: formName,
          description: formDesc,
        };
        response = await categoryService.update(currentCategory._id, payload);
      } else {
        const payload = {
          category_name: formName,
          description: formDesc,
          status: "1",
        };
        response = await categoryService.create(payload);
      }

      if (response.success) {
        fetchCategories();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save category.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving category.');
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
      const response = await categoryService.delete(deleteId);
      if (response.success) {
        setCategories(categories.filter((c) => c._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const response = await categoryService.toggleStatus(cat);
      if (response.success) {
        setCategories(
          categories.map((c) =>
            c._id === cat._id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
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

      {/* Search and reload */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm items-center justify-between">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white w-64 text-slate-900"
        />
        <button
          onClick={fetchCategories}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer"
          title="Reload Categories"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading & error states */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold">
          <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
          Loading classifications...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No categories found. Click "Add Category Tag" to create one.
        </div>
      ) : (
        /* Categories list */
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Standard Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr
                  key={cat._id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    cat.status === 'inactive' ? 'opacity-75 bg-slate-50/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-teal" />
                    {cat.categoryName}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {cat.description || 'High-performance industrial components used inside assembly or heavy plant systems.'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(cat)}
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        cat.status === 'active' ? 'text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {cat.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat._id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100 cursor-pointer"
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
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Short Description</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 text-xs"
                >
                  {submitLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Category...
                    </>
                  ) : (
                    'Save Category Settings'
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
        title="Delete Taxonomy Category"
        message="Are you sure you want to permanently delete this taxonomy classification? It will be removed from catalog tagging."
      />

    </div>
  );
}
