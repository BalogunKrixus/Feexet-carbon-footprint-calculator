import { FACTORS } from "@/config/factors";
import type {
  GreenPrintState, Result, CategoryResult, BenchmarkSet,
  PowerAnswers, TransportAnswers, CookingAnswers,
} from "@/store/state";

const f = FACTORS;

// --- Power ---
function calcPower(power: PowerAnswers | undefined, householdSize: number): { kg: number; naira: number } {
  if (!power) return { kg: 0, naira: 0 };

  let kg = 0;
  let naira = 0;

  // Grid electricity (estimate kWh from hours on)
  const gridHoursMap: Record<string, number> = {
    "almost-none": 1, "a-few": 3, "half-day": 6, "most-day": 10,
  };
  const gridHours = gridHoursMap[power.gridHoursPerDay] ?? 3;
  const gridKwhPerYear = gridHours * 0.5 * 365; // rough 500W average load
  kg += gridKwhPerYear * f.emission.gridKwhKgCo2;
  naira += gridKwhPerYear * f.prices.gridKwhNaira;

  // Generator fuel
  if (power.hasGenerator && power.generatorType !== "none") {
    const fuelBand = f.bands.generatorFuelLitresPerWeek[power.generatorFuelPerWeek] ?? 25;
    const litresPerYear = fuelBand * 52;
    const isoDiesel = power.generatorType === "large-diesel";
    const emFactor = isoDiesel ? f.emission.dieselPerLitre : f.emission.petrolPerLitre;
    const priceFactor = isoDiesel ? f.prices.dieselPerLitre : f.prices.petrolPerLitre;
    const rawKg = litresPerYear * emFactor;
    const rawNaira = litresPerYear * priceFactor;
    // Offset by solar coverage
    const solarFraction = (power.hasSolarOrInverter ? power.solarCoveragePercent : 0) / 100;
    kg += rawKg * (1 - solarFraction);
    naira += rawNaira * (1 - solarFraction);
  }

  // Borehole pumping (extra generator use)
  if (power.hasBorehole) {
    kg += 200;
    naira += 52 * 2 * f.prices.petrolPerLitre; // ~2L/week extra
  }

  return { kg, naira };
}

// --- Transport ---
// km/week baselines by mode for non-car commuters (GHG Protocol urban Nigeria estimate)
const MODE_KM_PER_WEEK: Record<string, number> = {
  "ride-hail":  80,   // similar range to car, typically urban
  "danfo-brt":  60,   // shared, covers similar distances
  "keke":       40,   // shorter trips
  "okada":      50,   // medium-range trips
  "walk":        0,   // zero tailpipe emissions
};

function calcTransport(transport: TransportAnswers | undefined): { kg: number; naira: number } {
  if (!transport) return { kg: 0, naira: 0 };

  let kg = 0;
  let naira = 0;

  if (transport.mainMode === "own-car" && transport.carFuelPerWeek) {
    // Use ACTUAL fuel consumption reported — more accurate than km estimate
    const litresPerWeek = f.bands.carFuelLitresPerWeek[transport.carFuelPerWeek] ?? 25;
    const litresPerYear = litresPerWeek * 52;
    kg += litresPerYear * f.emission.petrolPerLitre;  // 2.31 kg CO₂e/litre (IPCC)
    naira += litresPerYear * f.prices.petrolPerLitre;
  } else {
    // Non-car modes: use mode-specific km/week estimate
    const kmPerWeek = MODE_KM_PER_WEEK[transport.mainMode] ?? 0;
    const modeEmission: Record<string, number> = {
      "ride-hail": f.emission.ridehailPerKm,
      "danfo-brt": f.emission.danfoPerKm,
      "keke":      f.emission.kekePerKm,
      "okada":     f.emission.okadaPerKm,
      "walk":      0,
    };
    kg += kmPerWeek * 52 * (modeEmission[transport.mainMode] ?? 0);
  }

  // Interstate travel (shared road, shared cost — use mid-range car factor)
  const interstateTripsPerYear = f.bands.interstateTripFrequency[transport.interstateFrequency] ?? 0;
  kg += interstateTripsPerYear * 400 * f.emission.carPetrolPerKm; // 400 km avg trip

  // Flights (domestic, incl. radiative forcing at 2× direct — IPCC RF factor)
  const flights = f.bands.flightsPerYear[transport.flightsPerYear] ?? 0;
  kg += flights * 1200 * f.emission.domesticFlightPerKm; // 1200 km avg domestic

  return { kg, naira };
}

