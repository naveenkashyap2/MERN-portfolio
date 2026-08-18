import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, MapPin, Wallet, CalendarDays, Users, Train, Bus, Car, Footprints,
  Building2, IndianRupee, Crown, Route, Bot, Compass, Heart, Star, ChevronDown, ShieldCheck, Zap, LineChart, Landmark,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import MapCanvas from '../components/maps/MapCanvas';
import { imageFor } from '../constants/images';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const HERO_MARKERS = [
  { id: 'delhi', lat: 28.6139, lng: 77.209, label: 'Delhi', color: '#3B82F6' },
  { id: 'agra', lat: 27.1767, lng: 78.0081, label: 'Agra', color: '#06B6D4' },
  { id: 'jaipur', lat: 26.9124, lng: 75.7873, label: 'Jaipur', color: '#22C55E' },
];

const HERO_ROUTE = [
  { lat: 28.6139, lng: 77.209 },
  { lat: 27.5, lng: 77.6 },
  { lat: 27.1767, lng: 78.0081 },
  { lat: 27.0, lng: 76.9 },
  { lat: 26.9124, lng: 75.7873 },
];

const STEPS = [
  { icon: MapPin, title: 'Tell us your plan', text: 'Origin, destination, dates, budget and preferences — or just type it in Hindi/Hinglish.' },
  { icon: Sparkles, title: 'AI builds your trip', text: 'YatraGenie designs a day-wise itinerary, routes, stays and a full budget breakdown.' },
  { icon: Route, title: 'Travel with live help', text: 'Track your journey, get walking directions, arrival alerts and instant AI replanning.' },
];

const FEATURES = [
  { icon: Sparkles, title: 'AI Trip Planning', text: 'A complete itinerary from a simple sentence or form.' },
  { icon: LineChart, title: 'Budget Intelligence', text: 'Smart cost estimates and an expense tracker per trip.' },
  { icon: Bot, title: 'AI Assistant', text: 'Ask anything — reduce cost, find nearby, or replan on the go.' },
  { icon: Route, title: 'Route & Walking', text: 'Optimised routes with walking mode and arrival detection.' },
  { icon: Train, title: 'Transport', text: 'Train, bus and car comparisons for your corridor.' },
  { icon: Building2, title: 'Hotels', text: 'Budget, medium and premium stays ranked for you.' },
  { icon: Landmark, title: 'Spiritual Travel', text: 'Temples, gurudwaras and sacred experiences across India.' },
  { icon: ShieldCheck, title: 'Private & Secure', text: 'Location tracking only with consent. Your data stays yours.' },
];

const DESTINATIONS = [
  { slug: 'agra-taj', city: 'Agra', label: 'Taj Mahal', tag: 'UNESCO' },
  { slug: 'jaipur', city: 'Jaipur', label: 'Pink City', tag: 'Heritage' },
  { slug: 'delhi', city: 'Delhi', label: 'Capital City', tag: 'Culture' },
  { slug: 'varanasi', city: 'Varanasi', label: 'Spiritual', tag: 'Ghats' },
  { slug: 'amritsar', city: 'Amritsar', label: 'Golden Temple', tag: 'Sacred' },
];

const TESTIMONIALS = [
  { name: 'Ananya S.', city: 'Bengaluru', text: 'Planned a 3-day Jaipur trip in under a minute. The budget breakdown was spot on.' },
  { name: 'Rohit M.', city: 'Delhi', text: 'The walking mode and arrival alerts made my city trip feel effortless.' },
  { name: 'Simran K.', city: 'Pune', text: 'Asked AI for a temple-focused Amritsar trip — it nailed every stop.' },
];

