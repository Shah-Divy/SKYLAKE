import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { id, title, model, brand, price, discountPrice, shortDescription, images, rating } = product;

  // Calculate discount percentage
  const discountPercent = Math.round(((price - discountPrice) / price) * 100);

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group"
    >
      {/* Product Image Section */}
      <div className="relative pt-[75%] bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100">
        <img
          src={images[0]}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Brand Tag Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">
          {brand}
        </div>

        {/* Discount Overlay */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-brand-orange text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
            Save {discountPercent}%
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Model & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md">
            Mod: {model}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-600">{rating}</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-brand-teal transition-colors mb-1.5">
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {shortDescription}
        </p>

        {/* Price & CTA Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50/80">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 line-through font-semibold leading-none">
              {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {discountPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <Link
            to={`/products/${id}`}
            className="flex items-center gap-1 text-xs font-bold text-brand-teal group-hover:text-brand-teal-dark transition-colors"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
