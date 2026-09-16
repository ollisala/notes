import { useEffect } from 'react';
import { FretboardView } from './FretboardView';
import { FretboardFeedback } from './FretboardFeedback';
import { useFretboardQuiz } from '../hooks/useFretboardQuiz';
import { pitchClassMatch } from '../models/fretboard';
import { ALL_PITCH_CLASSES, pitchName } from '../models/pitchClass';
import type { Score } from '../App';

const WEIGHTS_KEY = 'note-trainer-weights-guitar';

interface GuitarQuizProps {
  mirrored: boolean;
  onScoreChange: (score: Score) => void;
}

export function GuitarQuiz({ mirrored, onScoreChange }: GuitarQuizProps) {
  const q = useFretboardQuiz(ALL_PITCH_CLASSES, WEIGHTS_KEY, String, pitchClassMatch);

  useEffect(() => {
    onScoreChange({ correct: q.correctCount, total: q.totalCount });
  }, [q.correctCount, q.totalCount, onScoreChange]);

  return (
    <div className="quiz quiz-guitar">
      <div className="target-note">
        <p className="target-note-label">Find this note</p>
        <p className="target-note-value">{pitchName(q.target)}</p>
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

      <div className="stage">
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
    </div>
  );
}
