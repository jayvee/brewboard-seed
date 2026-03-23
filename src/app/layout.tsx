import type { Metadata } from 'next';
import './globals.css';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'BrewBoard',
  description: 'Track and share your craft beer collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-amber-50 dark:bg-stone-900 text-stone-800 dark:text-amber-50 min-h-full transition-colors duration-200">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
