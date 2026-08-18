import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Train,
  Hotel,
  Wallet,
  Navigation,
  MapPin,
  Footprints,
  Bot,
  Shield,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import Button from '../../components/ui/Button.jsx';
import { DESTINATIONS } from '../../constants/places.js';
import { INTERESTS, TRANSPORT_OPTIONS, STAY_OPTIONS } from '../../constants/app.js';
import { useAuth } from '../../hooks/useAuth.js';

const fade = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } };

const faqs = [
  { q: 'Does YatraGenie show live train seats?', a: 'Only when a verified provider is connected. Otherwise we say live availability could not be verified — we never invent seats or fares.' },
  { q: 'Is my location tracked by default?', a: 'No. Tracking stays off until you explicitly enable Live Trip Mode.' },
  { q: 'Can I plan a Delhi → Delhi walk?', a: 'Yes. Local and same-city trips, including 1–10+ km walking routes, are first-class.' },
  { q: 'Where does the AI run?', a: 'Gemini is called only from the backend. The API key never reaches the browser.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demo, setDemo] = useState({
    origin: 'Delhi',
    destination: 'Agra',
    budget: 5000,
    travelers: 2,
    transport: 'train',
    stay: 'medium',
    interests: ['historical', 'temple', 'food'],
    nl: 'Delhi se Agra 2 din ke liye jana hai, budget 5000, train se, Taj Mahal aur temples.',
  });

  const toggleInterest = (id) => {
    setDemo((d) => ({
      ...d,
      interests: d.interests.includes(id) ? d.interests.filter((x) => x !== id) : [...d.interests, id],
    }));
  };

  const goPlan = (extra = {}) => {
    const params = new URLSearchParams({
      from: extra.origin || demo.origin,
      to: extra.destination || demo.destination,
      budget: String(extra.budget || demo.budget),
      nl: extra.nl || demo.nl,
    });
    navigate(user ? `/plan?${params}` : `/login?next=/plan&${params}`);
  };

  return (
    <div className="bg-bg">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_85%_0%,rgba(6,182,212,0.16),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-accent-cyan">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered India trip planner
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[56px]">
              Your Journey.
              <br />
              Planned by AI.
            </h1>
            <p className="mt-5 max-w-xl text-base text-ink-mute sm:text-lg">
              Create intelligent India trips with AI-powered itineraries, routes, stays, budgets and real-time trip assistance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => goPlan()}>
                Plan My Trip <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" onClick={() => navigate('/explore')}>
                Explore Destinations
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <div className="card relative overflow-hidden p-6">
              <svg viewBox="0 0 360 220" className="h-auto w-full" aria-hidden>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <path d="M40 160 C 120 40, 200 40, 320 80" fill="none" stroke="url(#rg)" strokeWidth="3" className="route-line" />
                <circle cx="40" cy="160" r="7" fill="#3B82F6" />
                <circle cx="180" cy="56" r="7" fill="#06B6D4" />
                <circle cx="320" cy="80" r="7" fill="#22C55E" />
                <text x="28" y="190" fill="#94A3B8" fontSize="12">Delhi</text>
                <text x="160" y="36" fill="#94A3B8" fontSize="12">Agra</text>
                <text x="292" y="108" fill="#94A3B8" fontSize="12">Jaipur</text>
              </svg>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-white/5 p-3">₹5,000 Budget</div>
                <div className="rounded-lg bg-white/5 p-3">2 Days</div>
                <div className="rounded-lg bg-white/5 p-3 text-accent-cyan">✨ AI Optimized</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16" id="planner">
        <motion.div {...fade} className="card p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Plan your next journey</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {['origin', 'destination'].map((k) => (
              <label key={k} className="md:col-span-1">
                <span className="label">{k === 'origin' ? 'From' : 'To'}</span>
                <input className="input" value={demo[k]} onChange={(e) => setDemo({ ...demo, [k]: e.target.value })} />
              </label>
            ))}
            <label>
              <span className="label">Budget</span>
              <input className="input" type="number" value={demo.budget} onChange={(e) => setDemo({ ...demo, budget: Number(e.target.value) })} />
            </label>
            <label>
              <span className="label">Travelers</span>
              <input className="input" type="number" min={1} value={demo.travelers} onChange={(e) => setDemo({ ...demo, travelers: Number(e.target.value) })} />
            </label>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => goPlan()}>
                Generate My Trip ✨
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDemo({ ...demo, transport: t.id })}
                className={`rounded-full px-3 py-1.5 text-xs ${demo.transport === t.id ? 'bg-accent text-white' : 'bg-white/5 text-ink-mute'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {STAY_OPTIONS.filter((s) => s.id !== 'none').map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setDemo({ ...demo, stay: s.id })}
                className={`rounded-full px-3 py-1.5 text-xs ${demo.stay === s.id ? 'bg-accent text-white' : 'bg-white/5 text-ink-mute'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => toggleInterest(i.id)}
                className={`rounded-full px-3 py-1.5 text-xs ${demo.interests.includes(i.id) ? 'bg-accent/20 text-ink' : 'bg-white/5 text-ink-mute'}`}
              >
                {i.label}
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-mute">Or just tell YatraGenie what you want...</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <input
              className="input flex-1"
              value={demo.nl}
              onChange={(e) => setDemo({ ...demo, nl: e.target.value })}
              placeholder="Delhi se Agra 2 din ke liye jana hai..."
            />
            <Button onClick={() => goPlan({ nl: demo.nl })}>Plan with AI</Button>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <motion.h2 {...fade} className="text-3xl font-semibold">How it works</motion.h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ['01', 'Tell us where', 'Origin, destination, dates, budget.'],
            ['02', 'Choose your vibe', 'Train or walk. Temples or food. Local or intercity.'],
            ['03', 'AI builds the days', 'Validated itinerary, never raw model dump.'],
            ['04', 'Travel live', 'Map, walking progress, arrival — only with consent.'],
          ].map(([n, t, d]) => (
            <motion.div key={n} {...fade} className="card p-5">
              <p className="text-xs text-accent-cyan">{n}</p>
              <p className="mt-2 font-medium">{t}</p>
              <p className="mt-2 text-sm text-ink-mute">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <motion.h2 {...fade} className="text-3xl font-semibold">Feature showcase</motion.h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [Sparkles, 'AI itineraries', 'Day-wise plans with trust labels.'],
            [Train, 'Transport compare', 'Estimates until a live provider is connected.'],
            [Hotel, 'Stay bands', 'Budget / medium / premium — never fake rooms.'],
            [Wallet, 'Budget intelligence', 'Spent, remaining, optimize when you overshoot.'],
            [Navigation, 'Live trip mode', 'You are here, next stop, ETA, progress.'],
            [Footprints, 'Walking 10+ km', 'Progress ring, pause, arrival radius.'],
            [Bot, 'YatraGenie chat', 'I’m late. Kam budget. Nearby gurudwara.'],
            [MapPin, 'Temples & gurudwaras', 'Catalog-verified spiritual places.'],
            [Shield, 'Privacy first', 'HttpOnly sessions. No silent GPS.'],
          ].map(([Icon, t, d]) => (
            <div key={t} className="card p-5">
              <Icon className="h-5 w-5 text-accent-cyan" />
              <p className="mt-3 font-medium">{t}</p>
              <p className="mt-1 text-sm text-ink-mute">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <p className="text-xs text-accent-cyan">LIVE TRIP PREVIEW</p>
            <h3 className="mt-2 text-xl font-semibold">Map-first when you start walking</h3>
            <div className="mt-6 rounded-xl bg-bg-elevated p-4">
              <p className="text-sm">📍 You are here — Connaught Place</p>
              <p className="mt-2 text-ink-mute">Next: India Gate · 4.2 km · 52 min</p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[42%] rounded-full bg-gradient-to-r from-accent to-accent-cyan" />
              </div>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-xs text-accent-cyan">AI ASSISTANT</p>
            <h3 className="mt-2 text-xl font-semibold">Conversational, not a form dump</h3>
            <div className="mt-6 space-y-3 text-sm">
              <div className="ml-10 rounded-xl bg-accent/20 p-3">Nearby koi achha gurudwara hai?</div>
              <div className="mr-10 rounded-xl bg-white/5 p-3">Bangla Sahib is 1.1 km away in the catalog. Live hours aren’t verified.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-3xl font-semibold">Popular India destinations</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <button key={d.name} type="button" onClick={() => goPlan({ destination: d.name, origin: 'Delhi' })} className="group overflow-hidden rounded-xl border border-white/10 text-left">
              <img src={d.image} alt={d.name} className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
              <div className="bg-bg-card p-4">
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-ink-mute">{d.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-3xl font-semibold">Discover India’s spiritual side</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {['Temples', 'Gurudwaras', 'Historic shrines', 'Spiritual experiences'].map((t) => (
            <Link key={t} to="/explore" className="card p-5 hover:border-accent/40">
              {t}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-3xl font-semibold">Travelers on the same wavelength</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Ananya, Pune', 'Planned a 2-day Agra trip on a ₹5,000 budget without fake “available seats”.'],
            ['Kabir, Delhi', 'Used walking mode from CP to India Gate. Arrival ping actually waited for GPS confirm.'],
            ['Meera, Amritsar', 'Spiritual filter kept gurudwaras first. Felt like a product, not a college form.'],
          ].map(([n, t]) => (
            <div key={n} className="card p-5">
              <p className="text-sm text-ink-mute">“{t}”</p>
              <p className="mt-4 text-sm font-medium">{n}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-3xl font-semibold">FAQ</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-ink-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-accent-cyan p-10 text-center">
          <h2 className="text-3xl font-semibold text-white">Where are we going next?</h2>
          <p className="mt-2 text-white/80">Budget bolo. YatraGenie plan kare.</p>
          <Button variant="secondary" className="mt-6 bg-white text-bg hover:bg-white/90" onClick={() => goPlan()}>
            Plan My Trip
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
