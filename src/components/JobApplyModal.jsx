import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobApplyModal({ job, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    message: '',
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Disable background page scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-+()]/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience level is required';
    }

    if (!formData.resume) {
      newErrors.resume = 'Please upload your CV/Resume';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors((prev) => ({ ...prev, resume: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        
        {/* Backdrop click to close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        {/* Modal content box */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2.5 py-1 rounded-md">
                  Careers at 3ARK
                </span>
                <h3 className="font-display font-extrabold text-xl text-slate-900 mt-2">
                  Apply for Position
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {job.title} — <span className="text-slate-400 font-mono">{job.location}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:bg-white transition-colors ${
                      errors.fullName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.fullName}</p>}
                </div>

                {/* Email & Phone side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:bg-white transition-colors ${
                        errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                      }`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:bg-white transition-colors ${
                        errors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone}</p>}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border focus:outline-none focus:bg-white transition-colors ${
                      errors.experience ? 'border-red-500' : 'border-slate-200 focus:border-brand-teal'
                    }`}
                  >
                    <option value="">Select experience...</option>
                    <option value="Fresher">Fresher (0-1 Year)</option>
                    <option value="Junior">Junior (1-3 Years)</option>
                    <option value="Mid-Level">Mid-Level (3-5 Years)</option>
                    <option value="Senior">Senior (5+ Years)</option>
                  </select>
                  {errors.experience && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.experience}</p>}
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Upload Resume (PDF/DOC)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    />
                    <div className={`w-full bg-slate-50 border border-dashed rounded-xl px-4 py-6 text-center flex flex-col items-center justify-center transition-colors ${
                      errors.resume ? 'border-red-500 bg-red-50/10' : 'border-slate-200 hover:bg-slate-100/50'
                    }`}>
                      <Upload className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-600 font-semibold">
                        {formData.resume ? formData.resume.name : 'Choose file or drag here'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        PDF, DOC up to 5MB
                      </span>
                    </div>
                  </div>
                  {errors.resume && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.resume}</p>}
                </div>

                {/* Cover Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cover Note (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-teal transition-colors resize-none"
                    placeholder="Briefly pitch your profile..."
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-brand-teal mb-4 animate-bounce" />
              <h3 className="font-display font-extrabold text-xl text-slate-900">
                Application Received!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2 max-w-sm">
                Thank you for applying, {formData.fullName}. Our recruitment team will review your CV for the <strong className="text-slate-800">{job.title}</strong> role and contact you shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
