import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Lightbox({ image, title, description, onClose }) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-3 sm:p-4">
        
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
          className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2.5 bg-slate-950/80 hover:bg-slate-800 text-white rounded-full transition-colors cursor-pointer border border-slate-700/50 shadow-md"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Scrollable Content Container */}
          <div className="flex flex-col md:flex-row items-stretch overflow-y-auto md:overflow-hidden max-h-[90vh]">
            
            {/* Visual Screen */}
            <div className="w-full md:flex-1 bg-slate-950/60 p-4 sm:p-6 flex items-center justify-center min-h-[220px] max-h-[45vh] md:max-h-none shrink-0">
              <img
                src={image}
                alt={title || 'Lightbox View'}
                className="max-h-[40vh] md:max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-sm"
              />
            </div>

            {/* Side / Bottom description */}
            <div className="w-full md:w-80 bg-slate-900 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 shrink-0 md:shrink">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-brand-teal tracking-widest uppercase block">
                  Automation Showcase
                </span>
                <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug">
                  {title || 'Industrial Deployment'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {description || 'Snapshot demonstrating live industrial integration. We commission automation hardware and build custom electrical panels matching strict IEC guidelines.'}
                </p>
              </div>
              
              <div className="mt-4 pt-4 md:mt-6 md:pt-6 border-t border-slate-800/80 flex items-center gap-2 text-slate-400 text-[11px]">
                <ZoomIn className="w-4 h-4 text-brand-teal shrink-0" />
                <span>Pinch/scroll to inspect details</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}

