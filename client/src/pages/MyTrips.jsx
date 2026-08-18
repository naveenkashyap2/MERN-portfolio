import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Card, Badge, Skeleton, EmptyState, Button } from "../components/UI";
import { Trash2, Eye, MapPinned } from "lucide-react";
import toast from "react-hot-toast";

export default function MyTrips(){
  const [trips,setTrips]=useState([]);
  const [loading,setLoading]=useState(true);
  const fetchT=async()=>{
    try{ const res=await api.get("/trips"); setTrips(res.data.data.trips);}catch{ toast.error("Login to see saved trips"); }
    setLoading(false);
  };
  useEffect(()=>{fetchT();},[]);
  const del=async(id)=>{
    if(!confirm("Delete this trip?")) return;
    try{ await api.delete(`/trips/${id}`); setTrips(t=>t.filter(x=>x._id!==id)); toast.success("Deleted");}catch{ toast.error("Failed");}
  };
  if(loading) return <div className="max-w-5xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-4">{[1,2,3,4].map(i=><Skeleton key={i} className="h-48"/>)}</div>;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="display text-3xl font-bold">My Trips</h1><p className="text-muted">Aapke saare saved itineraries</p></div>
        <Link to="/create"><Button>Create New</Button></Link>
      </div>
      {trips.length===0 ? <EmptyState icon="🧳" title="No saved trips" desc="Aapne abhi tak koi trip save nahi kiya. Ek naya plan banao!" action={<Link to="/create"><Button>Plan My First Trip</Button></Link>} /> : (
        <div className="grid sm:grid-cols-2 gap-6">
          {trips.map(t=>(
            <Card key={t._id} className="p-5 hover:shadow-card transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-sm text-muted flex items-center gap-1 mt-1"><MapPinned size={12}/> {t.source} → {t.destination} • {t.days} days</p>
                </div>
                <Badge>{t.travelStyle}</Badge>
              </div>
              <p className="text-sm text-muted mt-3 line-clamp-2">{t.overview?.transportTips?.slice(0,120)}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-bold text-primary-600">{t.budgetBreakdown?.total || `₹${t.budget}`}</span>
                <div className="flex gap-2">
                  <Link to={`/trip/${t._id}`}><Button size="sm" variant="secondary"><Eye size={14}/> View</Button></Link>
                  <Button size="sm" variant="ghost" onClick={()=>del(t._id)} className="text-red-600 hover:bg-red-50"><Trash2 size={14}/></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
