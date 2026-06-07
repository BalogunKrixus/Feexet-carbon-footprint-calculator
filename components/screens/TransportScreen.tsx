"use client";

import { useState } from "react";
import { Car, Smartphone, Bus, Bike, PersonStanding, Droplets, Fuel, Building2, Route, Home, Plane, Globe } from "lucide-react";
import { useStore } from "@/store/store";
import { StepLayout } from "@/components/ui/StepLayout";
import { OptionCard } from "@/components/ui/OptionCard";
import { Button } from "@/components/ui/Button";
import type { TransportAnswers } from "@/store/state";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const MAIN_MODES = [
  { value: "own-car", label: "Own car", icon: <Car size={18} /> },
  { value: "ride-hail", label: "Bolt / inDrive / Uber", icon: <Smartphone size={18} /> },
  { value: "danfo-brt", label: "Danfo or BRT bus", icon: <Bus size={18} /> },
  { value: "keke", label: "Keke (tricycle)", icon: <Car size={18} /> },
  { value: "okada", label: "Okada (motorbike)", icon: <Bike size={18} /> },
  { value: "walk", label: "Mostly walk", icon: <PersonStanding size={18} /> },
] as const;

const CAR_FUEL = [
  { value: "light", label: "Light (under 15L/week)", icon: <Droplets size={18} /> },
  { value: "moderate", label: "Moderate (15 to 35L/week)", icon: <Fuel size={18} /> },
  { value: "heavy", label: "Heavy (35L+ per week)", icon: <Fuel size={18} /> },
] as const;

const INTERSTATE = [
  { value: "never", label: "Never or rarely", icon: <Building2 size={18} /> },
  { value: "sometimes", label: "Once or twice a month", icon: <Route size={18} /> },
  { value: "often", label: "Often (weekly)", icon: <Route size={18} /> },
] as const;

const FLIGHTS = [
  { value: "none", label: "No flights", icon: <Home size={18} /> },
  { value: "one-two", label: "1 to 2 flights", icon: <Plane size={18} /> },
  { value: "several", label: "3 or more flights", icon: <Globe size={18} /> },
] as const;

export function TransportScreen({ onNext, onBack }: Props) {
  const firstName = useStore((s) => s.profile.firstName);
  const savedTransport = useStore((s) => s.answers.transport);
  const setTransportAnswers = useStore((s) => s.setTransportAnswers);

  const [mainMode, setMainMode] = useState<TransportAnswers["mainMode"]>(savedTransport?.mainMode || "own-car");
  const [carFuel, setCarFuel] = useState<TransportAnswers["carFuelPerWeek"]>(savedTransport?.carFuelPerWeek || "moderate");
  const [interstate, setInterstate] = useState<TransportAnswers["interstateFrequency"]>(savedTransport?.interstateFrequency || "never");
  const [flights, setFlights] = useState<TransportAnswers["flightsPerYear"]>(savedTransport?.flightsPerYear || "none");

  const handleContinue = () => {
    setTransportAnswers({
      mainMode,
      carFuelPerWeek: mainMode === "own-car" ? carFuel : null,
      interstateFrequency: interstate,
      flightsPerYear: flights,
    });
    onNext();
  };

  return (
    <StepLayout accent="#F2A93B">
      <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors flex items-center gap-1">
        ← Back
      </button>

      <h2 className="font-display text-4xl text-off-white mb-1">How do you get around,</h2>
      <h2 className="font-display text-4xl text-amber mb-6">{firstName}?</h2>

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">Your main way to travel most days:</p>
        <div className="grid grid-cols-2 gap-2">
          {MAIN_MODES.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={mainMode === opt.value}
              onClick={() => setMainMode(opt.value)}
            />
          ))}
        </div>
      </div>

      {mainMode === "own-car" && (
        <div className="mb-6">
          <p className="font-body text-off-white/70 text-sm font-medium mb-3">Petrol used per week:</p>
          <div className="space-y-2">
            {CAR_FUEL.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                label={opt.label}
                selected={carFuel === opt.value}
                onClick={() => setCarFuel(opt.value)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">Interstate travel per month:</p>
        <div className="space-y-2">
          {INTERSTATE.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={interstate === opt.value}
              onClick={() => setInterstate(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="font-body text-off-white/70 text-sm font-medium mb-3">Flights in the last year:</p>
        <div className="space-y-2">
          {FLIGHTS.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={flights === opt.value}
              onClick={() => setFlights(opt.value)}
            />
          ))}
        </div>
      </div>

      <Button onClick={handleContinue} fullWidth>Continue →</Button>
    </StepLayout>
  );
}
