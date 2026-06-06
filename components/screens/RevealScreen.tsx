"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/Button";

interface Props {
  onNext: () => void;
}

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1000).toLocaleString()}k`;
  return `₦${n.toLocaleString()}`;
}

export function RevealScreen({ onNext }: Props) {
  const firstName = useStore((s) => s.profile.firstName);
  const result = useStore((s) => s.result);
  const tonnes = result?.totalTonnesCo2PerYear ?? 0;
  const displayTonnes = useCountUp(tonnes);

  if (!result) return null;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="fixed inset-0 bg-[#062436]" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-teal/5 to-transparent" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body text-off-white/50 text-sm uppercase tracking-widest mb-4"
        >
          {firstName}, your GreenPrint is
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="mb-2"
        >
          <span className="font-display text-[7rem] sm:text-[9rem] leading-none text-off-white">
            {displayTonnes.toFixed(1)}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-off-white/50 text-lg mb-6"
        >
          tonnes of CO₂ a year
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-8"
        >
          <span className="font-mono text-off-white/70 font-medium">
            {displayTonnes.toFixed(1)}t CO₂
          </span>
          <span className="w-px h-5 bg-white/20" />
          <span className="font-mono text-amber font-bold text-lg">
            {formatNaira(result.totalNairaPerYear)} / yr
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-10 text-left"
        >
          <p className="font-body text-off-white/60 text-sm">
            Most of that comes from{" "}
            <span className="text-teal font-semibold">{result.dominantDriverLabel.toLowerCase()}</span>.{" "}
            {result.dominantDriver === "power"
              ? "For most Nigerian homes, this is the generator."
              : result.dominantDriver === "transport"
              ? "Your travel adds up — especially at today's pump prices."
              : "This is your single biggest area of impact."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Button onClick={onNext} fullWidth className="text-base py-4">
            Show me why →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
