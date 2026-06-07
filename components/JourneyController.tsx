"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@/store/store";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { LocationScreen } from "@/components/screens/LocationScreen";
import { HouseholdScreen } from "@/components/screens/HouseholdScreen";
import { PowerScreen } from "@/components/screens/PowerScreen";
import { TransportScreen } from "@/components/screens/TransportScreen";
import { CookingScreen } from "@/components/screens/CookingScreen";
import { FoodScreen } from "@/components/screens/FoodScreen";
import { CalculatingScreen } from "@/components/screens/CalculatingScreen";
import { RevealScreen } from "@/components/screens/RevealScreen";
import { BreakdownScreen } from "@/components/screens/BreakdownScreen";
import { ActionsScreen } from "@/components/screens/ActionsScreen";

const STEP_ORDER = [
  "welcome", "location", "household", "power", "transport", "cooking", "food",
  "calculating", "reveal", "breakdown", "actions",
] as const;

type Step = typeof STEP_ORDER[number];

export function JourneyController() {
  const currentStep = useStore((s) => s.currentStep) as Step;
  const setCurrentStep = useStore((s) => s.setCurrentStep);
  const reset = useStore((s) => s.reset);

  // Rehydrate the persisted store on the client
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  const stepIndex = STEP_ORDER.indexOf(currentStep);

  const goNext = () => {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) setCurrentStep(next);
  };

  const goBack = () => {
    if (["welcome", "calculating", "reveal"].includes(currentStep)) return;
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) setCurrentStep(prev);
  };

  const handleReset = () => {
    reset();
    setCurrentStep("welcome");
  };

  return (
    <div className="relative min-h-dvh">
      <ProgressBar currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {currentStep === "welcome" && (
          <WelcomeScreen key="welcome" onNext={goNext} />
        )}
        {currentStep === "location" && (
          <LocationScreen key="location" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "household" && (
          <HouseholdScreen key="household" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "power" && (
          <PowerScreen key="power" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "transport" && (
          <TransportScreen key="transport" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "cooking" && (
          <CookingScreen key="cooking" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "food" && (
          <FoodScreen key="food" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "calculating" && (
          <CalculatingScreen key="calculating" onNext={goNext} />
        )}
        {currentStep === "reveal" && (
          <RevealScreen key="reveal" onNext={goNext} />
        )}
        {currentStep === "breakdown" && (
          <BreakdownScreen key="breakdown" onNext={goNext} onBack={goBack} />
        )}
        {currentStep === "actions" && (
          <ActionsScreen key="actions" onBack={goBack} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  );
}
