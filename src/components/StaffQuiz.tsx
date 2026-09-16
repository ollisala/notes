import { useEffect, useMemo, useState } from 'react';
import { StaffView } from './StaffView';
import { allStaffPrompts, noteNameFor, pickAnswerOptions, promptKey, type StaffPrompt } from '../models/staffNote';
import { loadWeights, pickWeighted, recordResult, type Weights } from '../models/spacedPractice';
import { filterByStaffRange, type StaffRange } from '../models/staffRange';
import type { Score } from '../App';

const WEIGHTS_KEY = 'note-trainer-weights-staff';
const ALL_PROMPTS = allStaffPrompts();

interface StaffQuizProps {
  range: StaffRange;
  onScoreChange: (score: Score) => void;
}

export function StaffQuiz({ range, onScoreChange }: StaffQuizProps) {
  return (
    <div className="quiz quiz-staff">
      {/* Remounts the round whenever the range changes, so the current note always comes
          from the newly selected pool and the session score resets for the new mode. */}
      <StaffRound key={range} range={range} onScoreChange={onScoreChange} />
    </div>
  );
}

function StaffRound({ range, onScoreChange }: { range: StaffRange; onScoreChange: (score: Score) => void }) {
  const pool = useMemo(() => filterByStaffRange(ALL_PROMPTS, range), [range]);

  const [weights, setWeights] = useState<Weights>(() => loadWeights(WEIGHTS_KEY));
  const [prompt, setPrompt] = useState<StaffPrompt>(() => pickWeighted(pool, weights, promptKey));
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    onScoreChange({ correct: correctCount, total: totalCount });
  }, [correctCount, totalCount, onScoreChange]);

  const options = useMemo(() => pickAnswerOptions(prompt, pool), [prompt, pool]);

  const hasAnswered = selectedName !== null;
  const correctName = noteNameFor(prompt);

  function selectOption(name: string) {
    if (hasAnswered) return;
    setSelectedName(name);
    setTotalCount((n) => n + 1);
    const correct = name === correctName;
    if (correct) setCorrectCount((n) => n + 1);
    setWeights((w) => recordResult(WEIGHTS_KEY, w, promptKey(prompt), correct));
  }

  function next() {
    setPrompt((p) => pickWeighted(pool, weights, promptKey, p));
    setSelectedName(null);
  }

  function buttonClass(name: string): string {
    if (!selectedName) return 'note-button';
    if (name === correctName) return 'note-button note-button-correct';
    if (name === selectedName) return 'note-button note-button-wrong';
    return 'note-button';
  }

  return (
    <>
      <p className="target-note-label">What note is this?</p>

      <div className="stage">
        <StaffView value={prompt.value} sharp={prompt.sharp} />
      </div>

      {hasAnswered && (
        <div className="feedback">
          {selectedName === correctName ? (
            <p className="feedback-correct">Correct!</p>
          ) : (
            <p className="feedback-title">Not quite — it's {correctName}</p>
          )}
        </div>
      )}

      <div className="answer-tile">
        <div className="answer-grid">
          {options.map((name) => (
            <button key={name} className={buttonClass(name)} disabled={hasAnswered} onClick={() => selectOption(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <button className="next-button" style={{ visibility: hasAnswered ? 'visible' : 'hidden' }} onClick={next}>
        Next
      </button>
    </>
  );
}
