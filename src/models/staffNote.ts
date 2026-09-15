/**
 * A natural note on or around the treble clef staff. 0 is the bottom line (E4), 8 is the
 * top line (F5); values outside 0...8 sit below/above the staff on ledger lines.
 */
export type StaffValue = number;

export const STAFF_VALUES: StaffValue[] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LETTERS: Record<StaffValue, string> = {
  [-2]: 'C', // C4
  [-1]: 'D', // D4
  0: 'E',
  1: 'F',
  2: 'G',
  3: 'A',
  4: 'B',
  5: 'C',
  6: 'D',
  7: 'E',
  8: 'F',
  9: 'G', // G5
  10: 'A', // A5
};

export function letterFor(value: StaffValue): string {
  return LETTERS[value];
}

/**
 * Staff-line positions (even values) strictly outside the staff (0...8) that must be drawn
 * as ledger lines to reach the given note position.
 */
export function ledgerLinePositions(value: StaffValue): StaffValue[] {
  const positions: StaffValue[] = [];
  if (value < 0) {
    let p = -2;
    while (p >= value) {
      positions.push(p);
      p -= 2;
    }
  } else if (value > 8) {
    let p = 10;
    while (p <= value) {
      positions.push(p);
      p += 2;
    }
  }
  return positions;
}
