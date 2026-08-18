import { motion, AnimatePresence } from 'framer-motion';

export default function Drawer({ open, onClose, title, children, side = 'right' }) {
  const from = side === 'left' ? -24 : 24;
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: from, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: from, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-0 h-full w-[min(100%,380px)] border-white/10 bg-bg-secondary p-5 shadow-card ${
              side === 'left' ? 'left-0 border-r' : 'right-0 border-l'
            }`}
          >
            {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
