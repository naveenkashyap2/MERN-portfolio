import Badge from '../../../components/ui/Badge.jsx';

export default function DayItinerary({ day, items = [], onEdit, onRemove }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-accent-cyan">DAY {day}</h3>
      <ol className="relative space-y-4 border-l border-white/10 pl-6">
        {items.map((item) => (
          <li key={item._id} className="card p-4 transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-ink-mute">
                  {item.startTime} – {item.endTime} · {item.durationMinutes} min
                </p>
                <p className="mt-1 font-medium">{item.title}</p>
                <p className="text-sm text-ink-mute">{item.location}</p>
              </div>
              <Badge trust={item.trust} />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-mute">
              <span className="capitalize">{item.category}</span>
              {item.transportMode && <span>{item.transportMode}</span>}
              {item.estimatedCost ? <span>₹{item.estimatedCost}</span> : null}
            </div>
            <div className="mt-3 flex gap-3 text-xs">
              <button type="button" className="text-accent-cyan" onClick={() => onEdit?.(item)}>
                Edit
              </button>
              <button type="button" className="text-red-300" onClick={() => onRemove?.(item)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
