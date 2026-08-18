import LiveTracker from "../components/LiveTracker";
import { useState } from "react";
import api from "../services/api";

export default function Live(){
  const [last, setLast] = useState(null);
  const onStats = async ({ distanceKm, steps }) => {
    if (distanceKm - (last?.distanceKm||0) > 0.5) {
      setLast({distanceKm, steps});
      try{
        await api.post("/auth/history", { destination: "Live Walk", from: "Current", days: 1, distanceKm: 0.5, steps: Math.round(0.5*1300) });
      }catch{}
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="display text-3xl font-bold">Live Tracker</h1>
        <p className="text-muted">20km / 10km local ya All India — har kadam live. Kanpur ho ya Delhi, sab dikhega.</p>
      </div>
      <LiveTracker onStats={onStats} />
    </div>
  );
}
