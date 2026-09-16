import { FRET_COUNT, OPEN_STRINGS, type FretPosition } from '../models/fretboard';
import { pitchName } from '../models/pitchClass';

const VIEW_WIDTH = 320;
const NECK_HEIGHT = 150;
const FRET_LABEL_HEIGHT = 20;
const VIEW_HEIGHT = NECK_HEIGHT + FRET_LABEL_HEIGHT;
const NECK_TOP = FRET_LABEL_HEIGHT;
const LEFT_MARGIN = 40;
const TOP_MARGIN = 18;
const STRING_COUNT = OPEN_STRINGS.length;
const FRET_WIDTH = (VIEW_WIDTH - LEFT_MARGIN) / FRET_COUNT;
const STRING_SPACING = (NECK_HEIGHT - TOP_MARGIN * 2) / (STRING_COUNT - 1);

// Standard guitar fret markers (inlays), filtered to whatever range is currently shown - so
// this keeps working automatically if the fretboard is ever extended further up the neck.
const MARKER_FRETS = [1, 3, 5, 7, 9, 12].filter((fret) => fret < FRET_COUNT);

interface FretboardViewProps {
  correctPositions: FretPosition[];
  answeredPosition: FretPosition | null;
  onTap: (position: FretPosition) => void;
  /** 'right' mirrors the diagram so the nut is on the right instead of the left. */
  mirrored?: boolean;
}

export function FretboardView({ correctPositions, answeredPosition, onTap, mirrored = false }: FretboardViewProps) {
  // Every x-coordinate below is computed in the un-mirrored (nut-on-left) layout, then passed
  // through this to flip the whole diagram horizontally for left-handed players.
  const mx = (x: number) => (mirrored ? VIEW_WIDTH - x : x);

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
      aria-label={`Guitar fretboard, open position, nut on the ${mirrored ? 'right' : 'left'}`}
    >
      {MARKER_FRETS.map((fret) => {
        const x = mx(LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH);
        return (
          <text
            key={fret}
            x={x}
            y={FRET_LABEL_HEIGHT / 2}
            fontSize={10}
            textAnchor="middle"
            dominantBaseline="central"
            className="fret-number-label"
          >
            {fret}
          </text>
        );
      })}

      {Array.from({ length: FRET_COUNT }, (_, fret) => {
        const x = mx(LEFT_MARGIN + fret * FRET_WIDTH);
        return (
          <line
            key={fret}
            x1={x}
            y1={NECK_TOP + TOP_MARGIN}
            x2={x}
            y2={NECK_TOP + NECK_HEIGHT - TOP_MARGIN}
            stroke="currentColor"
            strokeWidth={fret === 0 ? 4 : 1}
          />
        );
      })}

      {Array.from({ length: STRING_COUNT }, (_, string) => {
        const y = NECK_TOP + TOP_MARGIN + string * STRING_SPACING;
        return <line key={string} x1={mx(LEFT_MARGIN)} y1={y} x2={mx(VIEW_WIDTH)} y2={y} stroke="currentColor" strokeWidth={1.5} />;
      })}

      {Array.from({ length: STRING_COUNT }, (_, string) => {
        const y = NECK_TOP + TOP_MARGIN + string * STRING_SPACING;
        return (
          <text
            key={string}
            x={mx(LEFT_MARGIN / 2)}
            y={y}
            fontSize={11}
            textAnchor="middle"
            dominantBaseline="central"
            className="fret-string-label"
          >
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
          const rectX = mirrored ? VIEW_WIDTH - cellMaxX : cellMinX;
          const y = NECK_TOP + TOP_MARGIN + string * STRING_SPACING;
          return (
            <rect
              key={`${string}-${fret}`}
              x={rectX}
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
          const x = mx(fret === 0 ? LEFT_MARGIN : LEFT_MARGIN + (fret - 0.5) * FRET_WIDTH);
          const y = NECK_TOP + TOP_MARGIN + string * STRING_SPACING;
          return <circle key={`${string}-${fret}`} cx={x} cy={y} r={7} className={dotClass(string, fret)} pointerEvents="none" />;
        }),
      )}
    </svg>
  );
}
