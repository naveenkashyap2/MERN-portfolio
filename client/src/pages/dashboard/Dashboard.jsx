import { Link, useNavigate } from 'react-router-dom';
import { Map, Compass, Hotel, Train, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTrips } from '../../features/trips/hooks/useTrips.js';
import TripCard from '../../features/trips/components/TripCard.jsx';
import Button from '../../components/ui/Button.jsx';

const hour = new Date().getHours();
const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

const actions = [
  { to: '/plan', label: 'Plan Trip', icon: Map },
  { to: '/nearby', label: 'Explore Nearby', icon: Compass },
  { to: '/hotels', label: 'Find Hotels', icon: Hotel },
  { to: '/transport', label: 'Find Transport', icon: Train },
  { to: '/assistant', label: 'Ask AI', icon: Sparkles },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data } = useTrips({ limit: 4 });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold">
        {hello}, {user?.name?.split(' ')[0] || 'traveler'} 👋
      </h1>
      <p className="mt-2 text-ink-mute">Where are we going next?</p>
      <Button className="mt-6" onClick={() => navigate('/plan')}>
        Plan My Trip
      </Button>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.to} to={a.to} className="card p-4 hover:border-accent/40">
              <Icon className="h-4 w-4 text-accent-cyan" />
              <p className="mt-3 text-sm font-medium">{a.label}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="mt-10 text-lg font-semibold">Recent trips</h2>
      <div className="mt-4 grid gap-4">
        {data?.items?.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
        {!data?.items?.length && <p className="text-sm text-ink-mute">Nothing here yet.</p>}
      </div>
    </DashboardLayout>
  );
}
