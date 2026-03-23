'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check localStorage
    const savedTheme = localStorage.getItem('brewboard-theme');
    
    // 2. Check OS preference if no saved theme
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('brewboard-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  if (theme === null) return null; // Avoid hydration mismatch or flicker by not rendering until theme is determined

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-full bg-amber-100 dark:bg-stone-700 text-stone-800 dark:text-amber-50 shadow-md border border-amber-200 dark:border-stone-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
