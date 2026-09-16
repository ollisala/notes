/** Lets a staff-based quiz be limited to just the upper or lower half of its note range. */
export type StaffRange = 'full' | 'upper' | 'lower';

export const STAFF_RANGES: { key: StaffRange; label: string; description: string }[] = [
  { key: 'full', label: 'Full', description: 'All notes, low to high' },
  { key: 'upper', label: 'Upper', description: 'Notes at or above the middle line' },
  { key: 'lower', label: 'Lower', description: 'Notes below the middle line' },
];

// Split at the middle line (B4, value 4): "upper half" is the center line and above, "lower
// half" is everything below it.
const CENTER_VALUE = 4;

export function loadStaffRange(storageKey: string): StaffRange {
  const stored = localStorage.getItem(storageKey);
  return stored === 'upper' || stored === 'lower' ? stored : 'full';
}

export function saveStaffRange(storageKey: string, range: StaffRange): void {
  try {
    localStorage.setItem(storageKey, range);
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}

export function filterByStaffRange<T extends { value: number }>(pool: readonly T[], range: StaffRange): T[] {
  if (range === 'upper') return pool.filter((p) => p.value >= CENTER_VALUE);
  if (range === 'lower') return pool.filter((p) => p.value < CENTER_VALUE);
  return [...pool];
}
