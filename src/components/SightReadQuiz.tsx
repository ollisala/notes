import { useEffect } from 'react';
import { StaffView } from './StaffView';
import { FretboardView } from './FretboardView';
import { FretboardFeedback } from './FretboardFeedback';
import { useFretboardQuiz } from '../hooks/useFretboardQuiz';
import { exactPitchMatch, positionsForExactPitch } from '../models/fretboard';
import { allStaffPrompts, absolutePitchFor, promptKey, type StaffPrompt } from '../models/staffNote';
import { filterByStaffRange, type StaffRange } from '../models/staffRange';
import type { Score } from '../App';

const WEIGHTS_KEY = 'note-trainer-weights-sightread';

// Open position (frets 0-5) only spans about two octaves on the neck, so most of the staff's
// full range can't actually be played there in its exact octave. Only quiz on staff notes
// that have at least one real, exact-pitch answer somewhere on the visible fretboard -
// otherwise every tap on an unreachable note would be marked wrong no matter what.
const REACHABLE_POOL = allStaffPrompts().filter((prompt) => positionsForExactPitch(absolutePitchFor(prompt)).length > 0);

function matchFor(prompt: StaffPrompt) {
  return exactPitchMatch(absolutePitchFor(prompt));
}

interface SightReadQuizProps {
  range: StaffRange;
  mirrored: boolean;
  onScoreChange: (score: Score) => void;
}

/** Shows a note on the staff; the answer is tapping where it's played on the fretboard. */
export function SightReadQuiz({ range, mirrored, onScoreChange }: SightReadQuizProps) {
  return (
    <div className="quiz quiz-sightread">
      {/* Remounts the round whenever the range changes, so the current note always comes
          from the newly selected pool and the session score resets for the new mode. */}
      <SightReadRound key={range} range={range} mirrored={mirrored} onScoreChange={onScoreChange} />
    </div>
  );
}

function SightReadRound({
  range,
  mirrored,
  onScoreChange,
}: {
  range: StaffRange;
  mirrored: boolean;
  onScoreChange: (score: Score) => void;
}) {
  const pool = filterByStaffRange(REACHABLE_POOL, range);
  const q = useFretboardQuiz(pool, WEIGHTS_KEY, promptKey, matchFor);

  useEffect(() => {
    onScoreChange({ correct: q.correctCount, total: q.totalCount });
  }, [q.correctCount, q.totalCount, onScoreChange]);

  return (
    <>
      <p className="target-note-label">Find this note on the fretboard</p>

      <div className="stage stage-prompt">
        <StaffView value={q.item.value} sharp={q.item.sharp} />
      </div>

      {q.hasAnswered && q.answeredPosition && (
        <FretboardFeedback
          isCorrect={q.isCorrect}
          pressedNote={q.pressedNote}
          stringLabel={q.stringLabel}
          fret={q.answeredPosition.fret}
          openNote={q.openNote}
          target={q.target}
          correctFretOnString={q.correctFretOnString}
          reachableOnString={q.reachableOnString}
        />
      )}

      <div className="stage stage-answer">
        <FretboardView
          correctPositions={q.correctPositions}
          answeredPosition={q.answeredPosition}
          onTap={q.selectPosition}
          mirrored={mirrored}
        />
      </div>

      <button className="next-button" style={{ visibility: q.hasAnswered ? 'visible' : 'hidden' }} onClick={q.next}>
        Next
      </button>
    </>
  );
}
