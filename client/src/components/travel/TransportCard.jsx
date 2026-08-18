import { Train, Bus, Clock, CalendarDays, IndianRupee } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatINR } from '../../utils/currency';
import { formatDurationMinutes } from '../../utils/distance';

export default function TransportCard({ item, kind = 'train' }) {
  const isTrain = kind === 'train';
  const Icon = isTrain ? Train : Bus;
  return (
    <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-brand-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-body truncate">{isTrain ? item.name : item.operator}</h3>
            {isTrain && <span className="text-xs text-muted">#{item.number}</span>}
          </div>
          <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
            {item.from} → {item.to}
            {item.boardingPoint && ` · ${item.boardingPoint}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 text-sm">
        <div>
          <p className="text-[11px] text-muted uppercase">Depart</p>
          <p className="font-medium text-body">{item.departure}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted uppercase">Arrive</p>
          <p className="font-medium text-body">{item.arrival}</p>
        </div>
        <div className="flex items-center gap-1.5 text-body">
          <Clock size={14} className="text-cyan" /> {formatDurationMinutes(item.durationMin)}
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted uppercase">Fare</p>
          <p className="font-semibold text-body flex items-center gap-0.5 justify-end">
            <IndianRupee size={13} /> {item.fare}
          </p>
        </div>
        <Badge tone="estimate" label="Estimate" />
      </div>
    </div>
  );
}

export function formatDur(min) {
  return formatDurationMinutes(min);
}
