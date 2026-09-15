import { useState } from 'react';
import { FretboardView } from './FretboardView';
import { FRET_COUNT, OPEN_STRINGS, STRING_LABELS, noteAt, type FretPosition } from '../models/fretboard';
import { ALL_PITCH_CLASSES, pitchName, type PitchClass } from '../models/pitchClass';
import { describeStepsUp } from '../models/interval';
import { loadWeights, pickWeighted, recordResult, type Weights } from '../models/spacedPractice';

const WEIGHTS_KEY = 'note-trainer-weights-guitar';

export function GuitarQuiz() {
  const [weights, setWeights] = useState<Weights>(() => loadWeights(WEIGHTS_KEY));
  const [target, setTarget] = useState<PitchClass>(() => pickWeighted(ALL_PITCH_CLASSES, weights, String));
  const [answeredPosition, setAnsweredPosition] = useState<FretPosition | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const hasAnswered = answeredPosition !== null;
  const pressedNote = answeredPosition ? noteAt(answeredPosition.string, answeredPosition.fret) : null;
  const isCorrect = pressedNote === target;

  const openNote = answeredPosition ? OPEN_STRINGS[answeredPosition.string] : null;
  const stringLabel = answeredPosition ? STRING_LABELS[answeredPosition.string] : null;
  const correctFretOnString = openNote !== null ? (((target - openNote) % 12) + 12) % 12 : null;
  const reachableOnString = correctFretOnString !== null && correctFretOnString < FRET_COUNT;

  function selectPosition(position: FretPosition) {
    if (hasAnswered) return;
    setAnsweredPosition(position);
    setTotalCount((n) => n + 1);
    const correct = noteAt(position.string, position.fret) === target;
    if (correct) setCorrectCount((n) => n + 1);
    setWeights((w) => recordResult(WEIGHTS_KEY, w, String(target), correct));
  }

  function next() {
    setTarget((t) => pickWeighted(ALL_PITCH_CLASSES, weights, String, t));
    setAnsweredPosition(null);
  }

  return (
    <div className="quiz quiz-guitar">
      <p className="score">
        Score: {correctCount}/{totalCount}
      </p>

      <div className="target-note">
        <p className="target-note-label">Find this note</p>
        <p className="target-note-value">{pitchName(target)}</p>
      </div>

      {hasAnswered &&
        (isCorrect ? (
          <p className="feedback feedback-correct">Correct!</p>
        ) : (
          <div className="feedback feedback-wrong">
            <p className="feedback-title">Not quite</p>
            <p className="feedback-detail">
              You played {pressedNote !== null ? pitchName(pressedNote) : '?'} on the {stringLabel} string (fret {answeredPosition.fret}).
            </p>
            {openNote !== null && correctFretOnString !== null && (
              <p className="feedback-theory">
                {reachableOnString
                  ? `Open ${stringLabel} is ${pitchName(openNote)}. ${describeStepsUp(
                      openNote,
                      target,
                    )} So on this string the right fret is ${correctFretOnString}, not ${answeredPosition.fret}.`
                  : `${pitchName(
                      target,
                    )} doesn't fall within frets 0–5 on the ${stringLabel} string — try one of the highlighted spots on another string instead.`}
              </p>
            )}
          </div>
        ))}

      <div className="stage">
        <FretboardView target={target} answeredPosition={answeredPosition} onTap={selectPosition} />
      </div>

      <button className="next-button" style={{ visibility: hasAnswered ? 'visible' : 'hidden' }} onClick={next}>
        Next
      </button>
    </div>
  );
}
