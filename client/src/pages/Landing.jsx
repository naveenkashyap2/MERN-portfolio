import { Link } from "react-router-dom";
import { MapPinned, Sparkles, Clock, Wallet, Utensils, Hotel, ArrowRight, Star, ShieldCheck, Zap, Navigation, Mic, Crown, Globe2, Footprints, Lock } from "lucide-react";
import { Button, Card, Badge } from "../components/UI";
import { DESTINATIONS } from "../constants";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="overflow-hidden bg-background">
      {/* HERO - Premium */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-violet-50/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 lg:pt-14 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{opacity:0, y:24}} animate={{opacity:1, y:0}} transition={{duration:0.7}}>
              <div className="inline-flex items-center gap-2 bg-white border border-primary-100 rounded-full px-3.5 py-1.5 shadow-soft text-xs font-medium text-primary-700">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live Location Tracker + Voice Assistant • 4 Languages
              </div>
              <h1 className="display text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[0.95] tracking-tight text-charcoal mt-4">
                Har Yatra,<br/> <span className="bg-gradient-to-r from-primary-600 to-emerald-500 bg-clip-text text-transparent">AI Ke Saath</span><br/>Free.
              </h1>
              <p className="mt-4 text-lg text-muted leading-relaxed max-w-xl">
                Kanpur se Delhi ya Kashmir se Kanyakumari — <b className="text-charcoal">Train, Highway, Flight ka best route</b>, live tracking, hotel-food-map sab ek hi plan me. Dekhte hi book karne ka mann kare.
              </p>
              
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/create"><Button size="lg" className="shadow-lg shadow-primary-600/20"><Sparkles size={18}/> Plan My Trip — Free</Button></Link>
                <Link to="/live"><Button variant="secondary" size="lg"><Navigation size={16}/> Live Tracker</Button></Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white rounded-2xl border border-border p-3 flex flex-col items-center text-center">
                  <span className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Lock size={16}/></span>
                  <p className="text-xs font-semibold mt-2">100% Secure</p><p className="text-[11px] text-muted leading-none">Login Mandatory</p>
                </div>
                <div className="bg-white rounded-2xl border border-border p-3 flex flex-col items-center text-center">
                  <span className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600"><Mic size={16}/></span>
                  <p className="text-xs font-semibold mt-2">Voice AI</p><p className="text-[11px] text-muted leading-none">Hindi • English • मराठी • ಕನ್ನಡ</p>
                </div>
                <div className="bg-white rounded-2xl border border-border p-3 flex flex-col items-center text-center">
                  <span className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><Navigation size={16}/></span>
                  <p className="text-xs font-semibold mt-2">Live Tracker</p><p className="text-[11px] text-muted leading-none">Har kadam pe</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 text-sm">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i=><img key={i} src={`https://i.pravatar.cc/100?img=${10+i}`} className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="user"/>)}
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1 font-semibold"><Star size={12} className="fill-amber-400 text-amber-400"/> 4.9/5 (2,400+ yatris)</div>
                  <p className="text-muted">Kanpur ke 500+ log already use kar rahe hai</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20, scale:0.97}} animate={{opacity:1, y:0, scale:1}} transition={{duration:0.7, delay:0.15}} className="relative">
              <div className="bg-white rounded-[28px] border border-border shadow-card p-3">
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=650&fit=crop" alt="travel" className="w-full h-[380px] lg:h-[460px] object-cover rounded-[20px]"/>
                {/* Floating Cards */}
                <motion.div initial={{x:20, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:0.5}} className="absolute -left-2 sm:left-2 bottom-10 bg-white rounded-2xl shadow-card border p-4 w-[300px]">
                  <p className="text-xs font-semibold text-primary-700 flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Live Tracking • Kanpur → Delhi</p>
                  <p className="text-sm font-bold mt-1">Shram Shakti Express • 12451</p>
                  <p className="text-xs text-muted">Kanpur Central 23:55 → New Delhi 06:10 • 6h 15m</p>
                  <div className="mt-2 flex gap-2 text-[11px]">
                    <Badge variant="primary">Highway NH19 440km</Badge><Badge>Train 6h</Badge>
                  </div>
                  <div className="mt-2 bg-gray-50 rounded-xl p-2 flex items-center gap-2">
                    <Footprints size={14} className="text-primary-600"/><span className="text-xs font-medium">1,248 steps • 0.9 km walked</span><span className="ml-auto text-xs text-emerald-600 font-semibold">Live</span>
                  </div>
                </motion.div>
                <motion.div initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.7}} className="absolute -right-2 sm:right-4 top-8 bg-charcoal text-white rounded-2xl p-3.5 shadow-xl min-w-[160px]">
                  <p className="text-xs opacity-70 flex items-center gap-1"><Sparkles size={12} className="text-emerald-300"/> Free Forever</p>
                  <p className="text-xl font-bold">100% Free</p>
                  <p className="text-xs opacity-60">No payment • No limits</p>
                  <div className="mt-2 flex gap-1">
                    <span className="w-6 h-1.5 bg-white rounded-full"></span><span className="w-3 h-1.5 bg-white/40 rounded-full"></span>
                  </div>
                </motion.div>
                {/* Voice pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex w-20 h-20 bg-white/90 backdrop-blur rounded-full items-center justify-center shadow-xl border">
                  <span className="absolute w-full h-full rounded-full bg-primary-500/20 animate-ping"></span>
                  <Mic size={22} className="text-primary-600 relative"/>
                </div>
              </div>
              {/* Bottom stats */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-white border rounded-2xl p-2.5 text-center"><p className="text-lg font-bold text-charcoal">20km</p><p className="text-[11px] text-muted">Local Trips Live</p></div>
                <div className="bg-white border rounded-2xl p-2.5 text-center"><p className="text-lg font-bold text-charcoal">10km</p><p className="text-[11px] text-muted">City Tracker</p></div>
                <div className="bg-primary-600 text-white rounded-2xl p-2.5 text-center"><p className="text-lg font-bold">All India</p><p className="text-[11px] opacity-80">All States</p></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-4 sm:gap-8 items-center justify-center text-xs text-muted">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500"/> Secure Login & Google Auth</span>
          <span className="w-1 h-1 bg-border rounded-full hidden sm:block"/>
          <span className="flex items-center gap-1.5"><Globe2 size={14} className="text-violet-500"/> All India + All States</span>
          <span className="w-1 h-1 bg-border rounded-full hidden sm:block"/>
          <span className="flex items-center gap-1.5"><Navigation size={14} className="text-primary-500"/> Live 20km / 10km + Steps</span>
          <span className="w-1 h-1 bg-border rounded-full hidden sm:block"/>
          <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500"/> 100% Free Forever</span>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="display text-2xl font-bold">Trending Destinations</h2>
            <p className="text-sm text-muted">Uttar Pradesh se Kerala tak — sab cover</p>
          </div>
          <Link to="/explore" className="text-sm font-medium text-primary-600 hover:underline hidden sm:block">View all →</Link>
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

      {/* FEATURES - Premium */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="primary" className="mb-3">✨ Kanpur to Kanyakumari — Sab ek jagah</Badge>
            <h2 className="display text-3xl font-bold">Socho Mat, Nikal Pado</h2>
            <p className="text-muted mt-3">Train ke time se leke highway ke dhabo tak — Gemini aapka personal travel concierge hai, jo har kadam track karta hai</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {icon: Navigation, title: "Live Location Tracker", desc: "Chalte-chalte map pe dekho kaha ho — 20km, 10km local bhi. Har step count hota hai. Background me bhi tracking.", color:"bg-emerald-50 text-emerald-600", badge:"Live"},
              {icon: Clock, title: "Highway vs Train vs Flight", desc: "Kanpur → Delhi: NH19 440km 6h vs Shram Shakti 23:55 vs Flight 1h. Sab ka time, cost, best option.", color:"bg-blue-50 text-blue-600", badge:"All Routes"},
              {icon: Mic, title: "Bolo-To-Karo Voice AI", desc: "‘Delhi ka mausam kaisa hai?’ Hindi, English, मराठी, ಕನ್ನಡ me bolo — AI turant jawab dega aur kaam bhi karega.", color:"bg-violet-50 text-violet-600", badge:"4 Languages"},
              {icon: Hotel, title: "Stay + Food + Budget Wow", desc: "Har budget me 3 hotel, local khana aur har rupee ka hisab — style ke hisab se (Budget/Comfort/Luxury).", color:"bg-amber-50 text-amber-600", badge:"₹ Split"},
              {icon: Wallet, title: "100% Free & Unlimited", desc: "Kitne bhi trips banao — no payment, no limits. Sab features free.", color:"bg-rose-50 text-rose-600", badge:"Free"},
              {icon: Utensils, title: "History & Profile", desc: "Kaha gaye, kitna chale, kab gaye — poori history. Profile me photo lagao, free badge dikhao.", color:"bg-teal-50 text-teal-600", badge:"Timeline"},
            ].map(f=>(
              <Card key={f.title} className="p-6 hover:shadow-card transition relative overflow-hidden group">
                {f.badge && <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider bg-charcoal text-white px-2 py-1 rounded-full">{f.badge}</span>}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color} group-hover:scale-110 transition`}><f.icon size={20}/></div>
                <h3 className="font-semibold mt-4">{f.title}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-charcoal text-white rounded-[24px] mx-4 sm:mx-6 lg:mx-8 mb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <h2 className="display text-2xl font-bold text-center">Kaise kaam karta hai? 3 Step Me</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {step:"01", title:"Secure Login", desc:"Google se ya email se login — bina login kuch nahi. Security first.", icon: Lock},
              {step:"02", title:"Bolo & Generate", desc:"‘Kanpur to Delhi 2 din, ₹8000’ bolo ya type karo — Gemini + Maps turant route, train time, hotel, budget de dega.", icon: Sparkles},
              {step:"03", title:"Live Niklo", desc:"Live tracker ON karo, chalte jao — har 10m update, steps, history auto save. 20km local bhi.", icon: Navigation},
            ].map(s=>(
              <div key={s.step} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                <span className="text-3xl font-extrabold text-white/20">{s.step}</span>
                <h3 className="font-semibold mt-2 flex items-center gap-2"><s.icon size={16}/> {s.title}</h3>
                <p className="text-sm opacity-80 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/signup"><Button size="lg" className="bg-white text-charcoal hover:bg-gray-100">Create Account — Free <ArrowRight size={16}/></Button></Link>
            <Link to="/login"><Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10">Login</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
