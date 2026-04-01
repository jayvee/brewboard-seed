import type { Metadata } from 'next';
import './globals.css';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'BrewBoard',
  description: 'Track and share your craft beer collection',
};

const themeBootScript = `
(() => {
  try {
    const storageKey = 'brewboard-theme';
    const storedTheme = localStorage.getItem(storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme === 'dark' || storedTheme === 'light'
      ? storedTheme
      : prefersDark
        ? 'dark'
        : 'light';

    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch {
    document.documentElement.classList.toggle(
      'dark',
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    );
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-amber-50 text-stone-800 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <div className="fixed right-4 top-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
