import React, { useState, useEffect } from 'react';
import { Download, FileText, Settings, Award, ShieldAlert, ExternalLink, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadService } from '../services/downloadService';
import { getFileUrl } from '../services/api';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [downloadCounts, setDownloadCounts] = useState({});
  const [loading, setLoading] = useState(true);

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

  const handleDownloadTrigger = (item) => {
    // Open zip file in new tab and increment local counter
    const url = item.zip_file || item.zipFile || getFileUrl(item.zip_file || item.zipFile || '');
    if (url) window.open(url, '_blank');
    setDownloadCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await downloadService.getAll();
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((d) => ({
            id: d.id || d._id,
            title: d.title,
            zip_file: d.zip_file || d.zipFile || '',
            description: d.description || '',
            video_link: d.video_link || d.videoLink || '',
          }));
          setDownloads(mapped);
          const counts = {};
          mapped.forEach((m) => { counts[m.id] = 0; });
          setDownloadCounts(counts);
        } else {
          setDownloads([]);
        }
      } catch (err) {
        console.error('Error fetching downloads:', err);
        setDownloads([]);
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
          
          {/* Cards Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 mt-4">Loading downloads...</p>
            </div>
          ) : downloads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloads.map((item) => (
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
                      {item.video_link && (
                        <a
                          href={item.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-teal font-semibold hover:underline mt-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Watch Video
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions & File details */}
                    <div className="mt-8 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                      {/* <div className="flex flex-col text-[10px] text-slate-400 font-semibold">
                         <span>Size: —</span>
                        <span className="text-slate-400/80">Downloaded {downloadCounts[item.id] || 0} times</span>
                      </div> */}

                      <button
                        onClick={() => handleDownloadTrigger(item)}
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
                We couldn't find any downloads.
              </p>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
