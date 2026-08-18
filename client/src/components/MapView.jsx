import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const colors = ["#059669","#f59e0b","#8b5cf6","#ef4444","#06b6d4"];

export default function MapView({ center, days }) {
  if (!center || !center.lat) return <div className="h-[320px] bg-gray-50 rounded-2xl flex items-center justify-center text-muted text-sm">Map will appear after itinerary</div>;
  
  const allPlaces = days?.flatMap((d,i) => d.places.map(p => ({...p, day: d.day, color: colors[i%colors.length]}))) || [];
  const positions = allPlaces.filter(p=>p.lat && p.lng).map(p=>[p.lat,p.lng]);

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-border shadow-soft">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{height:"100%", width:"100%"}} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.length > 1 && <Polyline positions={positions} color="#059669" weight={3} opacity={0.6} dashArray="6,8" />}
        {allPlaces.map((p, idx) => (
          p.lat && p.lng ? (
            <Marker key={idx} position={[p.lat, p.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500">Day {p.day} • {p.time}</p>
                  <p className="text-xs mt-1">{p.cost}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
