"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/Button";

interface Props {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: Props) {
  const [name, setName] = useState("");
  const setFirstName = useStore((s) => s.setFirstName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setFirstName(trimmed);
    onNext();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-[#062436]" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-deep-ocean/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-12"
        >
          <img
            src="/logo.svg"
            alt="GreenPrint"
            className="h-10 w-auto"
          />
          <span className="text-off-white/50 font-body text-sm tracking-wide">by Feexet</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl text-off-white leading-tight mb-4"
        >
          Let&apos;s find your<br />
          <span className="text-teal">GreenPrint.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="font-body text-off-white/60 text-base mb-10 leading-relaxed"
        >
          See what your everyday life costs the planet and your pocket.
          About&nbsp;3&nbsp;minutes. No sign&nbsp;up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-4"
        >
          <label className="block">
            <span className="font-body text-off-white/50 text-xs uppercase tracking-widest mb-2 block">
              First, what should we call you?
            </span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your first name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-off-white font-body text-lg placeholder:text-off-white/25 focus:outline-none focus:border-teal/60 focus:bg-white/8 transition-all duration-150"
            />
          </label>

          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            fullWidth
            className="text-base py-4"
          >
            Start →
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-body text-off-white/30 text-xs mt-6 leading-relaxed"
        >
          Your answers stay on your device. No account. No data collected.
        </motion.p>
      </motion.div>
    </div>
  );
}
