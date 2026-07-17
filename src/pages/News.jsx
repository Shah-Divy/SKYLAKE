import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { newsService } from '../services/newsService';
import { getFileUrl } from '../services/api';
import { useState, useEffect } from 'react';

const stripHtml = (html = '') => {
  return String(html).replace(/<[^>]*>/g, '');
};

const firstWords = (text = '', n = 15) => {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  if (words.length <= n) return words.join(' ');
  return words.slice(0, n).join(' ') + ' ....';
};


export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await newsService.getAll();
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((n) => ({
            id: n.id || n._id,
            title: n.title,
            image: getFileUrl(n.image),
            content: n.content,
            date: n.publish_date ? new Date(n.publish_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
          }));
          setNews(mapped);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <main className="w-full pt-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Latest Press & News Releases
          </h1>
          <p className="text-xs text-slate-400">
            Read updates on partnerships, technical plant expansions, and completed project deployments.
          </p>
        </div>
      </section>

      {/* News Listing Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <motion.article
                key={item.id}
                whileHover={{ y: -5 }}
                className="bg-brand-slate-light border border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group h-full"
              >
                {/* News Image Header */}
                <div className="w-full overflow-hidden shrink-0 border-b border-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto block group-hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* News Info */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Date marker */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                    {item.date}
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-teal transition-colors line-clamp-2 leading-snug mb-3">
                    {item.title}
                  </h3>

                  {/* snippet */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-grow">
                    {firstWords(stripHtml(item.content), 15)}
                  </p>

                  {/* Footer Action */}
                  <div className="mt-auto pt-4 border-t border-slate-100/60">
                    <Link
                      to={`/news/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-brand-teal-dark transition-colors"
                    >
                      Read Full Article
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
