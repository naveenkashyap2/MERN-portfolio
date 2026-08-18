import TransportCard from './TransportCard.jsx';
import { formatKm, formatMins } from '../../../utils/formatters.js';

export default function WalkingRoute({ route }) {
  if (!route) return null;
  return (
    <TransportCard
      title="Walking"
      subtitle={route.notes}
      duration={formatMins(route.durationMinutes)}
      fare={formatKm(route.distanceKm)}
      trust={route.trust}
    />
  );
}
