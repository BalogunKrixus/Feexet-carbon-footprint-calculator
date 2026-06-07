"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/store";
import { selectActions } from "@/engine/recommend";
import { generateAndPrintReport } from "@/engine/report";
import { Button } from "@/components/ui/Button";
import type { Action } from "@/content/actions";
import type { Result } from "@/store/state";

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

function calcCommitment(actions: Action[], addedIds: string[]) {
  const selected = actions.filter((a) => addedIds.includes(a.id));
  return {
    count: selected.length,
    kgSaved: selected.reduce((s, a) => s + a.kgSavedPerYear, 0),
    nairaSaved: selected.reduce((s, a) => s + a.nairaSavedPerYear, 0),
    titles: selected.map((a) => a.title),
  };
}

function buildCommitmentShareText(result: Result, commitment: ReturnType<typeof calcCommitment>): string {
  if (commitment.count === 0) {
    return `My carbon footprint is ${result.totalTonnesCo2PerYear}t CO₂/year. I calculated it with GreenPrint by Feexet.\n\ngreenprint.feexet.com`;
  }
  const newTonnes = Math.max(0, result.totalTonnesCo2PerYear - commitment.kgSaved / 1000).toFixed(1);
  const actionList = commitment.titles.map((t) => `✅ ${t}`).join("\n");
  return (
    `My carbon footprint is ${result.totalTonnesCo2PerYear}t CO₂/year.\n\n` +
    `I’m committing to:\n${actionList}\n\n` +
    `This will cut my footprint to ${newTonnes}t and save ${formatNaira(commitment.nairaSaved)}/yr!\n\n` +
    `Calculate yours 👇\ngreenprint.feexet.com`
  );
}


function ActionCard({
  action,
  committed,
  onToggle,
}: {
  action: Action;
  committed: boolean;
  onToggle: () => void;
}) {
  const effort = EFFORT_LABELS[action.effort];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        committed ? "border-teal/40 bg-teal/5" : "border-white/10 bg-white/5"
      }`}
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
              {Math.round(action.kgSavedPerYear / 10) / 100}t CO₂/yr saved
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
            ${
              committed
                ? "bg-teal/20 text-teal border border-teal/40"
                : "bg-white/8 text-off-white/70 border border-white/10 hover:bg-white/15"
            }`}
        >
          {committed ? "✓ Committed" : "Commit to this"}
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
  const storeState = useStore((s) => s);

  const [copied, setCopied] = useState<"commitment" | "score" | null>(null);

  if (!result) return null;

  const actions = selectActions(result, rotationSeed);
  const commitment = calcCommitment(actions, addedActions);
  const newTonnes = Math.max(0, result.totalTonnesCo2PerYear - commitment.kgSaved / 1000);

  const handleShare = async (text: string, title: string, type: "commitment" | "score") => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {
        // User cancelled share — do nothing
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2500);
    }
  };

  return (
    <div className="min-h-dvh px-5 py-16 flex flex-col">
      <div className="fixed inset-0 bg-[#062436]" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col flex-1">
        <button
          onClick={onBack}
          className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors self-start flex items-center gap-1"
        >
          ← Back
        </button>

        <h2 className="font-display text-4xl text-off-white mb-1">Your quickest wins,</h2>
        <h2 className="font-display text-4xl text-amber mb-2">{firstName}.</h2>
        <p className="font-body text-off-white/50 text-sm mb-8">
          Commit to the ones you will actually try. We will calculate your impact.
        </p>

        {/* Action cards */}
        <div className="space-y-4">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              committed={addedActions.includes(action.id)}
              onToggle={() => toggleAction(action.id)}
            />
          ))}
        </div>

        {/* Commitment summary — appears when ≥1 action committed */}
        <AnimatePresence>
          {commitment.count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="mt-6 bg-lime/10 border border-lime/30 rounded-2xl px-5 py-4"
            >
              <p className="font-body text-lime text-sm font-semibold mb-1">
                🎯 Your commitment
              </p>
              <p className="font-body text-off-white/60 text-xs leading-relaxed mb-1">
                Cut{" "}
                <span className="text-lime font-semibold">
                  {(commitment.kgSaved / 1000).toFixed(1)}t CO₂
                </span>{" "}
                and save{" "}
                <span className="text-lime font-semibold">
                  {formatNaira(commitment.nairaSaved)}/yr
                </span>
                {" "}if you follow through on{" "}
                {commitment.count === 1 ? "this change" : `these ${commitment.count} changes`}.
              </p>
              {commitment.kgSaved > 0 && (
                <p className="font-body text-off-white/35 text-xs mb-3">
                  Your footprint: {result.totalTonnesCo2PerYear}t → {newTonnes.toFixed(1)}t CO₂/yr
                </p>
              )}
              <Button
                variant="secondary"
                fullWidth
                onClick={() =>
                  handleShare(
                    buildCommitmentShareText(result, commitment),
                    "My GreenPrint commitment",
                    "commitment"
                  )
                }
              >
                {copied === "commitment" ? "Copied ✓" : "Share my commitment →"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download report */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="font-body text-off-white/70 text-sm font-semibold mb-1">
            📄 Download your full report
          </p>
          <p className="font-body text-off-white/40 text-xs mb-4 leading-relaxed">
            A detailed PDF with your footprint breakdown, data sources, methodology, and action plan.
          </p>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => generateAndPrintReport(storeState, result, actions, addedActions)}
          >
            Download my GreenPrint report
          </Button>
        </div>

        {/* Community CTA */}
        <div className="mt-3 bg-teal/8 border border-teal/20 rounded-2xl p-5">
          <p className="text-2xl mb-2">🌱</p>
          <p className="font-body font-semibold text-off-white text-sm mb-1">
            Join the Feexet Green community
          </p>
          <p className="font-body text-off-white/50 text-xs mb-4 leading-relaxed">
            Connect with other Nigerians taking their footprint seriously. Tips, wins, and real accountability.
          </p>
          <a
            href="https://chat.whatsapp.com/feexet-green"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl font-body text-sm font-medium bg-teal/20 text-teal border border-teal/30 text-center hover:bg-teal/30 transition-all duration-150"
          >
            Join the community →
          </a>
        </div>

        {/* Bottom section */}
        <div className="mt-3 pb-8">
          <Button variant="ghost" onClick={onReset} fullWidth>
            Start over
          </Button>
        </div>
      </div>
    </div>
  );
}
