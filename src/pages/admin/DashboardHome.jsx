import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Award,
  Layers,
  BookOpen,
  Newspaper,
  Download,
  Mail,
  Briefcase,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';

export default function DashboardHome() {
  const [data, setData] = useState({
    products: 0,
    brands: 0,
    categories: 0,
    blogs: 0,
    news: 0,
    downloads: 0,
    inquiries: 0,
    jobOpenings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  // 8 Stats cards data matching prompt requirements
  const stats = [
    { label: 'Total Products', value: data.products, icon: <Cpu className="w-5 h-5 text-indigo-500" />, color: 'indigo' },
    { label: 'Total Brands', value: data.brands, icon: <Award className="w-5 h-5 text-amber-500" />, color: 'amber' },
    { label: 'Total Categories', value: data.categories, icon: <Layers className="w-5 h-5 text-emerald-500" />, color: 'emerald' },
    { label: 'Total Blogs', value: data.blogs, icon: <BookOpen className="w-5 h-5 text-pink-500" />, color: 'pink' },
    { label: 'Total News', value: data.news, icon: <Newspaper className="w-5 h-5 text-blue-500" />, color: 'blue' },
    { label: 'Total Downloads', value: data.downloads, icon: <Download className="w-5 h-5 text-teal-500" />, color: 'teal' },
    { label: 'Total Inquiries', value: data.inquiries, icon: <Mail className="w-5 h-5 text-rose-500" />, color: 'rose' },
    { label: 'Total Job Openings', value: data.jobOpenings, icon: <Briefcase className="w-5 h-5 text-orange-500" />, color: 'orange' }
  ];

  const recentActivities = [
    { id: 1, user: 'Amit Patel', action: 'submitted new switchgear inquiry', detail: 'Siemens 3RT2 Contactor quote', time: '10 mins ago', type: 'inquiry' },
    { id: 2, user: 'Sarah Jenkins', action: 'applied for Robotics Specialist position', detail: 'CV attached: Sarah_Specialist.pdf', time: '1 hour ago', type: 'job' },
    { id: 3, user: 'Admin Console', action: 'updated SIMATIC S7-1500 details', detail: 'Modified Work Memory parameters', time: '3 hours ago', type: 'edit' },
    { id: 4, user: 'Cargill Foods Lead', action: 'requested PDF commissioning software', detail: 'VFD mapping tool', time: '1 day ago', type: 'download' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Console Dashboard
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Systems Overview & Operations
          </h1>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard/products"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-brand-teal" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Grid of 8 Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((item, idx) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -3 }}
            className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {item.label}
              </span>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                {item.icon}
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              {loading ? (
                <div className="h-6 w-16 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none">
                    {item.value}
                  </span>
                  <span className="text-[9px] text-brand-teal font-extrabold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +12%
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholders & Recent Activities layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Custom High-Fidelity SVG Line Chart (Col 8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-sm text-slate-900">
              Monthly Technical Inquiries
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              Last 6 Months
            </span>
          </div>

          {/* Premium Glowing SVG Chart */}
          <div className="relative h-60 w-full bg-slate-50 border border-slate-100/60 rounded-xl overflow-hidden p-4">
            <svg viewBox="0 0 600 200" className="w-full h-full">
              {/* Background grid lines */}
              <line x1="50" y1="20" x2="550" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="70" x2="550" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="120" x2="550" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="50" y1="170" x2="550" y2="170" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area under the line */}
              <path
                d="M 50 170 L 50 150 L 150 110 L 250 140 L 350 70 L 450 90 L 550 40 L 550 170 Z"
                fill="url(#chartGrad)"
                opacity="0.1"
              />

              {/* SVG Gradient definition */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* The glowing line */}
              <path
                d="M 50 150 L 150 110 L 250 140 L 350 70 L 450 90 L 550 40"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_4px_rgba(14,165,233,0.3)]"
              />

              {/* Node points */}
              <circle cx="50" cy="150" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
              <circle cx="150" cy="110" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
              <circle cx="250" cy="140" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
              <circle cx="350" cy="70" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
              <circle cx="450" cy="90" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />
              <circle cx="550" cy="40" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="2" />

              {/* Axis text */}
              <text x="50" y="190" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Dec</text>
              <text x="150" y="190" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Jan</text>
              <text x="250" y="190" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Feb</text>
              <text x="350" y="190" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Mar</text>
              <text x="450" y="190" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Apr</text>
              <text x="550" y="190" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">May</text>
            </svg>
          </div>
        </div>

        {/* Recent Activities (Col 4) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-brand-teal" />
              System Events
            </h3>
            <span className="text-[9px] text-brand-teal font-extrabold">LIVE</span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-brand-teal shrink-0 mt-1.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-slate-800">{act.user}</span>{' '}
                  <span className="text-slate-500">{act.action}</span>
                  <span className="block font-mono text-[9px] text-slate-400 mt-0.5">{act.detail}</span>
                  <span className="block text-[8px] text-slate-400 mt-1 font-semibold uppercase">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-extrabold text-sm text-slate-900">
          Module Configuration Controls
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/dashboard/banners"
            className="p-5 bg-white border border-slate-200/50 rounded-2xl shadow-sm hover:border-slate-300 transition-colors flex items-center justify-between group"
          >
            <div className="text-xs">
              <div className="font-bold text-slate-900">Configure Banners</div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Banners and CTA links</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/dashboard/products"
            className="p-5 bg-white border border-slate-200/50 rounded-2xl shadow-sm hover:border-slate-300 transition-colors flex items-center justify-between group"
          >
            <div className="text-xs">
              <div className="font-bold text-slate-900">Catalogue Management</div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">145 catalog components</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/dashboard/inquiries"
            className="p-5 bg-white border border-slate-200/50 rounded-2xl shadow-sm hover:border-slate-300 transition-colors flex items-center justify-between group"
          >
            <div className="text-xs">
              <div className="font-bold text-slate-900">Inquiry Leads</div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Customer sales requests</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/dashboard/settings"
            className="p-5 bg-white border border-slate-200/50 rounded-2xl shadow-sm hover:border-slate-300 transition-colors flex items-center justify-between group"
          >
            <div className="text-xs">
              <div className="font-bold text-slate-900">Admin Settings</div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Portal preferences</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

    </div>
  );
}
