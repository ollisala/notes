import { addSemitones, naturalPitchClass, type PitchClass } from './pitchClass';

/**
 * A natural note on or around the treble clef staff. 0 is the bottom line (E4), 8 is the
 * top line (F5); values outside 0...8 sit below/above the staff on ledger lines.
 */
export type StaffValue = number;

export const STAFF_VALUES: StaffValue[] = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LETTERS: Record<StaffValue, string> = {
  [-7]: 'E', // written E3 (sounds E2, open low E string)
  [-6]: 'F', // written F3
  [-5]: 'G', // written G3
  [-4]: 'A', // written A3 (sounds A2, open A string)
  [-3]: 'B', // written B3
  [-2]: 'C', // written C4
  [-1]: 'D', // written D4
  0: 'E',
  1: 'F',
  2: 'G',
  3: 'A',
  4: 'B',
  5: 'C',
  6: 'D',
  7: 'E',
  8: 'F',
  9: 'G', // written G5
  10: 'A', // written A5
};

// Scientific-pitch octave *as written* for each staff position (the treble clef bottom line,
// value 0, is written E4; the octave rolls over between B4, value 4, and C5, value 5).
//
// Guitar is a transposing instrument: it's notated one octave higher than it actually sounds
// (otherwise standard guitar range would need a staff full of ledger lines below middle C).
// So the open high-E string is written as E5 (top space) but sounds as E4 (played on a piano,
// say) - a full octave lower than the written position would suggest on a non-transposing
// instrument. `absolutePitchFor` accounts for this when computing the pitch to match against
// the fretboard; `letterFor`/`noteNameFor` are unaffected since transposition never changes
// the note's letter name, only which octave it sounds in.
const WRITTEN_OCTAVES: Record<StaffValue, number> = {
  [-7]: 3,
  [-6]: 3,
  [-5]: 3,
  [-4]: 3,
  [-3]: 3,
  [-2]: 4,
  [-1]: 4,
  0: 4,
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 5,
  6: 5,
  7: 5,
  8: 5,
  9: 5,
  10: 5,
};

export function letterFor(value: StaffValue): string {
  return LETTERS[value];
}

/** A note prompted on the staff: a line/space position, optionally sharped. */
export interface StaffPrompt {
  value: StaffValue;
  sharp: boolean;
}

// B and E have no commonly-used sharp (B♯/E♯ are enharmonic curiosities, not real practice),
// so only these five letters ever get a sharp prompt.
const SHARPABLE_LETTERS = new Set(['C', 'D', 'F', 'G', 'A']);

export function canHaveSharp(value: StaffValue): boolean {
  return SHARPABLE_LETTERS.has(letterFor(value));
}

/** The note name shown on answer buttons and in feedback, e.g. "F" or "F♯". */
export function noteNameFor(prompt: StaffPrompt): string {
  return letterFor(prompt.value) + (prompt.sharp ? '♯' : '');
}

export function pitchClassFor(prompt: StaffPrompt): PitchClass {
  const natural = naturalPitchClass(letterFor(prompt.value));
  return prompt.sharp ? addSemitones(natural, 1) : natural;
}

/** The exact pitch (in semitones) this staff prompt actually sounds, guitar transposition applied. */
export function absolutePitchFor(prompt: StaffPrompt): number {
  const soundingOctave = WRITTEN_OCTAVES[prompt.value] - 1;
  return soundingOctave * 12 + pitchClassFor(prompt);
}

export function promptKey(prompt: StaffPrompt): string {
  return `${prompt.value}${prompt.sharp ? '#' : ''}`;
}

/** Every prompt the staff can show: each natural position, plus a sharped version for the
    five letters that commonly have one. */
export function allStaffPrompts(): StaffPrompt[] {
  const prompts: StaffPrompt[] = [];
  for (const value of STAFF_VALUES) {
    prompts.push({ value, sharp: false });
    if (canHaveSharp(value)) {
      prompts.push({ value, sharp: true });
    }
  }
  return prompts;
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ALL_NOTE_NAMES = ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'];

/**
 * Four answer options for a multiple-choice round, as note names: the correct one, one name
 * close to it on the staff (a real near-miss, to make the choice meaningful), and two more
 * picked at random from the rest. Returned in random order.
 *
 * Options must be distinct *names* (not staff positions) — the same letter can sit at two
 * different staff positions (e.g. G4 and G5 are both just "G"), and showing two buttons with
 * the same label would be unanswerable.
 */
export function pickAnswerOptions(correct: StaffPrompt, pool: readonly StaffPrompt[]): string[] {
  const correctName = noteNameFor(correct);

  // How close a name's *nearest* occurrence on the staff is to the correct prompt's position.
  function distanceFor(name: string): number {
    const values = pool.filter((p) => noteNameFor(p) === name).map((p) => p.value);
    return Math.min(...values.map((v) => Math.abs(v - correct.value)));
  }

  const otherNames = ALL_NOTE_NAMES.filter((name) => name !== correctName);
  const sorted = [...otherNames].sort((a, b) => distanceFor(a) - distanceFor(b));

  const nearCandidates = sorted.slice(0, 3);
  const near = nearCandidates[Math.floor(Math.random() * nearCandidates.length)];

  const rest = otherNames.filter((name) => name !== near);
  const randomExtras = shuffled(rest).slice(0, 2);

  return shuffled([correctName, near, ...randomExtras]);
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
