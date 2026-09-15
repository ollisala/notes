import { useState } from 'react';
import { StaffQuiz } from './components/StaffQuiz';
import { GuitarQuiz } from './components/GuitarQuiz';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './useTheme';
import './App.css';

type Tab = 'staff' | 'guitar';

function App() {
  const [tab, setTab] = useState<Tab>('staff');
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="app">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <main className="app-main">{tab === 'staff' ? <StaffQuiz /> : <GuitarQuiz />}</main>

      <nav className="tab-bar">
        <button className={tab === 'staff' ? 'tab-button tab-button-active' : 'tab-button'} onClick={() => setTab('staff')}>
          <span className="tab-icon">&#9834;</span>
          <span>Notes</span>
        </button>
        <button className={tab === 'guitar' ? 'tab-button tab-button-active' : 'tab-button'} onClick={() => setTab('guitar')}>
          <span className="tab-icon">&#127928;</span>
          <span>Guitar</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
