"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/Button";
import type { BenchmarkSet } from "@/store/state";

interface Props {
  onNext: () => void;
}

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1000).toLocaleString()}k`;
  return `₦${n.toLocaleString()}`;
}

type Verdict = {
  label: string;
  emoji: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  desc: string;
};

function getVerdict(tonnes: number, b: BenchmarkSet): Verdict {
  if (tonnes <= b.fairShare * 0.75) {
    return {
      label: "Low footprint",
      emoji: "🌱",
      textColor: "text-lime",
      borderColor: "border-lime/30",
      bgColor: "bg-lime/10",
      desc: `Well below the 1.5°C fair share of ${b.fairShare}t. You are doing better than most.`,
    };
  }
  if (tonnes <= b.fairShare) {
    return {
      label: "On target",
      emoji: "✅",
      textColor: "text-lime",
      borderColor: "border-lime/30",
      bgColor: "bg-lime/10",
      desc: `Within the 1.5°C fair share of ${b.fairShare}t. You are doing well.`,
    };
  }
  if (tonnes <= b.localTypical * 0.88) {
    return {
      label: "Below average",
      emoji: "👍",
      textColor: "text-teal",
      borderColor: "border-teal/30",
      bgColor: "bg-teal/10",
      desc: `Below the typical household in ${b.localLabel} (${b.localTypical}t). Room to improve still.`,
    };
  }
  if (tonnes <= b.localTypical * 1.15) {
    return {
      label: "About average",
      emoji: "〰️",
      textColor: "text-amber",
      borderColor: "border-amber/30",
      bgColor: "bg-amber/10",
      desc: `About typical for ${b.localLabel}. That still leaves room to do better.`,
    };
  }
  if (tonnes <= b.globalAverage) {
    return {
      label: "Above average",
      emoji: "⚠️",
      textColor: "text-amber",
      borderColor: "border-amber/30",
      bgColor: "bg-amber/10",
      desc: `Above average for ${b.localLabel}, but still below the global average of ${b.globalAverage}t.`,
    };
  }
  return {
    label: "High footprint",
    emoji: "🔴",
    textColor: "text-red-400",
    borderColor: "border-red-400/30",
    bgColor: "bg-red-400/10",
    desc: `Above the global average of ${b.globalAverage}t per person. There is a lot of room to bring this down.`,
  };
}

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        className="w-4 h-4 rounded-full bg-white/10 text-off-white/40 text-[9px] leading-none flex items-center justify-center font-body font-bold hover:bg-white/20 hover:text-off-white/60 transition-colors flex-shrink-0"
        aria-label="What does this mean?"
      >
        i
      </button>
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-[#04436A] border border-white/15 rounded-xl px-3.5 py-3 text-xs font-body text-off-white/70 leading-relaxed z-50 shadow-xl pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#04436A]" />
        </div>
      )}
    </div>
  );
}

function ComparisonRow({
  label,
  benchmark,
  userTonnes,
  color,
  delay,
  tooltip,
}: {
  label: string;
  benchmark: number;
  userTonnes: number;
  color: string;
  delay: number;
  tooltip?: string;
}) {
  const diff = userTonnes - benchmark;
  const absPct = Math.round(Math.abs(diff / benchmark) * 100);
  const isHigher = diff > 0.1;
  const isLower = diff < -0.1;

  let badge: string;
  let badgeClass: string;
  if (isHigher) {
    badge = `${absPct}% higher`;
    badgeClass = "text-amber/80 bg-amber/10 border-amber/20";
  } else if (isLower) {
    badge = `${absPct}% lower`;
    badgeClass = "text-lime bg-lime/10 border-lime/20";
  } else {
    badge = "About the same";
    badgeClass = "text-off-white/50 bg-white/5 border-white/10";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between py-3 border-b border-white/6 last:border-0"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="font-body text-off-white/60 text-xs truncate">{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
        <span className="font-mono text-off-white/25 text-xs flex-shrink-0">{benchmark}t</span>
      </div>
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0 ml-2 ${badgeClass}`}>
        {badge}
      </span>
    </motion.div>
  );
}

