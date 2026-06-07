import type { Result } from "@/store/state";
import type { GreenPrintState } from "@/store/state";
import type { Action } from "@/content/actions";

function formatNaira(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1000)}k`;
  return `₦${n.toLocaleString()}`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function answerRow(label: string, value: string): string {
  return `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:45%">${label}</td><td style="padding:8px 0;color:#f1f5f9;font-size:13px;font-weight:600">${value}</td></tr>`;
}

function powerSummary(answers: GreenPrintState["answers"]): string {
  const p = answers.power;
  if (!p) return "<p style='color:#64748b'>Not collected</p>";
  const gridMap: Record<string, string> = {
    "almost-none": "Almost none (0 to 2 hrs)", "a-few": "A few hours (2 to 5 hrs)",
    "half-day": "About half the day", "most-day": "Most of the day (10+ hrs)",
  };
  const genMap: Record<string, string> = {
    "small-petrol": "Small petrol generator", "mid-petrol": "Midsize petrol generator",
    "large-diesel": "Large diesel generator", "none": "None",
  };
  const fuelMap: Record<string, string> = {
    "a-few": "A few litres (under 10L)", "jerry-can": "A jerry can or two (10 to 40L)",
    "two-cans": "Two to four jerry cans (40 to 80L)", "drum": "A drum or more (80L+)",
  };
  const solarMap: Record<number, string> = { 0: "No", 25: "Yes, fans and lights", 50: "Yes, about half home", 75: "Yes, most appliances" };
  const rows = [
    answerRow("NEPA supply", gridMap[p.gridHoursPerDay] || p.gridHoursPerDay),
    answerRow("Generator", p.hasGenerator ? genMap[p.generatorType] || p.generatorType : "No generator"),
    ...(p.hasGenerator ? [answerRow("Fuel per week", fuelMap[p.generatorFuelPerWeek] || p.generatorFuelPerWeek)] : []),
    answerRow("Solar or inverter", solarMap[p.solarCoveragePercent] || (p.hasSolarOrInverter ? "Yes" : "No")),
    answerRow("Borehole pump", p.hasBorehole ? "Yes" : "No"),
  ];
  return `<table style="width:100%;border-collapse:collapse">${rows.join("")}</table>`;
}

function transportSummary(answers: GreenPrintState["answers"]): string {
  const t = answers.transport;
  if (!t) return "<p style='color:#64748b'>Not collected</p>";
  const modeMap: Record<string, string> = {
    "own-car": "Own car", "ride-hail": "Bolt / inDrive / Uber", "danfo-brt": "Danfo or BRT bus",
    "keke": "Keke (tricycle)", "okada": "Okada (motorbike)", "walk": "Mostly walk",
  };
  const fuelMap: Record<string, string> = { "light": "Light (under 15L/week)", "moderate": "Moderate (15 to 35L/week)", "heavy": "Heavy (35L+ per week)" };
  const interstateMap: Record<string, string> = { "never": "Never or rarely", "sometimes": "Once or twice a month", "often": "Often (weekly)" };
  const flightMap: Record<string, string> = { "none": "No flights", "one-two": "1 to 2 flights", "several": "3 or more flights" };
  const rows = [
    answerRow("Main transport", modeMap[t.mainMode] || t.mainMode),
    ...(t.mainMode === "own-car" && t.carFuelPerWeek ? [answerRow("Petrol use", fuelMap[t.carFuelPerWeek] || t.carFuelPerWeek)] : []),
    answerRow("Interstate trips", interstateMap[t.interstateFrequency] || t.interstateFrequency),
    answerRow("Flights per year", flightMap[t.flightsPerYear] || t.flightsPerYear),
  ];
  return `<table style="width:100%;border-collapse:collapse">${rows.join("")}</table>`;
}

function cookingSummary(answers: GreenPrintState["answers"]): string {
  const c = answers.cooking;
  if (!c) return "<p style='color:#64748b'>Not collected</p>";
  const fuelMap: Record<string, string> = {
    "gas-lpg": "LPG gas", "kerosene": "Kerosene", "charcoal": "Charcoal",
    "firewood": "Firewood", "electric": "Electric cooker",
  };
  const freqMap: Record<string, string> = { "rarely": "Rarely", "monthly": "Monthly", "fortnightly": "Every two weeks", "weekly": "Weekly" };
  const sec = c.secondaryFuels.map((f) => fuelMap[f] || f).join(", ");
  const rows = [
    answerRow("Main fuel", fuelMap[c.mainFuel] || c.mainFuel),
    ...(sec ? [answerRow("Also uses", sec)] : []),
    answerRow("Refill frequency", freqMap[c.refillFrequency] || c.refillFrequency),
  ];
  return `<table style="width:100%;border-collapse:collapse">${rows.join("")}</table>`;
}

