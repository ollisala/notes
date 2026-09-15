/**
 * Lightweight weighted practice: notes you get wrong show up more often, notes you get right
 * show up less often. Weights persist in localStorage so it carries over between sessions.
 */

export type Weights = Record<string, number>;

const MIN_WEIGHT = 1;
const MAX_WEIGHT = 6;
const WRONG_BOOST = 3;
const RIGHT_DECAY = 1;

export function loadWeights(storageKey: string): Weights {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Weights) : {};
  } catch {
    return {};
  }
}

function saveWeights(storageKey: string, weights: Weights): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(weights));
  } catch {
    // Ignore (private browsing, storage disabled, quota, etc.) — practice still works,
    // it just won't remember weights for next time.
  }
}

/** Records a right/wrong result for `key` and persists the updated weights. */
export function recordResult(storageKey: string, weights: Weights, key: string, wasCorrect: boolean): Weights {
  const current = weights[key] ?? MIN_WEIGHT;
  const next = wasCorrect ? Math.max(MIN_WEIGHT, current - RIGHT_DECAY) : Math.min(MAX_WEIGHT, current + WRONG_BOOST);
  const updated = { ...weights, [key]: next };
  saveWeights(storageKey, updated);
  return updated;
}

/**
 * Picks a random item, biased toward higher-weight (more-missed) items, optionally excluding
 * one item (e.g. so the same note doesn't repeat twice in a row).
 */
export function pickWeighted<T>(items: readonly T[], weights: Weights, keyFor: (item: T) => string, exclude?: T): T {
  const excludedKey = exclude !== undefined ? keyFor(exclude) : null;
  const pool = excludedKey !== null ? items.filter((item) => keyFor(item) !== excludedKey) : items;
  const candidates = pool.length > 0 ? pool : items;

  const total = candidates.reduce((sum, item) => sum + (weights[keyFor(item)] ?? MIN_WEIGHT), 0);
  let roll = Math.random() * total;
  for (const item of candidates) {
    roll -= weights[keyFor(item)] ?? MIN_WEIGHT;
    if (roll <= 0) return item;
  }
  return candidates[candidates.length - 1];
}
