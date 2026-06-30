import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search, Cpu, Eye, CheckCircle, FileText, Video, Award, Layers, AlertCircle, RefreshCw, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import { brandService } from '../../services/brandService';
import { categoryService } from '../../services/categoryService';
import ConfirmModal from '../../components/ConfirmModal';
import { getFileUrl } from '../../services/api';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Modal & Drawer toggles
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formHSN, setFormHSN] = useState('85371010');
  const [formPrice, setFormPrice] = useState('');
  const [formDiscPrice, setFormDiscPrice] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formVideo, setFormVideo] = useState('');
  const [formImages, setFormImages] = useState([]); // Multiple files
  const [formPdfFile, setFormPdfFile] = useState(null);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreviewName, setPdfPreviewName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchRelationalData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        categoryService.getAll({ limit: 100 }),
        brandService.getAll({ limit: 100 }),
      ]);
      if (catRes.success) setCategories(catRes.data || []);
      if (brandRes.success) setBrands(brandRes.data || []);
    } catch (err) {
      console.error('Error fetching categories/brands:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getAllAdmin({
        page,
        limit,
        search,
        categoryId: catFilter,
        brandId: brandFilter,
      });
      if (response.success) {
        setProducts(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
          setTotalProducts(response.pagination.total || 0);
        }
      } else {
        setError('Failed to fetch products.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationalData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, catFilter, brandFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenAdd = () => {
    setCurrentProduct(null);
    setFormName('');
    setFormModel('');
    setFormHSN('85371010');
    setFormPrice('');
    setFormDiscPrice('');
    // Default to first brand/category if available
    setFormBrand(brands[0]?._id || '');
    setFormCat(categories[0]?._id || '');
    setFormDesc('');
    setFormVideo('');
    setFormImages([]);
    setFormPdfFile(null);
    setImagePreviews([]);
    setPdfPreviewName('');
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setCurrentProduct(p);
    setFormName(p.productName);
    setFormModel(p.modelNumber);
    setFormHSN(p.hsnCode || '85371010');
    setFormPrice(String(p.price || ''));
    setFormDiscPrice(p.discountedPrice ? String(p.discountedPrice) : '');
    setFormBrand(p.brandId?._id || p.brandId || '');
    setFormCat(p.categoryId?._id || p.categoryId || '');
    setFormDesc(p.description || '');
    setFormVideo(p.videoLink || '');
    setFormImages([]);
    setFormPdfFile(null);
    setImagePreviews(p.images || []);
    setPdfPreviewName(p.pdfFile ? 'Existing PDF manual brochure' : '');
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormPdfFile(file);
      setPdfPreviewName(file.name);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formModel.trim() || !formBrand || !formCat) {
      alert('Please fill out all required fields.');
      return;
    }
    if (!currentProduct && formImages.length === 0) {
      alert('At least one primary product image file is required.');
      return;
    }

    setSubmitLoading(true);
    try {
      let response;
      if (currentProduct) {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('product_name', formName);
        formData.append('model_number', formModel);
        formData.append('hsn_code', formHSN);
        formData.append('description', formDesc);
        formData.append('price', formPrice);
        if (formDiscPrice) {
          formData.append('discounted_price', formDiscPrice);
        }
        formData.append('brand_id', formBrand);
        formData.append('category_id', formCat);
        formData.append('status', currentProduct.status === 'active' ? 1 : 0);

        // Re-attach existing images as File objects so backend file validation passes
        const existingImages = currentProduct.images || [];
        for (let i = 0; i < existingImages.length; i++) {
          try {
            const imageUrl = getFileUrl(existingImages[i]);
            const imgResponse = await fetch(imageUrl);
            const blob = await imgResponse.blob();
            const ext = existingImages[i].split('.').pop() || 'jpg';
            const file = new File([blob], `image_${i}.${ext}`, { type: blob.type || 'image/jpeg' });
            formData.append('images[]', file);
          } catch (imgErr) {
            console.warn('Could not fetch existing image:', existingImages[i], imgErr);
          }
        }

        // Re-attach existing PDF file if present
        const existingPdf = currentProduct.pdfFile || currentProduct.pdf_file;
        if (existingPdf) {
          try {
            const pdfUrl = getFileUrl(existingPdf);
            const pdfResponse = await fetch(pdfUrl);
            const pdfBlob = await pdfResponse.blob();
            const pdfFile = new File([pdfBlob], 'brochure.pdf', { type: 'application/pdf' });
            formData.append('pdfFile', pdfFile);
          } catch (pdfErr) {
            console.warn('Could not fetch existing PDF:', existingPdf, pdfErr);
          }
        }

        // Preserve video link
        const existingVideo = currentProduct.videoLink || currentProduct.video_link || '';
        if (existingVideo) {
          formData.append('video_link', existingVideo);
        }

        response = await productService.update(currentProduct._id, formData);
      } else {
        const formData = new FormData();
        formData.append('product_name', formName);
        formData.append('model_number', formModel);
        formData.append('hsn_code', formHSN);
        formData.append('price', formPrice);
        if (formDiscPrice) {
          formData.append('discounted_price', formDiscPrice);
        }
        formData.append('brand_id', formBrand);
        formData.append('category_id', formCat);
        formData.append('description', formDesc);
        formData.append('video_link', formVideo);
        formData.append('status', '1');

        if (formImages.length > 0) {
          formImages.forEach((img) => {
            formData.append('images[]', img);
          });
        }

        if (formPdfFile) {
          formData.append('pdf_file', formPdfFile);
        }

        response = await productService.create(formData);
      }

      if (response.success) {
        fetchProducts();
        setModalOpen(false);
      } else {
        alert(response.message || 'Failed to save product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving product catalog settings.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await productService.delete(deleteId);
      if (response.success) {
        setProducts(products.filter((p) => p._id !== deleteId));
        setConfirmOpen(false);
        setDrawerOpen(false);
      } else {
        alert(response.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const response = await productService.toggleStatus(product);
      if (response.success) {
        setProducts(
          products.map((p) =>
            p._id === product._id ? { ...p, status: p.status === 'active' ? 1 : 0 } : p
          )
        );
      }
    } catch (err) {
      console.error(err);
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
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">

        {/* Search */}
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            placeholder="Search by product name or model code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-950 px-9 py-2.5 rounded-xl focus:outline-none focus:bg-white text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category */}
        <div className="sm:col-span-3">
          <select
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="sm:col-span-3">
          <select
            value={brandFilter}
            onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>{b.brandName}</option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold p-2.5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-800"
          >
            Go
          </button>
        </div>

      </form>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold w-full">
          <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
          Loading hardware inventory catalog...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center text-slate-400 font-semibold text-xs">
          No product listings found. Click "Add New Product" to record inventory items.
        </div>
      ) : (
        /* Table grid */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Component name</th>
                  <th className="px-6 py-4">Model number</th>
                  <th className="px-6 py-4">Manufacturer</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getFileUrl(p.images[0])} alt={p.productName} className="w-9 h-9 rounded-lg object-cover border" />
                        <span className="font-bold text-slate-900">{p.productName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">{p.modelNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{p.brandId?.brandName || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{p.categoryId?.categoryName || 'N/A'}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {p.discountedPrice ? (
                        <>
                          <span className="line-through text-slate-400 mr-1.5">${p.price}</span>
                          <span className="text-emerald-600 font-extrabold">${p.discountedPrice}</span>
                        </>
                      ) : (
                        `$${p.price}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[8px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${p.status
                            ? 'text-brand-teal bg-brand-teal/10 hover:bg-brand-teal/20'
                            : 'text-slate-500 bg-slate-100 hover:bg-slate-200'
                          }`}
                      >
                        {p.status ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setCurrentProduct(p); setDrawerOpen(true); }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                          title="Quick Inspect"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {/* <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button> */}
                        <button
                          onClick={() => handleDeleteClick(p._id)}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/50 shadow-sm text-slate-500 font-bold">
              <div>
                Showing {products.length} of {totalProducts} Products
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

      {/* Editor Modal Overlay */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0 cursor-default" onClick={() => !submitLoading && setModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {!submitLoading && (
                <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {currentProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
                </h3>
              </div>

              {/* Tabs header */}
              <div className="flex border-b border-slate-200">
                {['general', 'specs', currentProduct ? null : 'media'].filter(Boolean).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-bold capitalize cursor-pointer border-b-2 text-xs ${activeTab === tab ? 'border-brand-teal text-slate-950' : 'border-transparent text-slate-400'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">

                {activeTab === 'general' && (
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Component Label / Product Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
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
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">HSN Code</label>
                        <input
                          type="text"
                          required
                          value={formHSN}
                          onChange={(e) => setFormHSN(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
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
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                        >
                          <option value="">Select Brand</option>
                          {brands.map((b) => (
                            <option key={b._id} value={b._id}>{b.brandName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Category</label>
                        <select
                          value={formCat}
                          onChange={(e) => setFormCat(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-xs"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.categoryName}</option>
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
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Discounted Contract Price ($ - Optional)</label>
                        <input
                          type="number"
                          value={formDiscPrice}
                          onChange={(e) => setFormDiscPrice(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
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
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white resize-none text-xs"
                        placeholder="Detailed engineering capabilities, power ratings, configuration specifications, etc..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-4">
                    {/* Image files upload */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                        {currentProduct ? 'Replace Product Images (Optional)' : 'Upload Product Images (Required)'}
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                      />
                    </div>

                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {imagePreviews.map((url, i) => (
                          <img key={i} src={getFileUrl(url)} className="w-16 h-16 object-cover border rounded-xl" alt="Preview" />
                        ))}
                      </div>
                    )}

                    {/* PDF Brochure Upload */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">
                        Upload Technical Brochure / PDF (Optional)
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                      />
                      {pdfPreviewName && (
                        <div className="mt-1 text-[10px] font-bold text-brand-teal flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {pdfPreviewName}
                        </div>
                      )}
                    </div>

                    {/* Video URL */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Application Video Link URL (Optional)</label>
                      <input
                        type="text"
                        value={formVideo}
                        onChange={(e) => setFormVideo(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white text-xs"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl mt-4 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75 text-xs"
                >
                  {submitLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Product Details...
                    </>
                  ) : (
                    'Save Product Settings'
                  )}
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
              className="relative w-96 bg-white h-full z-10 p-6 flex flex-col justify-between shadow-2xl border-l border-slate-100 overflow-y-auto text-xs"
            >
              <div className="space-y-6">

                {/* Header title */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-display font-extrabold text-sm text-slate-900">
                    Component Specifications Drawer
                  </h3>
                  <button onClick={() => setDrawerOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Picture */}
                <div className="relative pt-[60%] bg-slate-50 rounded-xl overflow-hidden border">
                  <img src={getFileUrl(currentProduct.images[0])} alt={currentProduct.productName} className="absolute inset-0 w-full h-full object-cover" />
                </div>

                {/* Brand Category metadata */}
                <div className="flex gap-2">
                  <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded flex items-center gap-1 text-[10px]">
                    <Award className="w-3.5 h-3.5 text-brand-teal" />
                    {currentProduct.brandId?.brandName || 'Manufacturer'}
                  </span>
                  <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded flex items-center gap-1 text-[10px]">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    {currentProduct.categoryId?.categoryName || 'Category'}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="font-display font-extrabold text-slate-900 text-sm leading-snug">{currentProduct.productName}</h2>
                  <p className="font-mono text-slate-400 font-bold tracking-wider mt-1">Model: {currentProduct.modelNumber}</p>
                </div>

                {/* Pricing & HSN details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">Contract pricing</span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      ${currentProduct.discountedPrice || currentProduct.price}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">HSN identifier</span>
                    <span className="font-mono text-slate-700 font-semibold">{currentProduct.hsnCode || 'N/A'}</span>
                  </div>
                </div>

                {/* Video brochure attachments */}
                {(currentProduct.pdfFile || currentProduct.videoLink) && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Technical Media</h4>
                    <div className="flex gap-2">
                      {currentProduct.pdfFile && (
                        <a
                          href={getFileUrl(currentProduct.pdfFile)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-100"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-500" />
                          Brochure PDF
                        </a>
                      )}
                      {currentProduct.videoLink && (
                        <a
                          href={currentProduct.videoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-100"
                        >
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                          Watch Video
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Description details */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Detailed Description</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-h-40 overflow-y-auto">
                    {currentProduct.description}
                  </p>
                </div>

              </div>

              {/* Drawer footer actions */}
              <div className="pt-6 border-t border-slate-100 flex gap-4 mt-8">
                {/* <button
                  onClick={() => { setDrawerOpen(false); handleOpenEdit(currentProduct); }}
                  className="flex-grow py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 text-center cursor-pointer"
                >
                  Edit Specifications
                </button> */}
                <button
                  onClick={() => handleDeleteClick(currentProduct._id)}
                  className="flex-grow py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center cursor-pointer"
                >
                  Delete Item
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
        title="Delete Product Entry"
        message="Are you sure you want to permanently delete this product catalog entry? It will be removed from the public catalogue."
      />

    </div>
  );
}
