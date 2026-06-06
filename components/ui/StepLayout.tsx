"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  accent?: string;
  className?: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export function StepLayout({ children, accent, className = "" }: Props) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`min-h-dvh flex flex-col items-center justify-center px-5 py-16 ${className}`}
    >
      {accent && (
        <div
          className="fixed inset-0 pointer-events-none opacity-20"
          style={{ background: `radial-gradient(ellipse at top right, ${accent} 0%, transparent 60%)` }}
        />
      )}
      <div className="w-full max-w-lg relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
