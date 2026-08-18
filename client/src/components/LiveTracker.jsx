import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import { Navigation, Footprints, Clock, MapPin, Play, Pause, RotateCcw } from "lucide-react";
import { Button, Card, Badge } from "./UI";
import toast from "react-hot-toast";

// haversine
const dist = (a,b) => {
  const R=6371;
  const dLat=(b.lat-a.lat)*Math.PI/180;
  const dLng=(b.lng-a.lng)*Math.PI/180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(s));
};

export default function LiveTracker({ onStats }) {
  const [pos, setPos] = useState(null);
  const [path, setPath] = useState([]);
  const [watching, setWatching] = useState(false);
  const [steps, setSteps] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [radius, setRadius] = useState(20); // 10 or 20
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState("");
  const watchId = useRef(null);
  const lastPos = useRef(null);

  const start = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setError(""); setWatching(true);
    // get once
    navigator.geolocation.getCurrentPosition(
      p => {
        const np = { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy, time: Date.now(), speed: p.coords.speed||0 };
        setPos(np); setPath([np]); lastPos.current = np;
        toast.success("Live tracking started 📍");
      },
      e => setError(e.message),
      { enableHighAccuracy: true }
    );
    watchId.current = navigator.geolocation.watchPosition(
      p => {
        const np = { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy, time: Date.now(), speed: p.coords.speed||0 };
        setPos(np);
        setPath(prev => {
          const last = prev[prev.length-1];
          if (last) {
            const d = dist(last, np);
            if (d < 0.005) return prev; // ignore <5m jitter
            const newKm = totalKm + d;
            setTotalKm(newKm);
            const newSteps = Math.round(newKm * 1300); // ~1300 steps/km avg
            setSteps(newSteps);
            if (onStats) onStats({ distanceKm: newKm, steps: newSteps });
          }
          return [...prev, np];
        });
        lastPos.current = np;
        setSpeed(p.coords.speed ? (p.coords.speed*3.6).toFixed(1) : 0);
      },
      e => setError(e.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const stop = () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    setWatching(false);
    toast("Tracking paused");
  };

  const reset = () => {
    stop();
    setPath([]); setTotalKm(0); setSteps(0); setPos(null); lastPos.current=null;
  };

  // Mock location for demo if permission denied or to show All India
  const useMock = () => {
    const kanpur = { lat: 26.4499, lng: 80.3319, acc: 12, time: Date.now(), speed: 0 };
    setPos(kanpur);
    setPath([kanpur, {lat:26.458, lng:80.35}, {lat:26.47, lng:80.36}]);
    setTotalKm(1.2); setSteps(1560);
    toast.success("Mock Kanpur location set — demo ke liye");
  };

  useEffect(()=>()=>{ if (watchId.current!==null) navigator.geolocation.clearWatch(watchId.current); },[]);

  const center = pos ? [pos.lat, pos.lng] : [26.4499, 80.3319]; // Kanpur default

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold flex items-center gap-2"><Navigation size={16} className="text-primary-600"/> Live Location Tracker</h3>
          <div className="flex gap-2">
            <Badge variant={watching?"primary":"default"}>{watching?"● LIVE":"Idle"}</Badge>
            <div className="flex bg-gray-100 rounded-full p-1 text-xs">
              <button onClick={()=>setRadius(10)} className={`px-3 py-1 rounded-full ${radius===10?"bg-white shadow font-semibold":""}`}>10km Local</button>
              <button onClick={()=>setRadius(20)} className={`px-3 py-1 rounded-full ${radius===20?"bg-white shadow font-semibold":""}`}>20km Local</button>
              <button onClick={()=>setRadius(500)} className={`px-3 py-1 rounded-full ${radius===500?"bg-white shadow font-semibold":""}`}>All India</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
            <p className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1"><Footprints size={12}/> Steps</p>
            <p className="text-xl font-extrabold text-charcoal mt-1">{steps.toLocaleString()}</p>
            <p className="text-[11px] text-muted">{(totalKm).toFixed(2)} km</p>
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3 text-center">
            <p className="text-xs text-violet-700 font-medium flex items-center justify-center gap-1"><Clock size={12}/> Duration</p>
            <p className="text-xl font-extrabold text-charcoal mt-1">{path.length ? `${Math.floor((Date.now()-path[0].time)/60000)}m` : "0m"}</p>
            <p className="text-[11px] text-muted">{speed} km/h</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
            <p className="text-xs text-amber-700 font-medium flex items-center justify-center gap-1"><MapPin size={12}/> Accuracy</p>
            <p className="text-xl font-extrabold text-charcoal mt-1">{pos ? `${Math.round(pos.acc)}m` : "--"}</p>
            <p className="text-[11px] text-muted">{radius===500?"All States":`±${radius}km`}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {!watching ? <Button onClick={start} className="flex-1"><Play size={16}/> Start Live Tracking</Button> : <Button onClick={stop} variant="secondary" className="flex-1 border-amber-200 bg-amber-50 text-amber-700"><Pause size={16}/> Pause</Button>}
          <Button variant="secondary" onClick={reset}><RotateCcw size={16}/> Reset</Button>
          <Button variant="ghost" onClick={useMock} className="text-xs">Demo Kanpur</Button>
        </div>
        {error && <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-100 rounded-xl p-2">{error} — Try Demo Kanpur or allow location permission.</p>}
        <p className="text-[11px] text-muted mt-2">• Har 10m pe update • Background me bhi (keep tab open) • All states & all country map support — zoom out to see India.</p>
      </Card>

      <div className="h-[420px] rounded-2xl overflow-hidden border shadow-soft">
        <MapContainer center={center} zoom={pos ? 15 : 11} style={{height:"100%", width:"100%"}} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OSM" />
          {pos && (
            <>
              <Marker position={[pos.lat, pos.lng]}>
                <Popup>आप यहाँ हैं 📍<br/>{pos.lat.toFixed(5)}, {pos.lng.toFixed(5)}<br/>Accuracy {Math.round(pos.acc)}m</Popup>
              </Marker>
              <Circle center={[pos.lat,pos.lng]} radius={pos.acc} pathOptions={{color:"#10b981", fillColor:"#10b981", fillOpacity:0.15}} />
              <Circle center={[pos.lat,pos.lng]} radius={radius*1000} pathOptions={{color:"#8b5cf6", fillColor:"transparent", dashArray:"6,10", weight:1}} />
            </>
          )}
          {path.length>1 && <Polyline positions={path.map(p=>[p.lat,p.lng])} color="#059669" weight={4} opacity={0.8} />}
        </MapContainer>
      </div>

      {path.length>1 && (
        <Card className="p-3">
          <p className="text-xs font-semibold">Path — {path.length} points • Total {totalKm.toFixed(2)} km • ~{steps} steps</p>
          <div className="mt-2 max-h-24 overflow-auto text-[11px] text-muted space-y-1">
            {path.slice(-8).map((p,i)=><div key={i}>{p.lat.toFixed(5)}, {p.lng.toFixed(5)} — {new Date(p.time).toLocaleTimeString()}</div>)}
          </div>
        </Card>
      )}
    </div>
  );
}
