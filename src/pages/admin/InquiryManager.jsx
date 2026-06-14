import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Eye, Trash2, X, AlertTriangle, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inquiryService } from '../../services/inquiryService';
import ConfirmModal from '../../components/ConfirmModal';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInquiries, setTotalInquiries] = useState(0);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await inquiryService.getAll({
        page,
        limit,
        search,
      });
      if (response.success) {
        setInquiries(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
          setTotalInquiries(response.pagination.total || 0);
        }
      } else {
        setError('Failed to fetch inquiries.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading client inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInquiries();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await inquiryService.delete(deleteId);
      if (response.success) {
        setInquiries(inquiries.filter((inq) => inq._id !== deleteId));
        if (selectedInquiry?._id === deleteId) {
          setSelectedInquiry(null);
        }
        setConfirmOpen(false);
      } else {
        alert(response.message || 'Failed to delete inquiry ticket.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Leads Database
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Client Inquiry Records
          </h1>
        </div>
        <button
          onClick={fetchInquiries}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer shadow-sm animate-none"
          title="Reload Inquiries"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search and filters */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md bg-white p-2.5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-2">
        <input
          type="text"
          placeholder="Search leads by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-950 px-4 py-2.5 rounded-xl focus:outline-none focus:bg-white text-xs"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800"
        >
          Search
        </button>
      </form>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold w-full">
          <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
          Loading client inquiries...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No client inquiries logged yet.
        </div>
      ) : (
        /* Leads listing table */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Client Name</th>
                  {/* <th className="px-6 py-4">Subject</th> */}
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Inquiry Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{inq.name}</td>
                    {/* <td className="px-6 py-4 text-slate-700 font-semibold truncate max-w-[150px]">{inq.subject || 'N/A'}</td> */}
                    <td className="px-6 py-4 font-semibold text-slate-600">{inq.email}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium font-mono">{inq.phone}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-600">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                          title="View Inquiry Message"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(inq._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100 cursor-pointer"
                          title="Delete Ticket"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/50 shadow-sm text-slate-500 font-bold">
              <div>
                Showing {inquiries.length} of {totalInquiries} Inquiry Leads
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-slate-900 px-2">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inquiry details Modal overlay */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0 cursor-default" onClick={() => setSelectedInquiry(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10"
            >
              <button onClick={() => setSelectedInquiry(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="pb-3 border-b border-slate-100">
                <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2 py-0.5 rounded">
                  Lead Ticket Details
                </span>
                <h3 className="font-display font-extrabold text-base text-slate-950 mt-2">
                  General Contact Inquiry
                </h3>
              </div>

              <div className="space-y-4 font-medium">
                
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Client Name</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Inquiry Date</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Email Address</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-brand-teal font-semibold font-mono hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Phone Contact</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-slate-700 font-semibold font-mono hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  <div className="col-span-2 border-t border-slate-200/60 pt-2 mt-1">
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Subject Matter</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedInquiry.subject || 'N/A'}</span>
                  </div>
                </div>

                {/* Message body */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-bold uppercase text-[8px] block">Message text</span>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed text-slate-600 whitespace-pre-wrap">
                    "{selectedInquiry.message}"
                  </div>
                </div>

              </div>

              {/* Footer action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Close Inquiry Ticket
                </button>
              </div>

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
        title="Delete Inquiry Ticket"
        message="Are you sure you want to permanently delete this lead inquiry ticket? This cannot be undone."
      />

    </div>
  );
}
