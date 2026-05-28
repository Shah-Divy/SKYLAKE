import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockJobs } from '../../data/mockData';

export default function JobManager() {
  const [jobs, setJobs] = useState(mockJobs);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formExp, setFormExp] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const handleOpenAdd = () => {
    setCurrentJob(null);
    setFormTitle('');
    setFormDept('Engineering');
    setFormExp('2 - 5 Years');
    setFormLocation('Bangalore, India (Hybrid)');
    setFormDesc('');
    setModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setCurrentJob(job);
    setFormTitle(job.title);
    setFormDept(job.department || 'Engineering');
    setFormExp(job.experience);
    setFormLocation(job.location);
    setFormDesc(job.description);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (currentJob) {
      setJobs(
        jobs.map((j) =>
          j.id === currentJob.id
            ? {
                ...j,
                title: formTitle,
                department: formDept,
                experience: formExp,
                location: formLocation,
                description: formDesc,
              }
            : j
        )
      );
    } else {
      const newJob = {
        id: Date.now(),
        title: formTitle,
        department: formDept,
        experience: formExp,
        location: formLocation,
        description: formDesc,
      };
      setJobs([...jobs, newJob]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this job opening?')) {
      setJobs(jobs.filter((j) => j.id !== id));
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

      {/* Jobs list */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Position Title</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{job.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
                    {job.department}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{job.experience}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{job.location}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
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
                  {currentJob ? 'Edit Career opening' : 'Create Job Opening'}
                </h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Job Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Department & Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Department</label>
                    <input
                      type="text"
                      required
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Experience Range</label>
                    <input
                      type="text"
                      required
                      value={formExp}
                      onChange={(e) => setFormExp(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Office Location</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Job Description Summary</label>
                  <textarea
                    rows={4}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Job opening
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
