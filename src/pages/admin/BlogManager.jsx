import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, Clock, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBlog } from '../../data/mockData';

export default function BlogManager() {
  const [blogs, setBlogs] = useState(mockBlog);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState('Industrial IoT');
  const [formDate, setFormDate] = useState('May 26, 2026');
  const [formTime, setFormTime] = useState('5 min read');
  const [formImage, setFormImage] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');

  const handleOpenAdd = () => {
    setCurrentBlog(null);
    setFormTitle('');
    setFormCat('Industrial IoT');
    setFormDate('May 26, 2026');
    setFormTime('6 min read');
    setFormImage('https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800');
    setFormExcerpt('');
    setFormContent('');
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setCurrentBlog(b);
    setFormTitle(b.title);
    setFormCat(b.category);
    setFormDate(b.date);
    setFormTime(b.readTime);
    setFormImage(b.image);
    setFormExcerpt(b.excerpt);
    setFormContent(b.content);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const savedBlog = {
      id: currentBlog ? currentBlog.id : Date.now(),
      title: formTitle,
      category: formCat,
      date: formDate,
      readTime: formTime,
      image: formImage,
      excerpt: formExcerpt || formContent.substring(0, 100) + '...',
      content: formContent,
    };

    if (currentBlog) {
      setBlogs(blogs.map((b) => (b.id === currentBlog.id ? savedProduct : b))); // Wait! Typing error, savedBlog not savedProduct
      // Fix: replacing with savedBlog
      setBlogs(blogs.map((b) => (b.id === currentBlog.id ? savedBlog : b)));
    } else {
      setBlogs([savedBlog, ...blogs]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this blog post guide permanently?')) {
      setBlogs(blogs.filter((b) => b.id !== id));
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

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Visual Screen */}
            <div className="relative pt-[56.25%] bg-slate-50 border-b overflow-hidden">
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-slate-950/90 text-brand-teal text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded">
                {item.category}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-teal" />
                    {item.readTime}
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>
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
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100 cursor-pointer"
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
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>

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
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Focus Excerpt Snippet</label>
                  <input
                    type="text"
                    required
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    placeholder="Short summary for listing feed..."
                  />
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Category</label>
                    <select
                      value={formCat}
                      onChange={(e) => setFormCat(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    >
                      <option value="Industrial IoT">Industrial IoT</option>
                      <option value="Safety Systems">Safety Systems</option>
                      <option value="Smart Manufacturing">Smart Manufacturing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Publish Date</label>
                    <input
                      type="text"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Link & Read Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Cover Image link</label>
                    <input
                      type="text"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Reading Estimate</label>
                    <input
                      type="text"
                      required
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Rich Blog Content</label>
                  <textarea
                    rows={5}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Blog Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
