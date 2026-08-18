import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, MapPinned, Calendar, Users, Wallet, Loader2 } from "lucide-react";
import { Button, Card, Input, Select } from "../components/UI";
import { INTERESTS, TRAVEL_STYLES } from "../constants";
import { useGenerateTrip } from "../hooks/useTrip";

export default function CreateTrip(){
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { generate, loading } = useGenerateTrip();
  const [form, setForm] = useState({
    source: "Delhi",
    destination: params.get("destination") || "Goa",
    days: 3,
    travelers: 2,
    budget: 15000,
    budgetType: "total",
    travelStyle: "comfort",
    interests: ["Nature","Food"]
  });

  const toggleInterest = (i) => {
    setForm(f => ({...f, interests: f.interests.includes(i) ? f.interests.filter(x=>x!==i) : [...f.interests, i]}));
  };

  const submit = async (e) => {
    e.preventDefault();
    try{
      const data = await generate(form);
      const trip = data.trip;
      if (trip && trip._id) nav(`/trip/${trip._id}`);
      else nav("/trip/preview", { state: { trip } });
    }catch{}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="display text-3xl font-bold">Plan Your Dream Trip ✨</h1>
        <p className="text-muted mt-2">Batao kahan jana hai — <b className="text-charcoal">Gemini 30 sec me pura plan bana dega</b> with map & budget</p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Source (Kahan se?)" value={form.source} onChange={e=>setForm({...form, source:e.target.value})} placeholder="Delhi" required />
            <Input label="Destination (Kahan jana hai?)" value={form.destination} onChange={e=>setForm({...form, destination:e.target.value})} placeholder="Goa, Manali, Jaipur..." required list="destList"/>
            <datalist id="destList">
              <option value="Goa"/><option value="Manali"/><option value="Jaipur"/><option value="Kerala"/><option value="Leh Ladakh"/><option value="Udaipur"/><option value="Varanasi"/><option value="Darjeeling"/>
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

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <span className="text-amber-600">💡</span>
            <p className="text-sm text-amber-800"><b>Pro Tip:</b> Budget me hi hotels + food + activities sab include hai. Gemini aapke budget ke hisaab se hi suggestions dega — budget me raho!</p>
          </div>

          <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" size={18}/> Gemini Soch Raha Hai... (15-20 sec)</> : <><Sparkles size={18}/> Generate My Trip with Gemini AI</>}
          </Button>
          <p className="text-center text-xs text-muted">Powered by Gemini 2.0 Flash • No login required • Free</p>
        </form>
      </Card>

      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-center">
        <Card className="p-4"><p className="text-2xl">⚡</p><p className="text-sm font-medium mt-1">30 Sec Me Plan</p><p className="text-xs text-muted">No waiting</p></Card>
        <Card className="p-4"><p className="text-2xl">🗺️</p><p className="text-sm font-medium mt-1">Map Ke Saath</p><p className="text-xs text-muted">Interactive pins</p></Card>
        <Card className="p-4"><p className="text-2xl">💰</p><p className="text-sm font-medium mt-1">Budget Perfect</p><p className="text-xs text-muted">Har rupee ka hisab</p></Card>
      </div>
    </div>
  );
}
