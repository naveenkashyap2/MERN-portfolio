import DayItinerary from './DayItinerary.jsx';
import { groupByDay } from '../trip.utils.js';

export default function TripTimeline({ items, onEdit, onRemove }) {
  const days = groupByDay(items);
  if (!days.length) return <p className="text-sm text-ink-mute">Nothing here yet. Generate a plan first.</p>;
  return (
    <div className="space-y-10">
      {days.map(([day, list]) => (
        <DayItinerary key={day} day={day} items={list} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </div>
  );
}
