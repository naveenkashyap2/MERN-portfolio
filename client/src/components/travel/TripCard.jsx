import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, Wallet, MapPin, MoreHorizontal, Eye, Pencil, Copy, Share2, Trash2 } from 'lucide-react';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import Badge from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import { imageFor } from '../../constants/images';
import { formatINR } from '../../utils/currency';
import { formatShortDate } from '../../utils/date';

const STATUS = {
  planned: { label: 'Upcoming', tone: 'brand' },
  active: { label: 'Active', tone: 'live' },
  completed: { label: 'Completed', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

export default function TripCard({ trip, onView, onEdit, onDuplicate, onShare, onDelete, index = 0 }) {
  const status = STATUS[trip.status] || STATUS.planned;
  const progress = trip.status === 'completed' ? 100 : trip.status === 'active' ? 42 : 0;
  const destSlug = trip.itinerary?.[0]?.items?.find((i) => i.imageSlug)?.imageSlug || 'hero';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group"
    >
      <Link to={`/trips/${trip.id}`} className="block relative h-40 overflow-hidden">
        <img src={imageFor(destSlug, 'hero')} alt={trip.destination} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge tone={status.tone} label={status.label} />
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-body flex items-center gap-1.5">
              <MapPin size={15} className="text-cyan" /> {trip.origin} → {trip.destination}
            </h3>
            <p className="text-xs text-muted mt-0.5">{trip.title}</p>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1"><CalendarDays size={13} /> {formatShortDate(trip.startDate)} – {formatShortDate(trip.endDate)}</span>
          <span className="flex items-center gap-1"><Users size={13} /> {(trip.travelers?.adults || 0) + (trip.travelers?.children || 0)}</span>
          <span className="flex items-center gap-1"><Wallet size={13} /> {formatINR(trip.budget, true)}</span>
        </div>

        {trip.status === 'active' && (
          <div className="mt-3">
            <ProgressBar value={progress} tone="brand" />
            <p className="text-[11px] text-muted mt-1.5">{progress}% complete</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Link to={`/trips/${trip.id}`} className="flex-1 h-9 rounded-lg bg-white/[0.06] border border-white/10 text-sm font-medium text-body hover:bg-white/[0.1] transition-colors flex items-center justify-center gap-1.5">
            <Eye size={14} /> View
          </Link>
          <button onClick={onShare} className="h-9 px-3 rounded-lg glass text-muted hover:text-body transition-colors" aria-label="Share">
            <Share2 size={15} />
          </button>
          <Dropdown
            trigger={
              <button className="h-9 px-2.5 rounded-lg glass text-muted hover:text-body transition-colors" aria-label="More actions">
                <MoreHorizontal size={16} />
              </button>
            }
          >
            <DropdownItem icon={Pencil} onClick={onEdit}>Edit</DropdownItem>
            <DropdownItem icon={Copy} onClick={onDuplicate}>Duplicate</DropdownItem>
            <DropdownItem icon={Trash2} danger onClick={onDelete}>Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </motion.div>
  );
}