// --- Cooking ---
function calcCooking(cooking: CookingAnswers | undefined): { kg: number; naira: number } {
  if (!cooking) return { kg: 0, naira: 0 };

  let kg = 0;
  let naira = 0;

  const refillPerYear = f.bands.cookingRefillFrequency[cooking.refillFrequency] ?? 1;

  const fuelKg: Record<string, { kgCo2: number; naira: number }> = {
    "gas-lpg": { kgCo2: f.emission.lpgPerKg * 12.5 * refillPerYear, naira: f.prices.lpgPerKg * 12.5 * refillPerYear },
    "kerosene": { kgCo2: f.emission.kerosenePerLitre * 10 * refillPerYear * 12, naira: f.prices.kerosenePerLitre * 10 * refillPerYear * 12 },
    "charcoal": { kgCo2: f.emission.charcoalPerKg * 20 * refillPerYear * 12, naira: 1500 * refillPerYear * 12 },
    "firewood": { kgCo2: f.emission.firewoodPerKg * 30 * refillPerYear * 12, naira: 800 * refillPerYear * 12 },
    "electric": { kgCo2: f.emission.electricCookingPerKwh * 3 * 365, naira: f.prices.gridKwhNaira * 3 * 365 },
  };

  const main = fuelKg[cooking.mainFuel];
  if (main) {
    kg += main.kgCo2;
    naira += main.naira;
  }

  // Secondary fuels at 30% weight
  for (const fuel of cooking.secondaryFuels) {
    const sec = fuelKg[fuel];
    if (sec) {
      kg += sec.kgCo2 * 0.3;
      naira += sec.naira * 0.3;
    }
  }

  return { kg, naira };
}

// --- Food ---
// Methodology: IPCC AR6 Ch5 + FAO FAOSTAT Nigeria
// Baseline 400 kg CO₂e covers non-meat calories (grains, veg, eggs, fish, dairy)
// typical for West African diet. Red meat added on top per frequency band.
// Origin factor: local markets = 0.8× (less processing/transport); imported = 1.3×
// Eating out factor: higher packaging, food waste, and supply chain overhead
function calcFood(food: GreenPrintState["answers"]["food"]): { kg: number; naira: number } {
  if (!food) return { kg: 900, naira: 450000 }; // ~0.9t default: typical Nigerian diet
  const meatCo2 = (f.bands.beefFrequency[food.redMeatFrequency] ?? 52) * f.emission.beefPerServing;
  const baseCo2 = 400; // non-meat diet baseline for Nigeria (kg CO₂e/yr)
  const originFactor = food.foodOrigin === "mostly-local" ? 0.8 : food.foodOrigin === "mostly-imported" ? 1.3 : 1.0;
  const eatOutFactor = food.eatingOutFrequency === "often" ? 1.3 : food.eatingOutFrequency === "sometimes" ? 1.1 : 1.0;
  const kg = (baseCo2 + meatCo2) * originFactor * eatOutFactor;
  const naira = kg * 200; // ~₦200/kg CO₂e food cost proxy
  return { kg, naira };
}

function calcGoods(goods: GreenPrintState["answers"]["goods"]): { kg: number; naira: number } {
  if (!goods) return { kg: 400, naira: 200000 };
  const elec = (f.bands.electronicsPerYear[goods.electronicsPerYear] ?? 1.5) * f.emission.electronicsPerItem;
  const clothFactor = goods.clothingSource === "mostly-secondhand" ? 0.3 : goods.clothingSource === "mix" ? 0.65 : 1.0;
  const cloth = 6 * f.emission.newClothingPerItem * clothFactor;
  const orders = (f.bands.onlineOrdersPerMonth[goods.onlineOrdersPerMonth] ?? 1.5) * 12 * f.emission.onlineOrderPerDelivery;
  const kg = elec + cloth + orders;
  const naira = kg * 600;
  return { kg, naira };
}

