import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lightbox({ image, title, onClose }) {
  useEffect(() => {
    // Prevent scrolling behind the overlay
    document.body.style.overflow = 'hidden';
    
    // Close on escape key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4">
        
        {/* Backdrop Tap to Close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 cursor-zoom-out"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Container */}
          <div className="flex flex-col md:flex-row items-stretch min-h-[400px] max-h-[85vh]">
            
            {/* Visual Screen */}
            <div className="flex-grow flex items-center justify-center p-6 bg-slate-950/50">
              <img
                src={image}
                alt={title || 'Lightbox View'}
                className="max-h-[60vh] md:max-h-[75vh] object-contain rounded-lg"
              />
            </div>

            {/* Side description */}
            <div className="w-full md:w-80 bg-slate-900 p-6 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-800">
              <span className="text-[10px] font-bold text-brand-teal tracking-widest uppercase mb-1">
                Automation Showcase
              </span>
              <h3 className="font-display font-bold text-lg text-white mb-3">
                {title || 'Industrial Deployment'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Snapshot demonstrating live industrial integration. We commission automation hardware and build custom electrical panels matching strict IEC guidelines.
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-2 text-slate-500 text-xs">
                <ZoomIn className="w-4 h-4 text-slate-600" />
                <span>Pinch/scroll on mobile to inspect details</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
