import { addSemitones, type PitchClass } from './pitchClass';

/** Standard guitar tuning and note lookup for the open position (frets 0-5). */

/** Open-string pitch classes, low string (index 0) to high string (index 5). */
export const OPEN_STRINGS: PitchClass[] = [4, 9, 2, 7, 11, 4]; // E A D G B E

/** Open-string octaves (scientific pitch notation), same order: E2 A2 D3 G3 B3 E4. */
const OPEN_STRING_OCTAVES = [2, 2, 3, 3, 3, 4];

/** Human-readable labels, same order as OPEN_STRINGS. */
export const STRING_LABELS = ['low E', 'A', 'D', 'G', 'B', 'high E'];

export const FRET_COUNT = 6; // frets 0-5

export function noteAt(stringIndex: number, fret: number): PitchClass {
  return addSemitones(OPEN_STRINGS[stringIndex], fret);
}

/** Absolute pitch (semitones, octave-aware) of the open string. */
function openAbsolutePitch(stringIndex: number): number {
  return OPEN_STRING_OCTAVES[stringIndex] * 12 + OPEN_STRINGS[stringIndex];
}

/** Absolute pitch (semitones, octave-aware) at a given fret. */
export function absolutePitchAt(stringIndex: number, fret: number): number {
  return openAbsolutePitch(stringIndex) + fret;
}

export interface FretPosition {
  string: number;
  fret: number;
}

/** All (string, fret) positions that play the given pitch class, in any octave. */
export function positionsFor(target: PitchClass): FretPosition[] {
  const positions: FretPosition[] = [];
  for (let s = 0; s < OPEN_STRINGS.length; s++) {
    for (let f = 0; f < FRET_COUNT; f++) {
      if (noteAt(s, f) === target) positions.push({ string: s, fret: f });
    }
  }
  return positions;
}

/** All (string, fret) positions that play this exact pitch (same octave, not just note name). */
export function positionsForExactPitch(targetAbsolutePitch: number): FretPosition[] {
  const positions: FretPosition[] = [];
  for (let s = 0; s < OPEN_STRINGS.length; s++) {
    for (let f = 0; f < FRET_COUNT; f++) {
      if (absolutePitchAt(s, f) === targetAbsolutePitch) positions.push({ string: s, fret: f });
    }
  }
  return positions;
}

/** How a quiz decides whether a tapped fretboard spot is correct, and what to say if not. */
export interface FretMatch {
  /** The pitch class to display/name (e.g. "F♯"), regardless of matching mode. */
  pitchClass: PitchClass;
  /** Every (string, fret) spot that counts as correct. */
  correctPositions: FretPosition[];
  /** The correct fret on a given string, or null if this string can't reach it within frets 0-5. */
  fretOnString: (stringIndex: number) => number | null;
}

/** Matches any octave of the given pitch class - used when the prompt is just a note name. */
export function pitchClassMatch(target: PitchClass): FretMatch {
  return {
    pitchClass: target,
    correctPositions: positionsFor(target),
    fretOnString: (stringIndex) => {
      const fret = (((target - OPEN_STRINGS[stringIndex]) % 12) + 12) % 12;
      return fret < FRET_COUNT ? fret : null;
    },
  };
}

/** Matches only the exact pitch (same octave) - used when the prompt is a specific staff note. */
export function exactPitchMatch(targetAbsolutePitch: number): FretMatch {
  const pitchClass = (((targetAbsolutePitch % 12) + 12) % 12) as PitchClass;
  return {
    pitchClass,
    correctPositions: positionsForExactPitch(targetAbsolutePitch),
    fretOnString: (stringIndex) => {
      const fret = targetAbsolutePitch - openAbsolutePitch(stringIndex);
      return fret >= 0 && fret < FRET_COUNT ? fret : null;
    },
  };
}
