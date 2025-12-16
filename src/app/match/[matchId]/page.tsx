import { Metadata } from 'next';
import { MatchDetailsClient } from './MatchDetailsClient';

interface Props {
  params: {
    matchId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { matchId } = params;
  
  return {
    title: `Match ${matchId} - TITIK SPORTS`,
    description: 'Watch live match and view detailed statistics, lineups, and match facts.',
  };
}

export default function MatchDetailsPage({ params }: Props) {
  return <MatchDetailsClient matchId={params.matchId} />;
}