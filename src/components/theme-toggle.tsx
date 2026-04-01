'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'brewboard-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => {
        const nextTheme = isDark ? 'light' : 'dark';
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }}
      className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur transition hover:border-stone-400 hover:bg-white dark:border-stone-700 dark:bg-stone-900/90 dark:text-stone-100 dark:hover:border-stone-500 dark:hover:bg-stone-800"
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
