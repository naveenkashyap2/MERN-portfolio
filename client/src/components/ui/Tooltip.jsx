export default function Tooltip({ label, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-bg-elevated px-2 py-1 text-[11px] text-ink opacity-0 shadow-card transition group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
