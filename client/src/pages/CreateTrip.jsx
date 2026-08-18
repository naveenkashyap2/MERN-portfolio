import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Sparkles, MapPinned, Calendar, Users, Wallet, Loader2, Lock } from "lucide-react";
import { Button, Card, Input, Select } from "../components/UI";
import { INTERESTS, TRAVEL_STYLES } from "../constants";
import { useGenerateTrip } from "../hooks/useTrip";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function CreateTrip(){
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { generate, loading } = useGenerateTrip();
  const { isAuth } = useAuthStore();
  const [form, setForm] = useState({
    source: "Kanpur",
    destination: params.get("destination") || "Delhi",
    days: 2,
    travelers: 2,
    budget: 8000,
    budgetType: "total",
    travelStyle: "comfort",
    interests: ["Culture","Food"]
  });

  const toggleInterest = (i) => {
    setForm(f => ({...f, interests: f.interests.includes(i) ? f.interests.filter(x=>x!==i) : [...f.interests, i]}));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!isAuth) { toast.error("Login required — security ke liye mandatory hai"); nav("/login"); return; }
    try{
      const data = await generate(form);
      const trip = data.trip;
      if (trip && trip._id) nav(`/trip/${trip._id}`);
      else nav("/trip/preview", { state: { trip } });
      // also push to history stats (handled backend)
    }catch(err){
      if (err.response?.status===401) { toast.error("Session expired, login again"); nav("/login"); }
    }
  };

  if (!isAuth) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto"><Lock size={24} className="text-amber-600"/></div>
        <h2 className="display text-2xl font-bold mt-4">Login Required</h2>
        <p className="text-muted mt-2">Security ke liye YatraGenie me har trip ke liye login mandatory hai. Aapka data safe rahega.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/login"><Button size="lg">Login</Button></Link>
          <Link to="/signup"><Button variant="secondary" size="lg">Create Account</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="display text-3xl font-bold">Plan Your Dream Trip ✨</h1>
        <p className="text-muted mt-2">Kanpur → Delhi ya All India — <b className="text-charcoal">Train time, Highway, Flight best route + map + budget</b> 30 sec me</p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Source (Kahan se?)" value={form.source} onChange={e=>setForm({...form, source:e.target.value})} placeholder="Kanpur" required />
            <Input label="Destination (Kahan jana hai?)" value={form.destination} onChange={e=>setForm({...form, destination:e.target.value})} placeholder="Delhi, Goa, Jaipur..." required list="destList"/>
            <datalist id="destList">
              <option value="Goa"/><option value="Delhi"/><option value="Kanpur"/><option value="Manali"/><option value="Jaipur"/><option value="Kerala"/><option value="Varanasi"/><option value="Lucknow"/><option value="Ayodhya"/>
            </datalist>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Select label="Days" value={form.days} onChange={e=>setForm({...form, days: Number(e.target.value)})}>
              {[1,2,3,4,5,6,7,10].map(n=><option key={n} value={n}>{n} Days</option>)}
            </Select>
            <Select label="Travelers" value={form.travelers} onChange={e=>setForm({...form, travelers: Number(e.target.value)})}>
              {[1,2,3,4,5,6,8,10].map(n=><option key={n} value={n}>{n} {n===1?"Person":"People"}</option>)}
            </Select>
            <Input label="Budget (₹)" type="number" value={form.budget} onChange={e=>setForm({...form, budget: e.target.value})} min="1000" required />
            <Select label="Budget Type" value={form.budgetType} onChange={e=>setForm({...form, budgetType:e.target.value})}>
              <option value="total">Total Budget</option>
              <option value="per_person">Per Person</option>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Travel Style</label>
            <div className="grid sm:grid-cols-3 gap-3 mt-2">
              {TRAVEL_STYLES.map(s=>(
                <button key={s.id} type="button" onClick={()=>setForm({...form, travelStyle:s.id})} className={`p-4 rounded-2xl border-2 text-left transition ${form.travelStyle===s.id ? s.color + " border-current shadow-soft" : "bg-white border-border hover:border-gray-300"}`}>
                  <div className="text-lg">{s.icon}</div>
                  <p className="font-semibold text-sm mt-1">{s.label}</p>
                  <p className="text-xs opacity-80">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Interests (select 2-3)</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTERESTS.map(i=>(
                <button key={i} type="button" onClick={()=>toggleInterest(i)} className={`px-4 py-2 rounded-full text-sm border font-medium transition ${form.interests.includes(i) ? "bg-primary-600 text-white border-primary-600" : "bg-white border-border hover:bg-gray-50"}`}>{i}</button>
              ))}
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex gap-3">
            <span className="text-violet-600">✨</span>
            <p className="text-sm text-violet-900"><b>Kanpur → Delhi special:</b> Shram Shakti 23:55, Shatabdi 06:00 ke live timings + NH19 highway + flight — best option auto suggest hoga!</p>
          </div>

          <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" size={18}/> Gemini Soch Raha Hai... (8-12 sec)</> : <><Sparkles size={18}/> Generate My Trip with Gemini AI</>}
          </Button>
          <p className="text-center text-xs text-muted">🔐 Secure • Preview ke baad Live Tracker ON kar sakte ho</p>
        </form>
      </Card>

      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-center">
        <Card className="p-4"><p className="text-2xl">🛣️</p><p className="text-sm font-medium mt-1">All Routes</p><p className="text-xs text-muted">Highway / Train / Flight</p></Card>
        <Card className="p-4"><p className="text-2xl">📍</p><p className="text-sm font-medium mt-1">Live Map</p><p className="text-xs text-muted">All states + country</p></Card>
        <Card className="p-4"><p className="text-2xl">👣</p><p className="text-sm font-medium mt-1">Steps</p><p className="text-xs text-muted">Har kadam count</p></Card>
      </div>
    </div>
  );
}
