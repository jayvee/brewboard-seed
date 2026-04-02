'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('brewboard-theme');
    if (stored) {
      setDark(stored === 'dark');
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('brewboard-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('brewboard-theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      className="rounded px-2 py-1 text-sm border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200"
    >
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
