"use client";

import { useState } from "react";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";
import { Button } from "@/components/ui/Button";
import type { FoodAnswers } from "@/store/state";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const MEAT_FREQ = [
  {
    value: "rarely",
    label: "Rarely, maybe once a month",
    icon: "🥗",
  },
  {
    value: "few-week",
    label: "A few times a week",
    icon: "🍖",
  },
  {
    value: "most-days",
    label: "Most days",
    icon: "🥩",
  },
] as const;

const FOOD_ORIGIN = [
  {
    value: "mostly-local",
    label: "Mostly local markets",
    icon: "🧺",
  },
  {
    value: "mostly-imported",
    label: "Mostly supermarkets or imported",
    icon: "📦",
  },
  {
    value: "mixed",
    label: "A mix of local markets and supermarkets",
    icon: "🛒",
  },
] as const;

const EAT_OUT = [
  {
    value: "rarely",
    label: "Rarely",
    icon: "🏠",
  },
  {
    value: "sometimes",
    label: "Once or twice a week",
    icon: "🍽️",
  },
  {
    value: "often",
    label: "Most days",
    icon: "🥡",
  },
] as const;

export function FoodScreen({ onNext, onBack }: Props) {
  const savedFood = useStore((s) => s.answers.food);
  const setFoodAnswers = useStore((s) => s.setFoodAnswers);

  const [meatFreq, setMeatFreq] = useState<FoodAnswers["redMeatFrequency"]>(
    savedFood?.redMeatFrequency || "few-week"
  );
  const [origin, setOrigin] = useState<FoodAnswers["foodOrigin"]>(
    savedFood?.foodOrigin || "mixed"
  );
  const [eatOut, setEatOut] = useState<FoodAnswers["eatingOutFrequency"]>(
    savedFood?.eatingOutFrequency || "sometimes"
  );

  const handleContinue = () => {
    setFoodAnswers({ redMeatFrequency: meatFreq, foodOrigin: origin, eatingOutFrequency: eatOut });
    onNext();
  };

  return (
    <StepLayout accent="#7C3AED">
      <button
        onClick={onBack}
        className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1"
      >
        ← Back
      </button>

      <h2 className="font-display text-4xl text-off-white mb-1">What do you eat?</h2>
      <p className="font-body text-off-white/50 text-base mb-8">
        Red meat is the biggest food driver of emissions worldwide.
      </p>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">
          How often do you eat beef or goat?
        </p>
        <div className="space-y-2">
          {MEAT_FREQ.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={meatFreq === opt.value}
              onClick={() => setMeatFreq(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">
          Where does most of your food come from, local markets or supermarkets?
        </p>
        <div className="space-y-2">
          {FOOD_ORIGIN.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={origin === opt.value}
              onClick={() => setOrigin(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">
          How often do you eat out or order in?
        </p>
        <div className="space-y-2">
          {EAT_OUT.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={eatOut === opt.value}
              onClick={() => setEatOut(opt.value)}
            />
          ))}
        </div>
      </div>

      <Button onClick={handleContinue} fullWidth>
        Continue →
      </Button>
    </StepLayout>
  );
}
