import type { NigerianState } from "@/store/state";

export const NIGERIAN_STATES: NigerianState[] = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export const STATE_CITIES: Record<string, string[]> = {
  "Lagos": ["Lagos Island", "Victoria Island", "Ikeja", "Lekki", "Surulere", "Ikorodu", "Badagry", "Epe", "Other"],
  "FCT (Abuja)": ["Garki", "Wuse", "Maitama", "Gwarinpa", "Kubwa", "Nyanya", "Karu", "Gwagwalada", "Other"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny", "Other"],
  "Kano": ["Kano City", "Fagge", "Nasarawa", "Tarauni", "Other"],
  "Oyo": ["Ibadan North", "Ibadan South", "Ogbomoso", "Oyo Town", "Other"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Other"],
  "Edo": ["Benin City", "Auchi", "Other"],
  "Delta": ["Warri", "Asaba", "Effurun", "Other"],
  "Enugu": ["Enugu City", "Nsukka", "Other"],
  "Kaduna": ["Kaduna City", "Zaria", "Other"],
};

export const DEFAULT_CITIES = ["State Capital", "Major Town", "Other"];

export const JOURNEY_STEPS = [
  "welcome",
  "location",
  "household",
  "power",
  "transport",
  "cooking",
  "food",
  "goods",
  "waste",
  "calculating",
  "reveal",
  "breakdown",
  "compare",
  "actions",
] as const;

export type JourneyStep = typeof JOURNEY_STEPS[number];

export const PHASE1_STEPS: JourneyStep[] = [
  "welcome", "location", "household", "power", "transport", "cooking",
  "calculating", "reveal", "breakdown", "actions",
];

export const STEP_LABELS: Record<JourneyStep, string> = {
  welcome: "Hello",
  location: "Location",
  household: "Household",
  power: "Power",
  transport: "Getting Around",
  cooking: "Cooking",
  food: "Food",
  goods: "Shopping",
  waste: "Waste",
  calculating: "Reading",
  reveal: "Your GreenPrint",
  breakdown: "Breakdown",
  compare: "Compare",
  actions: "Actions",
};
