"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { Button } from "@/components/ui/Button";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const SIZES = [1, 2, 3, 4, 5, 6, 7];

export function HouseholdScreen({ onNext, onBack }: Props) {
  const savedSize = useStore((s) => s.profile.householdSize);
  const setHouseholdSize = useStore((s) => s.setHouseholdSize);
  const [selected, setSelected] = useState(savedSize || 1);

  return (
    <StepLayout accent="#04436A">
      <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1">
        ← Back
      </button>

      <h2 className="font-display text-4xl text-off-white mb-2">
        How many people live in your home?
      </h2>
      <p className="font-body text-off-white/50 text-base mb-8">
        This helps us share the numbers fairly across your household.
      </p>

      <div className="flex gap-3 flex-wrap mb-10">
        {SIZES.map((n) => (
          <motion.button
            key={n}
            onClick={() => setSelected(n)}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-2xl font-display text-xl transition-all duration-150
              ${selected === n
                ? "bg-teal text-navy"
                : "bg-white/5 border border-white/10 text-off-white/70 hover:border-white/30"
              }`}
          >
            {n === 7 ? "7+" : n}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-1.5 mb-10 flex-wrap">
        {Array.from({ length: Math.min(selected, 7) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="w-10 h-10 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-teal" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7H4z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={() => { setHouseholdSize(selected); onNext(); }}
        fullWidth
      >
        Continue →
      </Button>
    </StepLayout>
  );
}
