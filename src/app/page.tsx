import { Metadata } from 'next';
import { MatchList } from '@/components/matches/MatchList';

export const metadata: Metadata = {
  title: 'TITIK SPORTS - Live Football Scores & Match Schedules',
  description: 'Get live football scores, match schedules, lineups, and statistics from leagues around the world. Your ultimate football companion.',
  keywords: ['football', 'soccer', 'live scores', 'match schedules', 'fixtures', 'results'],
  openGraph: {
    title: 'TITIK SPORTS - Live Football Scores',
    description: 'Live football scores and match schedules',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TITIK SPORTS - Live Football Scores',
    description: 'Live football scores and match schedules',
  },
};

export default function HomePage() {
  return (
    <main className="pb-20">
      {/* DatePicker akan ada di layout sebagai client component */}
      <MatchList />
    </main>
  );
}