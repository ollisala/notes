import type { Handedness } from '../useHandedness';

interface HandednessToggleProps {
  handedness: Handedness;
  onToggle: () => void;
}

export function HandednessToggle({ handedness, onToggle }: HandednessToggleProps) {
  const isRight = handedness === 'right';

  return (
    <button
      type="button"
      className="handedness-toggle"
      onClick={onToggle}
      aria-label={isRight ? 'Switch fretboard to left-handed (nut on left)' : 'Switch fretboard to right-handed (nut on right)'}
    >
      <span className={isRight ? 'handedness-toggle-knob handedness-toggle-knob-right' : 'handedness-toggle-knob'}>
        {isRight ? 'R' : 'L'}
      </span>
    </button>
  );
}
