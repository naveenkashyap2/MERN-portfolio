import { Compass } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center animate-float">
          <Compass size={24} className="text-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan animate-pulse-soft" />
      </div>
      <p className="text-sm text-muted">Loading your journey…</p>
    </div>
  );
}
