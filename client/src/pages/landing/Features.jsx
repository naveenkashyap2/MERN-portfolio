import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

const items = [
  'AI itinerary with validation',
  'Hinglish natural language planning',
  'Local + intercity trips',
  'Walking 1–10+ km with arrival detection',
  'Temple & gurudwara discovery',
  'Budget + expense charts',
  'Secure Google + email auth',
  'Object-level authorization',
];

export default function Features() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-semibold">Features</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <div key={t} className="card p-5">
              {t}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
