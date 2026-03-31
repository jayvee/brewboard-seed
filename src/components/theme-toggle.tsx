'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('brewboard-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('brewboard-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <button onClick={toggle} aria-label="Toggle dark mode">
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
