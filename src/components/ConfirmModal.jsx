import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
  isLoading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? null : onClose}
            className="absolute inset-0 bg-slate-950 backdrop-blur-sm cursor-default"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 p-6 space-y-6"
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="bg-red-50 p-3 rounded-2xl text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 pr-6">
                <h3 className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {message}
                </p>
              </div>

              {!isLoading && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer shadow-lg shadow-red-600/10"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
