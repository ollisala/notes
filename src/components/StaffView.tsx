import { ledgerLinePositions, type StaffValue } from '../models/staffNote';

const LINE_SPACING = 16;
const VIEW_WIDTH = 320;
// Tall enough for the extended range down to written E3 (open low-E string) and up to A5,
// with stems and ledger lines, without clipping.
const VIEW_HEIGHT = LINE_SPACING * 14;
const STAFF_TOP = (VIEW_HEIGHT - LINE_SPACING * 4) / 2;
const STAFF_LEFT = 40;
const STAFF_RIGHT = VIEW_WIDTH - 24;
const STAFF_BOTTOM_Y = STAFF_TOP + LINE_SPACING * 4;

const NOTE_X = STAFF_LEFT + LINE_SPACING * 5.4;
const NOTE_WIDTH = LINE_SPACING * 1.15;
const NOTE_HEIGHT = LINE_SPACING * 0.8;
const STEM_LENGTH = LINE_SPACING * 3.5;

// Clef baseline y, calibrated against a real rendered screenshot (Chrome headless) so the
// glyph's visible ink center lands on the staff's center line - SVG text layout metrics for
// this Unicode symbol don't match its visual ink, same issue as native font rendering.
const CLEF_BASELINE_Y = STAFF_TOP + LINE_SPACING * 3.83;
const CLEF_FONT_SIZE = LINE_SPACING * 6.4;

interface StaffViewProps {
  value: StaffValue;
  sharp?: boolean;
}

export function StaffView({ value, sharp = false }: StaffViewProps) {
  const noteY = STAFF_BOTTOM_Y - value * (LINE_SPACING / 2);
  const stemUp = value < 4;
  const stemX = stemUp ? NOTE_X + NOTE_WIDTH / 2 : NOTE_X - NOTE_WIDTH / 2;
  const stemY2 = stemUp ? noteY - STEM_LENGTH : noteY + STEM_LENGTH;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="staff-view"
      role="img"
      aria-label="Musical staff with a note"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const y = STAFF_TOP + i * LINE_SPACING;
        return (
          <line key={i} x1={STAFF_LEFT} y1={y} x2={STAFF_RIGHT} y2={y} stroke="currentColor" strokeWidth={1.5} />
        );
      })}

      <text
        x={STAFF_LEFT + 22}
        y={CLEF_BASELINE_Y}
        fontSize={CLEF_FONT_SIZE}
        textAnchor="middle"
        fill="currentColor"
      >
        &#x1D11E;
      </text>

      {ledgerLinePositions(value).map((position) => {
        const y = STAFF_BOTTOM_Y - position * (LINE_SPACING / 2);
        return (
          <line
            key={position}
            x1={NOTE_X - NOTE_WIDTH}
            y1={y}
            x2={NOTE_X + NOTE_WIDTH}
            y2={y}
            stroke="currentColor"
            strokeWidth={1.5}
          />
        );
      })}

      <line x1={stemX} y1={noteY} x2={stemX} y2={stemY2} stroke="currentColor" strokeWidth={1.8} />

      {sharp && (
        <text
          x={NOTE_X - NOTE_WIDTH * 2}
          y={noteY}
          fontSize={LINE_SPACING * 2.1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
        >
          &#x266F;
        </text>
      )}

      <ellipse cx={NOTE_X} cy={noteY} rx={NOTE_WIDTH / 2} ry={NOTE_HEIGHT / 2} fill="currentColor" />
    </svg>
  );
}
