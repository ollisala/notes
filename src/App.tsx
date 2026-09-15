import { useState } from 'react';
import { StaffQuiz } from './components/StaffQuiz';
import { GuitarQuiz } from './components/GuitarQuiz';
import './App.css';

type Tab = 'staff' | 'guitar';

function App() {
  const [tab, setTab] = useState<Tab>('staff');

  return (
    <div className="app">
      <header className="app-header">
        <h1>{tab === 'staff' ? 'Staff' : 'Guitar'}</h1>
      </header>

      <main className="app-main">{tab === 'staff' ? <StaffQuiz /> : <GuitarQuiz />}</main>

      <nav className="tab-bar">
        <button className={tab === 'staff' ? 'tab-button tab-button-active' : 'tab-button'} onClick={() => setTab('staff')}>
          <span className="tab-icon">&#9834;</span>
          <span>Staff</span>
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
