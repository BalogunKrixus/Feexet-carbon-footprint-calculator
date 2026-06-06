"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { selectActions } from "@/engine/recommend";
import { Button } from "@/components/ui/Button";
import type { Action } from "@/content/actions";

interface Props {
  onBack: () => void;
  onReset: () => void;
}

const EFFORT_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: "Easy win", color: "text-lime border-lime/40 bg-lime/10" },
  medium: { label: "Some effort", color: "text-amber border-amber/40 bg-amber/10" },
  high: { label: "Big move", color: "text-teal border-teal/40 bg-teal/10" },
};

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1000)}k`;
  return `₦${n.toLocaleString()}`;
}

function ActionCard({ action, added, onToggle }: { action: Action; added: boolean; onToggle: () => void }) {
  const effort = EFFORT_LABELS[action.effort];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 transition-all duration-200 ${added ? "border-teal/40 bg-teal/5" : "border-white/10 bg-white/5"}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{action.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-body font-semibold text-off-white text-sm">{action.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${effort.color}`}>
              {effort.label}
            </span>
          </div>
          <p className="font-body text-off-white/50 text-xs leading-relaxed mb-3">{action.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-off-white/60 text-xs">
              −{Math.round(action.kgSavedPerYear / 10) / 100}t CO₂/yr
            </span>
            {action.nairaSavedPerYear > 0 && (
              <>
                <span className="text-white/20">·</span>
                <span className="font-mono text-amber text-xs font-semibold">
                  save {formatNaira(action.nairaSavedPerYear)}/yr
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/8">
        <button
          onClick={onToggle}
          className={`w-full py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-150
            ${added
              ? "bg-teal/20 text-teal border border-teal/40"
              : "bg-white/8 text-off-white/70 border border-white/10 hover:bg-white/15"}`}
        >
          {added ? "✓ Added to my plan" : "+ Add to my plan"}
        </button>
      </div>
    </motion.div>
  );
}

export function ActionsScreen({ onBack, onReset }: Props) {
  const firstName = useStore((s) => s.profile.firstName);
  const result = useStore((s) => s.result);
  const addedActions = useStore((s) => s.plan.addedActions);
  const rotationSeed = useStore((s) => s.rotationSeed);
  const toggleAction = useStore((s) => s.toggleAction);

  if (!result) return null;

  const actions = selectActions(result, rotationSeed);

  return (
    <div className="min-h-dvh px-5 py-16 flex flex-col">
      <div className="fixed inset-0 bg-[#062436]" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col flex-1">
        <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors self-start flex items-center gap-1">
          ← Back
        </button>

        <h2 className="font-display text-4xl text-off-white mb-1">Your quickest wins,</h2>
        <h2 className="font-display text-4xl text-amber mb-2">{firstName}.</h2>
        <p className="font-body text-off-white/50 text-sm mb-8">
          Ranked by impact on your footprint.{" "}
          {addedActions.length > 0 && (
            <span className="text-teal">{addedActions.length} added to your plan.</span>
          )}
        </p>

        <div className="space-y-4">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              added={addedActions.includes(action.id)}
              onToggle={() => toggleAction(action.id)}
            />
          ))}
        </div>

        {addedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-lime/10 border border-lime/30 rounded-2xl px-5 py-4"
          >
            <p className="font-body text-lime text-sm font-medium">
              {addedActions.length} action{addedActions.length > 1 ? "s" : ""} in your plan.
            </p>
            <p className="font-body text-off-white/50 text-xs mt-0.5">
              Saved to your device — come back any time to track progress.
            </p>
          </motion.div>
        )}

        <div className="mt-8 space-y-3 pb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="font-body text-off-white/70 text-sm font-medium mb-1">🌍 That&apos;s your GreenPrint.</p>
            <p className="font-body text-off-white/40 text-xs mb-4">
              Share it with friends and spread the word. Every conversation counts.
            </p>
            <Button variant="secondary" fullWidth onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: "My GreenPrint",
                  text: `My carbon footprint is ${result.totalTonnesCo2PerYear}t CO₂/year — I calculated it with GreenPrint by Feexet.`,
                });
              }
            }}>
              Share my GreenPrint
            </Button>
          </div>
          <Button variant="ghost" onClick={onReset} fullWidth>
            Start over
          </Button>
        </div>
      </div>
    </div>
  );
}