function foodSummary(answers: GreenPrintState["answers"]): string {
  const fd = answers.food;
  if (!fd) return "<p style='color:#64748b;font-size:13px'>Using estimated average (0.9t CO₂/yr)</p>";
  const meatMap: Record<string, string> = {
    "rarely": "Rarely (about once a month)", "few-week": "A few times a week", "most-days": "Most days",
  };
  const originMap: Record<string, string> = {
    "mostly-local": "Mostly local markets", "mixed": "A mix of local and imported", "mostly-imported": "Mostly supermarket or imported",
  };
  const eatOutMap: Record<string, string> = {
    "rarely": "Rarely", "sometimes": "Once or twice a week", "often": "Most days",
  };
  const rows = [
    answerRow("Red meat (beef/goat)", meatMap[fd.redMeatFrequency] || fd.redMeatFrequency),
    answerRow("Food source", originMap[fd.foodOrigin] || fd.foodOrigin),
    answerRow("Eating out", eatOutMap[fd.eatingOutFrequency] || fd.eatingOutFrequency),
  ];
  return `<table style="width:100%;border-collapse:collapse">${rows.join("")}</table>`;
}

export function generateAndPrintReport(
  state: GreenPrintState,
  result: Result,
  actions: Action[],
  addedActionIds: string[]
): void {
  const { profile, answers } = state;
  const committedActions = actions.filter((a) => addedActionIds.includes(a.id));
  const totalKgSaved = committedActions.reduce((s, a) => s + a.kgSavedPerYear, 0);
  const totalNairaSaved = committedActions.reduce((s, a) => s + a.nairaSavedPerYear, 0);
  const newTonnes = Math.max(0, result.totalTonnesCo2PerYear - totalKgSaved / 1000);

  const categoryRows = result.perCategory.map((cat) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e293b">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${cat.color};margin-right:10px;vertical-align:middle"></span>
        <span style="color:#f1f5f9;font-size:14px">${cat.label}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1e293b;text-align:right;color:#94a3b8;font-size:14px">${cat.sharePercent}%</td>
      <td style="padding:10px 0;border-bottom:1px solid #1e293b;text-align:right;color:#f1f5f9;font-size:14px;font-weight:600">${(cat.kgCo2PerYear / 1000).toFixed(2)}t CO₂</td>
      <td style="padding:10px 0;border-bottom:1px solid #1e293b;text-align:right;color:#F2A93B;font-size:14px">${formatNaira(cat.nairaPerYear)}/yr</td>
    </tr>
  `).join("");

  const commitmentSection = committedActions.length > 0 ? `
    <div style="background:#0f2a1e;border:1px solid #166534;border-radius:12px;padding:24px;margin-bottom:24px">
      <h3 style="color:#BCEC30;font-size:16px;font-weight:700;margin:0 0 8px">Your Commitment</h3>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 16px">
        If you follow through on these ${committedActions.length} action${committedActions.length > 1 ? "s" : ""}, your footprint drops from
        <strong style="color:#f1f5f9">${result.totalTonnesCo2PerYear}t</strong> to
        <strong style="color:#BCEC30">${newTonnes.toFixed(1)}t CO₂/yr</strong> —
        saving <strong style="color:#F2A93B">${formatNaira(totalNairaSaved)}/yr</strong>.
      </p>
      ${committedActions.map((a) => `
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
          <span style="font-size:20px;flex-shrink:0">${a.icon}</span>
          <div>
            <p style="color:#f1f5f9;font-size:14px;font-weight:600;margin:0 0 2px">${a.title}</p>
            <p style="color:#64748b;font-size:12px;margin:0">
              Saves ${(a.kgSavedPerYear / 1000).toFixed(2)}t CO₂/yr
              ${a.nairaSavedPerYear > 0 ? `&nbsp;·&nbsp;<span style="color:#F2A93B">${formatNaira(a.nairaSavedPerYear)}/yr</span>` : ""}
            </p>
          </div>
        </div>
      `).join("")}
    </div>
  ` : `
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#64748b;font-size:13px;margin:0">No actions committed yet. Visit the GreenPrint app to pick actions and track your progress.</p>
    </div>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${profile.firstName}'s GreenPrint Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #062436;
    color: #f1f5f9;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { max-width: 800px; margin: 0 auto; padding: 48px 40px; }
  h2 { font-size: 22px; font-weight: 700; color: #f1f5f9; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #1e293b; }
  .section { margin-bottom: 36px; }
  @media print {
    body { background: #062436; }
    .no-print { display: none; }
    .page { padding: 20px; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #05A7B4">
    <div>
      <div style="font-size:24px;font-weight:800;color:#05A7B4;letter-spacing:-0.5px">GreenPrint</div>
      <div style="font-size:12px;color:#64748b;margin-top:2px">by Feexet</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:13px;color:#64748b">${formatDate()}</div>
      <div style="font-size:13px;color:#94a3b8;margin-top:2px">${profile.firstName}&apos;s Personal Carbon Report</div>
      ${profile.city ? `<div style="font-size:12px;color:#64748b;margin-top:2px">${profile.city}${profile.state ? `, ${profile.state}` : ""}</div>` : ""}
    </div>
  </div>

  <!-- Big number -->
  <div class="section" style="background:linear-gradient(135deg,#04436A,#062436);border:1px solid #05A7B4/30;border-radius:16px;padding:32px;text-align:center;margin-bottom:32px">
    <p style="color:#94a3b8;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">${profile.firstName}, your annual carbon footprint is</p>
    <div style="font-size:80px;font-weight:800;color:#f1f5f9;line-height:1;margin-bottom:4px">${result.totalTonnesCo2PerYear}</div>
    <div style="font-size:20px;color:#94a3b8;margin-bottom:20px">tonnes of CO₂ per year</div>
    <div style="display:inline-block;background:#F2A93B/15;border:1px solid #F2A93B/40;border-radius:10px;padding:10px 24px">
      <span style="color:#F2A93B;font-size:22px;font-weight:700">${formatNaira(result.totalNairaPerYear)}/yr</span>
      <span style="color:#94a3b8;font-size:13px;margin-left:8px">in direct fuel and energy costs</span>
    </div>
  </div>

  <!-- Benchmarks -->
  <div class="section">
    <h2>How you compare</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:14px">${result.benchmarks.localLabel} typical</td>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;text-align:right;color:#f1f5f9;font-size:14px;font-weight:600">${Number(result.benchmarks.localTypical).toFixed(1)}t</td>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;text-align:right;font-size:13px;padding-left:16px;${result.totalTonnesCo2PerYear > result.benchmarks.localTypical ? "color:#F2A93B" : "color:#BCEC30"}">
          ${result.totalTonnesCo2PerYear > result.benchmarks.localTypical
            ? `+${Math.round((result.totalTonnesCo2PerYear / result.benchmarks.localTypical - 1) * 100)}% above`
            : `${Math.round((1 - result.totalTonnesCo2PerYear / result.benchmarks.localTypical) * 100)}% below`}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:14px">1.5°C fair share target</td>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;text-align:right;color:#f1f5f9;font-size:14px;font-weight:600">${Number(result.benchmarks.fairShare).toFixed(1)}t</td>
        <td style="padding:12px 0;border-bottom:1px solid #1e293b;text-align:right;font-size:13px;padding-left:16px;${result.totalTonnesCo2PerYear > result.benchmarks.fairShare ? "color:#F2A93B" : "color:#BCEC30"}">
          ${result.totalTonnesCo2PerYear > result.benchmarks.fairShare
            ? `+${Math.round((result.totalTonnesCo2PerYear / result.benchmarks.fairShare - 1) * 100)}% above target`
            : `${Math.round((1 - result.totalTonnesCo2PerYear / result.benchmarks.fairShare) * 100)}% below target`}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#94a3b8;font-size:14px">Global average</td>
        <td style="padding:12px 0;text-align:right;color:#f1f5f9;font-size:14px;font-weight:600">${Number(result.benchmarks.globalAverage).toFixed(1)}t</td>
        <td style="padding:12px 0;text-align:right;font-size:13px;padding-left:16px;${result.totalTonnesCo2PerYear > result.benchmarks.globalAverage ? "color:#F2A93B" : "color:#BCEC30"}">
          ${result.totalTonnesCo2PerYear > result.benchmarks.globalAverage
            ? `+${Math.round((result.totalTonnesCo2PerYear / result.benchmarks.globalAverage - 1) * 100)}% above global`
            : `${Math.round((1 - result.totalTonnesCo2PerYear / result.benchmarks.globalAverage) * 100)}% below global`}
        </td>
      </tr>
    </table>
  </div>

  <!-- Category breakdown -->
  <div class="section">
    <h2>Emissions by category</h2>
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="padding:8px 0;text-align:left;color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #1e293b">Category</th>
          <th style="padding:8px 0;text-align:right;color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #1e293b">Share</th>
          <th style="padding:8px 0;text-align:right;color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #1e293b">CO₂/yr</th>
          <th style="padding:8px 0;text-align:right;color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #1e293b">Cost/yr</th>
        </tr>
      </thead>
      <tbody>${categoryRows}</tbody>
    </table>
    <div style="margin-top:12px;padding:12px;background:#0f172a;border-radius:8px">
      <p style="color:#64748b;font-size:11px;line-height:1.6">
        * Goods and Waste emissions are estimated based on typical Nigerian household averages.
        Food emissions ${answers.food ? "are calculated from your responses" : "are estimated (you can retake the questionnaire to include food data)"}.
      </p>
    </div>
  </div>

  <!-- Your answers -->
  <div class="section">
    <h2>Your inputs</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:20px">
        <h3 style="color:#05A7B4;font-size:14px;font-weight:600;margin-bottom:12px">⚡ Power</h3>
        ${powerSummary(answers)}
      </div>
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:20px">
        <h3 style="color:#F2A93B;font-size:14px;font-weight:600;margin-bottom:12px">🚌 Transport</h3>
        ${transportSummary(answers)}
      </div>
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:20px">
        <h3 style="color:#BCEC30;font-size:14px;font-weight:600;margin-bottom:12px">🔥 Cooking</h3>
        ${cookingSummary(answers)}
      </div>
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:20px">
        <h3 style="color:#7C3AED;font-size:14px;font-weight:600;margin-bottom:12px">🍽️ Food</h3>
        ${foodSummary(answers)}
      </div>
    </div>
  </div>

  <!-- Commitment / actions -->
  <div class="section">
    <h2>Your action plan</h2>
    ${commitmentSection}
  </div>

  <!-- Methodology -->
  <div class="section">
    <h2>Methodology and data sources</h2>
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px">
      <p style="color:#94a3b8;font-size:13px;line-height:1.8;margin-bottom:16px">
        This report was generated using emission factors sourced from the IPCC Sixth Assessment Report (AR6), the International Energy Agency (IEA Nigeria grid emission factor), and the Food and Agriculture Organization (FAO FAOSTAT). All calculations are per person, dividing household-level data by household size.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px;width:55%">Petrol combustion</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">2.31 kg CO₂e/litre (IPCC 2006 Vol.2)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">Diesel combustion</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">2.68 kg CO₂e/litre (IPCC 2006 Vol.2)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">Nigerian grid electricity</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">0.43 kg CO₂e/kWh (IEA Nigeria, 2023)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">LPG cooking gas</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">3.0 kg CO₂e/kg (IPCC 2006 default)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">Charcoal</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">1.83 kg CO₂e/kg (IPCC biomass)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">Firewood</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">1.9 kg CO₂e/kg (IPCC, unsustainable harvest)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">Domestic flights (incl. radiative forcing)</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">0.255 kg CO₂e/km (IPCC RF factor ~2x)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">Beef per serving</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">6.0 kg CO₂e (Poore and Nemecek 2018, Science)</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:12px">1.5°C fair share</td><td style="padding:6px 0;color:#94a3b8;font-size:12px">2.3t CO₂e/person/yr (IPCC SR1.5, global equity)</td></tr>
      </table>
      <p style="color:#475569;font-size:11px;line-height:1.6">
        Scope coverage: Scope 1 (direct combustion), Scope 2 (grid electricity), partial Scope 3 (flights, food, goods).
        Goods and waste use Nigerian household averages. This tool is intended for awareness purposes;
        for verified organisational reporting please refer to the GHG Protocol Corporate Standard.
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding-top:24px;border-top:1px solid #1e293b;margin-top:8px">
    <p style="color:#05A7B4;font-size:15px;font-weight:700;margin-bottom:4px">GreenPrint by Feexet</p>
    <p style="color:#475569;font-size:12px">greenprint.feexet.com &nbsp;·&nbsp; Generated ${formatDate()}</p>
    <p style="color:#334155;font-size:11px;margin-top:8px">This report is personal and non-commercial. Emission factors are updated annually.</p>
  </div>

</div>
<script>
  window.onload = function() { window.print(); };
<\/script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
