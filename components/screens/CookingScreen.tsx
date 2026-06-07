"use client";

import { useState } from "react";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";
import { Button } from "@/components/ui/Button";
import type { CookingAnswers } from "@/store/state";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const MAIN_FUELS = [
  { value: "gas-lpg", label: "Gas (LPG cylinder)", icon: "🔵" },
  { value: "kerosene", label: "Kerosene stove", icon: "🏮" },
  { value: "charcoal", label: "Charcoal", icon: "⬛" },
  { value: "firewood", label: "Firewood", icon: "🪵" },
  { value: "electric", label: "Electric cooker", icon: "⚡" },
] as const;

const REFILL_FREQ = [
  { value: "rarely", label: "Rarely (every few months)", icon: "📅" },
  { value: "monthly", label: "About once a month", icon: "🗓️" },
  { value: "fortnightly", label: "Every two weeks", icon: "⚡" },
  { value: "weekly", label: "Every week or more", icon: "🔥" },
] as const;

type MainFuel = CookingAnswers["mainFuel"];
type SecFuel = CookingAnswers["secondaryFuels"][number];

export function CookingScreen({ onNext, onBack }: Props) {
  const savedCooking = useStore((s) => s.answers.cooking);
  const setCookingAnswers = useStore((s) => s.setCookingAnswers);

  const [mainFuel, setMainFuel] = useState<MainFuel>(savedCooking?.mainFuel || "gas-lpg");
  const [secondary, setSecondary] = useState<SecFuel[]>(savedCooking?.secondaryFuels || []);
  const [refill, setRefill] = useState<CookingAnswers["refillFrequency"]>(savedCooking?.refillFrequency || "monthly");

  const toggleSecondary = (fuel: SecFuel) => {
    setSecondary((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  const handleContinue = () => {
    setCookingAnswers({ mainFuel, secondaryFuels: secondary, refillFrequency: refill });
    onNext();
  };

  const secondaryOptions = MAIN_FUELS.filter((f) => f.value !== mainFuel);

  return (
    <StepLayout accent="#BCEC30">
      <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1">
        ← Back
      </button>

      <h2 className="font-display text-4xl text-off-white mb-6">What do you cook with?</h2>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">Main cooking fuel:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MAIN_FUELS.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={mainFuel === opt.value}
              onClick={() => setMainFuel(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-1">
          Anything else you use sometimes? <span className="text-off-white/40">(optional)</span>
        </p>
        <p className="font-body text-off-white/40 text-xs mb-3">Fuel stacking is common. Select all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {secondaryOptions.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={secondary.includes(opt.value as SecFuel)}
              onClick={() => toggleSecondary(opt.value as SecFuel)}
              multi
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">How often do you refill or restock?</p>
        <div className="grid grid-cols-2 gap-2">
          {REFILL_FREQ.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={refill === opt.value}
              onClick={() => setRefill(opt.value)}
            />
          ))}
        </div>
      </div>

      <Button onClick={handleContinue} fullWidth>Continue →</Button>
    </StepLayout>
  );
}
