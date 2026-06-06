"use client";

import { motion } from "framer-motion";
import { PHASE1_STEPS, JourneyStep } from "@/config/questions";

interface Props {
  currentStep: string;
}

export function ProgressBar({ currentStep }: Props) {
  const stepIndex = PHASE1_STEPS.indexOf(currentStep as JourneyStep);
  const inputSteps = PHASE1_STEPS.filter(
    (s) => !["calculating", "reveal", "breakdown", "actions"].includes(s)
  );
  const totalInputSteps = inputSteps.length;
  const currentInputIndex = inputSteps.indexOf(currentStep as JourneyStep);
  const progress = currentInputIndex >= 0 ? (currentInputIndex + 1) / totalInputSteps : stepIndex >= PHASE1_STEPS.indexOf("calculating") ? 1 : 0;

  if (["welcome", "calculating", "reveal", "breakdown", "actions"].includes(currentStep)) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
      <motion.div
        className="h-full bg-teal"
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
