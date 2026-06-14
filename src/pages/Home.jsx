import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Briefcase, MapPin, Eye, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Static mock data removed per request

import { bannerService } from '../services/bannerService';
import { companyProfileService } from '../services/companyProfileService';
import { productService } from '../services/productService';
import { galleryService } from '../services/galleryService';
import { reviewService } from '../services/reviewService';
import { jobService } from '../services/jobService';
import { brandService } from '../services/brandService';
import { getFileUrl } from '../services/api';

import ProductCard from '../components/ProductCard';
import Lightbox from '../components/Lightbox';
import JobApplyModal from '../components/JobApplyModal';

export default function Home() {
  // Slider states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const slideInterval = useRef(null);

  // Gallery states
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [selectedGalleryTitle, setSelectedGalleryTitle] = useState('');

  // Careers states
  const [selectedJob, setSelectedJob] = useState(null);

  // Dynamic States
  const [banners, setBanners] = useState([]);
  const [intro, setIntro] = useState(null);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data mapping helpers to conform Mongo schemas to existing JSX keys
  const mapBanner = (b) => ({
    id: b._id || b.id,
    type: b.mediaType || b.media_type || 'image',
    url: getFileUrl(b.mediaUrl || b.media_url),
    title: b.title || b.name || '',
    subtitle: (b.mediaType || b.media_type) === 'video' ? 'Precision Robotics & Advanced Control Systems' : 'Empowering smart manufacturing with state-of-the-art systems.',
    primaryCTA: b.ctaText || b.cta_text || 'View Products',
    primaryLink: b.ctaUrl || b.cta_url || '/products',
    secondaryCTA: 'Contact Us',
    secondaryLink: '/contact'
  });

  const mapIntro = (profile) => ({
    title: profile.company_profile || 'Pioneering the Future of Automation & Control Engineering',
    subtitle: profile.company_profile || '',
    paragraph1: profile.mission || '',
    paragraph2: profile.vision || '',
    achievements: profile.achievements || '',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    stats: [
      { label: 'Installed Systems', value: '1,200+' },
      { label: 'Global Brands Offered', value: '15+' },
      { label: 'Commissioned Engineers', value: '45+' },
      { label: 'Uptime Reliability', value: '99.9%' }
    ]
  });

  const mapProduct = (doc) => ({
    id: doc._id,
    title: doc.productName,
    model: doc.modelNumber,
    brand: doc.brandId?.brandName || 'Generic',
    category: doc.categoryId?.categoryName || 'General',
    price: doc.price,
    discountPrice: doc.discountedPrice !== null && doc.discountedPrice !== undefined ? doc.discountedPrice : doc.price,
    shortDescription: doc.description ? (doc.description.length > 120 ? doc.description.substring(0, 120) + '...' : doc.description) : '',
    images: doc.images?.map(img => getFileUrl(img)) || [],
    rating: 4.7
  });

  const mapTestimonial = (t) => ({
    id: t._id,
    name: t.customerName,
    role: 'VP of Manufacturing',
    company: t.companyName,
    content: t.review,
    image: getFileUrl(t.profileImage) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  });

  const mapGallery = (g) => ({
    id: g._id,
    title: g.title,
    category: 'Infrastructure',
    image: getFileUrl(g.image)
  });

  const mapJob = (j) => ({
    id: j._id,
    title: j.title,
    department: 'Engineering',
    experience: j.experience,
    location: j.location,
    description: j.description,
    requirements: [
      'Proficiency in controls systems design and programming.',
      'Willingness to travel for on-site commissioning.',
      'Strong team collaboration skills.'
    ]
  });

  const mapBrand = (b) => ({
    id: b._id,
    name: b.brandName,
    logo: getFileUrl(b.logo)
  });

  useEffect(() => {
    const loadHomeData = async () => {
      // Load services in a batch but tolerate failures so company profile fetch still runs
      try {
        const settled = await Promise.allSettled([
          bannerService.getAll(),
          productService.getAll({ page: 1, limit: 3 }),
          galleryService.getAll(),
          reviewService.getAll(),
          jobService.getAll(),
          brandService.getAll()
        ]);

        const bannersRes = settled[0].status === 'fulfilled' ? settled[0].value : null;
        const productsRes = settled[1].status === 'fulfilled' ? settled[1].value : null;
        const galleryRes = settled[2].status === 'fulfilled' ? settled[2].value : null;
        const reviewsRes = settled[3].status === 'fulfilled' ? settled[3].value : null;
        const jobsRes = settled[4].status === 'fulfilled' ? settled[4].value : null;
        const brandsRes = settled[5].status === 'fulfilled' ? settled[5].value : null;

        // Banners
        if (bannersRes && bannersRes.success) {
          const activeBanners = (bannersRes.data || []).filter((b) => {
            if (b == null) return false;
            if (typeof b.status === 'boolean') return b.status === true;
            if (typeof b.status === 'number') return b.status === 1;
            if (typeof b.status === 'string') return b.status !== 'inactive' && b.status !== 'false' && b.status !== '0';
            return true;
          });
          setBanners(activeBanners.map(mapBanner));
        }
        // Fallback: if banner service failed or returned empty, try direct fetch
        if ((!bannersRes || !bannersRes.success || (bannersRes.data || []).length === 0)) {
          try {
            const resp = await fetch('https://api.skylakeautomation.com/api/banners');
            const json = await resp.json();
            if (json && json.success && Array.isArray(json.data)) {
              const active = (json.data || []).filter((b) => b && (b.status === true || b.status === 1 || b.status === 'active' || (typeof b.status === 'string' && b.status !== 'inactive')));
              setBanners(active.map(mapBanner));
            }
          } catch (e) {
            console.error('Fallback banners fetch failed:', e);
          }
        }

        // Other resources (if available)
        if (productsRes && productsRes.success) setProducts((productsRes.data || []).map(mapProduct));
        if (galleryRes && galleryRes.success) setGallery((galleryRes.data || []).map(mapGallery));
        if (reviewsRes && reviewsRes.success) setTestimonials((reviewsRes.data || []).map(mapTestimonial));
        if (jobsRes && jobsRes.success) setJobs((jobsRes.data || []).map(mapJob));
        if (brandsRes && brandsRes.success) setBrands((brandsRes.data || []).map(mapBrand));
      } catch (error) {
        console.error('Unexpected error loading home data:', error);
      }

      // Fetch company profile independently so failures in other services don't prevent it
      try {
        const resp = await fetch('https://api.skylakeautomation.com/api/company-profile');
        const json = await resp.json();
        if (json && json.success && json.data) {
          setIntro(mapIntro(json.data));
        }
      } catch (err) {
        console.error('Failed to fetch company profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Ensure banners load independently (fallback) in case other services fail
  useEffect(() => {
    let mounted = true;
    const loadBannersDirect = async () => {
      try {
        const resp = await fetch('https://api.skylakeautomation.com/api/banners');
        const json = await resp.json();
        if (json && json.success && Array.isArray(json.data) && mounted) {
          const active = (json.data || []).filter((b) => b && (b.status === true || b.status === 1 || b.status === 'active' || (typeof b.status === 'string' && b.status !== 'inactive')));
          setBanners(active.map(mapBanner));
        }
      } catch (e) {
        console.error('Direct banners fetch failed:', e);
      }
    };
    loadBannersDirect();
    return () => { mounted = false; };
  }, []);

  const activeBanners = banners; // no static fallback
  const activeIntro = intro; // render from fetched profile only

  

  // Auto slide effect
  useEffect(() => {
    if (isPlaying && activeBanners.length > 0) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
      }, 6000);
    } else {
      clearInterval(slideInterval.current);
    }
    return () => clearInterval(slideInterval.current);
  }, [isPlaying, activeBanners]);

  const nextSlide = () => {
    if (activeBanners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }
  };

  const prevSlide = () => {
    if (activeBanners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    }
  };

  return (
    <main className="w-full">
      
      {/* SECTION A: Hero Banner Slider */}
      <section className="relative h-[85vh] md:h-[90vh] bg-slate-950 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeBanners.map((slide, index) => {
            if (index !== currentSlide) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full flex items-center"
              >
                {/* Background media handler */}
                <div className="absolute inset-0 w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/75 to-slate-950/20 z-10" />
                  {slide.type === 'video' ? (
                    <video
                      src={slide.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Banner contents */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full">
                  <div className="max-w-2xl text-left">
                    
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block text-[10px] md:text-xs font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20 mb-4"
                    >
                      Precision Engineering Systems
                    </motion.span>

                    <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-5 text-glow-teal"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs md:text-sm text-slate-300 leading-relaxed mb-8"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ y: 35, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-4"
                    >
                      <Link
                        to={slide.primaryLink}
                        className="bg-brand-teal hover:bg-brand-teal-dark text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-brand-teal/20 transition-all hover:scale-102 flex items-center gap-1.5"
                      >
                        {slide.primaryCTA}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to={slide.secondaryLink}
                        className="bg-slate-800/80 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl border border-slate-700/60 transition-colors"
                      >
                        {slide.secondaryCTA}
                      </Link>
                    </motion.div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Left / Right Navigators */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-slate-900/80 border border-slate-800/80 px-4 py-2 rounded-full">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label={isPlaying ? 'Pause Auto Slide' : 'Start Auto Slide'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <div className="flex gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide ? 'w-6 bg-brand-teal' : 'bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B: Company Introduction Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Intro Text */}
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
                Who We Are
              </span>
              {activeIntro ? (
                <>
                  <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight leading-tight">
                    {activeIntro.title}
                  </h2>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    {activeIntro.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeIntro.paragraph1}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeIntro.paragraph2}
                  </p>
                  {activeIntro.achievements && (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <strong className="font-bold">Achievements: </strong>
                      {activeIntro.achievements}
                    </p>
                  )}

                  {/* Stats highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                    {activeIntro.stats.map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="font-display font-extrabold text-xl md:text-2xl text-slate-900">
                          {stat.value}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500">Loading company profile...</p>
              )}
            </div>

            {/* Intro Visual Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-teal/5 rounded-3xl -rotate-2" />
              <div className="relative bg-slate-950 rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-[4/3]">
                {activeIntro?.image ? (
                  <img
                    src={activeIntro.image}
                    alt={activeIntro.title || 'Industrial Plant Automation'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800/20" />
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION D: Product Highlight Section */}
      <section className="py-24 bg-brand-slate-light border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
                Premium Hardware
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight mt-3">
                Featured Product Range
              </h2>
            </div>
            <Link
              to="/products"
              className="group bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              Browse Complete Catalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(Boolean).map((prod) => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION E: Gallery Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
              Visual Tour
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight">
              Systems Deployment Gallery
            </h2>
            <p className="text-xs text-slate-500">
              Browse actual control installations, assembly plants, PLC panels, and cobots commissioned in client workspaces.
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.filter(Boolean).map((item) => (
              <motion.div
                key={item.id || item._id}
                whileHover={{ y: -4 }}
                onClick={() => {
                  if (!item) return;
                  setSelectedGalleryImg(item.image || null);
                  setSelectedGalleryTitle(item.title || '');
                }}
                className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-square bg-slate-100"
              >
                {item?.image ? (
                  <img
                    src={item.image}
                    alt={item.title || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[9px] font-extrabold text-brand-teal uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-white font-display font-bold text-sm">
                    {item.title}
                  </h4>
                  {/* <div className="flex items-center gap-1.5 text-brand-teal font-bold text-[10px] mt-2">
                    <Eye className="w-3.5 h-3.5" />
                    Expand Preview
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION C: Customer Reviews / Testimonials */}
      <section className="py-24 bg-brand-slate-light border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
              Testimonials
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.filter(Boolean).map((t) => (
              <div key={t.id || t._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-sm">
                <div>
                  <p className="text-xs text-slate-500 italic leading-relaxed mb-6">
                    "{t.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                  <img
                    src={t.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'}
                    alt={t.name || 'Customer'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION F: Job Opening Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
              Join the Team
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight">
              Active Job Openings
            </h2>
            <p className="text-xs text-slate-500">
              We are expanding! Apply to join our core technical systems team in India.
            </p>
          </div>

          {/* Job listings */}
          <div className="max-w-4xl mx-auto space-y-6">
            {jobs.filter(Boolean).map((job) => (
              <div
                key={job.id || job._id}
                className="bg-brand-slate-light p-6 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-base text-slate-900">
                      {job.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                      {job.experience}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-xs">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.description}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                  </div>
                </div>

                {/* <button
                  onClick={() => setSelectedJob(job)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-1 shrink-0 self-stretch sm:self-center justify-center"
                >
                  Apply Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button> */}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION G: Brand / Partner Showcase */}
      <section className="py-16 bg-brand-slate-light border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Authorized Distribution & Integration Partners
            </span>
          </div>

          {/* Logo Slider / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-65 hover:opacity-100 transition-opacity duration-300">
            {brands.filter(Boolean).map((brand) => (
              <Link key={brand.id || brand._id} to="/partners" className="h-10 flex items-center justify-center filter grayscale hover:grayscale-0 transition-all duration-300">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name || ''}
                    className="max-h-full max-w-[120px] object-contain"
                  />
                ) : (
                  <div className="w-28 h-6 bg-slate-200" />
                )}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION H: Contact CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-[100px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            Let's Collaborate
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-5xl text-white tracking-tight leading-tight text-glow-teal">
            Ready to Optimize Your Automation Systems?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Get in touch with our system engineers today for component pricing, upgrade feasibility audits, or custom control panel designs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-extrabold text-xs px-7 py-4 rounded-xl shadow-lg shadow-brand-orange/20 transition-all hover:scale-102 flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs px-7 py-4 rounded-xl transition-all border border-white/5 w-full sm:w-auto justify-center"
            >
              Explore Components Range
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Rendering */}
      {selectedGalleryImg && (
        <Lightbox
          image={selectedGalleryImg}
          title={selectedGalleryTitle}
          onClose={() => {
            setSelectedGalleryImg(null);
            setSelectedGalleryTitle('');
          }}
        />
      )}

      {/* Careers Apply Modal Rendering */}
      {selectedJob && (
        <JobApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

    </main>
  );
}
