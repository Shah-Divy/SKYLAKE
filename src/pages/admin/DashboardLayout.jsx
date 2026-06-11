import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  MessageSquare,
  Images,
  Briefcase,
  Building2,
  Shield,
  Award,
  Layers,
  Cpu,
  Newspaper,
  BookOpen,
  Download,
  Mail,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogoutClick = async () => {
    await logout();
    navigate('/admin/login');
  };

  // 15 Menu items
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Banner Management', path: '/admin/dashboard/banners', icon: <Image className="w-5 h-5" />, end: false },
    { name: 'Customer Reviews', path: '/admin/dashboard/reviews', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Gallery Management', path: '/admin/dashboard/gallery', icon: <Images className="w-5 h-5" /> },
    { name: 'Job Openings', path: '/admin/dashboard/jobs', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Company Profile', path: '/admin/dashboard/profile', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Policies', path: '/admin/dashboard/policies', icon: <Shield className="w-5 h-5" /> },
    { name: 'Brands', path: '/admin/dashboard/brands', icon: <Award className="w-5 h-5" /> },
    { name: 'Categories', path: '/admin/dashboard/categories', icon: <Layers className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/dashboard/products', icon: <Cpu className="w-5 h-5" /> },
    { name: 'Latest News', path: '/admin/dashboard/news', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Blogs', path: '/admin/dashboard/blogs', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Downloads', path: '/admin/dashboard/downloads', icon: <Download className="w-5 h-5" /> },
    { name: 'Inquiries', path: '/admin/dashboard/inquiries', icon: <Mail className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/dashboard/settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* 1. DESKTOP SIDEBAR NAVIGATION (Dark Slate style) */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 shrink-0 bg-slate-900 text-slate-400 border-r border-slate-800 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-brand-teal p-1.5 rounded-lg text-slate-950 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-sm tracking-tight text-white leading-none">
                  SKYLAKE
                </span>
                <span className="text-[8px] tracking-wider font-semibold text-brand-teal uppercase mt-0.5">
                  ADMIN PANEL
                </span>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed triggers selector */}
        {sidebarCollapsed && (
          <div className="h-10 flex items-center justify-center py-4 shrink-0">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Links list (takes up remaining height, scrolls internally) */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-brand-teal text-slate-950 font-bold shadow-md shadow-brand-teal/10'
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
              title={sidebarCollapsed ? item.name : ''}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer logout */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/10 transition-colors cursor-pointer ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKING AREA SCREEN */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Navbar header */}
        <header className="h-20 bg-white border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between z-30 shadow-sm shrink-0">
          
          <div className="flex items-center gap-4">
            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-slate-400 font-bold hidden sm:block">
              Welcome, <span className="text-slate-700 font-extrabold">{adminUser?.email || 'Admin'}</span> (System Admin)
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notifications panel dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl relative hover:bg-slate-50 cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-3 z-40 text-xs"
                  >
                    <div className="font-extrabold text-slate-800 pb-2 border-b border-slate-50 px-2 uppercase tracking-wider">
                      Recent Activities
                    </div>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto px-1">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-50">
                        <span className="font-bold text-slate-800">New Inquiry received</span> from Tata Motors engineering regarding PLC S7-1500 quote.
                        <span className="block text-[9px] text-slate-400 mt-1">2 mins ago</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-50">
                        <span className="font-bold text-slate-800">Resume uploaded</span> for Robotic integration role in Careers module.
                        <span className="block text-[9px] text-slate-400 mt-1">1 hour ago</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <div className="w-8.5 h-8.5 bg-slate-900 text-white rounded-full flex items-center justify-center font-display font-extrabold text-sm shrink-0 border-2 border-brand-teal/20">
                  <User className="w-4 h-4 text-brand-teal" />
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-2.5 z-40 text-xs text-slate-600"
                  >
                    <div className="p-2 border-b border-slate-100/60 mb-2">
                      <h4 className="font-bold text-slate-900">Administrator</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{adminUser?.email || 'admin@example.com'}</p>
                    </div>
                    
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2 p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors cursor-pointer font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </header>

        {/* Dashboard Main Viewport (Outlet) */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>

      </div>

      {/* 3. MOBILE MENU SIDEBAR DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            
            {/* Backdrop click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute inset-0 bg-black cursor-default"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-72 bg-slate-900 text-slate-400 h-full z-10 flex flex-col justify-between"
            >
              {/* Header (shrink-0) */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-teal p-1.5 rounded-lg text-slate-950 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="font-display font-extrabold text-sm tracking-tight text-white leading-none">
                    SKYLAKE ADMIN
                  </span>
                </div>
                
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1.5 text-slate-500 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links list (takes remaining height, scrolls internally) */}
              <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      location.pathname === item.path
                        ? 'bg-brand-teal text-slate-950 font-bold'
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Logout Footer (shrink-0) */}
              <div className="p-4 border-t border-slate-800 shrink-0">
                <button
                  onClick={() => { setMobileDrawerOpen(false); handleLogoutClick(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
