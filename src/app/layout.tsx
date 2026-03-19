import type { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrewBoard',
  description: 'Track and share your craft beer collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const setInitialTheme = `
    (function() {
      var storageKey = 'brewboard-theme';
      var root = document.documentElement;
      var saved = localStorage.getItem(storageKey);
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
      root.classList.toggle('dark', theme === 'dark');
    })();
  `;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className="bg-amber-50 text-stone-800 dark:bg-stone-900 dark:text-stone-100 min-h-screen">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
