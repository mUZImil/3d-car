import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luxury Car — Phase 1',
  description: 'Minimal Next.js + Three.js automotive prototype.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
