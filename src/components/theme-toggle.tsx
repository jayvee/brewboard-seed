'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('brewboard-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('brewboard-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 text-stone-600 hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-700"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
