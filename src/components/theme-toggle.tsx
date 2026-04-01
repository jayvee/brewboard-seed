'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const STORAGE_KEY = 'brewboard-theme';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'light' || v === 'dark') return v;
  return null;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

type ThemeContextValue = {
  theme: Theme;
  ready: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    const t = stored ?? getSystemTheme();
    setTheme(t);
    applyTheme(t);
    setReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getStoredTheme() === null) {
        const t = getSystemTheme();
        setTheme(t);
        applyTheme(t);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, ready, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('ThemeToggle must be used within ThemeProvider');
  }
  const { theme, ready, toggle } = ctx;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      className="rounded-lg border border-stone-300 bg-white/90 px-3 py-2 text-sm font-medium text-stone-800 shadow-sm backdrop-blur hover:bg-amber-50 disabled:opacity-60 dark:border-stone-600 dark:bg-stone-800/90 dark:text-stone-100 dark:hover:bg-stone-700"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {ready ? (theme === 'dark' ? 'Light' : 'Dark') : '…'}
    </button>
  );
}
