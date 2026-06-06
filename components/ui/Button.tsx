"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export function Button({
  children, onClick, variant = "primary", className = "",
  disabled, type = "button", fullWidth,
}: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold text-sm px-6 py-3.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal";
  const variants = {
    primary: "bg-amber text-navy hover:bg-amber/90 disabled:opacity-40",
    secondary: "bg-white/10 text-off-white border border-white/20 hover:bg-white/20 disabled:opacity-40",
    ghost: "text-off-white/60 hover:text-off-white disabled:opacity-40",
  };
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}
