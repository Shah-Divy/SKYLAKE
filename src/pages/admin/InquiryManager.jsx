import React, { useState } from 'react';
import { Mail, Phone, Clock, Eye, Trash2, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([
    { id: 1, name: 'Rajesh Mehta', email: 'rajesh@tatamotors.com', phone: '9822456712', subject: 'PLC/HMI Controls System Upgrade', message: 'We are planning to migrate our assembly lines PLC S5 systems to S7-1500. Need pricing catalog and commissioning details for 12 lines.', date: 'May 26, 2026' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah@unilever.com', phone: '9123456789', subject: 'VFD Speed Regulation Upgrade', message: 'Seeking safe torque-off parameter setup sheets and pricing for PowerFlex 525 AC drives.', date: 'May 25, 2026' },
    { id: 3, name: 'Amit Patel', email: 'amit@cipla.com', phone: '9876543210', subject: 'Clean Room photoelectric distance sensor', message: 'Please quote 45 pieces of Omron E3AS distance Settable sensors for packaging rejects cells.', date: 'May 24, 2026' }
  ]);

  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter((inq) =>
    inq.name.toLowerCase().includes(search.toLowerCase()) ||
    inq.email.toLowerCase().includes(search.toLowerCase()) ||
    inq.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this inquiry ticket?')) {
      setInquiries(inquiries.filter((inq) => inq.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
          Leads Database
        </span>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
          Client Inquiry Records
        </h1>
      </div>

      {/* Search and filters */}
      <div className="relative max-w-md bg-white p-2.5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-2">
        <input
          type="text"
          placeholder="Search leads by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 text-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
        />
      </div>

      {/* Leads listing table */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Email Address</th>
              <th className="px-6 py-4">Subject Matter</th>
              <th className="px-6 py-4">Inquiry Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{inq.name}</td>
                <td className="px-6 py-4 font-semibold text-slate-600">{inq.email}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{inq.subject}</td>
                <td className="px-6 py-4 font-mono font-medium text-slate-600">{inq.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(inq.id)}
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
              <button onClick={() => setSelectedInquiry(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>

              <div className="pb-3 border-b border-slate-100">
                <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2 py-0.5 rounded">
                  Lead Ticket details
                </span>
                <h3 className="font-display font-extrabold text-base text-slate-950 mt-2">
                  {selectedInquiry.subject}
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
                    <span className="font-mono text-slate-700 font-semibold">{selectedInquiry.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Email Address</span>
                    <span className="text-brand-teal font-semibold font-mono">{selectedInquiry.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[8px] block">Phone Contact</span>
                    <span className="text-slate-700 font-semibold font-mono">{selectedInquiry.phone}</span>
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

    </div>
  );
}
