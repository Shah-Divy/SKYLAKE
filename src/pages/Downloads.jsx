import React, { useState } from 'react';
import { Download, FileText, Settings, Award, ShieldAlert, ExternalLink, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockDownloads } from '../data/mockData';

export default function Downloads() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadCounts, setDownloadCounts] = useState(
    mockDownloads.reduce((acc, curr) => ({ ...acc, [curr.id]: Math.floor(Math.random() * 300) + 140 }), {})
  );

  const categories = ['All', 'Brochures', 'Manuals', 'Software', 'Certificates'];

  const filteredDownloads = activeCategory === 'All'
    ? mockDownloads
    : mockDownloads.filter((d) => d.category === activeCategory);

  const getIcon = (cat) => {
    switch (cat) {
      case 'Brochures':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'Manuals':
        return <HardDrive className="w-5 h-5 text-blue-500" />;
      case 'Software':
        return <Settings className="w-5 h-5 text-teal-500" />;
      case 'Certificates':
        return <Award className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleDownloadTrigger = (id) => {
    // Simulate incrementing downloads
    setDownloadCounts((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
    
    // Alert or dispatch a mock file alert
    alert('Simulating direct file download block...');
  };

  return (
    <main className="w-full pt-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Technical Resource Download Center
          </h1>
          <p className="text-xs text-slate-400">
            Access free automation catalogues, VFD speed configuration templates, quality certificates, and setup manuals.
          </p>
        </div>
      </section>

      {/* Downloads Catalog content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredDownloads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDownloads.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="bg-brand-slate-light p-6 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Icon & Category */}
                    <div className="flex items-center justify-between">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-50 shadow-sm">
                        {getIcon(item.category)}
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-sm text-slate-950">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & File details */}
                  <div className="mt-8 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                    <div className="flex flex-col text-[10px] text-slate-400 font-semibold">
                      <span>Size: {item.fileSize}</span>
                      <span className="text-slate-400/80">Downloaded {downloadCounts[item.id]} times</span>
                    </div>

                    <button
                      onClick={() => handleDownloadTrigger(item.id)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Get File
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 max-w-sm mx-auto flex flex-col items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="font-display font-bold text-slate-800">
                No Downloads Available
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find items matching "{activeCategory}". Feel free to browse brochures or manuals.
              </p>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
