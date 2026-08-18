import { Polyline } from 'react-leaflet';

export default function RoutePolyline({ points = [] }) {
  if (points.length < 2) return null;
  return <Polyline positions={points.map((p) => [p.lat, p.lng])} pathOptions={{ color: '#3B82F6', weight: 4 }} />;
}
