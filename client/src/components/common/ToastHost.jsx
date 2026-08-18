import { useEffect, useState } from 'react';
import { subscribeToasts } from '../../store/ui.store.js';

const tone = {
  success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100',
  error: 'border-red-500/30 bg-red-500/15 text-red-100',
  warning: 'border-amber-500/30 bg-amber-500/15 text-amber-100',
  info: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-100',
};

export default function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => subscribeToasts(setItems), []);
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[70] flex w-[min(100%-2rem,360px)] flex-col gap-2 sm:bottom-6">
      {items.map((t) => (
        <div key={t.id} className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-card ${tone[t.type] || tone.info}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
