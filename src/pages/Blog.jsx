import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockBlog } from '../data/mockData';
import { blogService } from '../services/blogService';
import { getFileUrl } from '../services/api';

const getBlogCategory = (title) => {
  const t = (title || '').toLowerCase();
  if (t.includes('opc') || t.includes('iot')) return 'Industrial IoT';
  if (t.includes('safety') || t.includes('torque') || t.includes('sto')) return 'Safety Systems';
  if (t.includes('maintenance') || t.includes('predictive')) return 'Smart Manufacturing';
  return 'Automation';
};

const mapBlogDoc = (doc) => ({
  id: doc._id,
  title: doc.title,
  excerpt: doc.content ? (doc.content.substring(0, 150) + '...') : '',
  category: getBlogCategory(doc.title),
  date: doc.publishDate ? new Date(doc.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'May 18, 2026',
  readTime: '5 min read',
  image: getFileUrl(doc.image),
  content: doc.content
});

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await blogService.getAll();
        if (res.success && res.data && res.data.length > 0) {
          setBlogs(res.data.map(mapBlogDoc));
        } else {
          setBlogs(mockBlog);
        }
      } catch (err) {
        console.error('Error fetching blogs from API:', err);
        setBlogs(mockBlog);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const activeBlogs = blogs.length > 0 ? blogs : mockBlog;

  // Extract unique categories from blog posts
  const categories = ['All', ...new Set(activeBlogs.map((b) => b.category))];

  const filteredBlogs = selectedCategory === 'All'
    ? activeBlogs
    : activeBlogs.filter((b) => b.category === selectedCategory);


  return (
    <main className="w-full pt-20">
      
      {/* Header banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Industrial Knowledge & Insights
          </h1>
          <p className="text-xs text-slate-400">
            Read engineering guides, safety configuration steps, and trends in automated manufacturing.
          </p>
        </div>
      </section>

      {/* Blog Catalogue Feed */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -5 }}
                className="bg-brand-slate-light border border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group h-full"
              >
                {/* Visual Header */}
                <div className="pt-[56.25%] relative bg-slate-100 overflow-hidden shrink-0 border-b border-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 text-brand-teal text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">
                    {post.category}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 flex flex-col flex-grow">
                  
                  {/* Date and Reading time metadata */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-teal transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-grow font-medium">
                    {post.excerpt}
                  </p>

                  {/* Read details button */}
                  <div className="mt-auto pt-4 border-t border-slate-100/60">
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-brand-teal-dark transition-colors"
                    >
                      Read Full Guide
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>

              </motion.article>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
