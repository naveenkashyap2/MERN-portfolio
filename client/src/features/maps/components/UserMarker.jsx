import { Marker } from 'react-leaflet';
import { pinIcon } from '../../../lib/leaflet.js';

export default function UserMarker({ position }) {
  if (!position) return null;
  return <Marker position={[position.lat, position.lng]} icon={pinIcon('#06B6D4')} />;
}
