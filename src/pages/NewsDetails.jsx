import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ArrowRight, Info } from 'lucide-react';
import { mockNews } from '../data/mockData';

export default function NewsDetails() {
  const { id } = useParams();
  const newsItem = mockNews.find((n) => n.id === parseInt(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!newsItem) {
    return (
      <main className="w-full pt-32 pb-24 text-center">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-red-100">
            <Info className="w-8 h-8" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Article Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The news press release parameter ID #{id} was not found. It may have been archived or removed.
          </p>
          <Link
            to="/news"
            className="inline-block bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md"
          >
            Return to News Center
          </Link>
        </div>
      </main>
    );
  }

  const { title, date, image, content } = newsItem;

  // Recent news filtering for bottom navigation (excluding current)
  const otherNews = mockNews.filter((n) => n.id !== newsItem.id).slice(0, 2);

  return (
    <main className="w-full pt-20">
      
      {/* Breadcrumb row */}
      <section className="bg-slate-900/5 py-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/news" className="hover:text-brand-teal transition-colors flex items-center gap-0.5">
              <ChevronLeft className="w-3.5 h-3.5" />
              Press News
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold truncate">{title}</span>
          </div>
        </div>
      </section>

      {/* Main article body */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-6">
            
            {/* Meta and title */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-brand-teal" />
                Published: {date}
              </div>
              <h1 className="font-display font-extrabold text-2xl md:text-4xl text-slate-950 tracking-tight leading-tight">
                {title}
              </h1>
            </div>

            {/* Featured Image */}
            <div className="relative pt-[50%] bg-slate-950 rounded-2xl overflow-hidden shadow-md">
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Detailed Content */}
            <div className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-6 pt-4 font-medium">
              <p>{content}</p>
              
              <p>
                As part of our commitment to continuous delivery of top-tier industrial systems, Skylake Automation remains dedicated to engineering high-precision solutions that meet strict safety and operational standards. For further details on this deployment or other services, please contact our corporate liaison office at <a href="mailto:info@skylakeautomation.com" className="text-brand-teal font-bold hover:underline">info@skylakeautomation.com</a>.
              </p>
            </div>

          </div>

          {/* Recent News section */}
          {otherNews.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-100">
              <h3 className="font-display font-extrabold text-lg text-slate-950 mb-8">
                Recent Press Releases
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherNews.map((n) => (
                  <Link
                    key={n.id}
                    to={`/news/${n.id}`}
                    className="p-5 bg-brand-slate-light border border-slate-100 hover:border-slate-200 rounded-xl block shadow-sm hover:shadow-md transition-all group"
                  >
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">{n.date}</span>
                    <h4 className="font-display font-bold text-xs text-slate-900 group-hover:text-brand-teal transition-colors line-clamp-1">
                      {n.title}
                    </h4>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-brand-teal mt-3">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
