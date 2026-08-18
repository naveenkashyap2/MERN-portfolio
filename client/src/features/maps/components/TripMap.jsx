import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { pinIcon } from '../../../lib/leaflet.js';
import RoutePolyline from './RoutePolyline.jsx';
import UserMarker from './UserMarker.jsx';
import DestinationMarker from './DestinationMarker.jsx';

function Fit({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) map.fitBounds(points.map((p) => [p.lat, p.lng]), { padding: [28, 28] });
    else if (points[0]) map.setView([points[0].lat, points[0].lng], 12);
  }, [map, points]);
  return null;
}

export default function TripMap({ items = [], user, destination, className = 'h-72' }) {
  const points = items.filter((i) => i.lat != null);
  const center = points[0] || destination || user || { lat: 28.6139, lng: 77.209 };
  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 ${className}`}>
      <MapContainer center={[center.lat, center.lng]} zoom={11} className="h-full w-full" scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Fit points={[...points, user, destination].filter((p) => p?.lat != null)} />
        {points.map((p) => (
          <Marker key={`${p.lat}-${p.title}`} position={[p.lat, p.lng]} icon={pinIcon('#3B82F6')}>
            <Popup>{p.title || p.name}</Popup>
          </Marker>
        ))}
        <UserMarker position={user} />
        <DestinationMarker position={destination} label={destination?.name || 'Destination'} />
        <RoutePolyline points={points} />
      </MapContainer>
    </div>
  );
}
