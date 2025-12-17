import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StreamingData } from '@/types/match.types';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Environment variable NEXT_PUBLIC_SUPABASE_URL is not set');
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  /**
   * Get streaming link for a match
   */
  async getStreamingLink(matchId: string): Promise<string | null> {
    try {
      console.log(`🔍 Fetching streaming data for match ID: ${matchId}`);

      // Try live_streams table first
      const { data, error } = await this.client
        .from('live_streams')
        .select('sources, is_live, home_team, away_team, league')
        .eq('match_id', matchId)
        .single();

      if (error) {
        // If not found in live_streams, try matches table
        if (error.code === 'PGRST116') {
          console.log('ℹ️ No data in live_streams, trying matches table...');
          return await this.getStreamingLinkFromMatches(matchId);
        }
        throw error;
      }

      if (!data || !data.sources || !Array.isArray(data.sources)) {
        console.log('ℹ️ No streaming sources found');
        return null;
      }

      // Select best source
      const bestSource = this.selectBestSource(data.sources);
      
      if (bestSource?.source) {
        console.log(`✅ Streaming link found: ${bestSource.type}`);
        return bestSource.source;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching streaming link:', error);
      return null;
    }
  }

  /**
   * Fallback: Get streaming link from matches table
   */
  private async getStreamingLinkFromMatches(matchId: string): Promise<string | null> {
    try {
      const { data, error } = await this.client
        .from('matches')
        .select('link_streaming')
        .eq('match_id', matchId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data.link_streaming || null;
    } catch (error) {
      console.error('❌ Error fetching from matches table:', error);
      return null;
    }
  }

  /**
   * Select the best streaming source
   * Priority: HLS > FLV > others
   */
  private selectBestSource(sources: any[]): any {
    const priority: Record<string, number> = {
      'HLS': 1,
      'FLV': 2,
      'MP4': 3,
      'default': 999,
    };

    const sortedSources = [...sources].sort((a, b) => {
      const aPriority = priority[a.type] || priority.default;
      const bPriority = priority[b.type] || priority.default;
      return aPriority - bPriority;
    });

    return sortedSources.find(
      (source) =>
        source &&
        source.source &&
        (source.source.includes('.m3u8') ||
          source.source.includes('.flv') ||
          source.source.includes('http'))
    ) || sortedSources[0];
  }

  /**
   * Get all streaming data for debugging
   */
  async debugStreamData(matchId: string): Promise<any> {
    try {
      const { data, error } = await this.client
        .from('live_streams')
        .select('*')
        .eq('match_id', matchId)
        .single();

      if (error) {
        const { data: matchesData } = await this.client
          .from('matches')
          .select('*')
          .eq('match_id', matchId)
          .single();

        return matchesData;
      }

      return data;
    } catch (error) {
      console.error('Debug error:', error);
      return null;
    }
  }
}

// Singleton instance
export const supabaseService = new SupabaseService();

export default supabaseService;
