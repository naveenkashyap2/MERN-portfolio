import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Clock, Navigation } from 'lucide-react';
import Badge from '../ui/Badge';
import { imageFor } from '../../constants/images';
import { CATEGORY_LABELS } from '../../constants/places';
import { cn } from '../../utils/cn';

export default function PlaceCard({ place, distance, saved, onToggleFavorite, onOpen, onNavigate, index = 0 }) {
  const verified = place.dataTrust === 'verified';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageFor(place.imageSlug, 'hero')}
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        <button
          onClick={() => onToggleFavorite?.(saved)}
          aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition-colors',
            saved ? 'text-danger' : 'text-body hover:text-danger',
          )}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge tone={verified ? 'live' : 'estimate'} label={verified ? 'Verified' : 'Estimate'} />
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="font-semibold text-body">{place.name}</h3>
            <p className="text-xs text-muted mt-0.5">{CATEGORY_LABELS[place.category] || place.category} · {place.city}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Star size={13} className="text-warning" fill="currentColor" /> {place.rating}
          </span>
          {distance !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-brand-400" /> {distance}
            </span>
          )}
          {place.visitDurationMin && (
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-cyan" /> {Math.round(place.visitDurationMin / 60)}h
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onOpen}
            className="flex-1 h-9 rounded-lg bg-white/[0.06] border border-white/10 text-sm font-medium text-body hover:bg-white/[0.1] transition-colors"
          >
            View Details
          </button>
          <button
            onClick={onNavigate}
            className="h-9 px-3 rounded-lg glass text-brand-400 hover:bg-white/[0.1] transition-colors"
            aria-label="Navigate"
          >
            <Navigation size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
