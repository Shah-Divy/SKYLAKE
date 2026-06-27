import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Cpu, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryService } from '../services/categoryService';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res && res.success && Array.isArray(res.data)) {
          setCategoriesList(res.data.map((c) => c.categoryName || c.category_name));
        }
      } catch (err) {
        console.error('Error loading categories for navbar:', err);
      }
    };
    loadCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Partners', path: '/partners' },
    { name: 'Products', path: '/products', hasDropdown: true },
    { name: 'Blog', path: '/blog' },
    { name: 'News', path: '/news' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/90 border-b border-slate-800 shadow-lg backdrop-blur-md'
          : 'bg-slate-900 border-b border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-3">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Section */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-1 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src={encodeURI('/3ARK logo.png')}
                alt="3ARK"
                className="h-25 sm:h-25 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm sm:text-base xl:text-lg tracking-tight leading-none text-white whitespace-nowrap">
                3ARK PRIVATE LIMITED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setShowProductsDropdown(true)}
                onMouseLeave={() => link.hasDropdown && setShowProductsDropdown(false)}
              >
                {link.hasDropdown ? (
                  <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-0.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors duration-200 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800/50"
                  >
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showProductsDropdown ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors duration-200 ${
                        isActive
                          ? 'text-brand-teal bg-brand-teal/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                )}

                {/* Mega Dropdown for Products */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {showProductsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-0 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-3"
                      >
                        <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-3 py-1">
                          Product Range
                        </div>
                        <div className="mt-2 space-y-1">
                          {categoriesList.map((cat) => (
                            <Link
                              key={cat}
                              to={`/products?category=${encodeURIComponent(cat)}`}
                              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-brand-teal hover:bg-slate-800 transition-colors group"
                            >
                              {cat}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-slate-800/60 mt-3 pt-3 px-3">
                          <Link
                            to="/products"
                            className="flex items-center justify-center text-xs font-bold text-slate-950 bg-brand-teal hover:bg-brand-teal-dark py-2 px-4 rounded-lg w-full text-center transition-colors"
                          >
                            All Products Catalog
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Tools (Search + Call-to-action) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Bar Toggle */}
            <div className="relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearchSubmit}
                    className="absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <input
                      type="text"
                      placeholder="Search parts, model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 text-white placeholder-slate-500 text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-teal"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              {/* <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Search className="w-5 h-5" />
              </button> */}
            </div>

            {/* Quick Contact Button */}
            <Link
              to="/contact"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-brand-orange/20 transition-all hover:scale-102 flex items-center gap-1.5"
            >
              Get Solution Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburguer & Search Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {/* Mobile Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search parts, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-teal"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <div className="flex flex-col gap-1.5 mt-4">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setShowProductsDropdown(!showProductsDropdown)}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                          {link.name}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showProductsDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {showProductsDropdown && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-6 mt-1 space-y-1 border-l-2 border-slate-800"
                            >
                              {categoriesList.map((cat) => (
                                <Link
                                  key={cat}
                                  to={`/products?category=${encodeURIComponent(cat)}`}
                                  onClick={() => setIsOpen(false)}
                                  className="block py-2 text-xs font-semibold text-slate-400 hover:text-brand-teal"
                                >
                                  {cat}
                                </Link>
                              ))}
                              <Link
                                to="/products"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-xs font-bold text-brand-teal"
                              >
                                View All Catalog →
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Call-to-action in Mobile Menu */}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white text-center py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  Get Solution Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
