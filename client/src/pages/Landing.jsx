import { Link } from "react-router-dom";
import { MapPinned, Sparkles, Clock, Wallet, Utensils, Hotel, ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";
import { Button, Card, Badge } from "../components/UI";
import { DESTINATIONS } from "../constants";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}}>
              <Badge variant="primary" className="mb-4">✨ Powered by Gemini 2.0 Flash + Maps</Badge>
              <h1 className="display text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[0.95] tracking-tight text-charcoal">
                India ka <span className="text-primary-600">AI Trip</span> Planner
              </h1>
              <p className="mt-4 text-lg text-muted leading-relaxed max-w-xl">
                Budget bolo, <b className="text-charcoal">Gemini pura itinerary bana dega</b> — Hotels, khana, map, cost breakdown sab kuch. 30 sec me.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/create"><Button size="lg"><Sparkles size={18}/> Plan My Trip — Free</Button></Link>
                <Link to="/explore"><Button variant="secondary" size="lg">Explore Trips <ArrowRight size={16}/></Button></Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><ShieldCheck size={16} className="text-emerald-600"/></span> No login needed</span>
                <span className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Zap size={16} className="text-amber-600"/></span> 30 sec AI</span>
                <span className="flex items-center gap-2"><Star size={16} className="fill-amber-400 text-amber-400"/> 4.9/5</span>
              </div>

              <div className="mt-8 p-4 bg-white rounded-2xl border border-border shadow-soft flex items-center gap-3 max-w-md">
                <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=100&h=100&fit=crop" className="w-12 h-12 rounded-xl object-cover" alt="user"/>
                <div className="flex-1">
                  <p className="text-sm font-medium">“Goa ka 3-day plan 20 sec me mil gaya, map ke saath!”</p>
                  <p className="text-xs text-muted">— Priya, Delhi → Goa • ₹12,000</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.15}} className="relative">
              <div className="bg-white rounded-[24px] border border-border shadow-card p-3">
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop" alt="travel" className="w-full h-[340px] lg:h-[420px] object-cover rounded-2xl"/>
                <div className="absolute -left-2 sm:left-4 bottom-8 bg-white rounded-2xl shadow-card border p-4 w-[280px]">
                  <p className="text-xs font-semibold text-primary-700 flex items-center gap-1"><MapPinned size={12}/> Day 2 • Jaipur</p>
                  <p className="text-sm font-semibold mt-1">Hawa Mahal → Chokhi Dhani Dinner</p>
                  <p className="text-xs text-muted mt-1">9 AM • 2-3 hours • ₹350</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="primary">Culture</Badge><Badge>₹1,200/day</Badge>
                  </div>
                </div>
                <div className="absolute -right-2 sm:right-6 top-10 bg-charcoal text-white rounded-2xl p-3 shadow-xl">
                  <p className="text-xs opacity-80">Total Budget</p>
                  <p className="text-xl font-bold">₹18,500</p>
                  <p className="text-xs opacity-60">for 2 travelers • 3 days</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="display text-2xl font-bold">Trending Destinations</h2>
          <Link to="/explore" className="text-sm font-medium text-primary-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {DESTINATIONS.map(d=>(
            <Link key={d.name} to={`/create?destination=${d.name}`} className="group bg-white rounded-2xl border border-border p-4 text-center hover:shadow-card hover:border-primary-100 transition">
              <div className="text-2xl">{d.emoji}</div>
              <p className="font-semibold text-sm mt-2 group-hover:text-primary-600">{d.name}</p>
              <p className="text-xs text-muted">{d.tag}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="display text-3xl font-bold">Har cheez ek jagah</h2>
            <p className="text-muted mt-3">Gemini AI + Maps + Real Budget — Jo ab tak kisi trip planner me nahi tha</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {icon: Sparkles, title: "Gemini Itinerary", desc: "Day-wise plan with time, cost, tips — personalized to your budget & interests.", color:"bg-violet-50 text-violet-600"},
              {icon: MapPinned, title: "Live Interactive Map", desc: "Har jagah map pe pin, route line, click to see details. Leaflet + OSM.", color:"bg-emerald-50 text-emerald-600"},
              {icon: Wallet, title: "Smart Budget Split", desc: "Stay / Food / Transport / Activities me kharcha tod ke dikhaye, over-budget alert.", color:"bg-amber-50 text-amber-600"},
              {icon: Hotel, title: "Stay Suggestions", desc: "3 hotel options — Budget, Comfort, Luxury — with area & why to stay.", color:"bg-blue-50 text-blue-600"},
              {icon: Utensils, title: "Local Food", desc: "Har destination ke famous dishes + kahaan milega + cost.", color:"bg-rose-50 text-rose-600"},
              {icon: Clock, title: "Save & Share", desc: "Trip save karo, link se share karo, kabhi bhi wapas dekho.", color:"bg-teal-50 text-teal-600"},
            ].map(f=>(
              <Card key={f.title} className="p-6 hover:shadow-card transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color}`}><f.icon size={18}/></div>
                <h3 className="font-semibold mt-4">{f.title}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="display text-2xl font-bold text-center">Kaise kaam karta hai?</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {step:"01", title:"Details Bharo", desc:"Source, Destination, Days, Budget, Travel Style select karo — 20 sec"},
            {step:"02", title:"Gemini Magic ✨", desc:"Gemini 2.0 Flash pura itinerary, hotels, food, map ke saath generate karega"},
            {step:"03", title:"Save & Explore", desc:"Map pe dekho, budget check karo, doston ko share karo"},
          ].map(s=>(
            <div key={s.step} className="bg-white border rounded-2xl p-6">
              <span className="text-4xl font-extrabold text-gray-100">{s.step}</span>
              <h3 className="font-semibold mt-2">{s.title}</h3>
              <p className="text-sm text-muted mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/create"><Button size="lg">Abhi Try Karo — Free <ArrowRight size={16}/></Button></Link>
        </div>
      </section>
    </div>
  );
}
