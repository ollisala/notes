import { useEffect, useState } from 'react';

export type Handedness = 'left' | 'right';

// Most players are right-handed (standard guitar, nut on the left in a top-down fretboard
// diagram), so that's the default until someone explicitly picks left-handed (mirrored, nut
// on the right - how a left-handed player's own guitar is strung).
export function useHandedness(): [Handedness, () => void] {
  const [handedness, setHandedness] = useState<Handedness>(() => {
    const stored = localStorage.getItem('handedness');
    return stored === 'left' ? 'left' : 'right';
  });

  useEffect(() => {
    try {
      localStorage.setItem('handedness', handedness);
    } catch {
      // ignore (private browsing, storage disabled, etc.)
    }
  }, [handedness]);

  function toggle() {
    setHandedness((h) => (h === 'left' ? 'right' : 'left'));
  }

  return [handedness, toggle];
}
