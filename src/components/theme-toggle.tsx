'use client';

import { useEffect, useState } from 'react';

const THEME_KEY = 'brewboard-theme';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  if (document.documentElement.classList.contains('dark')) {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }

    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  const nextLabel = theme === 'dark' ? 'Light mode' : 'Dark mode';

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(currentTheme => {
          const resolvedTheme =
            currentTheme ??
            (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

          return resolvedTheme === 'dark' ? 'light' : 'dark';
        })
      }
      className="fixed right-4 top-4 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-sm transition-colors hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
      aria-label="Toggle color theme"
    >
      {nextLabel}
    </button>
  );
}
