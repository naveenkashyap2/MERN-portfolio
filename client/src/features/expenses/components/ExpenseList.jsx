import ExpenseCard from './ExpenseCard.jsx';

export default function ExpenseList({ items = [], onDelete }) {
  if (!items.length) return <p className="text-sm text-ink-mute">Start tracking your trip expenses.</p>;
  return (
    <div className="space-y-2">
      {items.map((e) => (
        <ExpenseCard key={e._id} expense={e} onDelete={onDelete} />
      ))}
    </div>
  );
}
