export const FACTORS = {
  version: "1.0",
  updatedAt: "2026-06-06",

  // Naira prices (update regularly as prices move)
  prices: {
    petrolPerLitre: 1050,    // NGN per litre, market rate mid-2026
    dieselPerLitre: 1100,    // NGN per litre
    lpgPerKg: 1400,          // NGN per kg
    kerosenePerLitre: 900,   // NGN per litre
    gridKwhNaira: 68,        // NGN per kWh (average tariff)
  },

  // Emission factors (kg CO2e per unit)
  emission: {
    petrolPerLitre: 2.31,
    dieselPerLitre: 2.68,
    gridKwhKgCo2: 0.43,      // Nigerian grid (IPCC / IEA adapted)
    lpgPerKg: 3.0,           // LPG cooking
    kerosenePerLitre: 2.52,
    charcoalPerKg: 1.83,     // biomass (IPCC)
    firewoodPerKg: 1.9,
    electricCookingPerKwh: 0.43,
    // Transport
    carPetrolPerKm: 0.171,
    ridehailPerKm: 0.130,    // slightly better utilisation
    danfoPerKm: 0.055,       // shared
    kekePerKm: 0.070,
    okadaPerKm: 0.090,
    // Flights (kg CO2e per km, incl radiative forcing)
    domesticFlightPerKm: 0.255,
    // Food
    beefPerServing: 6.0,     // kg CO2e
    chickenPerServing: 1.1,
    localFoodFactor: 0.7,    // multiplier for local vs imported
    importedFoodFactor: 1.3,
    eatingOutFactor: 1.2,
    // Goods
    electronicsPerItem: 70,  // kg CO2e per device
    newClothingPerItem: 15,
    onlineOrderPerDelivery: 2.5,
    // Waste
    landfillPerKgWaste: 0.45,
    burningPerKgWaste: 1.2,
    recycledPerKgWaste: 0.1,
  },

  // Banded value midpoints
  bands: {
    generatorFuelLitresPerWeek: {
      "a-few": 5,
      "jerry-can": 25,
      "two-cans": 50,
      "drum": 100,
    },
    gridHoursPerDay: {
      "almost-none": 1,
      "a-few": 3,
      "half-day": 6,
      "most-day": 10,
    },
    carFuelLitresPerWeek: {
      "light": 10,
      "moderate": 25,
      "heavy": 50,
    },
    interstateTripFrequency: {
      "never": 0,
      "sometimes": 2,
      "often": 6,
    },
    flightsPerYear: {
      "none": 0,
      "one-two": 1.5,
      "several": 5,
    },
    cookingRefillFrequency: {
      "rarely": 0.3,
      "monthly": 1,
      "fortnightly": 2,
      "weekly": 4,
    },
    beefFrequency: {
      "rarely": 12,       // ~once a month (12 servings/yr)
      "few-week": 104,    // ~twice a week (104 servings/yr)
      "most-days": 260,   // ~5 days a week (260 servings/yr)
    },
    electronicsPerYear: {
      "none": 0,
      "one-two": 1.5,
      "several": 4,
    },
    onlineOrdersPerMonth: {
      "none": 0,
      "one-two": 1.5,
      "weekly": 4,
    },
  },

  // Benchmarks (tonnes CO2e per person per year)
  benchmarks: {
    lagosTypical: 2.8,
    abujaTypical: 3.2,
    nigeriaAverage: 0.6,    // national average incl. rural
    globalAverage: 4.5,
    fairShare: 2.3,         // 1.5°C compatible
  },
};

export type FactorConfig = typeof FACTORS;
