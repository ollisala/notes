import { STAFF_RANGES, type StaffRange } from '../models/staffRange';

interface RangeSelectorProps {
  range: StaffRange;
  onChange: (range: StaffRange) => void;
}

export function RangeSelector({ range, onChange }: RangeSelectorProps) {
  const current = STAFF_RANGES.find((r) => r.key === range) ?? STAFF_RANGES[0];

  return (
    <div className="range-picker">
      <p className="range-heading">Note range</p>
      <div className="range-selector">
        {STAFF_RANGES.map(({ key, label }) => (
          <button
            key={key}
            className={range === key ? 'range-button range-button-active' : 'range-button'}
            onClick={() => onChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="range-description">{current.description}</p>
    </div>
  );
}
