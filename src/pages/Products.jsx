import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, X, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// removed static mockData imports; products/categories/brands are loaded from API
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { getFileUrl } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active filters from URL query parameters
  const activeCategory = searchParams.get('category') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeSearch = searchParams.get('search') || '';

  // Local state for search box
  const [searchText, setSearchText] = useState(activeSearch);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Dynamic state loaded from DB
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync search input when search param changes (e.g. from global search)
  useEffect(() => {
    setSearchText(activeSearch);
  }, [activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams('search', searchText);
  };

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchText('');
  };

  // Map Product helper
  const mapProduct = (doc) => ({
    id: doc._id || doc.id,
    title: doc.productName || doc.product_name,
    model: doc.modelNumber || doc.model_number,
    brand: doc.brandId?.brandName || doc.brand?.brand_name || 'Generic',
    category: doc.categoryId?.categoryName || doc.category?.category_name || 'General',
    price: doc.price || doc.price,
    discountPrice: (doc.discountedPrice !== null && doc.discountedPrice !== undefined) ? doc.discountedPrice : (doc.discounted_price || doc.price),
    shortDescription: doc.description ? (doc.description.length > 120 ? doc.description.substring(0, 120) + '...' : doc.description) : '',
    images: (doc.images || []).map((img) => (typeof img === 'string' && img.startsWith('http') ? img : getFileUrl(img))),
    rating: 4.7
  });

  const mapBrand = (b) => ({
    id: b._id,
    name: b.brandName,
    logo: getFileUrl(b.logo),
    description: b.description || '',
    productsCount: b.productsCount || 85
  });

  // 1. Fetch categories and brands on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          categoryService.getAll(),
          brandService.getAll()
        ]);
        if (catsRes.success) setCategories(catsRes.data || []);
        if (brandsRes.success) setBrands(brandsRes.data || []);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilters();
  }, []);

  // 2. Fetch products dynamically when filters or filter options change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        
        if (activeCategory) {
          const matchedCat = categories.find(c => c.categoryName === activeCategory);
          if (matchedCat) {
            params.category_id = matchedCat._id;
          }
        }

        if (activeBrand) {
          const matchedBrand = brands.find(b => b.brandName.toLowerCase() === activeBrand.toLowerCase());
          if (matchedBrand) {
            params.brand_id = matchedBrand._id;
          }
        }

        if (activeSearch) {
          params.search = activeSearch;
        }

        const response = await productService.getAll(params);
        if (response.success && response.data) {
          setProducts((response.data || []).map(mapProduct));
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 || brands.length > 0 || (!activeCategory && !activeBrand)) {
      fetchFilteredProducts();
    }
  }, [activeCategory, activeBrand, activeSearch, categories, brands]);

  const finalProducts = products;
  const activeCategoriesList = categories.length > 0 ? categories.map((c) => c.categoryName) : [];
  const activeBrandsList = brands.length > 0 ? brands.map(mapBrand) : [];

  return (
    <main className="w-full pt-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Industrial Systems Catalog
          </h1>
          <p className="text-xs text-slate-400">
            Search and configure genuine PLCs, motion drives, collaborative cobots, and process sensors.
          </p>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* 1. Sidebar Filters (Desktop only) */}
            <aside className="hidden lg:block w-72 shrink-0 space-y-8 bg-brand-slate-light p-6 rounded-2xl border border-slate-100">
              
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <h3 className="font-display font-extrabold text-sm text-slate-950 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-brand-teal" />
                  Filter Catalog
                </h3>
                {(activeCategory || activeBrand || activeSearch) && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-extrabold text-brand-orange hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Product Category
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => updateParams('category', '')}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                      !activeCategory ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    All Categories
                  </button>
                  {activeCategoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParams('category', cat)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        activeCategory === cat ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter checkboxes */}
              <div className="space-y-3 pt-4 border-t border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Manufacturer Brand
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => updateParams('brand', '')}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      !activeBrand ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    All Brands
                  </button>
                  {activeBrandsList.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateParams('brand', b.name)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        activeBrand.toLowerCase() === b.name.toLowerCase() ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

            </aside>

            {/* 2. Main Catalogue Content */}
            <div className="flex-grow w-full space-y-6">
              
              {/* Search form and mobile filter buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                
                {/* Search field */}
                <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search model number, tags..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-teal transition-all"
                  />
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  {searchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchText('');
                        updateParams('search', '');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Info & Mobile Filter Trigger */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Showing {finalProducts.length} Results
                  </span>
                  
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Active filters display tags */}
              {(activeCategory || activeBrand || activeSearch) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
                    Active Filters:
                  </span>
                  {activeSearch && (
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Query: "{activeSearch}"
                      <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => updateParams('search', '')} />
                    </span>
                  )}
                  {activeCategory && (
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Category: {activeCategory}
                      <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => updateParams('category', '')} />
                    </span>
                  )}
                  {activeBrand && (
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Brand: {activeBrand}
                      <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-600" onClick={() => updateParams('brand', '')} />
                    </span>
                  )}
                </div>
              )}

              {/* Products Cards Grid */}
              {finalProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {finalProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-brand-slate-light border border-dashed border-slate-200 rounded-3xl p-8 max-w-md mx-auto flex flex-col items-center justify-center">
                  <Cpu className="w-12 h-12 text-slate-300 mb-4 animate-pulse" />
                  <h3 className="font-display font-extrabold text-slate-900 text-base">
                    No Matching Automation Parts
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    We couldn't find items matching your filter options. Try removing query parameters or refining keywords.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 3. Mobile Filters Slide-over (AnimatePresence) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            
            {/* Backdrop click indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black cursor-default"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 bg-white h-full z-10 p-6 flex flex-col justify-between shadow-2xl border-l border-slate-100 overflow-y-auto"
            >
              <div className="space-y-8">
                {/* Header title */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-display font-extrabold text-sm text-slate-900">
                    Filter Catalogue
                  </h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Category Range
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => { updateParams('category', ''); setMobileFiltersOpen(false); }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${!activeCategory ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'}`}
                    >
                      All Categories
                    </button>
                    {activeCategoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { updateParams('category', cat); setMobileFiltersOpen(false); }}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${activeCategory === cat ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Partner Brands
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => { updateParams('brand', ''); setMobileFiltersOpen(false); }}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${!activeBrand ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'}`}
                    >
                      All Brands
                    </button>
                    {activeBrandsList.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => { updateParams('brand', b.name); setMobileFiltersOpen(false); }}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${activeBrand.toLowerCase() === b.name.toLowerCase() ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'}`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom reset actions */}
              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => { clearFilters(); setMobileFiltersOpen(false); }}
                  className="flex-grow py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 text-center cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-grow py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
