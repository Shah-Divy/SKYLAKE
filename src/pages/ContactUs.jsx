import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
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
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please write your message';
    }
    if (!recaptchaToken) {
      newErrors.recaptcha = 'Please verify you are not a robot';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;                                                                             
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Trim inputs before sending
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        recaptchaToken,
      };
      const response = await api.post('/contact', payload);
      if (response?.data?.success) {
        setIsSubmitted(true);
        // Reset form after success
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setRecaptchaToken(null);
      } else {
        setErrors((prev) => ({ ...prev, api: response?.data?.message || 'Submission failed.' }));
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrors((prev) => ({ ...prev, api: err.response?.data?.message || 'An error occurred while sending.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full pt-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Contact Our Engineering Center
          </h1>
          <p className="text-xs text-slate-400">
            Submit a request for components procurement, control upgrades, or customized design audits.
          </p>
        </div>
      </section>

      {/* Main Details and Form Segment */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
            
            {/* LEFT: Info & Details Cards (Grid col 5) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              
              <div className="space-y-6">
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
                  Get In Touch
                </span>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight">
                  Consult With a Controls Expert
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  We look forward to optimizing your production systems. Reach out via email, phone, or drop by our panel fabrication assembly workshop in Pune.
                </p>
              </div>

              {/* Info Widgets Grid */}
              <div className="grid grid-cols-1 gap-4 pt-6">
                
                {/* Card 1: Office Address */}
                <div className="flex gap-4 p-5 bg-brand-slate-light border border-slate-100 rounded-2xl">
                  <div className="bg-white p-3 rounded-xl border border-slate-50 text-brand-teal flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 mb-1">Corporate Headquarters</div>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      601-Kohinoor Bussiness Hub, Near Ranasan Toll Plaza, S P Ring Road, Naroda GIDC, Ahmedabad, Gujarat - 382330, India
                    </p>
                  </div>
                </div>

                {/* Card 2: Contact Numbers */}
                <div className="flex gap-4 p-5 bg-brand-slate-light border border-slate-100 rounded-2xl">
                  <div className="bg-white p-3 rounded-xl border border-slate-50 text-brand-teal flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 mb-1">Direct Call Centers</div>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      24 X 7 Help Line: +91 98986-00605
                    </p>
                  </div>
                </div>

                {/* Card 3: Email Inboxes */}
                <div className="flex gap-4 p-5 bg-brand-slate-light border border-slate-100 rounded-2xl">
                  <div className="bg-white p-3 rounded-xl border border-slate-50 text-brand-teal flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 mb-1">General Correspondence</div>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      {/* General: <a href="mailto:info@3ARK.com" className="text-brand-teal font-semibold hover:underline">info@3ARK.com</a> <br /> */}
                      Support: <a href="mailto:info@3ark.in" className="text-brand-teal font-semibold hover:underline">info@3ark.in</a>
                    </p>
                  </div>
                </div>

              </div>

              {/* Working Hours */}
              <div className="pt-6 border-t border-slate-100 text-xs flex items-center gap-2.5 text-slate-400 font-semibold">
                <Clock className="w-4 h-4 text-brand-teal" />
                <span>Hours: Mon - Sat: 9:00 AM - 6:00 PM (IST)</span>
              </div>

            </div>

            {/* RIGHT: Contact Form (Grid col 7) */}
            <div className="lg:col-span-7 bg-brand-slate-light p-6 sm:p-10 rounded-3xl border border-slate-100">
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-display font-extrabold text-lg text-slate-950 mb-6">
                    Request Component Quote / Consultation
                  </h3>
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-white text-slate-900 text-xs px-3.5 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.name}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full bg-white text-slate-900 text-xs px-3.5 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                        }`}
                        placeholder="john@company.com"
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full bg-white text-slate-900 text-xs px-3.5 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                        }`}
                        placeholder="9876543210"
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  {/* <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subject Matter
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full bg-white text-slate-900 text-xs px-3.5 py-3 rounded-xl border focus:outline-none focus:ring-1 transition-colors ${
                        errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                      }`}
                      placeholder="Brief subject or request summary"
                    />
                    {errors.subject && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.subject}</p>}
                  </div> */}

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Brief Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full bg-white text-slate-900 text-xs px-3.5 py-3 rounded-xl border focus:outline-none focus:border-brand-teal transition-colors resize-none ${
                        errors.message ? 'border-red-500' : 'border-slate-200'
                      }`}
                      placeholder="Specify model numbers, target quantities, and layout specifications..."
                    />
                    {errors.message && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.message}</p>}
                  </div>

                  {/* reCAPTCHA v2 Checkbox */}
                  <div>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_GOOGLE_SITE_KEY}
                      onChange={(token) => {
                        setRecaptchaToken(token);
                        if (errors.recaptcha) setErrors((prev) => ({ ...prev, recaptcha: '' }));
                      }}
                    />
                    {errors.recaptcha && <p className="text-red-500 text-[10px] mt-2 font-semibold">{errors.recaptcha}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Inquiry
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {errors.api && (
                    <p className="text-red-500 text-[10px] mt-2 text-center">{errors.api}</p>
                  )}
                </form>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <CheckCircle className="w-16 h-16 text-brand-teal mb-4 animate-bounce" />
                  <h3 className="font-display font-extrabold text-xl text-slate-900">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 max-w-sm">
                    Thank you for reaching out, {formData.name}. Our systems engineer will review your request regarding <strong className="text-slate-800">"{formData.subject || 'PLC/HMI Controls System Upgrade'}"</strong> and get back to you within 4-6 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Google Map Section */}
      

    </main>
  );
}