export function RevealScreen({ onNext }: Props) {
  const firstName = useStore((s) => s.profile.firstName);
  const result = useStore((s) => s.result);
  const tonnes = result?.totalTonnesCo2PerYear ?? 0;
  const displayTonnes = useCountUp(tonnes);

  if (!result) return null;

  const verdict = getVerdict(tonnes, result.benchmarks);
  const monthlyNaira = Math.round(result.totalNairaPerYear / 12);

  return (
    <div className="min-h-dvh flex flex-col px-5 py-16 relative overflow-hidden">
      <div className="fixed inset-0 bg-[#062436]" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-teal/5 to-transparent" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        {/* Intro label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body text-off-white/50 text-sm uppercase tracking-widest mb-4 text-center"
        >
          {firstName}, your GreenPrint is
        </motion.p>

        {/* Big number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          className="text-center mb-1"
        >
          <span className="font-display text-[7rem] sm:text-[9rem] leading-none text-off-white">
            {displayTonnes.toFixed(1)}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-off-white/50 text-lg mb-6 text-center"
        >
          tonnes of CO₂ a year
        </motion.p>

        {/* Verdict badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5 mb-4 ${verdict.bgColor} ${verdict.borderColor}`}
        >
          <span className="text-xl leading-none mt-0.5">{verdict.emoji}</span>
          <div>
            <p className={`font-body font-semibold text-sm mb-0.5 ${verdict.textColor}`}>
              {verdict.label}
            </p>
            <p className="font-body text-off-white/55 text-xs leading-relaxed">{verdict.desc}</p>
          </div>
        </motion.div>

        {/* Comparison rows */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 border border-white/10 rounded-2xl px-5 py-1 mb-4"
        >
          <ComparisonRow
            label={`${result.benchmarks.localLabel} typical`}
            benchmark={result.benchmarks.localTypical}
            userTonnes={tonnes}
            color="#05A7B4"
            delay={0.85}
          />
          <ComparisonRow
            label="1.5°C fair share"
            benchmark={result.benchmarks.fairShare}
            userTonnes={tonnes}
            color="#BCEC30"
            delay={0.95}
            tooltip="The maximum carbon footprint per person that keeps global warming below 1.5°C. Scientists put it at around 2.3t of CO₂ per person per year."
          />
          <ComparisonRow
            label="Global average"
            benchmark={result.benchmarks.globalAverage}
            userTonnes={tonnes}
            color="#F2A93B"
            delay={1.05}
          />
        </motion.div>

        {/* Naira cost card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-amber/5 border border-amber/20 rounded-2xl px-5 py-4 mb-4"
        >
          <p className="font-body text-amber/60 text-xs uppercase tracking-widest mb-2">
            What this costs you
          </p>
          <p className="font-display text-amber text-4xl leading-none mb-2">
            {formatNaira(result.totalNairaPerYear)}
            <span className="font-body text-amber/50 text-sm ml-1">/year</span>
          </p>
          <p className="font-body text-off-white/45 text-xs leading-relaxed">
            That is roughly{" "}
            <span className="text-amber/70 font-semibold">{formatNaira(monthlyNaira)} every month</span>{" "}
            spent directly on the petrol, diesel, and gas behind your footprint.
          </p>
        </motion.div>

        {/* Dominant driver + CTA — one connected unit */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8"
        >
          <div className="px-5 pt-5 pb-4">
            <p className="font-body text-off-white/60 text-sm leading-relaxed">
              Most of your footprint comes from{" "}
              <span className="text-teal font-semibold">
                {result.dominantDriverLabel.toLowerCase()}
              </span>
              .{" "}
              {result.dominantDriver === "power"
                ? "For most Nigerian homes, this is the generator."
                : result.dominantDriver === "transport"
                ? "Your travel adds up, especially at today's pump prices."
                : "This is your single biggest area of impact."}
            </p>
          </div>
          <div className="border-t border-white/8 px-4 pb-4 pt-3">
            <Button onClick={onNext} fullWidth className="text-base py-3.5">
              Show me why →
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
