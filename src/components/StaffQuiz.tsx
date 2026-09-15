import { useState } from 'react';
import { StaffView } from './StaffView';
import { letterFor, randomStaffValue, type StaffValue } from '../models/staffNote';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function StaffQuiz() {
  const [currentValue, setCurrentValue] = useState<StaffValue>(() => randomStaffValue());
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const hasAnswered = selectedLetter !== null;
  const correctLetter = letterFor(currentValue);

  function selectLetter(letter: string) {
    if (hasAnswered) return;
    setSelectedLetter(letter);
    setTotalCount((n) => n + 1);
    if (letter === correctLetter) setCorrectCount((n) => n + 1);
  }

  function next() {
    setCurrentValue(randomStaffValue(currentValue));
    setSelectedLetter(null);
  }

  function buttonClass(letter: string): string {
    if (!selectedLetter) return 'note-button';
    if (letter === correctLetter) return 'note-button note-button-correct';
    if (letter === selectedLetter) return 'note-button note-button-wrong';
    return 'note-button';
  }

  return (
    <div className="quiz">
      <p className="score">
        Score: {correctCount}/{totalCount}
      </p>

      <StaffView value={currentValue} />

      {hasAnswered && (
        <p className={selectedLetter === correctLetter ? 'feedback feedback-correct' : 'feedback feedback-wrong'}>
          {selectedLetter === correctLetter ? 'Correct!' : `Not quite — it's ${correctLetter}`}
        </p>
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
