import type { Metadata } from 'next';
import './globals.css';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'BrewBoard',
  description: 'Track and share your craft beer collection',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-stone-800 min-h-screen">
        <div className="fixed top-2 right-2 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
