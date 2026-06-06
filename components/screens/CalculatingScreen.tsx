"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/store";
import { calculate } from "@/engine/calculate";

interface Props {
  onNext: () => void;
}

const MESSAGES = [
  "Reading your GreenPrint.",
  "Adding up your power.",
  "Turning litres into numbers.",
  "Counting every kilometre.",
  "Almost there.",
];

export function CalculatingScreen({ onNext }: Props) {
  const [msgIndex, setMsgIndex] = useState(0);
  const setResult = useStore((s) => s.setResult);
  // Read the whole state snapshot once for the calculation (not a reactive selector)
  const storeSnapshot = useStore.getState();

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 700);

    const timer = setTimeout(() => {
      const result = calculate(storeSnapshot);
      setResult(result);
      clearInterval(interval);
      onNext();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5">
      <div className="fixed inset-0 bg-[#062436]" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          className="w-24 h-24 mx-auto mb-8 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-teal/20" />
          <div className="absolute inset-2 rounded-full border-2 border-teal/40" />
          <div className="absolute inset-4 rounded-full border-2 border-teal/60" />
          <div className="absolute inset-6 rounded-full bg-teal/20 flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-display text-2xl text-off-white"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
