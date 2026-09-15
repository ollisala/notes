import type { Theme } from '../useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={isDark ? 'theme-toggle-knob theme-toggle-knob-dark' : 'theme-toggle-knob'}>
        {isDark ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
      </span>
    </button>
  );
}
