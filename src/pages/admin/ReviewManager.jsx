import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService } from '../../services/reviewService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formRating, setFormRating] = useState('5');
  const [formFile, setFormFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reviewService.getAll();
      if (response.success) {
        setReviews(response.data || []);
      } else {
        setError('Failed to fetch client testimonials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenAdd = () => {
    setCurrentReview(null);
    setFormName('');
    setFormCompany('L&T Heavy Industry');
    setFormContent('');
    setFormRating('5');
    setFormFile(null);
    setPreviewUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rev) => {
    setCurrentReview(rev);
    setFormName(rev.customerName);
    setFormCompany(rev.companyName || '');
    setFormContent(rev.review);
    setFormRating(String(rev.rating || 5));
    setFormFile(null);
    setPreviewUrl(rev.profileImage || '');
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
    if (!formName.trim() || !formContent.trim()) return;

    setSubmitLoading(true);
    try {
      let response;
      if (currentReview) {
        if (formFile) {
          const formData = new FormData();
          formData.append('customer_name', formName);
          formData.append('company_name', formCompany);
          formData.append('review', formContent);
          formData.append('rating', formRating);
          formData.append('status', currentReview.status === 'active' ? '1' : '0');
          formData.append('profile_image', formFile);
          formData.append('_method', 'PUT'); // Method spoofing for Laravel file uploads in PUT
          response = await reviewService.update(currentReview._id, formData);
        } else {
          const payload = {
            customer_name: formName,
            company_name: formCompany,
            review: formContent,
            rating: parseInt(formRating) || 5,
            status: currentReview.status === 'active'
          };
          response = await reviewService.updateJson(currentReview._id, payload);
        }
      } else {
        const formData = new FormData();
        formData.append('customer_name', formName);
        formData.append('company_name', formCompany);
        formData.append('review', formContent);
        formData.append('rating', formRating);
        formData.append('status', '0'); // default status is inactive
        if (formFile) {
          formData.append('profile_image', formFile);
        }
        response = await reviewService.create(formData);
      }

      if (response.success) {
        fetchReviews();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save testimonial.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving testimonial.');
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
      const response = await reviewService.delete(deleteId);
      if (response.success) {
        setReviews(reviews.filter((r) => r._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete testimonial.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const response = await reviewService.toggleStatus(item._id);
      if (response.success) {
        setReviews(
          reviews.map((r) =>
            r._id === item._id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
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
          {/* <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Social Proof
          </span> */}
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Client Testimonials & Reviews
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add Client Review
        </button>
      </div>

      {/* Reload button panel */}
      <div className="flex justify-end">
        <button
          onClick={fetchReviews}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer shadow-sm"
          title="Reload Testimonials"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm h-48 animate-pulse space-y-4">
              <div className="bg-slate-200 h-4 rounded w-1/3" />
              <div className="bg-slate-200 h-10 rounded w-full" />
              <div className="bg-slate-200 h-10 rounded-full w-10 inline-block" />
              <div className="bg-slate-200 h-4 rounded w-1/4 inline-block ml-3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs w-full col-span-full">
          No customer reviews found. Click "Add Client Review" to create one.
        </div>
      ) : (
        /* Grid listing */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                rev.status === 'inactive' ? 'border-slate-200/30 bg-slate-50/50 opacity-75' : 'border-slate-200/50'
              }`}
            >
              <div className="space-y-4">
                {/* Ratings & status */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleToggleStatus(rev)}
                    className={`text-[8px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      rev.status === 'active' ? 'text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {rev.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Message */}
                <p className="text-slate-500 italic leading-relaxed font-medium">
                  "{rev.review}"
                </p>
              </div>

              {/* Profile & Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  {rev.profileImage ? (
                    <img
                      src={getFileUrl(rev.profileImage)}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold font-display border border-slate-200 shadow-sm uppercase">
                      {rev.customerName?.charAt(0) || 'C'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{rev.customerName}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{rev.companyName || 'L&T Heavy Industry'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(rev)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200/60 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(rev._id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 cursor-pointer"
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
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10"
            >
              {!submitLoading && (
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentReview ? 'Edit Testimonial' : 'Create Client Testimonial'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Company & Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Star Rating</label>
                    <select
                      value={formRating}
                      onChange={(e) => setFormRating(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Testimonial feedback text</label>
                  <textarea
                    rows={4}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-xs"
                  />
                </div>

                {/* Avatar file upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                    {currentReview ? 'Replace Avatar Picture (Optional)' : 'Upload Avatar Picture (Optional)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                  />
                </div>

                {/* Avatar preview */}
                {previewUrl && (
                  <div className="h-16 flex items-center justify-start gap-4">
                    <img src={getFileUrl(previewUrl)} className="w-14 h-14 object-cover rounded-full border border-slate-200 shadow-sm" alt="Avatar Preview" />
                    <span className="text-[10px] text-slate-400 font-bold">Image loaded successfully</span>
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
                      Saving Testimonial...
                    </>
                  ) : (
                    'Save Review Settings'
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
        title="Delete Client Testimonial"
        message="Are you sure you want to permanently delete this client review? It will be removed from site feedback scrolls."
      />

    </div>
  );
}
