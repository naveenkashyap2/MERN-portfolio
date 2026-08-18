import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Planning your journey...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-mute" role="status">
      <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />
      {label}
    </div>
  );
}
