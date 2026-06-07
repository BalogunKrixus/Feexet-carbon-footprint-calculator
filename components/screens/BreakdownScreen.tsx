"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/Button";
import { DualLedger } from "@/components/ui/DualLedger";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function DonutChart({ categories }: { categories: { sharePercent: number; color: string; label: string }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const gap = 2;

  let startAngle = -90;
  const slices = categories.map((cat) => {
    const angle = (cat.sharePercent / 100) * 360;
    const slice = { ...cat, startAngle, endAngle: startAngle + angle - gap };
    startAngle += angle;
    return slice;
  });

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const large = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {slices.map((slice, i) => (
        <motion.path
          key={i}
          d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
          fill="none"
          stroke={slice.color}
          strokeWidth={28}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}
      <circle cx={cx} cy={cy} r={r - 14} fill="#062436" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#F5F8FA" fontSize="12" fontFamily="Space Grotesk">
        Total
      </text>
    </svg>
  );
}

const EXPLANATIONS: Record<string, string> = {
  power: "Generator fuel is Nigeria's biggest household emission source. Running a generator for 4+ hours a day can cost as much as a mid-range salary each year.",
  transport: "Every litre of petrol burned in your car or generator releases about 2.3 kg of CO₂. Since subsidy removal, travel costs have risen sharply.",
  cooking: "Solid fuels like charcoal and firewood release significant CO₂ and create indoor air pollution that affects health directly.",
  food: "Beef and goat produce far more greenhouse gases per meal than chicken, fish, or plant-based foods.",
  goods: "Manufacturing electronics and new clothing has a large carbon cost. Buying secondhand (okrika) is one of the easiest wins.",
  waste: "Open burning of waste releases toxic particles and carbon. Collected waste, while imperfect, is far cleaner than burning.",
};

export function BreakdownScreen({ onNext, onBack }: Props) {
  const result = useStore((s) => s.result);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!result) return null;

  return (
    <div className="min-h-dvh px-5 py-16 flex flex-col">
      <div className="fixed inset-0 bg-[#062436]" />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col flex-1">
        <button onClick={onBack} className="text-off-white/40 font-body text-sm mb-8 hover:text-off-white/70 transition-colors self-start flex items-center gap-1">
          ← Back
        </button>

        <h2 className="font-display text-4xl text-off-white mb-2">Where it comes from.</h2>
        <p className="font-body text-off-white/50 text-sm mb-8">Tap a category to learn more.</p>

        <DonutChart categories={result.perCategory} />

        <div className="space-y-2 mt-8">
          {result.perCategory.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`rounded-xl border overflow-hidden transition-colors duration-150 ${expanded === cat.category ? "border-white/20" : "border-white/10"}`}>
                <button
                  onClick={() => setExpanded(expanded === cat.category ? null : cat.category)}
                  className="w-full text-left bg-white/5 hover:bg-white/8 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="font-body font-medium text-off-white flex-1 text-sm">{cat.label}</span>
                    <div className="text-right">
                      <div className="font-mono text-xs text-off-white/60">{cat.sharePercent}%</div>
                      <DualLedger kg={cat.kgCo2PerYear} naira={cat.nairaPerYear} />
                    </div>
                    <span className="text-off-white/30 ml-2 text-xs">{expanded === cat.category ? "▲" : "▼"}</span>
                  </div>
                </button>

                {expanded === cat.category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-white/10 bg-white/3 px-4 py-3"
                  >
                    <p className="font-body text-off-white/60 text-xs leading-relaxed">
                      {EXPLANATIONS[cat.category] || "This area contributes to your overall footprint."}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 bg-teal/10 border border-teal/30 rounded-2xl px-5 py-4">
          <p className="font-body text-off-white/80 text-sm leading-relaxed">
            <span className="text-teal font-semibold">{result.dominantDriverLabel}</span> is your biggest.{" "}
            Good news, it&apos;s also where you can save the most.
          </p>
        </div>

        <div className="mt-8">
          <Button onClick={onNext} fullWidth>What can I do? →</Button>
        </div>
      </div>
    </div>
  );
}
