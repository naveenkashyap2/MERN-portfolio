import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', hideClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-ink-850 border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-card overflow-hidden',
              sizes[size],
            )}
          >
            {(title || !hideClose) && (
              <div className="flex items-start justify-between px-6 pt-5 pb-1">
                <div>
                  {title && <h3 className="text-lg font-semibold text-body">{title}</h3>}
                  {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
                </div>
                {!hideClose && (
                  <button onClick={onClose} aria-label="Close" className="text-muted hover:text-body p-1 -mr-1">
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
            {footer && <div className="px-6 pb-6 pt-1 flex items-center justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
