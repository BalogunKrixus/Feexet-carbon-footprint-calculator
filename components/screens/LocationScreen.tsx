"use client";

import { useState } from "react";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { Button } from "@/components/ui/Button";
import { NIGERIAN_STATES, STATE_CITIES, DEFAULT_CITIES } from "@/config/questions";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function LocationScreen({ onNext, onBack }: Props) {
  const firstName = useStore((s) => s.profile.firstName);
  const savedState = useStore((s) => s.profile.state);
  const savedCity = useStore((s) => s.profile.city);
  const setLocation = useStore((s) => s.setLocation);

  const [state, setState] = useState(savedState || "");
  const [city, setCity] = useState(savedCity || "");

  const cities = state ? (STATE_CITIES[state] || DEFAULT_CITIES) : [];

  const handleContinue = () => {
    if (!state) return;
    setLocation(state, city || cities[0] || "");
    onNext();
  };

  return (
    <StepLayout accent="#05A7B4">
      <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1">
        ← Back
      </button>

      <h2 className="font-display text-4xl text-off-white mb-2">
        Nice to meet you, <span className="text-teal">{firstName}.</span>
      </h2>
      <p className="font-body text-off-white/50 text-base mb-8">Where do you live?</p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block font-body text-off-white/50 text-xs uppercase tracking-widest mb-2">
            State
          </label>
          <select
            value={state}
            onChange={(e) => { setState(e.target.value); setCity(""); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-off-white font-body text-sm focus:outline-none focus:border-teal/60 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-navy">Select your state…</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s} className="bg-navy">{s}</option>
            ))}
          </select>
        </div>

        {state && (
          <div>
            <label className="block font-body text-off-white/50 text-xs uppercase tracking-widest mb-2">
              City or area
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-off-white font-body text-sm focus:outline-none focus:border-teal/60 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-navy">Select city…</option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-navy">{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button onClick={handleContinue} disabled={!state} fullWidth>
        Continue →
      </Button>
    </StepLayout>
  );
}
