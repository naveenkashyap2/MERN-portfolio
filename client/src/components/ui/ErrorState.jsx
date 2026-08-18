import { WifiOff, RefreshCw, ArrowLeft } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = "YatraGenie couldn't load this right now.", description, onRetry, onBack, icon: Icon = WifiOff }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-5">
        <Icon size={28} className="text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-body">{title}</h3>
      {description && <p className="text-sm text-muted mt-2">{description}</p>}
      <div className="flex gap-3 mt-6">
        {onRetry && (
          <Button variant="secondary" onClick={onRetry} icon={RefreshCw}>
            Try Again
          </Button>
        )}
        {onBack && (
          <Button variant="ghost" onClick={onBack} icon={ArrowLeft}>
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
