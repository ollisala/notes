import { useState } from 'react';
import { OPEN_STRINGS, STRING_LABELS, noteAt, type FretMatch, type FretPosition } from '../models/fretboard';
import { loadWeights, pickWeighted, recordResult, type Weights } from '../models/spacedPractice';

/**
 * Shared state/logic for any quiz where the answer is tapping a spot on the fretboard: picks
 * the next prompt (weighted toward ones you've missed), tracks score, and works out the
 * right-string/right-fret theory explanation when you tap the wrong spot.
 *
 * `item` is whatever is being asked about (a pitch class, a specific staff note, ...);
 * `matchFor` derives what counts as a correct tap for it - matching any octave of a pitch
 * class, or only the exact pitch, depending on the quiz.
 */
export function useFretboardQuiz<T>(
  pool: readonly T[],
  weightsKey: string,
  keyFor: (item: T) => string,
  matchFor: (item: T) => FretMatch,
) {
  const [weights, setWeights] = useState<Weights>(() => loadWeights(weightsKey));
  const [item, setItem] = useState<T>(() => pickWeighted(pool, weights, keyFor));
  const [answeredPosition, setAnsweredPosition] = useState<FretPosition | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const match = matchFor(item);
  const target = match.pitchClass;
  const hasAnswered = answeredPosition !== null;
  const pressedNote = answeredPosition ? noteAt(answeredPosition.string, answeredPosition.fret) : null;
  const isCorrect = answeredPosition !== null && isCorrectPosition(match, answeredPosition);

  const openNote = answeredPosition ? OPEN_STRINGS[answeredPosition.string] : null;
  const stringLabel = answeredPosition ? STRING_LABELS[answeredPosition.string] : null;
  const correctFretOnString = answeredPosition ? match.fretOnString(answeredPosition.string) : null;
  const reachableOnString = correctFretOnString !== null;

  function selectPosition(position: FretPosition) {
    if (hasAnswered) return;
    setAnsweredPosition(position);
    setTotalCount((n) => n + 1);
    const correct = isCorrectPosition(match, position);
    if (correct) setCorrectCount((n) => n + 1);
    setWeights((w) => recordResult(weightsKey, w, keyFor(item), correct));
  }

  function next() {
    setItem((current) => pickWeighted(pool, weights, keyFor, current));
    setAnsweredPosition(null);
  }

  return {
    item,
    target,
    correctPositions: match.correctPositions,
    hasAnswered,
    answeredPosition,
    isCorrect,
    pressedNote,
    openNote,
    stringLabel,
    correctFretOnString,
    reachableOnString,
    correctCount,
    totalCount,
    selectPosition,
    next,
  };
}

function isCorrectPosition(match: FretMatch, position: FretPosition): boolean {
  return match.correctPositions.some((p) => p.string === position.string && p.fret === position.fret);
}
