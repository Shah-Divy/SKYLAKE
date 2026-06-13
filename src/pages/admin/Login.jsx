import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Cpu, Eye, EyeOff, Lock, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Define Zod Validation Schema matching guidelines
const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Setup form hooks with zod validation resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setIsSubmitLoading(true);

    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMsg(result.message || 'Invalid administrative credentials. Please verify email and password.');
      }
    } catch (err) {
      setErrorMsg('An unexpected authentication error occurred.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans">
      
      {/* LEFT PANEL: Branding & Visuals (5 columns on desktop) */}
      <section className="hidden lg:flex lg:col-span-5 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800')]" />
        
        {/* Top brand */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="bg-brand-teal p-2 rounded-xl text-slate-950 flex items-center justify-center shadow-lg shadow-brand-teal/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-tight leading-none text-white">
              SKYLAKE
            </span>
            <span className="text-[9px] tracking-widest font-semibold text-brand-teal uppercase mt-0.5">
              AUTOMATION SYSTEM
            </span>
          </div>
        </div>

        {/* Center intro */}
        <div className="space-y-6 z-10 max-w-sm">
          <span className="inline-block text-[9px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Operations Center
          </span>
          <h1 className="font-display font-extrabold text-3xl tracking-tight leading-tight text-glow-teal">
            Industrial Systems Administrative Portal
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manage your hardware inventory catalog, publish engineering resources, review customer inquiry tickets, and configure smart-factory portal listings.
          </p>
        </div>

        {/* Bottom copyright/indicators */}
        <div className="z-10 text-[10px] text-slate-500 font-semibold flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-brand-teal" />
          <span>AES-256 Encrypted Operations Console. Version 2.4.0</span>
        </div>
      </section>

      {/* RIGHT PANEL: Login Form (7 columns on desktop) */}
      <section className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white border border-slate-100/80 p-8 sm:p-10 rounded-3xl shadow-xl space-y-6"
        >
          
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Administrative Login
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Enter credentials below to enter dashboard
            </p>
          </div>

          {/* Error Message banner */}
          {errorMsg && (
            <div className="flex gap-2.5 bg-red-50 border border-red-100 p-4 rounded-2xl text-xs text-red-600 font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full bg-slate-50 text-slate-950 text-xs px-10 py-3 rounded-xl border focus:outline-none focus:bg-white focus:ring-1 transition-colors ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                  }`}
                  placeholder="admin@example.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full bg-slate-50 text-slate-950 text-xs px-10 py-3 rounded-xl border focus:outline-none focus:bg-white focus:ring-1 transition-colors ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-brand-teal'
                  }`}
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-semibold mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded text-brand-teal border-slate-300 focus:ring-brand-teal focus:ring-offset-0"
                />
                Remember this device
              </label>
              
              <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Demo: admin123
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isSubmitLoading ? (
                <span className="border-2 border-white border-t-transparent w-4.5 h-4.5 rounded-full animate-spin" />
              ) : (
                'Authenticate Admin'
              )}
            </button>

          </form>

        </motion.div>
      </section>

    </main>
  );
}
