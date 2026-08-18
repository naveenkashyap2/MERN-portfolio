import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Card, Badge, Skeleton, EmptyState, Button } from "../components/UI";
import { Search, MapPinned, Calendar, Wallet } from "lucide-react";

export default function Explore(){
  const [trips,setTrips]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState("");
  const [search,setSearch]=useState("");

  const fetchTrips=async(s="")=>{
    setLoading(true);
    try{ const res=await api.get(`/trips/public?search=${s}`); setTrips(res.data.data.trips);}catch{}
    setLoading(false);
  };
  useEffect(()=>{ fetchTrips(); },[]);
  const onSearch=(e)=>{
    e.preventDefault(); fetchTrips(q); setSearch(q);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="display text-3xl font-bold">Explore Trips</h1>
          <p className="text-muted mt-1">Community ke banaye hue best itineraries — Gemini powered</p>
        </div>
        <form onSubmit={onSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search size={16} className="absolute left-3 top-3 text-muted"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Goa, Jaipur, Kerala..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary-100 text-sm"/>
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i=><Skeleton key={i} className="h-56"/>)}</div>
      ) : trips.length===0 ? (
        <EmptyState icon="🗺️" title={search?`No trips for "${search}"`:"No trips yet"} desc="Be the first to create an AI itinerary and it will appear here." action={<Link to="/create"><Button>Create Trip</Button></Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(t=>(
            <Link key={t._id} to={`/trip/${t._id}`} className="group">
              <Card className="overflow-hidden hover:shadow-card transition p-0">
                <div className="h-44 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                  <img src={`https://source.unsplash.com/600x400/?${encodeURIComponent(t.destination)},travel`} alt={t.destination} className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition duration-500" onError={(e)=>e.target.style.display='none'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold">{t.title}</h3>
                    <p className="text-xs opacity-90 flex items-center gap-1"><MapPinned size={12}/> {t.source} → {t.destination}</p>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-white text-charcoal">{t.travelStyle}</Badge>
                </div>
                <div className="p-4">
                  <div className="flex gap-2 text-xs text-muted">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {t.days} Days</span>
                    <span>•</span><span className="flex items-center gap-1"><Wallet size={12}/> {t.budgetBreakdown?.total || `₹${t.budget}`}</span>
                    <span>•</span><span>👁️ {t.views||0}</span>
                  </div>
                  <p className="text-xs text-muted mt-2 line-clamp-2">{t.overview?.transportTips || `${t.destination} ka best AI plan`}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
