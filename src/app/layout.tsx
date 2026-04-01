import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider, ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'BrewBoard',
  description: 'Track and share your craft beer collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-amber-50 text-stone-800 min-h-screen dark:bg-stone-950 dark:text-stone-100">
        <ThemeProvider>
          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>
          <div className="dark:[&_.border-stone-200]:border-stone-700 dark:[&_.bg-amber-100]:bg-amber-900/40 dark:[&_.bg-white]:bg-stone-800 dark:[&_.text-amber-800]:text-amber-200 dark:[&_.text-stone-400]:text-stone-500 dark:[&_.text-stone-500]:text-stone-400 dark:[&_.text-stone-900]:text-stone-100 dark:[&_h1]:text-stone-100 dark:[&_h2]:text-stone-100">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
