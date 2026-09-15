import { addSemitones, type PitchClass } from './pitchClass';

/** Standard guitar tuning and note lookup for the open position (frets 0-5). */

/** Open-string pitch classes, low string (index 0) to high string (index 5). */
export const OPEN_STRINGS: PitchClass[] = [4, 9, 2, 7, 11, 4]; // E A D G B E

export const FRET_COUNT = 6; // frets 0-5

export function noteAt(stringIndex: number, fret: number): PitchClass {
  return addSemitones(OPEN_STRINGS[stringIndex], fret);
}

export interface FretPosition {
  string: number;
  fret: number;
}

/** All (string, fret) positions where the given pitch class is played. */
export function positionsFor(target: PitchClass): FretPosition[] {
  const positions: FretPosition[] = [];
  for (let s = 0; s < OPEN_STRINGS.length; s++) {
    for (let f = 0; f < FRET_COUNT; f++) {
      if (noteAt(s, f) === target) positions.push({ string: s, fret: f });
    }
  }
  return positions;
}
