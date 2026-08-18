import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import Logo from '../common/Logo';

const FEATURES = [
  'AI-generated itineraries in seconds',
  'Budget-aware planning & tracking',
  'Live trip mode with arrival detection',
  'Temples, gurudwaras & hidden gems',
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-hero-radial">
        <Logo />
        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold leading-tight"
          >
            Plan smarter.
            <br />
            <span className="text-gradient">Travel better.</span>
          </motion.h1>
          <p className="text-muted mt-4 text-lg">Your AI-powered India trip planner.</p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-body/90"
              >
                <span className="w-6 h-6 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <Sparkles size={13} className="text-brand-400" />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted/70 flex items-center gap-1.5">
          <Compass size={13} className="text-cyan" /> YatraGenie AI · India's AI travel assistant
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-5 py-10 sm:py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
