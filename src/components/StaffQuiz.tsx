import { useState } from 'react';
import { StaffView } from './StaffView';
import { STAFF_VALUES, letterFor, type StaffValue } from '../models/staffNote';
import { loadWeights, pickWeighted, recordResult, type Weights } from '../models/spacedPractice';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const WEIGHTS_KEY = 'note-trainer-weights-staff';

export function StaffQuiz() {
  const [weights, setWeights] = useState<Weights>(() => loadWeights(WEIGHTS_KEY));
  const [currentValue, setCurrentValue] = useState<StaffValue>(() => pickWeighted(STAFF_VALUES, weights, String));
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const hasAnswered = selectedLetter !== null;
  const correctLetter = letterFor(currentValue);

  function selectLetter(letter: string) {
    if (hasAnswered) return;
    setSelectedLetter(letter);
    setTotalCount((n) => n + 1);
    const correct = letter === correctLetter;
    if (correct) setCorrectCount((n) => n + 1);
    setWeights((w) => recordResult(WEIGHTS_KEY, w, String(currentValue), correct));
  }

  function next() {
    setCurrentValue((cv) => pickWeighted(STAFF_VALUES, weights, String, cv));
    setSelectedLetter(null);
  }

  function buttonClass(letter: string): string {
    if (!selectedLetter) return 'note-button';
    if (letter === correctLetter) return 'note-button note-button-correct';
    if (letter === selectedLetter) return 'note-button note-button-wrong';
    return 'note-button';
  }

  return (
    <div className="quiz quiz-staff">
      <p className="score">
        Score: {correctCount}/{totalCount}
      </p>

      <div className="stage">
        <StaffView value={currentValue} />
      </div>

      {hasAnswered && (
        <div className="feedback">
          {selectedLetter === correctLetter ? (
            <p className="feedback-correct">Correct!</p>
          ) : (
            <p className="feedback-title">Not quite — it's {correctLetter}</p>
          )}
        </div>
      )}

      <div className="note-grid">
        {LETTERS.map((letter) => (
          <button key={letter} className={buttonClass(letter)} disabled={hasAnswered} onClick={() => selectLetter(letter)}>
            {letter}
          </button>
        ))}
      </div>

      <button className="next-button" style={{ visibility: hasAnswered ? 'visible' : 'hidden' }} onClick={next}>
        Next
      </button>
    </div>
  );
}
