import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobService } from '../../services/jobService';
import ConfirmModal from '../../components/ConfirmModal';

export default function JobManager() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formExp, setFormExp] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await jobService.getAllAdmin();
      if (response.success) {
        setJobs(response.data || []);
      } else {
        setError('Failed to fetch job openings.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading job openings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((j) =>
    (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentJob(null);
    setFormTitle('');
    setFormExp('2 - 5 Years');
    setFormLocation('Bangalore, India (Hybrid)');
    setFormDesc('');
    setModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setCurrentJob(job);
    setFormTitle(job.title);
    setFormExp(job.experience);
    setFormLocation(job.location);
    setFormDesc(job.description);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formExp.trim() || !formLocation.trim() || !formDesc.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        title: formTitle,
        experience: formExp,
        location: formLocation,
        description: formDesc,
      };

      let response;
      if (currentJob) {
        response = await jobService.update(currentJob._id, payload);
      } else {
        response = await jobService.create(payload);
      }

      if (response.success) {
        fetchJobs();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save job position.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving job opening.');
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
      const response = await jobService.delete(deleteId);
      if (response.success) {
        setJobs(jobs.filter((j) => j._id !== deleteId));
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete job opening.');
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
    const response = await jobService.toggleStatus(item.id);

    if (response.success) {
      fetchJobs();
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
            Careers Division
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Job Openings Management
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add Job Position
        </button>
      </div>

      {/* Search and reload */}
      <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm items-center justify-between">
        <input
          type="text"
          placeholder="Search jobs by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white w-64 text-slate-900"
        />
        <button
          onClick={fetchJobs}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer"
          title="Reload Jobs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold w-full">
          <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
          Loading job listings...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No job openings found. Click "Add Job Position" to create a post.
        </div>
      ) : (
        /* Jobs list */
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Position Title</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job._id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    job.status === 'inactive' ? 'opacity-75 bg-slate-50/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-teal" />
                      <div>
                        <span>{job.title}</span>
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5 max-w-sm line-clamp-1">{job.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{job.experience}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{job.location}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(job)}
                      className={`text-[8px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        job.status === true ? 'text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {job.status === true ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job._id)}
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
                  {currentJob ? 'Edit Career Opening' : 'Create Job Opening'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Job Position Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                    placeholder="e.g. Industrial Automation Engineer"
                  />
                </div>

                {/* Experience Range & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Experience Range</label>
                    <input
                      type="text"
                      required
                      value={formExp}
                      onChange={(e) => setFormExp(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                      placeholder="e.g. 2 - 5 Years"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Office Location</label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                      placeholder="e.g. Bangalore, India (Hybrid)"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Job Description Details</label>
                  <textarea
                    rows={6}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-xs"
                    placeholder="Provide details about expectations, tech stack, responsibilities..."
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
                      Saving Job Opening...
                    </>
                  ) : (
                    'Save Job Position Settings'
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
        title="Delete Job Opening"
        message="Are you sure you want to permanently remove this job posting? This cannot be undone."
      />

    </div>
  );
}
