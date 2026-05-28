import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Award, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockBrands } from '../data/mockData';

export default function Partners() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = mockBrands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full pt-20">
      
      {/* Header Banner */}
      <section className="relative bg-slate-950 py-24 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 z-10">
          <span className="text-[10px] font-bold text-brand-teal tracking-widest uppercase">
            Official Alliances
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-none text-glow-teal">
            Authorized Integration Partners & Brands
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            We partner with leading global hardware developers to offer genuine products, direct warranties, and certified engineering integrations.
          </p>
        </div>
      </section>

      {/* Main Brands list */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-16 relative">
            <input
              type="text"
              placeholder="Search partner brands (e.g. Siemens, ABB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-sm px-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-brand-teal transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Grid of Partner Cards */}
          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrands.map((brand) => (
                <motion.div
                  key={brand.id}
                  whileHover={{ y: -5 }}
                  className="bg-brand-slate-light border border-slate-100 hover:border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Brand Logo Header Container */}
                    <div className="h-16 bg-white p-3 rounded-xl border border-slate-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-[150px] object-contain"
                      />
                    </div>

                    {/* Brand Meta */}
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                        {brand.name}
                        <span className="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <Award className="w-3 h-3" />
                          Authorized
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {brand.description}
                      </p>
                    </div>
                  </div>

                  {/* Brand Footer Stats & Actions */}
                  <div className="mt-8 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Active Lines
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {brand.productsCount}+ Components
                      </span>
                    </div>

                    <Link
                      to={`/products?brand=${encodeURIComponent(brand.name)}`}
                      className="group inline-flex items-center gap-1 text-xs font-extrabold text-brand-teal hover:text-brand-teal-dark transition-colors"
                    >
                      View Brand Catalog
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 max-w-sm mx-auto flex flex-col items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-4 animate-bounce" />
              <h3 className="font-display font-bold text-base text-slate-800">
                No Partners Found
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                We couldn't find any partner brands matching "{searchQuery}". Try using Siemens, Omron or Fanuc.
              </p>
            </div>
          )}

          {/* Integration capability CTA */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 mt-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-[100px]" />
            
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="inline-block text-[9px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2.5 py-1 rounded-md">
                Systems Engineering
              </span>
              <h3 className="font-display font-extrabold text-xl md:text-3xl text-white tracking-tight leading-tight">
                Need Multi-Brand Hardware Configurations?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Our engineers excel at cross-brand integration. We program PLC systems that communicate across Siemens S7-1500 to Rockwell HMIs and FANUC robotics via OPC UA and Ethernet/IP protocols. Let us build a unified solution block matching your factory’s layout.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/contact"
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
                >
                  Consult Integration Engineer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/downloads"
                  className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all border border-white/5"
                >
                  Download Tech Manuals
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
