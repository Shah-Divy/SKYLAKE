import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Cpu, Eye, CheckCircle, FileText, Video, Award, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts, mockCategories, mockBrands } from '../../data/mockData';

export default function ProductManager() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  
  // Modal & Drawer toggles
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [formName, setFormName] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formHSN, setFormHSN] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDiscPrice, setFormDiscPrice] = useState('');
  const [formBrand, setFormBrand] = useState('Siemens');
  const [formCat, setFormCat] = useState('PLCs & Controllers');
  const [formDesc, setFormDesc] = useState('');
  const [formVideo, setFormVideo] = useState('');
  const [formImage, setFormImage] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.model.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter ? p.category === catFilter : true;
    const matchesBrand = brandFilter ? p.brand === brandFilter : true;
    return matchesSearch && matchesCat && matchesBrand;
  });

  const handleOpenAdd = () => {
    setCurrentProduct(null);
    setFormName('');
    setFormModel('');
    setFormHSN('85371010');
    setFormPrice('1500');
    setFormDiscPrice('1350');
    setFormBrand('Siemens');
    setFormCat('PLCs & Controllers');
    setFormDesc('');
    setFormVideo('https://www.youtube.com/embed/dQw4w9WgXcQ');
    setFormImage('https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600');
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setCurrentProduct(p);
    setFormName(p.title);
    setFormModel(p.model);
    setFormHSN(p.hsnCode || '85371010');
    setFormPrice(p.price.toString());
    setFormDiscPrice(p.discountPrice.toString());
    setFormBrand(p.brand);
    setFormCat(p.category);
    setFormDesc(p.description);
    setFormVideo(p.videoEmbed || '');
    setFormImage(p.images[0] || '');
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formModel.trim()) return;

    const savedProduct = {
      id: currentProduct ? currentProduct.id : Date.now(),
      title: formName,
      model: formModel,
      hsnCode: formHSN,
      price: parseFloat(formPrice) || 0,
      discountPrice: parseFloat(formDiscPrice) || 0,
      brand: formBrand,
      category: formCat,
      description: formDesc,
      shortDescription: formDesc.substring(0, 100) + '...',
      images: [formImage],
      videoEmbed: formVideo,
      rating: currentProduct ? currentProduct.rating : 4.5,
      specs: currentProduct ? currentProduct.specs : { 'IP Rating': 'IP20', 'Power Input': '24V DC' }
    };

    if (currentProduct) {
      setProducts(products.map((p) => p.id === currentProduct.id ? savedProduct : p));
    } else {
      setProducts([savedProduct, ...products]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product catalog entry?')) {
      setProducts(products.filter((p) => p.id !== id));
      if (currentProduct?.id === id) setDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-6 text-xs relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Hardware Catalog
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Product Catalog Inventory
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-teal" />
          Add New Product
        </button>
      </div>

      {/* Table filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
        
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            placeholder="Search by product name or model code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-950 px-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category */}
        <div className="sm:col-span-3">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
          >
            <option value="">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="sm:col-span-3">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
          >
            <option value="">All Brands</option>
            {mockBrands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table grid */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Component name</th>
              <th className="px-6 py-4">Model number</th>
              <th className="px-6 py-4">Manufacturer</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.title} className="w-9 h-9 rounded-lg object-cover border" />
                    <span className="font-bold text-slate-900">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono font-semibold text-slate-600">{p.model}</td>
                <td className="px-6 py-4 font-semibold text-slate-700">{p.brand}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{p.category}</td>
                <td className="px-6 py-4 font-extrabold text-slate-900">${p.discountPrice}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setCurrentProduct(p); setDrawerOpen(true); }}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                      title="Quick Inspect"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg border border-red-100 cursor-pointer"
                      title="Delete Product"
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
              className="relative bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
                </h3>
              </div>

              {/* Tabs header */}
              <div className="flex border-b border-slate-200">
                {['general', 'specs', 'media'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-bold capitalize cursor-pointer border-b-2 ${
                      activeTab === tab ? 'border-brand-teal text-slate-950' : 'border-transparent text-slate-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Component Label</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                      />
                    </div>

                    {/* Model & HSN */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Model Code</label>
                        <input
                          type="text"
                          required
                          value={formModel}
                          onChange={(e) => setFormModel(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">HSN Code</label>
                        <input
                          type="text"
                          required
                          value={formHSN}
                          onChange={(e) => setFormHSN(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Brand & Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Brand</label>
                        <select
                          value={formBrand}
                          onChange={(e) => setFormBrand(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        >
                          {mockBrands.map((b) => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Category</label>
                        <select
                          value={formCat}
                          onChange={(e) => setFormCat(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        >
                          {mockCategories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Retail Price ($)</label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Contract Price ($)</label>
                        <input
                          type="number"
                          required
                          value={formDiscPrice}
                          onChange={(e) => setFormDiscPrice(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Detailed Description</label>
                      <textarea
                        rows={6}
                        required
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none"
                        placeholder="Detailed engineering capabilities..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-4">
                    {/* Image URL Upload mock */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Primary Component Image Link</label>
                      <input
                        type="text"
                        required
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                      />
                    </div>

                    {/* Video URL */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Application Video Embed URL</label>
                      <input
                        type="text"
                        value={formVideo}
                        onChange={(e) => setFormVideo(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer"
                >
                  Save Product Settings
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Inspector Slide-out Drawer */}
      <AnimatePresence>
        {drawerOpen && currentProduct && (
          <div className="fixed inset-0 z-40 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black cursor-default"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-96 bg-white h-full z-10 p-6 flex flex-col justify-between shadow-2xl border-l border-slate-100 overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-display font-extrabold text-sm text-slate-900">
                    Component Specifications Drawer
                  </h3>
                  <button onClick={() => setDrawerOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Picture */}
                <div className="relative pt-[60%] bg-slate-50 rounded-xl overflow-hidden border">
                  <img src={currentProduct.images[0]} alt={currentProduct.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>

                {/* Brand Category metadata */}
                <div className="flex gap-2">
                  <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {currentProduct.brand}
                  </span>
                  <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {currentProduct.category}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="font-display font-extrabold text-slate-900 text-sm leading-snug">{currentProduct.title}</h2>
                  <p className="font-mono text-slate-400 font-bold tracking-wider mt-1">Model: {currentProduct.model}</p>
                </div>

                {/* Pricing & HSN details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">Contract pricing</span>
                    <span className="font-extrabold text-slate-900 text-sm">${currentProduct.discountPrice}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">HSN identifier</span>
                    <span className="font-mono text-slate-700 font-semibold">{currentProduct.hsnCode}</span>
                  </div>
                </div>

                {/* Specs table details */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Technical parameters</h4>
                  <div className="border border-slate-100 rounded-xl overflow-hidden text-[10px]">
                    <table className="w-full text-left">
                      <tbody>
                        {Object.entries(currentProduct.specs || {}).map(([k, v]) => (
                          <tr key={k} className="border-b border-slate-100 bg-white">
                            <td className="px-3.5 py-2 font-bold text-slate-400 w-28">{k}</td>
                            <td className="px-3.5 py-2 font-mono text-slate-600 font-medium">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-slate-100 flex gap-4 mt-8">
                <button
                  onClick={() => { setDrawerOpen(false); handleOpenEdit(currentProduct); }}
                  className="flex-grow py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 text-center cursor-pointer"
                >
                  Edit Specifications
                </button>
                <button
                  onClick={() => handleDelete(currentProduct.id)}
                  className="flex-grow py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center cursor-pointer"
                >
                  Delete Item
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
