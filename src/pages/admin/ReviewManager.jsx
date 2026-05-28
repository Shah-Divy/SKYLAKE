import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTestimonials } from '../../data/mockData';

export default function ReviewManager() {
  const [reviews, setReviews] = useState(mockTestimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');

  const handleOpenAdd = () => {
    setCurrentReview(null);
    setFormName('');
    setFormRole('Technical Lead');
    setFormCompany('L&T Heavy Industry');
    setFormContent('');
    setFormImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150');
    setModalOpen(true);
  };

  const handleOpenEdit = (rev) => {
    setCurrentReview(rev);
    setFormName(rev.name);
    setFormRole(rev.role || 'Executive');
    setFormCompany(rev.company);
    setFormContent(rev.content);
    setFormImage(rev.image);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    if (currentReview) {
      setReviews(
        reviews.map((r) =>
          r.id === currentReview.id
            ? {
                ...r,
                name: formName,
                role: formRole,
                company: formCompany,
                content: formContent,
                image: formImage,
              }
            : r
        )
      );
    } else {
      const newReview = {
        id: Date.now(),
        name: formName,
        role: formRole,
        company: formCompany,
        content: formContent,
        image: formImage,
      };
      setReviews([...reviews, newReview]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this client review permanently?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Social Proof
          </span>
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

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Ratings */}
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Message */}
              <p className="text-slate-500 italic leading-relaxed font-medium">
                "{rev.content}"
              </p>
            </div>

            {/* Profile & Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{rev.role || 'Executive'}, {rev.company}</p>
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
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 cursor-pointer"
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
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Role & Company side-by-side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Job Designation</label>
                    <input
                      type="text"
                      required
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
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
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Avatar Image link */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Client Avatar image URL</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Review Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