const FAQS = [
  { q: 'How does YatraGenie plan my trip?', a: 'Tell us your origin, destination, dates, budget and interests. Our AI designs a day-wise itinerary with places, routes, stays and a budget breakdown — in seconds.' },
  { q: 'Are train, bus and hotel prices accurate?', a: 'AI-generated prices and schedules are estimates, clearly labelled as such. Live availability is shown only when a verified provider is connected — we never fake live data.' },
  { q: 'Can I plan a trip within one city?', a: 'Yes. Local and same-city trips are fully supported, including walking routes of 1 km to 10 km or more.' },
  { q: 'Is my location tracked automatically?', a: 'Never. Location tracking is off by default and only starts after you explicitly enable it for Live Trip mode.' },
  { q: 'Is my data private?', a: 'Yes. Trips, expenses, conversations and location history are private to your account, and you can delete your location history or your whole account anytime.' },
];

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan mb-3">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h2>
      {sub && <p className="text-muted mt-4 text-base">{sub}</p>}
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-10 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge tone="ai" icon={Sparkles} label="AI-powered · Made for India" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-[40px] sm:text-[52px] lg:text-[56px] font-bold leading-[1.05] tracking-tight"
          >
            Your Journey.
            <br />
            <span className="text-gradient">Planned by AI.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 text-lg text-muted max-w-lg"
          >
            Create intelligent India trips with AI-powered itineraries, routes, stays, budgets and real-time trip assistance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button size="lg" icon={Sparkles} onClick={() => navigate('/plan')}>
              Plan My Trip
            </Button>
            <Button size="lg" variant="secondary" iconRight={ArrowRight} onClick={() => navigate('/explore')}>
              Explore Destinations
            </Button>
          </motion.div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-success" /> Consent-first tracking</span>
            <span className="flex items-center gap-2"><Zap size={16} className="text-warning" /> No fake live data</span>
          </div>
        </div>

        <HeroMap />
      </div>
    </section>
  );
}

function HeroMap() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative"
    >
      <div className="absolute -inset-6 bg-hero-radial rounded-[36px] -z-10" />
      <div className="glass rounded-3xl p-4 sm:p-5 shadow-card">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-soft" />
            <span className="text-xs font-medium text-body">Golden Triangle · AI Optimized</span>
          </div>
          <Badge tone="ai" label="AI Optimized" />
        </div>
        <MapCanvas markers={HERO_MARKERS} routePoints={HERO_ROUTE} height={360} label="Delhi → Agra → Jaipur route preview" />
        <div className="grid grid-cols-3 gap-2.5 mt-3">
          <HeroFloat icon={Wallet} label="₹5,000" sub="Budget" />
          <HeroFloat icon={CalendarDays} label="2 Days" sub="Duration" />
          <HeroFloat icon={Sparkles} label="AI" sub="Optimized" />
        </div>
      </div>
    </motion.div>
  );
}

function HeroFloat({ icon: Icon, label, sub }) {
  return (
    <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-brand-400" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-body leading-none">{label}</p>
        <p className="text-[11px] text-muted mt-1">{sub}</p>
      </div>
    </div>
  );
}

