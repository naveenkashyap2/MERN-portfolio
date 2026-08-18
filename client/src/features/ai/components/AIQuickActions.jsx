const ACTIONS = [
  { id: 'optimize', label: 'Optimize Trip' },
  { id: 'reduce', label: 'Reduce Cost' },
  { id: 'nearby', label: 'Find Nearby' },
  { id: 'hotel', label: 'Change Hotel' },
  { id: 'temple', label: 'Add Temple' },
  { id: 'gurudwara', label: 'Add Gurudwara' },
  { id: 'late', label: "I'm Late" },
  { id: 'replan', label: 'Replan' },
];

export default function AIQuickActions({ onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map((a) => (
        <button key={a.id} type="button" onClick={() => onPick(a)} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-ink-mute hover:text-ink">
          {a.label}
        </button>
      ))}
    </div>
  );
}
