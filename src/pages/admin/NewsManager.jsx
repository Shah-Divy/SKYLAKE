import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNews } from '../../data/mockData';

export default function NewsManager() {
  const [news, setNews] = useState(mockNews);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formContent, setFormContent] = useState('');

  const handleOpenAdd = () => {
    setCurrentNews(null);
    setFormTitle('');
    setFormDate('May 26, 2026');
    setFormImage('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800');
    setFormContent('');
    setModalOpen(true);
  };

  const handleOpenEdit = (n) => {
    setCurrentNews(n);
    setFormTitle(n.title);
    setFormDate(n.date);
    setFormImage(n.image);
    setFormContent(n.content);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (currentNews) {
      setNews(
        news.map((n) =>
          n.id === currentNews.id
            ? {
                ...n,
                title: formTitle,
                date: formDate,
                image: formImage,
                content: formContent,
              }
            : n
        )
      );
    } else {
      const newNews = {
        id: Date.now(),
        title: formTitle,
        date: formDate,
        image: formImage,
        content: formContent,
      };
      setNews([newNews, ...news]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this press announcement permanently?')) {
      setNews(news.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Press Releases
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Latest News Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Create News Announcement
        </button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Visual Screen */}
            <div className="relative pt-[56.25%] bg-slate-50 border-b overflow-hidden">
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                  {item.date}
                </span>
                <h3 className="font-display font-bold text-slate-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
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
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10"
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentNews ? 'Edit News Article' : 'Create News Release'}
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

                {/* Date & Image */}
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                {/* Content */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">News Content</label>
                  <textarea
                    rows={6}
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
                  Save News Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
