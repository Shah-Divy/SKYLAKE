import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, Clock, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogService } from '../../services/blogService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formFile, setFormFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogService.getAll();
      if (response.success) {
        setBlogs(response.data || []);
      } else {
        setError('Failed to fetch blogs.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading blog guides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) =>
    (b.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentBlog(null);
    setFormTitle('');
    setFormContent('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setCurrentBlog(b);
    setFormTitle(b.title);
    setFormContent(b.content);
    setFormDate(b.publishDate ? b.publishDate.split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormFile(null);
    setPreviewUrl(b.image || '');
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
    if (!formTitle.trim() || !formContent.trim()) return;
    if (!currentBlog && !formFile) {
      alert('Please upload a cover image file for the new blog.');
      return;
    }

    setSubmitLoading(true);
    try {
      let response;
      if (currentBlog) {
        const payload = {
          title: formTitle,
          content: formContent,
          publish_date: formDate.includes(' ') ? formDate : `${formDate} 00:00:00`,
          status: currentBlog.status === 'active',
        };
        response = await blogService.update(currentBlog._id, payload);
      } else {
        const formData = new FormData();
        formData.append('title', formTitle);
        formData.append('content', formContent);
        formData.append('publish_date', formDate.includes(' ') ? formDate : `${formDate} 00:00:00`);
        formData.append('status', '1');
        if (formFile) {
          formData.append('image', formFile); // Field name is 'image' in multer config
        }
        response = await blogService.create(formData);
      }

      if (response.success) {
        fetchBlogs();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save blog guide.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving blog guide.');
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
      const response = await blogService.delete(deleteId);
      if (response.success) {
        setBlogs(blogs.filter((b) => b._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete blog article.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    try {
      const response = await blogService.toggleStatus(blog._id);
      if (response.success) {
        setBlogs(
          blogs.map((b) =>
            b._id === blog._id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
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
            Insights Feed
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Blog Knowledge Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Create Blog Guide
        </button>
      </div>

      {/* Search and reload */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm items-center justify-between">
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white w-64 text-slate-900"
        />
        <button
          onClick={fetchBlogs}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer"
          title="Reload Blogs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden h-80 animate-pulse p-5 space-y-4">
              <div className="bg-slate-200 h-36 rounded-xl w-full" />
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
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No blogs found. Click "Create Blog Guide" to draft an article.
        </div>
      ) : (
        /* Grid listing */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all ${
                item.status === 'inactive' ? 'border-slate-200/30 bg-slate-50/50 opacity-75' : 'border-slate-200/50 hover:shadow-md'
              }`}
            >
              {/* Visual Screen */}
              <div className="relative pt-[56.25%] bg-slate-50 border-b overflow-hidden">
                <img src={getFileUrl(item.image)} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`absolute top-3 right-3 p-1.5 rounded-lg text-white font-extrabold text-[8px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-lg ${
                    item.status === 'active' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {item.status === 'active' ? (
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

              {/* Info */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      {new Date(item.publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item._id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100 cursor-pointer"
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
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              {!submitLoading && (
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentBlog ? 'Edit Blog Article' : 'Create Blog Guide'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Article Headline</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Publish Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>

                {/* Image file upload */}
                {!currentBlog && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                      Upload Cover Image (Required)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                    />
                  </div>
                )}

                {/* Image Preview */}
                {previewUrl && (
                  <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 relative pt-[40%]">
                    <img src={getFileUrl(previewUrl)} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                  </div>
                )}

                {/* Content */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Rich Blog Content</label>
                  <textarea
                    rows={6}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
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
                      Saving Blog article...
                    </>
                  ) : (
                    'Save Blog Settings'
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
        title="Delete Blog Article"
        message="Are you sure you want to permanently delete this blog guide? This cannot be undone."
      />

    </div>
  );
}
