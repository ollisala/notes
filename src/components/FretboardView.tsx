import { FRET_COUNT, OPEN_STRINGS, positionsFor, type FretPosition } from '../models/fretboard';
import { pitchName, type PitchClass } from '../models/pitchClass';

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 150;
const LEFT_MARGIN = 40;
const TOP_MARGIN = 18;
const STRING_COUNT = OPEN_STRINGS.length;
const FRET_WIDTH = (VIEW_WIDTH - LEFT_MARGIN) / FRET_COUNT;
const STRING_SPACING = (VIEW_HEIGHT - TOP_MARGIN * 2) / (STRING_COUNT - 1);

interface FretboardViewProps {
  target: PitchClass;
  answeredPosition: FretPosition | null;
  onTap: (position: FretPosition) => void;
}

export function FretboardView({ target, answeredPosition, onTap }: FretboardViewProps) {
  const correctPositions = positionsFor(target);

  function dotClass(string: number, fret: number): string {
    if (!answeredPosition) return 'fret-dot fret-dot-idle';
    const isCorrectSpot = correctPositions.some((p) => p.string === string && p.fret === fret);
    const isTapped = answeredPosition.string === string && answeredPosition.fret === fret;
    if (isTapped && isCorrectSpot) return 'fret-dot fret-dot-correct';
    if (isTapped) return 'fret-dot fret-dot-wrong';
    if (isCorrectSpot) return 'fret-dot fret-dot-reveal';
    return 'fret-dot fret-dot-idle';
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="fretboard-view"
      role="img"
      aria-label="Guitar fretboard, open position"
    >
      {Array.from({ length: FRET_COUNT }, (_, fret) => {
        const x = LEFT_MARGIN + fret * FRET_WIDTH;
        return (
          <line
            key={fret}
            x1={x}
            y1={TOP_MARGIN}
            x2={x}
            y2={VIEW_HEIGHT - TOP_MARGIN}
            stroke="currentColor"
            strokeWidth={fret === 0 ? 4 : 1}
          />
        );
      })}

      {Array.from({ length: STRING_COUNT }, (_, string) => {
        const y = TOP_MARGIN + string * STRING_SPACING;
        return <line key={string} x1={LEFT_MARGIN} y1={y} x2={VIEW_WIDTH} y2={y} stroke="currentColor" strokeWidth={1.5} />;
      })}

      {Array.from({ length: STRING_COUNT }, (_, string) => {
        const y = TOP_MARGIN + string * STRING_SPACING;
        return (
          <text key={string} x={LEFT_MARGIN / 2} y={y} fontSize={11} textAnchor="middle" dominantBaseline="central" className="fret-string-label">
            {pitchName(OPEN_STRINGS[string])}
          </text>
        );
      })}

      {/* Tap targets: one generous rectangle per grid cell (rather than a small dot) so edge
          cells - especially the open-string column at the left edge - are easy to hit. */}
      {Array.from({ length: STRING_COUNT }, (_, string) =>
        Array.from({ length: FRET_COUNT }, (_, fret) => {
          const cellMinX = fret === 0 ? 0 : LEFT_MARGIN + (fret - 1) * FRET_WIDTH;
          const cellMaxX = LEFT_MARGIN + fret * FRET_WIDTH;
          const y = TOP_MARGIN + string * STRING_SPACING;
          return (
            <rect
              key={`${string}-${fret}`}
              x={cellMinX}
              y={y - STRING_SPACING / 2}
              width={cellMaxX - cellMinX}
              height={STRING_SPACING}
              fill="transparent"
              onClick={() => !answeredPosition && onTap({ string, fret })}
              style={{ cursor: answeredPosition ? 'default' : 'pointer' }}
            />
          );
        }),
      )}

      {/* Visible dots, drawn on top and non-interactive (the rects above handle taps). */}
      {Array.from({ length: STRING_COUNT }, (_, string) =>
        Array.from({ length: FRET_COUNT }, (_, fret) => {
          const x = fret === 0 ? LEFT_MARGIN : LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH;
          const y = TOP_MARGIN + string * STRING_SPACING;
          return <circle key={`${string}-${fret}`} cx={x} cy={y} r={7} className={dotClass(string, fret)} pointerEvents="none" />;
        }),
      )}
    </svg>
  );
}
