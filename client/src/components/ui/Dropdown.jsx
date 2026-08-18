import { useState } from 'react';

export default function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 z-30 mt-2 min-w-44 rounded-lg border border-white/10 bg-bg-elevated p-1 shadow-card">
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}
