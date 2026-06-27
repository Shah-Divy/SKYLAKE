import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Share2,
  ChevronLeft,
  Star,
  CheckCircle,
  Play,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  PhoneCall,
  Info
} from 'lucide-react';
// removed mockProducts fallback — use API only
import { productService } from '../services/productService';
import { getFileUrl } from '../services/api';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProductsList, setRelatedProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);

  const mapProduct = (doc) => ({
    id: doc._id || doc.id,
    title: doc.productName || doc.product_name,
    model: doc.modelNumber || doc.model_number,
    hsnCode: doc.hsnCode || doc.hsn_code || '',
    brand: doc.brand?.brand_name || doc.brandId?.brandName || 'Generic',
    category: doc.category?.category_name || doc.categoryId?.categoryName || 'General',
    price: (doc.price !== undefined && doc.price !== null) ? parseFloat(doc.price) : undefined,
    discountPrice: (doc.discountedPrice !== undefined && doc.discountedPrice !== null) ? doc.discountedPrice : (doc.discounted_price || doc.price),
    shortDescription: doc.description ? (doc.description.substring(0, 150) + '...') : '',
    description: doc.description,
    images: (doc.images || []).map((img) => (typeof img === 'string' && img.startsWith('http') ? img : getFileUrl(img))),
    videoEmbed: doc.videoLink || doc.video_link || '',
    brochureUrl: doc.pdfFile ? (typeof doc.pdfFile === 'string' && doc.pdfFile.startsWith('http') ? doc.pdfFile : getFileUrl(doc.pdfFile)) : (doc.pdf_file || ''),
    rating: 4.7,
    specs: {
      'Model Number': doc.modelNumber,
      'HSN Code': doc.hsnCode || '85371010',
      // 'Operating Voltage': '24V DC / 230V AC',
      'System Type': doc.categoryId?.categoryName || 'Automation Parts',
      // 'Warranty': '12 Months Direct Manufacturer',
    }
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setApiFailed(false);
      try {
        const response = await productService.getById(id);
        if (response && response.success && response.data) {
          setProduct(mapProduct(response.data));
          // Fetch related products (API may return related list)
          try {
            const relatedRes = await api.get(`/products/${id}/related`);
            if (relatedRes.data?.success && Array.isArray(relatedRes.data.data)) {
              setRelatedProductsList((relatedRes.data.data || []).map(mapProduct));
            }
          } catch (err) {
            // ignore related fetch errors
            console.warn('Related products fetch failed', err);
          }
        } else {
          setApiFailed(true);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setApiFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const activeProduct = product;

  // Re-sync active image when activeProduct changes
  const [activeImage, setActiveImage] = useState('');
  useEffect(() => {
    if (activeProduct && activeProduct.images && activeProduct.images.length > 0) {
      setActiveImage(activeProduct.images[0]);
    }
  }, [activeProduct]);

  const [shareSuccess, setShareSuccess] = useState(false);

  // Loading indicator rendering
  if (loading) {
    return (
      <main className="w-full pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading component technical details...</p>
        </div>
      </main>
    );
  }

  // If product is not found
  if (!activeProduct) {
    return (
      <main className="w-full pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-red-100">
            <Info className="w-8 h-8 animate-bounce" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Component Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The product parameter ID #{id} does not match any items in our systems catalog. It may have been discontinued or updated.
          </p>
          <Link
            to="/products"
            className="inline-block bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md"
          >
            Return to Products Catalog
          </Link>
        </div>
      </main>
    );
  }

  const {
    title,
    model,
    hsnCode,
    brand,
    category,
    price,
    discountPrice,
    shortDescription,
    description,
    images,
    videoEmbed,
    brochureUrl,
    rating,
    specs,
  } = activeProduct;

  // Related products logic (same category or brand, excluding current ID)
  const finalRelatedProducts = relatedProductsList;

  // Social Share generators
  const shareUrl = window.location.href;
  const shareTitle = `3ARK - Check out the ${title} (Model: ${model})`;

  const shareLinks = [
    { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: <Facebook className="w-4 h-4" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', icon: <PhoneCall className="w-4 h-4" />, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}` },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://instagram.com' }, // Standard redirection
    { name: 'YouTube', icon: <Youtube className="w-4 h-4" />, url: 'https://youtube.com' }
  ];

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const discountPercent = Math.round(((price - discountPrice) / price) * 100);

  return (
    <main className="w-full pt-20">
      
      {/* Breadcrumb navigator */}
      <section className="bg-slate-900/5 py-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/products" className="hover:text-brand-teal transition-colors flex items-center gap-0.5">
              <ChevronLeft className="w-3.5 h-3.5" />
              Catalogue
            </Link>
            <span className="text-slate-300">/</span>
            <span>{category}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold truncate">{title}</span>
          </div>
        </div>
      </section>

      {/* Main product presentation segment */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: Image Gallery Preview (Grid col 5) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Large Main Picture Preview */}
              <div className="relative pt-[80%] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={activeImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              </div>

              {/* Thumbnails grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3.5">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`pt-[75%] relative bg-slate-50 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                        activeImage === img ? 'border-brand-teal' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${title} thumb ${index}`}
                        className="absolute inset-0 w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* RIGHT: Specs and ordering parameters (Grid col 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Brand and Tags */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md tracking-wider">
                  Brand: {brand}
                </span>
                <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-md tracking-wider">
                  {category}
                </span>
              </div>

              {/* Title heading */}
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight leading-snug">
                {title}
              </h1>

              {/* Model / HSN Block */}
              <div className="grid grid-cols-2 gap-4 max-w-sm bg-brand-slate-light p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Model Number</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{model}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">HSN Code</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{hsnCode}</div>
                </div>
              </div>

              {/* Price section */}
              <div className="flex items-center gap-4 py-3 border-y border-slate-100">
                <div className="flex flex-col">
                  <span className="text-slate-400 line-through text-xs font-semibold">
                    Original Price: {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-950 mt-0.5">
                    Discounted: {discountPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <span className="bg-brand-orange text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm shadow-brand-orange/10">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {shortDescription}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/contact"
                  className="flex-grow bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs py-4 rounded-xl text-center shadow-lg transition-colors cursor-pointer"
                >
                  Request Technical Quotation
                </Link>
                
                {brochureUrl && (
                  <a
                    href={brochureUrl}
                    className="sm:w-60 bg-brand-slate-light hover:bg-slate-100 text-slate-700 font-extrabold text-xs py-4 rounded-xl text-center border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-brand-teal" />
                    Download Brochure (PDF)
                  </a>
                )}
              </div>

              {/* Social Share Buttons */}
              {/* <div className="pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  Share Component Details
                </h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors"
                      title={link.name}
                    >
                      {link.icon}
                    </a>
                  ))}
                  
                  <button
                    onClick={handleCopyShare}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 ml-2 bg-slate-100/50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 cursor-pointer"
                  >
                    {shareSuccess ? 'Link Copied!' : 'Copy Page Link'}
                  </button>
                </div>
              </div> */}

            </div>

          </div>

          {/* Details Tabs Segment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20 pt-12 border-t border-slate-100">
            
            {/* Description details (Grid col 6) */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Detailed Functional Overview
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {description}
              </p>
              
              {/* Product video section */}
              {videoEmbed && (
                <a
                  href={videoEmbed}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-teal font-semibold hover:underline mt-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  Watch Product Overview Video
                </a>
              )}
            </div>

            {/* Specifications specs sheet (Grid col 6) */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Technical Specifications
              </h3>
              
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-brand-slate-light">
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    {Object.entries(specs).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={`border-b border-slate-100/55 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-transparent'
                        }`}
                      >
                        <td className="px-5 py-3.5 font-bold text-slate-500 w-44">{key}</td>
                        <td className="px-5 py-3.5 font-mono text-slate-700 font-medium">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Related products horizontal section */}
          {finalRelatedProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-100">
              <h2 className="font-display font-extrabold text-xl text-slate-950 mb-10">
                Related Automation Systems
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {finalRelatedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
