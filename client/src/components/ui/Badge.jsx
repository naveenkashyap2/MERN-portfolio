import { trustTone } from '../../utils/formatters.js';

export default function Badge({ children, trust, className = '' }) {
  const tone = trust ? trustTone(trust) : 'bg-white/5 text-ink-mute border-white/10';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tone} ${className}`}>
      {children || trust}
    </span>
  );
}
