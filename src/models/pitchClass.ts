/** One of the 12 pitches in an octave, using sharps (never flats). 0 = C, 11 = B. */
export type PitchClass = number;

const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export const ALL_PITCH_CLASSES: PitchClass[] = NAMES.map((_, i) => i);

export function pitchName(p: PitchClass): string {
  return NAMES[p];
}

export function addSemitones(p: PitchClass, semitones: number): PitchClass {
  return (((p + semitones) % 12) + 12) % 12;
}

const NATURAL_PITCH_CLASSES: Record<string, PitchClass> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** The pitch class for a natural note letter (A-G), with no sharp or flat. */
export function naturalPitchClass(letter: string): PitchClass {
  return NATURAL_PITCH_CLASSES[letter];
}
