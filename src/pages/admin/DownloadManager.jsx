import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, FileText, Download, Settings, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDownloads } from '../../data/mockData';

export default function DownloadManager() {
  const [downloads, setDownloads] = useState(mockDownloads);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDownload, setCurrentDownload] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState('Manuals');
  const [formSize, setFormSize] = useState('2.4 MB (PDF)');
  const [formUrl, setFormUrl] = useState('#');

  const handleOpenAdd = () => {
    setCurrentDownload(null);
    setFormTitle('');
    setFormDesc('');
    setFormCat('Manuals');
    setFormSize('3.5 MB (PDF)');
    setFormUrl('#');
    setModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setCurrentDownload(d);
    setFormTitle(d.title);
    setFormDesc(d.description || '');
    setFormCat(d.category);
    setFormSize(d.fileSize);
    setFormUrl(d.fileUrl);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (currentDownload) {
      setDownloads(
        downloads.map((d) =>
          d.id === currentDownload.id
            ? {
                ...d,
                title: formTitle,
                description: formDesc,
                category: formCat,
                fileSize: formSize,
                fileUrl: formUrl,
              }
            : d
        )
      );
    } else {
      const newDownload = {
        id: Date.now(),
        title: formTitle,
        description: formDesc,
        category: formCat,
        fileSize: formSize,
        fileUrl: formUrl,
      };
      setDownloads([...downloads, newDownload]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this download file resource?')) {
      setDownloads(downloads.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Resource Registry
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Technical Resource Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add Resource File
        </button>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Resource Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Size Code</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((d) => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{d.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
                    {d.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-medium text-slate-600">{d.fileSize}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(d)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
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
                  {currentDownload ? 'Edit File Parameters' : 'Register Resource File'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Resource Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Category & Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Category</label>
                    <select
                      value={formCat}
                      onChange={(e) => setFormCat(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    >
                      <option value="Brochures">Brochures</option>
                      <option value="Manuals">Manuals</option>
                      <option value="Software">Software</option>
                      <option value="Certificates">Certificates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">File Size label</label>
                    <input
                      type="text"
                      required
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* File URL */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">File Access Link</label>
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Resource Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
