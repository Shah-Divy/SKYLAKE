import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ArrowRight, Info, BookOpen } from 'lucide-react';
import { mockBlog } from '../data/mockData';

export default function BlogDetails() {
  const { id } = useParams();
  const post = mockBlog.find((b) => b.id === parseInt(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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

  // Sidebar elements
  const recentPosts = mockBlog.filter((b) => b.id !== post.id).slice(0, 3);
  const categories = [...new Set(mockBlog.map((b) => b.category))];

  return (
    <main className="w-full pt-20">
      
      {/* Breadcrumb row */}
      <section className="bg-slate-900/5 py-4 border-b border-slate-100">
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
      </section>

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
              <div className="relative pt-[56.25%] bg-slate-950 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Lead paragraph */}
              <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-brand-teal pl-4">
                {excerpt}
              </p>

              {/* Rich Body Content */}
              <div className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-6 font-medium">
                <p>{content}</p>
                <h3 className="font-display font-extrabold text-slate-900 text-sm md:text-base mt-8 mb-4">
                  Operational Best Practices for Control Engineers
                </h3>
                <p>
                  Deploying smart networks requires systematic grounding, shielded cabling, and structured network segregation. We recommend establishing dedicated subnets (VLANs) for OT (Operations Technology) communication traffic to prevent SCADA broadcasts from clogging PLC cycles.
                </p>
                <p>
                  For detailed advice or parts configuration corresponding to the topics discussed, please explore our products registry or check out the download center for configuration sheets.
                </p>
              </div>

            </article>

            {/* RIGHT: Sidebar Widgets (Col 4) */}
            <aside className="lg:col-span-4 space-y-8 bg-brand-slate-light p-6 rounded-2xl border border-slate-100">
              
              {/* Category Widget */}
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-sm text-slate-900 pb-2.5 border-b border-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-teal" />
                  Categories
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/blog?category=${encodeURIComponent(cat)}`}
                      className="flex items-center justify-between py-2 px-3 text-xs font-semibold text-slate-600 hover:text-brand-teal hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      {cat}
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {mockBlog.filter((b) => b.category === cat).length}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Posts Widget */}
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-sm text-slate-900 pb-2.5 border-b border-slate-200">
                  Recent Insights
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((postItem) => (
                    <Link
                      key={postItem.id}
                      to={`/blog/${postItem.id}`}
                      className="block group space-y-1.5"
                    >
                      <span className="text-[9px] font-bold text-slate-400 block">{postItem.date}</span>
                      <h4 className="font-display font-bold text-xs text-slate-800 group-hover:text-brand-teal transition-colors line-clamp-2 leading-snug">
                        {postItem.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Brochure Download Promo */}
              <div className="bg-slate-950 text-white rounded-xl p-5 relative overflow-hidden text-center space-y-4 mt-6">
                <span className="text-[9px] font-bold text-brand-teal uppercase tracking-widest bg-white/10 px-2 py-1 rounded">
                  Resources
                </span>
                <h4 className="font-display font-bold text-xs">
                  Looking for parameter manuals?
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Head over to our downloads center to access free VFD mapping utilities, certificates, and wiring guides.
                </p>
                <Link
                  to="/downloads"
                  className="block w-full bg-brand-teal hover:bg-brand-teal-dark text-slate-950 font-bold text-xs py-2.5 rounded-lg text-center transition-colors cursor-pointer"
                >
                  Download Center
                </Link>
              </div>

            </aside>

          </div>

        </div>
      </section>

    </main>
  );
}
