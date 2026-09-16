import { useEffect, useState } from 'react';

export type Handedness = 'left' | 'right';

export function useHandedness(): [Handedness, () => void] {
  const [handedness, setHandedness] = useState<Handedness>(() => {
    const stored = localStorage.getItem('handedness');
    return stored === 'right' ? 'right' : 'left';
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
