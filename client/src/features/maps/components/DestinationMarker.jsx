import { Marker, Popup } from 'react-leaflet';
import { pinIcon } from '../../../lib/leaflet.js';

export default function DestinationMarker({ position, label }) {
  if (!position) return null;
  return (
    <Marker position={[position.lat, position.lng]} icon={pinIcon('#22C55E')}>
      <Popup>{label}</Popup>
    </Marker>
  );
}
