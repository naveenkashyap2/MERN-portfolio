import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export default function About() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold">About YatraGenie</h1>
        <p className="mt-6 text-ink-mute">
          YatraGenie AI is a premium travel operating system for India — planning, routes, stays, spiritual places, live walking, and an assistant that can replan when you’re late.
        </p>
        <p className="mt-4 text-ink-mute">
          We refuse fake live trains and hotels. If a provider isn’t connected, we say so.
        </p>
      </main>
      <Footer />
    </div>
  );
}
