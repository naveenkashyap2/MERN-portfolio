import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button.jsx';
import { inr } from '../../../utils/currency.js';
import { daysBetween } from '../../../utils/date.js';
import { travelerLabel } from '../../../utils/formatters.js';

export default function TripHeader({ trip, onShare, onMore }) {
  const navigate = useNavigate();
  if (!trip) return null;
  const days = daysBetween(trip.startDate, trip.endDate);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs text-accent-cyan">TRIP</p>
        <h1 className="mt-1 text-3xl font-semibold">
          {trip.origin?.name} → {trip.destination?.name}
        </h1>
        <p className="mt-2 text-sm text-ink-mute">
          {days} Days • {Math.max(0, days - 1)} Night · {inr(trip.budget)} Budget · {travelerLabel(trip.travelers)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => navigate(`/trips/${trip._id}/live`)}>Start Trip</Button>
        <Button variant="secondary" onClick={() => navigate(`/trips/${trip._id}/edit`)}>
          Edit
        </Button>
        <Button variant="secondary" onClick={onShare}>
          Share
        </Button>
        <Button variant="ghost" onClick={onMore}>
          More
        </Button>
      </div>
    </div>
  );
}
