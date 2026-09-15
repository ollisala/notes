import { pitchName, type PitchClass } from './pitchClass';

/** Natural note pairs that are only a half step apart with no sharp between them. */
const NO_SHARP_BETWEEN = new Set(['E-F', 'F-E', 'B-C', 'C-B']);

/** The chromatic note sequence from `from` up to `from + distance`, inclusive of both ends. */
function chromaticPath(from: PitchClass, distance: number): string {
  const notes: string[] = [];
  for (let i = 0; i <= distance; i++) {
    notes.push(pitchName((from + i) % 12));
  }
  return notes.join(' → ');
}

/**
 * A full sentence describing the distance from `from` up to `to`, in semitones/frets, with a
 * short bit of music-theory reasoning: which notes are in between and why.
 */
export function describeStepsUp(from: PitchClass, to: PitchClass): string {
  const distance = (((to - from) % 12) + 12) % 12;
  const fromName = pitchName(from);
  const toName = pitchName(to);

  if (distance === 1) {
    const isNaturalHalfStep = NO_SHARP_BETWEEN.has(`${fromName}-${toName}`);
    return isNaturalHalfStep
      ? `${toName} is just 1 fret above ${fromName} — a half step, since they sit right next to each other with no sharp note between them.`
      : `${toName} is just 1 fret above ${fromName} — a half step.`;
  }
  if (distance === 2) {
    return `${toName} is 2 frets above ${fromName} — a whole step, since there's a sharp note (${pitchName(
      (from + 1) % 12,
    )}) in between.`;
  }
  return `${toName} is ${distance} frets above ${fromName}, stepping up through ${chromaticPath(from, distance)}.`;
}
