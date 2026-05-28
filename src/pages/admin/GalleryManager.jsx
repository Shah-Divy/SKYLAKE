import React, { useState } from 'react';
import { Upload, X, Trash2, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockGallery } from '../../data/mockData';

export default function GalleryManager() {
  const [gallery, setGallery] = useState(mockGallery);
  const [dragActive, setDragActive] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputCategory, setInputCategory] = useState('SCADA');

  const handleDelete = (id) => {
    if (window.confirm('Remove this photo from the systems gallery?')) {
      setGallery(gallery.filter((item) => item.id !== id));
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const newItem = {
      id: Date.now(),
      title: inputTitle.trim() || 'Custom Deployment Cell',
      category: inputCategory,
      image: inputUrl,
    };

    setGallery([newItem, ...gallery]);
    setInputUrl('');
    setInputTitle('');
  };

  return (
    <div className="space-y-8 text-xs">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
          Visual Assets
        </span>
        <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
          Showcase Gallery Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Add Image Panel (Col 4) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-6 self-start">
          <h3 className="font-display font-extrabold text-slate-950 text-sm">
            Add Media Assets
          </h3>
          
          {/* Simulated drag & drop */}
          <div
            className={`border border-dashed rounded-2xl px-4 py-8 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
              dragActive ? 'border-brand-teal bg-brand-teal/5' : 'border-slate-200 hover:bg-slate-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); alert('Simulated bulk upload addition...'); }}
          >
            <Upload className="w-8 h-8 text-slate-400 mb-2.5 animate-bounce" />
            <span className="font-bold text-slate-700">Drag &amp; drop photos here</span>
            <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPEG up to 10MB</span>
          </div>

          <div className="text-center font-bold text-slate-400 py-1 uppercase tracking-widest text-[9px] relative">
            <span className="bg-white px-2.5 relative z-10">Or Add Via URL</span>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 z-0" />
          </div>

          {/* Form Url */}
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Asset Label</label>
              <input
                type="text"
                placeholder="e.g. Panel fabrication block"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Category</label>
                <select
                  value={inputCategory}
                  onChange={(e) => setInputCategory(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                >
                  <option value="SCADA">SCADA Screens</option>
                  <option value="Robotics">Robotics Cells</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="VFDs">Drive Cabinets</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Photo URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://unsplash..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Add Image
            </button>
          </form>
        </div>

        {/* RIGHT: Visual Showcase listing (Col 8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-display font-extrabold text-slate-950 text-sm">
              Current Gallery Grid ({gallery.length} Images)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-xl aspect-square group bg-slate-100 border border-slate-100"
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                
                {/* Overlay Delete buttons */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                  <span className="text-[9px] font-extrabold text-brand-teal uppercase tracking-wider block">
                    {item.category}
                  </span>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{item.title}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
