import { FretboardView } from './FretboardView';
import { FretboardFeedback } from './FretboardFeedback';
import { useFretboardQuiz } from '../hooks/useFretboardQuiz';
import { pitchClassMatch } from '../models/fretboard';
import { ALL_PITCH_CLASSES, pitchName } from '../models/pitchClass';

const WEIGHTS_KEY = 'note-trainer-weights-guitar';

interface GuitarQuizProps {
  mirrored: boolean;
}

export function GuitarQuiz({ mirrored }: GuitarQuizProps) {
  const q = useFretboardQuiz(ALL_PITCH_CLASSES, WEIGHTS_KEY, String, pitchClassMatch);

  return (
    <div className="quiz quiz-guitar">
      <p className="score">
        Score: {q.correctCount}/{q.totalCount}
      </p>

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
