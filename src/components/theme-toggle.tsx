'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'brewboard-theme';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark =
      stored !== null
        ? stored === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded px-3 py-1 text-sm border border-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
    >
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
