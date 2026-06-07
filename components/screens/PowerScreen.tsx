"use client";

import { useState } from "react";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";
import { Button } from "@/components/ui/Button";
import type { PowerAnswers } from "@/store/state";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const GRID_HOURS = [
  { value: "almost-none", label: "Almost none (0 to 2 hrs)", icon: "🔌" },
  { value: "a-few", label: "A few hours (2 to 5 hrs)", icon: "💡" },
  { value: "half-day", label: "About half the day", icon: "🌤️" },
  { value: "most-day", label: "Most of the day (10+ hrs)", icon: "☀️" },
] as const;

const GEN_TYPES = [
  { value: "small-petrol", label: "Small petrol set (I pass my neighbour)", icon: "⚡" },
  { value: "mid-petrol", label: "Midsize petrol generator", icon: "🔋" },
  { value: "large-diesel", label: "Large diesel generator", icon: "🏭" },
] as const;

const FUEL_BANDS = [
  { value: "a-few", label: "A few litres (under 10L)", icon: "🪣" },
  { value: "jerry-can", label: "A jerry can or two (10 to 40L)", icon: "🛢️" },
  { value: "two-cans", label: "Two to four jerry cans (40 to 80L)", icon: "🛢️🛢️" },
  { value: "drum", label: "A drum or more (80L+)", icon: "⛽" },
] as const;

const SOLAR_COVERAGE = [
  { value: 25, label: "Fans and lights only", sub: "covers about 25%" },
  { value: 50, label: "About half our home", sub: "covers about 50%" },
  { value: 75, label: "Most appliances run on it", sub: "covers about 75%" },
] as const;

export function PowerScreen({ onNext, onBack }: Props) {
  const savedPower = useStore((s) => s.answers.power);
  const setPowerAnswers = useStore((s) => s.setPowerAnswers);

  const [gridHours, setGridHours] = useState<PowerAnswers["gridHoursPerDay"]>(savedPower?.gridHoursPerDay || "a-few");
  const [hasGen, setHasGen] = useState(savedPower?.hasGenerator ?? true);
  const [genType, setGenType] = useState<PowerAnswers["generatorType"]>(savedPower?.generatorType || "small-petrol");
  const [fuelBand, setFuelBand] = useState<PowerAnswers["generatorFuelPerWeek"]>(savedPower?.generatorFuelPerWeek || "jerry-can");
  const [hasSolar, setHasSolar] = useState(savedPower?.hasSolarOrInverter ?? false);
  const [solarPct, setSolarPct] = useState<0 | 25 | 50 | 75>(savedPower?.solarCoveragePercent || 25);
  const [hasBorehole, setHasBorehole] = useState(savedPower?.hasBorehole ?? false);

  const handleContinue = () => {
    setPowerAnswers({
      gridHoursPerDay: gridHours,
      hasGenerator: hasGen,
      generatorType: hasGen ? genType : "none",
      generatorFuelPerWeek: fuelBand,
      hasSolarOrInverter: hasSolar,
      solarCoveragePercent: hasSolar ? solarPct : 0,
      hasBorehole,
    });
    onNext();
  };

  return (
    <StepLayout accent="#05A7B4">
      <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1">
        ← Back
      </button>

      <div className="mb-2 text-2xl">⚡</div>
      <h2 className="font-display text-4xl text-off-white mb-1">Let&apos;s talk power.</h2>
      <p className="font-body text-off-white/50 text-base mb-8">
        Be honest, most homes run more than one source.
      </p>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">
          How many hours of NEPA light do you get a day on average?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GRID_HOURS.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={gridHours === opt.value}
              onClick={() => setGridHours(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">Do you run a generator?</p>
        <div className="flex gap-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => setHasGen(v)}
              className={`flex-1 py-3 rounded-xl font-body text-sm font-medium border transition-all ${hasGen === v ? "bg-teal/20 border-teal text-off-white" : "bg-white/5 border-white/10 text-off-white/60"}`}
            >
              {v ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {hasGen && (
        <>
          <div className="mb-6">
            <p className="font-body text-off-white/70 text-sm font-medium mb-3">Which kind?</p>
            <div className="space-y-2">
              {GEN_TYPES.map((opt) => (
                <OptionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  selected={genType === opt.value}
                  onClick={() => setGenType(opt.value)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="font-body text-off-white/70 text-sm font-medium mb-3">Roughly how much fuel per week?</p>
            <div className="space-y-2">
              {FUEL_BANDS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  selected={fuelBand === opt.value}
                  onClick={() => setFuelBand(opt.value)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">Do you have solar panels or an inverter at home?</p>
        <div className="flex gap-2 mb-3">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => setHasSolar(v)}
              className={`flex-1 py-3 rounded-xl font-body text-sm font-medium border transition-all ${hasSolar === v ? "bg-teal/20 border-teal text-off-white" : "bg-white/5 border-white/10 text-off-white/60"}`}
            >
              {v ? "Yes" : "No"}
            </button>
          ))}
        </div>
        {hasSolar && (
          <div>
            <p className="font-body text-off-white/40 text-xs mb-2">How much of your power does it cover?</p>
            <div className="space-y-2">
              {SOLAR_COVERAGE.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSolarPct(opt.value)}
                  className={`w-full px-4 py-3 rounded-xl font-body text-sm font-medium border transition-all text-left flex items-center justify-between ${solarPct === opt.value ? "bg-lime/20 border-lime text-lime" : "bg-white/5 border-white/10 text-off-white/60"}`}
                >
                  <span>{opt.label}</span>
                  <span className={`text-xs font-normal ${solarPct === opt.value ? "text-lime/60" : "text-off-white/25"}`}>{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">
          Do you pump borehole water with the generator?
        </p>
        <div className="flex gap-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => setHasBorehole(v)}
              className={`flex-1 py-3 rounded-xl font-body text-sm font-medium border transition-all ${hasBorehole === v ? "bg-teal/20 border-teal text-off-white" : "bg-white/5 border-white/10 text-off-white/60"}`}
            >
              {v ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleContinue} fullWidth>Continue →</Button>
    </StepLayout>
  );
}
