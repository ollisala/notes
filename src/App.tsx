import { useState } from 'react';
import { StaffQuiz } from './components/StaffQuiz';
import { GuitarQuiz } from './components/GuitarQuiz';
import { SightReadQuiz } from './components/SightReadQuiz';
import { ThemeToggle } from './components/ThemeToggle';
import { HandednessToggle } from './components/HandednessToggle';
import { useTheme } from './useTheme';
import { useHandedness } from './useHandedness';
import './App.css';

type Tab = 'staff' | 'guitar' | 'sightread';

function App() {
  const [tab, setTab] = useState<Tab>('staff');
  const [theme, toggleTheme] = useTheme();
  const [handedness, toggleHandedness] = useHandedness();
  const mirrored = handedness === 'right';

  return (
    <div className="app">
      <main className="app-main">
        {tab === 'staff' ? (
          <StaffQuiz />
        ) : tab === 'guitar' ? (
          <GuitarQuiz mirrored={mirrored} />
        ) : (
          <SightReadQuiz mirrored={mirrored} />
        )}
      </main>

      <div className="settings-cluster">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <HandednessToggle handedness={handedness} onToggle={toggleHandedness} />
      </div>

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
