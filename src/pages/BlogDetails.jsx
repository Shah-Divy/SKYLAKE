import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ArrowRight, Info, BookOpen } from 'lucide-react';
import { blogService } from '../services/blogService';
import { getFileUrl } from '../services/api';

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await blogService.getById(id);
        if (res.success && res.data) {
          const doc = res.data;
          const mapped = {
            id: doc._id,
            title: doc.title,
            date: doc.publishDate ? new Date(doc.publishDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) : 'May 18, 2026',
            readTime: '5 min read',
            image: getFileUrl(doc.image),
            category: doc.title ? (doc.title.toLowerCase().includes('opc') ? 'Industrial IoT' : 'Automation') : 'Automation',
            content: doc.content,
            excerpt: doc.content ? doc.content.split(/\s+/).slice(0,15).join(' ') + ' ....' : ''
          };
          setPost(mapped);
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    // fetch both the current post and recent posts for sidebar
    const fetchAll = async () => {
      await fetchBlog();
      try {
        const listRes = await blogService.getAll();
        if (listRes.success && Array.isArray(listRes.data)) {
          const mappedList = listRes.data.map((doc) => ({
            id: doc.id || doc._id,
            title: doc.title,
            date: doc.publish_date || doc.publishDate,
            category: doc.title ? (doc.title.toLowerCase().includes('opc') ? 'Industrial IoT' : 'Automation') : 'Automation',
          }));
          setRecent(mappedList.filter((b) => String(b.id) !== String(id)).slice(0,3));
          setCategories([...new Set(mappedList.map((b) => b.category))]);
        } else {
          setRecent([]);
          setCategories([]);
        }
      } catch (err) {
        setRecent([]);
        setCategories([]);
      }
    };
    fetchAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <main className="w-full pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading blog...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="w-full pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-red-100">
            <Info className="w-8 h-8" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Guide Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The blog post parameter ID #{id} was not found. It may have been archived or moved.
          </p>
          <Link
            to="/blog"
            className="inline-block bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md"
          >
            Return to Blog Feed
          </Link>
        </div>
      </main>
    );
  }

  const { title, date, readTime, image, category, content, excerpt } = post;

  // Sidebar elements (populated from API in useEffect)

  return (
    <main className="w-full pt-20">
      
      {/* Breadcrumb row */}
      {/* <section className="bg-slate-900/5 py-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/blog" className="hover:text-brand-teal transition-colors flex items-center gap-0.5">
              <ChevronLeft className="w-3.5 h-3.5" />
              Insights Blog
            </Link>
            <span className="text-slate-300">/</span>
            <span>{category}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold truncate">{title}</span>
          </div>
        </div>
      </section> */}

      {/* Blog Details Layout */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: Main Content Read Block (Col 8) */}
            <article className="lg:col-span-8 space-y-6">
              
              {/* Meta information tags */}
              <div className="space-y-3">
                <span className="inline-block text-[10px] font-extrabold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {category}
                </span>
                <h1 className="font-display font-extrabold text-2xl md:text-4xl text-slate-950 tracking-tight leading-tight">
                  {title}
                </h1>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-brand-teal" />
                    Published: {date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-brand-teal" />
                    {readTime}
                  </span>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="w-full rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto block"
                />
              </div>

              {/* Lead paragraph
              <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-brand-teal pl-4">
                {excerpt}
              </p> */}

              {/* Rich Body Content */}
              <div 
                className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-6 font-medium rich-text-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
                {/* <h3 className="font-display font-extrabold text-slate-900 text-sm md:text-base mt-8 mb-4">
                  Operational Best Practices for Control Engineers
                </h3>
                <p>
                  Deploying smart networks requires systematic grounding, shielded cabling, and structured network segregation. We recommend establishing dedicated subnets (VLANs) for OT (Operations Technology) communication traffic to prevent SCADA broadcasts from clogging PLC cycles.
                </p>
                <p>
                  For detailed advice or parts configuration corresponding to the topics discussed, please explore our products registry or check out the download center for configuration sheets.
                </p> */}

            </article>

          </div>

        </div>
      </section>

    </main>
  );
}
