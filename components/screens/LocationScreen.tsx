"use client";

import { useState } from "react";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
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

  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }));
  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  const handleContinue = () => {
    if (!state) return;
    setLocation(state, city || cities[0] || "");
    onNext();
  };

  return (
    <StepLayout accent="#05A7B4">
      <button
        onClick={onBack}
        className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1"
      >
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
          <Dropdown
            value={state}
            onChange={(val) => { setState(val); setCity(""); }}
            options={stateOptions}
            placeholder="Select your state…"
            searchable
          />
        </div>

        {state && (
          <div>
            <label className="block font-body text-off-white/50 text-xs uppercase tracking-widest mb-2">
              City or area
            </label>
            <Dropdown
              value={city}
              onChange={setCity}
              options={cityOptions}
              placeholder="Select city…"
            />
          </div>
        )}
      </div>

      <Button onClick={handleContinue} disabled={!state} fullWidth>
        Continue →
      </Button>
    </StepLayout>
  );
}
