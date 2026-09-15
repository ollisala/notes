import { useState } from 'react';
import { FretboardView } from './FretboardView';
import { noteAt, type FretPosition } from '../models/fretboard';
import { pitchName, randomPitchClass, type PitchClass } from '../models/pitchClass';

export function GuitarQuiz() {
  const [target, setTarget] = useState<PitchClass>(() => randomPitchClass());
  const [answeredPosition, setAnsweredPosition] = useState<FretPosition | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const hasAnswered = answeredPosition !== null;
  const pressedNote = answeredPosition ? noteAt(answeredPosition.string, answeredPosition.fret) : null;
  const isCorrect = pressedNote === target;

  function selectPosition(position: FretPosition) {
    if (hasAnswered) return;
    setAnsweredPosition(position);
    setTotalCount((n) => n + 1);
    if (noteAt(position.string, position.fret) === target) setCorrectCount((n) => n + 1);
  }

  function next() {
    setTarget(randomPitchClass(target));
    setAnsweredPosition(null);
  }

  return (
    <div className="quiz">
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
              You played {pressedNote !== null ? pitchName(pressedNote) : '?'} — looking for {pitchName(target)}
            </p>
          </div>
        ))}

      <FretboardView target={target} answeredPosition={answeredPosition} onTap={selectPosition} />

      <button className="next-button" style={{ visibility: hasAnswered ? 'visible' : 'hidden' }} onClick={next}>
        Next
      </button>
    </div>
  );
}
