import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-10 flex flex-col items-center text-center max-w-md mx-auto"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5">
          <Icon size={28} className="text-brand-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-body">{title}</h3>
      {description && <p className="text-sm text-muted mt-2 max-w-xs">{description}</p>}
      {actionLabel && (
        <Button className="mt-6" onClick={onAction} icon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
