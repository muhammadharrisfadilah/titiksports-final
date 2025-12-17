import { Metadata } from 'next';
import { MatchList } from '@/components/matches/MatchList';
import { apiService } from '@/lib/services/api.service';

// ✅ ISR: Regenerate page setiap 2 menit
export const revalidate = 120;

// ✅ Dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

// ✅ METADATA untuk SEO
export const metadata: Metadata = {
  title: 'TITIK SPORTS - Live Football Scores & Match Schedules',
  description: 'Get live football scores, match schedules, lineups, and statistics from leagues around the world.',
  keywords: ['football', 'soccer', 'live scores', 'match schedules'],
  openGraph: {
    title: 'TITIK SPORTS - Live Football Scores',
    description: 'Live football scores and match schedules',
    images: ['/og-image.png'],
    type: 'website',
  },
};

// ✅ SERVER-SIDE DATA FETCHING with proper error handling
async function getInitialMatches() {
  try {
    console.log('🔄 Fetching matches on server...');
    const matches = await apiService.fetchMatches(new Date());
    console.log('✅ Matches fetched successfully');
    return matches;
  } catch (error) {
    console.error('❌ Error fetching matches on server:', error);
    // Return null instead of throwing to prevent build failure
    return null;
  }
}

export default async function HomePage() {
  // ✅ Fetch di server (ISR)
  const initialMatches = await getInitialMatches();

  return (
    <main className="pb-20">
      {/* ✅ Client component dengan initial data dari server */}
      <MatchList initialData={initialMatches} />
    </main>
  );
}