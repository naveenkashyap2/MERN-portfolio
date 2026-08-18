import { motion } from 'framer-motion';
import { Clock, MapPin, Route as RouteIcon, Wallet, Navigation, Pencil, Trash2, Sparkles } from 'lucide-react';
import { imageFor } from '../../constants/images';
import { CATEGORY_LABELS } from '../../constants/places';
import { formatINR } from '../../utils/currency';

export default function ItineraryCard({ item, isNext = false, onNavigate, onEdit, onRemove, onOptimize }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`rounded-xl border p-3.5 flex gap-3.5 ${isNext ? 'border-brand-500/40 bg-brand-500/[0.07]' : 'border-white/[0.08] bg-ink-850/70'}`}
    >
      <img src={imageFor(item.imageSlug, 'hero')} alt={item.place} loading="lazy" className="w-16 h-16 rounded-lg object-cover shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-cyan tabular-nums">{item.time}</span>
              {isNext && <span className="text-[10px] uppercase tracking-wide text-brand-400 font-semibold">Next</span>}
            </div>
            <h4 className="font-medium text-body truncate mt-0.5">{item.place}</h4>
            <p className="text-[11px] text-muted">{CATEGORY_LABELS[item.category] || item.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted flex-wrap">
          {item.duration && <span className="flex items-center gap-1"><Clock size={11} /> {item.duration}</span>}
          {item.distance && item.distance !== '—' && <span className="flex items-center gap-1"><RouteIcon size={11} /> {item.distance}</span>}
          {item.cost > 0 && <span className="flex items-center gap-1"><Wallet size={11} /> {formatINR(item.cost)}</span>}
        </div>
        {item.notes && <p className="text-[11px] text-muted mt-1.5 line-clamp-1">{item.notes}</p>}
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        {onNavigate && (
          <button onClick={onNavigate} className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-white/[0.06]" aria-label="Navigate">
            <Navigation size={14} />
          </button>
        )}
        {onEdit && (
          <button onClick={onEdit} className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-white/[0.06]" aria-label="Edit">
            <Pencil size={14} />
          </button>
        )}
        {onOptimize && (
          <button onClick={onOptimize} className="p-1.5 rounded-lg text-muted hover:text-brand-400 hover:bg-white/[0.06]" aria-label="AI optimize">
            <Sparkles size={14} />
          </button>
        )}
        {onRemove && (
          <button onClick={onRemove} className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-white/[0.06]" aria-label="Remove">
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
