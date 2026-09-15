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
