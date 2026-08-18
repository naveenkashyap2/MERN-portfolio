import { motion } from 'framer-motion';
import { Star, MapPin, Heart, Wifi, Coffee, Car } from 'lucide-react';
import Badge from '../ui/Badge';
import { imageFor } from '../../constants/images';
import { formatINR } from '../../utils/currency';
import { cn } from '../../utils/cn';

const AMENITY_ICONS = { 'wi-fi': Wifi, breakfast: Coffee, parking: Car };

const CATEGORY_TONES = { budget: 'estimate', medium: 'neutral', premium: 'brand' };

export default function HotelCard({ hotel, saved, onToggleFavorite, onOpen, onAddToTrip, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={imageFor(hotel.imageSlug, 'hotel')} alt={hotel.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        <button
          onClick={() => onToggleFavorite?.(saved)}
          aria-label="Save hotel"
          className={cn('absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center transition-colors', saved ? 'text-danger' : 'text-body hover:text-danger')}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge tone={CATEGORY_TONES[hotel.category]} label={hotel.category} />
          <Badge tone="estimate" label="Est. price" />
        </div>
        <div className="absolute bottom-3 left-3">
          <h3 className="font-semibold text-body">{hotel.name}</h3>
          <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
            <MapPin size={12} /> {hotel.city} · {hotel.distanceKm} km from centre
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-body">
            <Star size={14} className="text-warning" fill="currentColor" /> {hotel.rating}
            <span className="text-xs text-muted">({hotel.ratingCount?.toLocaleString('en-IN')})</span>
          </span>
          <div className="text-right">
            <p className="text-lg font-semibold text-body">{formatINR(hotel.pricePerNight)}</p>
            <p className="text-[11px] text-muted -mt-0.5">per night</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities?.slice(0, 4).map((a) => {
            const key = Object.keys(AMENITY_ICONS).find((k) => a.toLowerCase().includes(k));
            const Icon = key ? AMENITY_ICONS[key] : Wifi;
            return (
              <span key={a} className="flex items-center gap-1 text-[11px] text-muted bg-white/[0.05] rounded-md px-2 py-1">
                <Icon size={11} /> {a}
              </span>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onOpen} className="flex-1 h-9 rounded-lg bg-white/[0.06] border border-white/10 text-sm font-medium text-body hover:bg-white/[0.1] transition-colors">
            View
          </button>
          {onAddToTrip && (
            <button onClick={onAddToTrip} className="flex-1 h-9 rounded-lg bg-brand-500/15 border border-brand-500/30 text-sm font-medium text-brand-400 hover:bg-brand-500/25 transition-colors">
              Add to Trip
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
