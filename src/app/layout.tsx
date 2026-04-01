import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'BrewBoard',
  description: 'Track and share your craft beer collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-stone-800 min-h-screen dark:bg-stone-900 dark:text-amber-50">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
