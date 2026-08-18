import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { imageFor } from '../../constants/images';
import { CATEGORY_LABELS } from '../../constants/places';
import { formatINR } from '../../utils/currency';

function PlaceChips({ places }) {
  return (
    <div className="mt-3 space-y-2">
      {places?.map((p) => (
        <div key={p.id || p.name} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-ink-900/60 p-2.5">
          <img src={imageFor(p.imageSlug, 'hero')} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-body truncate">{p.name}</p>
            <p className="text-[11px] text-muted">{CATEGORY_LABELS[p.category] || p.category} · {p.city}</p>
          </div>
          <span className="text-xs text-warning">★ {p.rating}</span>
        </div>
      ))}
    </div>
  );
}

function HotelChips({ hotels }) {
  return (
    <div className="mt-3 space-y-2">
      {hotels?.map((h) => (
        <div key={h.id || h.name} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-ink-900/60 p-2.5">
          <img src={imageFor(h.imageSlug, 'hotel')} alt={h.name} className="w-10 h-10 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-body truncate">{h.name}</p>
            <p className="text-[11px] text-muted">{h.category} · {h.rating}★</p>
          </div>
          <span className="text-xs text-body font-medium">{formatINR(h.pricePerNight)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AIMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center shrink-0 mt-1">
          <Sparkles size={15} className="text-white" />
        </span>
      )}
      <div
        className={cn(
          'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line',
          isUser ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-br-md' : 'bg-ink-800 border border-white/[0.08] text-body rounded-bl-md',
        )}
      >
        {message.content}
        {message.kind === 'place' && message.data?.places && <PlaceChips places={message.data.places} />}
        {message.kind === 'hotel' && message.data?.hotels && <HotelChips hotels={message.data.hotels} />}
      </div>
      {isUser && (
        <span className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center shrink-0 mt-1">
          <User size={15} className="text-muted" />
        </span>
      )}
    </motion.div>
  );
}
