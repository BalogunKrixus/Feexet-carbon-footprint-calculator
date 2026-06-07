"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick: () => void;
  multi?: boolean;
}

export function OptionCard({ icon, label, selected, onClick, multi }: Props) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150
        ${selected
          ? "bg-teal/20 border-teal text-off-white"
          : "bg-white/5 border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/10"
        }
      `}
    >
      {icon && (
        <span className={`flex-shrink-0 ${selected ? "text-teal" : "text-off-white/50"}`}>
          {icon}
        </span>
      )}
      <span className="font-body text-sm font-medium leading-snug flex-1">{label}</span>
      {multi && (
        <span className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center text-xs
          ${selected ? "bg-teal border-teal text-navy" : "border-white/30"}`}>
          {selected && "✓"}
        </span>
      )}
      {!multi && selected && (
        <span className="w-2 h-2 rounded-full bg-teal flex-shrink-0" />
      )}
    </motion.button>
  );
}
