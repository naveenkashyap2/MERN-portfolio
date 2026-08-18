import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center animate-float">
          <Compass size={48} className="text-white" />
        </div>
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-warning animate-pulse-soft" />
      </div>
      <h1 className="text-4xl font-bold mt-8">404</h1>
      <h2 className="text-xl font-semibold text-body mt-2">Looks like you've taken a wrong turn.</h2>
      <p className="text-muted mt-2 max-w-sm">The page you're looking for doesn't exist — but your next adventure does.</p>
      <Button className="mt-8" icon={Compass} onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
}
