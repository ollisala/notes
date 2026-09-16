import { useState } from 'react';
import { StaffQuiz } from './components/StaffQuiz';
import { GuitarQuiz } from './components/GuitarQuiz';
import { SightReadQuiz } from './components/SightReadQuiz';
import { ThemeToggle } from './components/ThemeToggle';
import { HandednessToggle } from './components/HandednessToggle';
import { RangeSelector } from './components/RangeSelector';
import { useTheme } from './useTheme';
import { useHandedness } from './useHandedness';
import { loadStaffRange, saveStaffRange, type StaffRange } from './models/staffRange';
import './App.css';

type Tab = 'staff' | 'guitar' | 'sightread';

export interface Score {
  correct: number;
  total: number;
}

const STAFF_RANGE_KEY = 'note-trainer-staff-range';
const SIGHTREAD_RANGE_KEY = 'note-trainer-sightread-range';

function App() {
  const [tab, setTab] = useState<Tab>('staff');
  const [theme, toggleTheme] = useTheme();
  const [handedness, toggleHandedness] = useHandedness();
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [staffRange, setStaffRange] = useState<StaffRange>(() => loadStaffRange(STAFF_RANGE_KEY));
  const [sightReadRange, setSightReadRange] = useState<StaffRange>(() => loadStaffRange(SIGHTREAD_RANGE_KEY));
  // Right-handed (the default) is the standard nut-on-left layout; left-handed mirrors it.
  const mirrored = handedness === 'left';

  function changeStaffRange(next: StaffRange) {
    setStaffRange(next);
    saveStaffRange(STAFF_RANGE_KEY, next);
  }

  function changeSightReadRange(next: StaffRange) {
    setSightReadRange(next);
    saveStaffRange(SIGHTREAD_RANGE_KEY, next);
  }

  return (
    <div className="app">
      <div className="settings-cluster">
        <p className="score">
          Score: {score.correct}/{score.total}
        </p>
        <div className="settings-toggles">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <HandednessToggle handedness={handedness} onToggle={toggleHandedness} />
        </div>
      </div>

      <main className="app-main">
        {tab === 'staff' ? (
          <StaffQuiz range={staffRange} onScoreChange={setScore} />
        ) : tab === 'guitar' ? (
          <GuitarQuiz mirrored={mirrored} onScoreChange={setScore} />
        ) : (
          <SightReadQuiz range={sightReadRange} mirrored={mirrored} onScoreChange={setScore} />
        )}
      </main>

      {tab !== 'guitar' && (
        <div className="range-bar">
          <RangeSelector
            range={tab === 'staff' ? staffRange : sightReadRange}
            onChange={tab === 'staff' ? changeStaffRange : changeSightReadRange}
          />
        </div>
      )}

      <nav className="tab-bar">
        <button className={tab === 'staff' ? 'tab-button tab-button-active' : 'tab-button'} onClick={() => setTab('staff')}>
          Notes
        </button>
        <button className={tab === 'guitar' ? 'tab-button tab-button-active' : 'tab-button'} onClick={() => setTab('guitar')}>
          Guitar
        </button>
        <button
          className={tab === 'sightread' ? 'tab-button tab-button-active' : 'tab-button'}
          onClick={() => setTab('sightread')}
        >
          Sight Read
        </button>
      </nav>
    </div>
  );
}

export default App;
