import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import MapView from "../components/MapView";
import { Button, Card, Badge, Skeleton } from "../components/UI";
import { Calendar, Wallet, Users, MapPinned, Utensils, Hotel, Clock, Share2, Bookmark, MessageCircle, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function TripDetail(){
  const { id } = useParams();
  const location = useLocation();
  const [trip, setTrip] = useState(location.state?.trip || null);
  const [loading, setLoading] = useState(!trip);
  const [activeDay, setActiveDay] = useState(1);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(()=>{
    if (id && id!=="preview") {
      setLoading(true);
      api.get(`/trips/${id}`).then(r=>{setTrip(r.data.data.trip); setLoading(false);}).catch(()=>setLoading(false));
    } else if (trip) setLoading(false);
  },[id]);

  const sendChat = async (e) => {
    e.preventDefault();
    if (!chatMsg.trim() || !trip?._id) return;
    const userQ = chatMsg;
    setChats(c=>[...c, {role:"user", text:userQ}]);
    setChatMsg("");
    setChatLoading(true);
    try{
      const res = await api.post(`/trips/chat/${trip._id}`, { message: userQ });
      setChats(c=>[...c, {role:"ai", text: res.data.data.reply}]);
    }catch{
      setChats(c=>[...c, {role:"ai", text:"AI busy hai, phir try karo."}]);
    }
    setChatLoading(false);
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-40"/><Skeleton className="h-96"/>
    </div>
  );
  if (!trip) return <div className="text-center py-16">Trip not found. <Link to="/create" className="text-primary-600 underline">Create one</Link></div>;

  const bb = trip.budgetBreakdown || {};
  const hotels = trip.hotels || [];
  const foods = trip.food || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-primary-600 to-emerald-500 rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"/>
        <div className="relative">
          <Badge className="bg-white/20 text-white border-white/20">✨ Generated via Gemini {trip.isMock ? "(Mock)" : ""}</Badge>
          <h1 className="display text-2xl sm:text-3xl font-bold mt-3">{trip.title}</h1>
          <p className="opacity-90 mt-2 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1"><MapPinned size={14}/> {trip.source} → {trip.destination}</span>
            <span className="flex items-center gap-1"><Calendar size={14}/> {trip.days} Days</span>
            <span className="flex items-center gap-1"><Users size={14}/> {trip.travelers} Travelers</span>
            <span className="flex items-center gap-1"><Wallet size={14}/> {trip.overview?.totalEstimatedCost || `₹${trip.budget}`}</span>
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm" onClick={()=>{navigator.clipboard.writeText(window.location.href); toast.success("Link copied!");}}><Share2 size={14}/> Share</Button>
            <Link to="/my-trips"><Button variant="secondary" size="sm"><Bookmark size={14}/> Saved</Button></Link>
          </div>
        </div>
      </div>

      {/* BUDGET BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
        <Card className="p-4 text-center"><p className="text-xs text-muted">Stay</p><p className="font-bold text-charcoal">{bb.stay||"₹--"}</p></Card>
        <Card className="p-4 text-center"><p className="text-xs text-muted">Food</p><p className="font-bold">{bb.food||"₹--"}</p></Card>
        <Card className="p-4 text-center"><p className="text-xs text-muted">Transport</p><p className="font-bold">{bb.transport||"₹--"}</p></Card>
        <Card className="p-4 text-center"><p className="text-xs text-muted">Activities</p><p className="font-bold">{bb.activities||"₹--"}</p></Card>
        <Card className="p-4 text-center bg-primary-600 text-white border-primary-600"><p className="text-xs opacity-80">Total</p><p className="font-bold">{bb.total || trip.overview?.totalEstimatedCost}</p></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* LEFT - ITINERARY */}
        <div className="lg:col-span-2 space-y-6">
          {/* MAP */}
          <Card className="p-3">
            <h3 className="font-semibold flex items-center gap-2 px-2 py-2"><MapPinned size={16} className="text-primary-600"/> Interactive Map</h3>
            <MapView center={trip.mapCenter} days={trip.itinerary} />
            <p className="text-xs text-muted px-2 pt-2">📍 Har pin ek jagah — click karo details ke liye. Blue dotted line aapka route hai.</p>
          </Card>

          {/* DAY TABS */}
          <div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(trip.itinerary||[]).map(d=>(
                <button key={d.day} onClick={()=>setActiveDay(d.day)} className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap border transition ${activeDay===d.day ? "bg-primary-600 text-white border-primary-600 shadow-soft" : "bg-white border-border hover:bg-gray-50"}`}>Day {d.day}</button>
              ))}
            </div>
            {(trip.itinerary||[]).filter(d=>d.day===activeDay).map(day=>(
              <Card key={day.day} className="p-5 mt-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{day.title}</h3>
                    <p className="text-xs text-muted mt-1">Theme: {day.theme} • <span className="text-primary-600 font-medium">{day.totalCost}</span></p>
                  </div>
                  <Badge variant="primary">Day {day.day}</Badge>
                </div>
                <div className="mt-4 space-y-4 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-200 to-amber-100 hidden sm:block"/>
                  {(day.places||[]).map((p, idx)=>(
                    <div key={idx} className="relative flex gap-4 bg-gray-50/70 rounded-2xl p-4 border border-border/50">
                      <div className="hidden sm:flex w-6 h-6 rounded-full bg-white border-2 border-primary-500 items-center justify-center flex-shrink-0 z-10 mt-1">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm">{p.name}</h4>
                          <Badge variant="default" className="text-[11px]">{p.category}</Badge>
                        </div>
                        <p className="text-sm text-muted mt-1 leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs">
                          <span className="bg-white border px-2.5 py-1 rounded-full flex items-center gap-1"><Clock size={12}/> {p.time} • {p.duration}</span>
                          <span className="bg-white border px-2.5 py-1 rounded-full font-medium">{p.cost}</span>
                          {p.tips && <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full">💡 {p.tips}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT - HOTELS & FOOD & CHAT */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Hotel size={16} className="text-violet-600"/> Hotels — 3 Options</h3>
            <div className="space-y-3 mt-3">
              {hotels.map((h,i)=>(
                <div key={i} className="p-3 rounded-xl border bg-gray-50/60">
                  <p className="font-medium text-sm">{h.name}</p>
                  <p className="text-xs text-muted">{h.area} • {h.rating}</p>
                  <p className="text-sm font-bold text-primary-600 mt-1">{h.pricePerNight} <span className="text-xs font-normal text-muted">/ night</span></p>
                  <p className="text-xs text-muted mt-1">Why: {h.why}</p>
                </div>
              ))}
              {hotels.length===0 && <p className="text-sm text-muted">No hotels data</p>}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold flex items-center gap-2"><Utensils size={16} className="text-amber-600"/> Local Food</h3>
            <div className="space-y-2 mt-3">
              {foods.map((f,i)=>(
                <div key={i} className="flex justify-between items-center p-3 rounded-xl border bg-white">
                  <div><p className="text-sm font-medium">{f.dish}</p><p className="text-xs text-muted">{f.where}</p></div>
                  <span className="text-sm font-semibold">{f.cost}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-sm">Overview</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p><b>Best Time:</b> {trip.overview?.bestTimeToVisit}</p>
              <p><b>Cuisine:</b> {trip.overview?.localCuisine?.join(", ")}</p>
              <p><b>Packing:</b> {trip.overview?.packingTips?.join(", ")}</p>
              <p className="text-muted leading-relaxed"><b className="text-charcoal">Transport:</b> {trip.overview?.transportTips}</p>
            </div>
          </Card>

          {/* AI CHAT */}
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-emerald-50">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><MessageCircle size={16} className="text-violet-600"/> Chat with Trip — Gemini</h3>
              <p className="text-xs text-muted">Puchho: “Isme adventure add karo” ya “budget kam karo”</p>
            </div>
            <div className="h-[280px] overflow-auto p-4 space-y-3 bg-gray-50/30">
              {chats.length===0 && <p className="text-xs text-muted text-center py-8">Try: “Vegetarian food options batao” <br/> “Solo travel safe hai?”</p>}
              {chats.map((c,i)=>(
                <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${c.role==="user" ? "bg-primary-600 text-white ml-auto rounded-br-sm" : "bg-white border shadow-soft rounded-bl-sm"}`}>{c.text}</div>
              ))}
              {chatLoading && <div className="bg-white border rounded-2xl px-3 py-2 text-sm animate-pulse">Gemini soch raha hai...</div>}
            </div>
            <form onSubmit={sendChat} className="p-3 border-t flex gap-2 bg-white">
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} placeholder="Ask Gemini..." className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"/>
              <Button type="submit" size="sm" disabled={chatLoading}><Send size={16}/></Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
