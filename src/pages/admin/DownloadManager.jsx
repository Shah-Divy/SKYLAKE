import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileText, Download, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadService } from '../../services/downloadService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function DownloadManager() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDownload, setCurrentDownload] = useState(null);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formVideo, setFormVideo] = useState('');
  const [formFile, setFormFile] = useState(null);
  const [previewName, setPreviewName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchDownloads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await downloadService.getAllAdmin();
      if (response.success) {
        setDownloads(response.data || []);
      } else {
        setError('Failed to fetch technical resources.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading downloadable resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const filteredDownloads = downloads.filter((d) =>
    (d.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentDownload(null);
    setFormTitle('');
    setFormDesc('');
    setFormVideo('');
    setFormFile(null);
    setPreviewName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setCurrentDownload(d);
    setFormTitle(d.title);
    setFormDesc(d.description || '');
    setFormVideo(d.videoLink || '');
    setFormFile(null);
    setPreviewName(d.zipFile ? 'Existing resource archive file' : '');
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormFile(file);
      setPreviewName(file.name);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    if (!currentDownload && !formFile) {
      alert('Please upload a ZIP/resource file.');
      return;
    }

    setSubmitLoading(true);
    try {
      let response;
      if (currentDownload) {
        const payload = {
          title: formTitle,
          description: formDesc,
          video_link: formVideo,
          status: currentDownload.status === 'active',
        };
        response = await downloadService.update(currentDownload._id, payload);
      } else {
        const formData = new FormData();
        formData.append('title', formTitle);
        formData.append('description', formDesc);
        formData.append('video_link', formVideo);
        formData.append('status', '1');
        if (formFile) {
          formData.append('zipfile', formFile); // Key matches backend 'zipfile'
        }
        response = await downloadService.create(formData);
      }

      if (response.success) {
        fetchDownloads();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save resource.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving resource.');
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
      const response = await downloadService.delete(deleteId);
      if (response.success) {
        setDownloads(downloads.filter((d) => d._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete resource.');
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
      const response = await downloadService.toggleStatus(item._id);
      if (response.success) {
        setDownloads(
          downloads.map((d) =>
            d._id === item._id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
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

      {/* Search and reload */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm items-center justify-between">
        <input
          type="text"
          placeholder="Search technical resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white w-64 text-slate-900"
        />
        <button
          onClick={fetchDownloads}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer"
          title="Reload Downloads"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold w-full">
          <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
          Loading resource registry files...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : filteredDownloads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No resources found. Click "Add Resource File" to populate technical downloads.
        </div>
      ) : (
        /* Table grid */
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Resource Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">File Link</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDownloads.map((d) => (
                <tr
                  key={d._id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    d.status === 'inactive' ? 'opacity-75 bg-slate-50/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-teal" />
                      <div>
                        <span>{d.title}</span>
                        {d.description && (
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{d.description}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(d)}
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        d.status === 'active' ? 'text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {d.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-600">
                    <a
                      href={getFileUrl(d.zipFile)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-teal hover:underline flex items-center gap-1 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Resource File
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(d._id)}
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
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Description details</label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-xs"
                  />
                </div>

                {/* File manual upload */}
                {!currentDownload && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                      Upload Resource File (Required)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                    />
                    {previewName && (
                      <div className="mt-1 text-[10px] font-bold text-brand-teal flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {previewName}
                      </div>
                    )}
                  </div>
                )}

                {/* Video Link */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Application Video URL (Optional)</label>
                  <input
                    type="text"
                    value={formVideo}
                    onChange={(e) => setFormVideo(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                    placeholder="https://www.youtube.com/watch?v=..."
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
                      Saving Technical Resource...
                    </>
                  ) : (
                    'Save Resource Settings'
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
        title="Delete Download Resource"
        message="Are you sure you want to permanently delete this downloadable resource archive? This cannot be undone."
      />

    </div>
  );
}
