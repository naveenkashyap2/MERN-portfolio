export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map((tab) => {
        const id = tab.id || tab;
        const label = tab.label || tab;
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active ? 'bg-accent text-white' : 'bg-white/5 text-ink-mute hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
