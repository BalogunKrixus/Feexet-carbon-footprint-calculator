interface Props {
  kg: number;
  naira: number;
  large?: boolean;
}

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1000)}k`;
  return `₦${n.toLocaleString()}`;
}

function formatKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t CO₂`;
  return `${Math.round(kg)} kg CO₂`;
}

export function DualLedger({ kg, naira, large }: Props) {
  return (
    <div className={`flex items-center gap-2 ${large ? "text-base" : "text-sm"}`}>
      <span className="font-mono text-off-white/80 font-medium">
        {formatKg(kg)}
      </span>
      <span className="text-off-white/30">|</span>
      <span className="font-mono text-amber font-semibold">
        {formatNaira(naira)} / yr
      </span>
    </div>
  );
}
