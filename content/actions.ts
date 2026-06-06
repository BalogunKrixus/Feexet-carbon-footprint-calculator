export interface Action {
  id: string;
  title: string;
  description: string;
  category: string;
  kgSavedPerYear: number;
  nairaSavedPerYear: number;
  effort: "low" | "medium" | "high";
  icon: string;
}

export const ACTION_LIBRARY: Action[] = [
  // Power actions
  {
    id: "gen-hours-reduce",
    title: "Run your generator fewer hours",
    description: "Simple habits like switching off non-essential appliances and using LED bulbs can cut generator hours by two or more a day.",
    category: "power",
    kgSavedPerYear: 420,
    nairaSavedPerYear: 189000,
    effort: "low",
    icon: "⚡",
  },
  {
    id: "gen-service",
    title: "Service your generator regularly",
    description: "A well-maintained generator uses up to 15% less fuel. A yearly service pays for itself quickly at today's pump prices.",
    category: "power",
    kgSavedPerYear: 180,
    nairaSavedPerYear: 81000,
    effort: "low",
    icon: "🔧",
  },
  {
    id: "shift-grid-hours",
    title: "Shift heavy use to grid hours",
    description: "Run your fridge, washing machine, and iron when the grid is on. Less generator load means less fuel burn.",
    category: "power",
    kgSavedPerYear: 250,
    nairaSavedPerYear: 112000,
    effort: "low",
    icon: "⏰",
  },
  {
    id: "small-inverter",
    title: "Invest in a small inverter setup",
    description: "A small inverter with two panels can cover lighting and phone charging through the night, cutting generator hours significantly.",
    category: "power",
    kgSavedPerYear: 600,
    nairaSavedPerYear: 270000,
    effort: "high",
    icon: "☀️",
  },
  {
    id: "led-bulbs",
    title: "Switch all bulbs to LED",
    description: "LEDs use up to 80% less electricity than incandescent bulbs. A full swap costs little and saves fuel on generator nights.",
    category: "power",
    kgSavedPerYear: 120,
    nairaSavedPerYear: 54000,
    effort: "low",
    icon: "💡",
  },

  // Transport actions
  {
    id: "reduce-car-trips",
    title: "Cut one car trip per week",
    description: "Combining errands into one trip or walking short distances saves several litres of petrol a month at current prices.",
    category: "transport",
    kgSavedPerYear: 200,
    nairaSavedPerYear: 90000,
    effort: "low",
    icon: "🚶",
  },
  {
    id: "danfo-more",
    title: "Take shared transport more often",
    description: "Danfo, BRT, or keke produce a fraction of the emissions of a private car per kilometre. Even one day a week makes a difference.",
    category: "transport",
    kgSavedPerYear: 350,
    nairaSavedPerYear: 80000,
    effort: "medium",
    icon: "🚌",
  },
  {
    id: "car-maintenance",
    title: "Keep your car properly maintained",
    description: "Under-inflated tyres and a clogged filter can raise fuel consumption by 10 percent. A basic service pays for itself quickly.",
    category: "transport",
    kgSavedPerYear: 150,
    nairaSavedPerYear: 68000,
    effort: "low",
    icon: "🔩",
  },

  // Cooking actions
  {
    id: "switch-to-gas",
    title: "Switch your main cooking to LPG gas",
    description: "Gas burns cleaner than charcoal or firewood, produces less indoor smoke, and is often cheaper per meal at current prices.",
    category: "cooking",
    kgSavedPerYear: 380,
    nairaSavedPerYear: 95000,
    effort: "medium",
    icon: "🔥",
  },
  {
    id: "pressure-cooker",
    title: "Cook with a pressure cooker",
    description: "A pressure cooker reduces cooking time by up to 70%, cutting fuel use dramatically whether you cook with gas, kerosene, or charcoal.",
    category: "cooking",
    kgSavedPerYear: 200,
    nairaSavedPerYear: 60000,
    effort: "low",
    icon: "🍲",
  },
  {
    id: "firewood-gas",
    title: "Add gas as a second fuel",
    description: "Even using gas for half your cooking, while keeping firewood for big pots, cuts indoor smoke and fuel costs significantly.",
    category: "cooking",
    kgSavedPerYear: 220,
    nairaSavedPerYear: 70000,
    effort: "medium",
    icon: "🌿",
  },

  // Food actions
  {
    id: "less-beef",
    title: "Eat red meat one fewer day per week",
    description: "Beef and goat carry much higher emissions than chicken, fish, or beans. One less day adds up to a meaningful saving.",
    category: "food",
    kgSavedPerYear: 180,
    nairaSavedPerYear: 120000,
    effort: "low",
    icon: "🥩",
  },
  {
    id: "local-food",
    title: "Buy from local markets",
    description: "Locally grown food travels far fewer kilometres than imported goods, cutting transport emissions and often costing less.",
    category: "food",
    kgSavedPerYear: 120,
    nairaSavedPerYear: 80000,
    effort: "low",
    icon: "🛒",
  },

  // Goods actions
  {
    id: "buy-okrika",
    title: "Buy more from okrika markets",
    description: "Secondhand clothing carries a fraction of the carbon of new clothing and costs far less. Nigeria's okrika culture is a real climate win.",
    category: "goods",
    kgSavedPerYear: 90,
    nairaSavedPerYear: 150000,
    effort: "low",
    icon: "👕",
  },
  {
    id: "repair-electronics",
    title: "Repair electronics before replacing",
    description: "Manufacturing a new phone or laptop is the most carbon-intensive part of owning it. Keeping one working longer is the highest impact choice.",
    category: "goods",
    kgSavedPerYear: 70,
    nairaSavedPerYear: 200000,
    effort: "low",
    icon: "📱",
  },

  // Waste actions
  {
    id: "stop-burning",
    title: "Stop burning waste at home",
    description: "Open burning releases harmful gases and particulates. Bagging waste for collection, however imperfect, is far cleaner.",
    category: "waste",
    kgSavedPerYear: 180,
    nairaSavedPerYear: 0,
    effort: "low",
    icon: "🚫",
  },
  {
    id: "compost-organic",
    title: "Compost your food scraps",
    description: "A small compost heap or bin turns food scraps into garden fertiliser, cutting methane from landfill and saving money on soil.",
    category: "waste",
    kgSavedPerYear: 120,
    nairaSavedPerYear: 15000,
    effort: "medium",
    icon: "🌱",
  },
];
