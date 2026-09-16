import { pitchName, type PitchClass } from '../models/pitchClass';
import { describeStepsUp } from '../models/interval';

interface FretboardFeedbackProps {
  isCorrect: boolean;
  pressedNote: PitchClass | null;
  stringLabel: string | null;
  fret: number;
  openNote: PitchClass | null;
  target: PitchClass;
  correctFretOnString: number | null;
  reachableOnString: boolean;
}

export function FretboardFeedback({
  isCorrect,
  pressedNote,
  stringLabel,
  fret,
  openNote,
  target,
  correctFretOnString,
  reachableOnString,
}: FretboardFeedbackProps) {
  if (isCorrect) {
    return <p className="feedback feedback-correct">Correct!</p>;
  }

  return (
    <div className="feedback feedback-wrong">
      <p className="feedback-title">Not quite — it's {pitchName(target)}</p>
      <p className="feedback-detail">
        You played {pressedNote !== null ? pitchName(pressedNote) : '?'} on the {stringLabel} string (fret {fret}).
      </p>
      {openNote !== null && correctFretOnString !== null && (
        <p className="feedback-theory">
          {reachableOnString
            ? `Open ${stringLabel} is ${pitchName(openNote)}. ${describeStepsUp(
                openNote,
                target,
              )} So on this string the right fret is ${correctFretOnString}, not ${fret}.`
            : `Open ${stringLabel} is ${pitchName(openNote)}. ${describeStepsUp(openNote, target)} That's past fret 5, so ${pitchName(
                target,
              )} doesn't fall within frets 0–5 on the ${stringLabel} string here — try one of the highlighted spots on another string instead.`}
        </p>
      )}
    </div>
  );
}