function calcWaste(waste: GreenPrintState["answers"]["waste"]): { kg: number; naira: number } {
  if (!waste) return { kg: 200, naira: 0 };
  const base = 400; // kg waste per person per year
  const emFactor =
    waste.disposalMethod === "burned" ? f.emission.burningPerKgWaste :
    waste.disposalMethod === "dumped" ? f.emission.landfillPerKgWaste * 0.8 :
    waste.recyclingHabit === "often" ? f.emission.recycledPerKgWaste :
    f.emission.landfillPerKgWaste;
  const kg = base * emFactor;
  return { kg, naira: 0 };
}

const CATEGORY_COLORS: Record<string, string> = {
  power: "#05A7B4",
  transport: "#F2A93B",
  cooking: "#BCEC30",
  food: "#7C3AED",
  goods: "#EC4899",
  waste: "#6B7280",
};

const CATEGORY_LABELS: Record<string, string> = {
  power: "Power",
  transport: "Transport",
  cooking: "Cooking",
  food: "Food",
  goods: "Goods",
  waste: "Waste",
};

export function calculate(state: GreenPrintState): Result {
  const { answers, profile } = state;
  const hs = profile.householdSize || 1;

  const power = calcPower(answers.power, hs);
  const transport = calcTransport(answers.transport);
  const cooking = calcCooking(answers.cooking);
  const food = calcFood(answers.food);
  const goods = calcGoods(answers.goods);
  const waste = calcWaste(answers.waste);

  const categories: Record<string, { kg: number; naira: number }> = {
    power, transport, cooking, food, goods, waste,
  };

  const totalKg = Object.values(categories).reduce((sum, c) => sum + c.kg, 0) / hs;
  const totalNaira = Object.values(categories).reduce((sum, c) => sum + c.naira, 0) / hs;

  const perCategory: CategoryResult[] = Object.entries(categories).map(([key, val]) => ({
    category: key,
    label: CATEGORY_LABELS[key],
    kgCo2PerYear: Math.round(val.kg / hs),
    nairaPerYear: Math.round(val.naira / hs),
    sharePercent: totalKg > 0 ? Math.round((val.kg / hs / totalKg) * 100) : 0,
    color: CATEGORY_COLORS[key],
  }));

  perCategory.sort((a, b) => b.kgCo2PerYear - a.kgCo2PerYear);

  const dominant = perCategory[0];
  const secondary = perCategory[1];

  const cityLC = profile.city.toLowerCase();
  const stateLC = profile.state.toLowerCase();
  const localTypicalRaw =
    stateLC.includes("lagos") || cityLC.includes("lagos")
      ? FACTORS.benchmarks.lagosTypical
      : stateLC.includes("fct") || cityLC.includes("abuja")
      ? FACTORS.benchmarks.abujaTypical
      : FACTORS.benchmarks.nigeriaAverage * 3;
  // Round to 1 decimal to avoid floating-point artefacts like 1.7999999999998
  const localTypical = Math.round(localTypicalRaw * 10) / 10;

  const benchmarks: BenchmarkSet = {
    localTypical,
    nigeriaAverage: FACTORS.benchmarks.nigeriaAverage,
    globalAverage: FACTORS.benchmarks.globalAverage,
    fairShare: FACTORS.benchmarks.fairShare,
    localLabel: profile.city || profile.state || "Your area",
  };

  return {
    totalKgCo2PerYear: Math.round(totalKg),
    totalTonnesCo2PerYear: Math.round((totalKg / 1000) * 10) / 10,
    totalNairaPerYear: Math.round(totalNaira),
    perCategory,
    dominantDriver: dominant?.category ?? "power",
    dominantDriverLabel: dominant?.label ?? "Power",
    secondaryDriver: secondary?.category ?? "transport",
    benchmarks,
  };
}
