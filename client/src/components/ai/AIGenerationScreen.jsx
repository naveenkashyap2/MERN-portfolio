import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Compass, Sparkles } from 'lucide-react';
import { GENERATION_STEPS } from '../../constants/trip';

export default function AIGenerationScreen({ destination = 'your destination', onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= GENERATION_STEPS.length) {
          clearInterval(interval);
          onComplete?.();
          return s;
        }
        return s + 1;
      });
    }, 620);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-600 to-cyan flex items-center justify-center shadow-glow">
          <Compass size={38} className="text-white" />
        </div>
        <motion.span
          className="absolute -inset-3 rounded-[28px] border border-cyan/40"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-bold text-body mt-8">
        YatraGenie is building your journey…
      </h2>
      <p className="text-muted mt-2 text-sm">
        Planning <span className="text-cyan font-medium">{destination}</span> with AI
        <span className="inline-flex items-center gap-1 ml-1 text-cyan"><Sparkles size={13} /></span>
      </p>

      <div className="w-full max-w-sm mt-10 space-y-3 text-left">
        {GENERATION_STEPS.map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                i < step ? 'bg-success/15 border-success/40' : i === step ? 'bg-brand-500/15 border-brand-500/40' : 'bg-white/[0.04] border-white/[0.08]'
              }`}
            >
              {i < step ? (
                <Check size={14} className="text-success" />
              ) : i === step ? (
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-white/[0.15]" />
              )}
            </span>
            <span className={`text-sm ${i < step ? 'text-body' : i === step ? 'text-body' : 'text-muted/60'}`}>{label}</span>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted/70 mt-10">
        AI-generated itinerary — prices &amp; timings are estimates.
      </p>
    </div>
  );
}
