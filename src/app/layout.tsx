import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TITIK SPORTS',
  description: 'Live football scores and match schedules',
  manifest: '/manifest.json',
  themeColor: '#ff6600',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="mobile-container max-w-[480px] mx-auto bg-surface min-h-screen relative shadow-sm">
            <Header />
            {children}
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}