function PlannerDemo() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16">
      <div className="gradient-border rounded-3xl bg-ink-900/70 p-6 sm:p-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Plan your next journey</h2>
            <p className="text-muted mt-1 text-sm">From → To → Dates → Budget → Trip. Done.</p>
          </div>
          <Badge tone="ai" icon={Sparkles} label="AI Planner" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DemoField icon={MapPin} label="From" value="Delhi" />
          <DemoField icon={MapPin} label="To" value="Agra" />
          <DemoField icon={CalendarDays} label="Dates" value="2 days" />
          <DemoField icon={Wallet} label="Budget" value="₹5,000" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted mb-2">Transport</p>
            <div className="flex gap-2 flex-wrap">
              {[{ icon: Train, l: 'Train' }, { icon: Bus, l: 'Bus' }, { icon: Car, l: 'Car' }, { icon: Footprints, l: 'Walking' }].map(({ icon: I, l }) => (
                <span key={l} className="flex items-center gap-1.5 text-xs text-muted bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 hover:border-brand-500/40 hover:text-body transition-colors cursor-pointer">
                  <I size={14} /> {l}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted mb-2">Hotel</p>
            <div className="flex gap-2 flex-wrap">
              {[{ icon: IndianRupee, l: 'Budget' }, { icon: Building2, l: 'Medium' }, { icon: Crown, l: 'Premium' }].map(({ icon: I, l }) => (
                <span key={l} className="flex items-center gap-1.5 text-xs text-muted bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 hover:border-brand-500/40 hover:text-body transition-colors cursor-pointer">
                  <I size={14} /> {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted mb-2">Interests</p>
          <div className="flex gap-2 flex-wrap">
            {['Temple', 'Gurudwara', 'Nature', 'Food', 'Adventure', 'History'].map((i) => (
              <span key={i} className="text-xs text-muted bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 hover:border-cyan/40 hover:text-body transition-colors cursor-pointer">{i}</span>
            ))}
          </div>
        </div>

        <Button size="lg" icon={Sparkles} className="mt-8 w-full sm:w-auto" onClick={() => navigate('/plan')}>
          Generate My Trip ✨
        </Button>

        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <p className="text-sm font-medium text-body mb-2.5">Or just tell YatraGenie what you want…</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Delhi se Agra 2 din ke liye jana hai, budget 5000, Taj Mahal aur temples dekhne hain…"
              className="flex-1 h-12 rounded-xl bg-ink-800/70 border border-white/10 px-4 text-sm text-body placeholder:text-muted/60 focus:border-cyan/60 transition-colors"
            />
            <Button icon={Bot} className="h-12" onClick={() => navigate('/plan', { state: { prompt: text } })}>
              Plan with AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-ink-800/70 border border-white/10 px-4 py-3">
      <p className="text-[11px] text-muted mb-1">{label}</p>
      <p className="text-sm font-medium text-body flex items-center gap-2"><Icon size={15} className="text-cyan" /> {value}</p>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div>
      <Hero />
      <PlannerDemo />

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
        <SectionHeading eyebrow="How it works" title="From idea to itinerary in seconds" sub="Three simple steps between you and your next journey." />
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center shrink-0">
                  <s.icon size={22} className="text-white" />
                </span>
                <span className="text-5xl font-bold text-white/[0.06]">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-body mt-5 text-lg">{s.title}</h3>
              <p className="text-sm text-muted mt-2">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
        <SectionHeading eyebrow="Everything you need" title="A travel operating system for India" sub="Planning, discovery, tracking and budgeting — all in one place." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07 }} className="card p-5 hover:border-brand-500/30 transition-colors">
              <span className="w-11 h-11 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center">
                <f.icon size={20} className="text-brand-400" />
              </span>
              <h3 className="font-semibold text-body mt-4">{f.title}</h3>
              <p className="text-sm text-muted mt-1.5">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spiritual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-72 lg:h-96 rounded-3xl overflow-hidden order-2 lg:order-1">
            <img src={imageFor('amritsar')} alt="Golden Temple" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <Badge tone="ai" icon={Sparkles} label="Spiritual Travel" />
                <p className="text-body font-semibold mt-2">The Golden Temple, Amritsar</p>
              </div>
              <Heart size={20} className="text-danger" fill="currentColor" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan mb-3">Spiritual travel</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Discover India's spiritual side</h2>
            <p className="text-muted mt-4">
              Temples, gurudwaras, historic shrines and sacred experiences — curated and woven into your route by AI.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {['Temples', 'Gurudwaras', 'Historic Shrines', 'Spiritual Experiences'].map((t) => (
                <div key={t} className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-body flex items-center gap-2.5">
                  <Landmark size={16} className="text-cyan" /> {t}
                </div>
              ))}
            </div>
            <Button className="mt-7" icon={Sparkles} onClick={() => (window.location.href = '/plan')}>
              Build Spiritual Trip
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
        <SectionHeading eyebrow="Popular destinations" title="Where will you go next?" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DESTINATIONS.map((d, i) => (
            <motion.div key={d.city} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="relative h-52 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => (window.location.href = '/explore')}>
              <img src={imageFor(d.slug)} alt={d.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent" />
              <div className="absolute top-3 left-3"><Badge tone="brand" label={d.tag} /></div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-semibold text-body">{d.city}</p>
                <p className="text-xs text-muted">{d.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
        <SectionHeading eyebrow="Loved by travellers" title="Real journeys, real smiles" />
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
              <div className="flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={15} fill="currentColor" />)}
              </div>
              <p className="text-sm text-body/90 mt-4 leading-relaxed">“{t.text}”</p>
              <div className="flex items-center gap-3 mt-5">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center text-white font-semibold">
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-sm font-medium text-body">{t.name}</p>
                  <p className="text-xs text-muted">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-24">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="font-medium text-body">{f.q}</span>
                <ChevronDown size={18} className={cn('text-muted transition-transform', openFaq === i && 'rotate-180')} />
              </button>
              {openFaq === i && <p className="px-5 pb-5 text-sm text-muted leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-24">
        <div className="gradient-border rounded-3xl bg-ink-900/80 p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />
          <Compass size={40} className="text-cyan mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-bold">Your next adventure starts here.</h2>
          <p className="text-muted mt-3 max-w-md mx-auto">Tell YatraGenie where you want to go, your budget and preferences — and let AI plan the journey.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button size="lg" icon={Sparkles} onClick={() => (window.location.href = isAuthenticated ? '/plan' : '/register')}>
              Plan My Trip
            </Button>
            <Button size="lg" variant="secondary" onClick={() => (window.location.href = '/explore')}>
              Explore India
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
