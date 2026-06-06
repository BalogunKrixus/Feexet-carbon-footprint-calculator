import { ACTION_LIBRARY, Action } from "@/content/actions";
import type { Result } from "@/store/state";

export function selectActions(result: Result, seed: number, count = 6): Action[] {
  const { dominantDriver, secondaryDriver } = result;

  const scored = ACTION_LIBRARY.map((action) => {
    let score = action.kgSavedPerYear;
    if (action.category === dominantDriver) score += 10000;
    else if (action.category === secondaryDriver) score += 5000;
    // Light rotation offset based on seed
    score += (seed % 100) * (ACTION_LIBRARY.indexOf(action) % 3 === 0 ? 1 : -1);
    return { action, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.action);
}
