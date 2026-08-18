import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const sides = {
  right: { initial: { x: '100%' }, exit: { x: '100%' }, pos: 'right-0 top-0 h-full w-[85%] max-w-sm' },
  left: { initial: { x: '-100%' }, exit: { x: '-100%' }, pos: 'left-0 top-0 h-full w-[85%] max-w-sm' },
  bottom: { initial: { y: '100%' }, exit: { y: '100%' }, pos: 'bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl' },
};

export default function Drawer({ open, onClose, title, side = 'right', children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const cfg = sides[side];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
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
            initial={cfg.initial}
            animate={{ x: 0, y: 0 }}
            exit={cfg.exit}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className={cn('absolute bg-ink-850 border-white/10 shadow-card flex flex-col', cfg.pos, side !== 'bottom' && 'border-r', side === 'bottom' && 'border-t')}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
              <h3 className="font-semibold text-body">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="text-muted hover:text-body">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
