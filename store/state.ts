export type NigerianState = string;

export interface PowerAnswers {
  gridHoursPerDay: "almost-none" | "a-few" | "half-day" | "most-day";
  hasGenerator: boolean;
  generatorType: "none" | "small-petrol" | "mid-petrol" | "large-diesel";
  generatorFuelPerWeek: "a-few" | "jerry-can" | "two-cans" | "drum";
  hasSolarOrInverter: boolean;
  solarCoveragePercent: 0 | 25 | 50 | 75;
  hasBorehole: boolean;
}

export interface TransportAnswers {
  mainMode: "own-car" | "ride-hail" | "danfo-brt" | "keke" | "okada" | "walk";
  carFuelPerWeek: "light" | "moderate" | "heavy" | null;
  interstateFrequency: "never" | "sometimes" | "often";
  flightsPerYear: "none" | "one-two" | "several";
}

export interface CookingAnswers {
  mainFuel: "gas-lpg" | "kerosene" | "charcoal" | "firewood" | "electric";
  secondaryFuels: Array<"gas-lpg" | "kerosene" | "charcoal" | "firewood" | "electric">;
  refillFrequency: "rarely" | "monthly" | "fortnightly" | "weekly";
}

export interface FoodAnswers {
  redMeatFrequency: "rarely" | "few-week" | "most-days";
  foodOrigin: "mostly-local" | "mixed" | "mostly-imported";
  eatingOutFrequency: "rarely" | "sometimes" | "often";
}

export interface GoodsAnswers {
  electronicsPerYear: "none" | "one-two" | "several";
  clothingSource: "mostly-new" | "mix" | "mostly-secondhand";
  onlineOrdersPerMonth: "none" | "one-two" | "weekly";
}

export interface WasteAnswers {
  disposalMethod: "collected" | "dumped" | "burned" | "mixed";
  recyclingHabit: "never" | "sometimes" | "often";
  wasteTypes: Array<"plastic-bottles" | "pure-water-sachets" | "tins-cans" | "glass" | "food-organic" | "paper-cardboard" | "fabric" | "tyres">;
}

export interface CategoryResult {
  category: string;
  label: string;
  kgCo2PerYear: number;
  nairaPerYear: number;
  sharePercent: number;
  color: string;
}

export interface BenchmarkSet {
  localTypical: number;
  nigeriaAverage: number;
  globalAverage: number;
  fairShare: number;
  localLabel: string;
}

export interface Result {
  totalKgCo2PerYear: number;
  totalTonnesCo2PerYear: number;
  totalNairaPerYear: number;
  perCategory: CategoryResult[];
  dominantDriver: string;
  dominantDriverLabel: string;
  secondaryDriver: string;
  benchmarks: BenchmarkSet;
}

export interface GreenPrintState {
  schemaVersion: number;
  currentStep: string;
  profile: {
    firstName: string;
    state: string;
    city: string;
    householdSize: number;
  };
  answers: {
    power?: PowerAnswers;
    transport?: TransportAnswers;
    cooking?: CookingAnswers;
    food?: FoodAnswers;
    goods?: GoodsAnswers;
    waste?: WasteAnswers;
  };
  result?: Result;
  plan: {
    addedActions: string[];
    seenUpcycling: string[];
  };
  rotationSeed: number;
}

export const defaultState: GreenPrintState = {
  schemaVersion: 1,
  currentStep: "welcome",
  profile: {
    firstName: "",
    state: "",
    city: "",
    householdSize: 1,
  },
  answers: {},
  result: undefined,
  plan: {
    addedActions: [],
    seenUpcycling: [],
  },
  rotationSeed: Math.floor(Math.random() * 10000),
};
