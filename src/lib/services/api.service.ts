import axios, { AxiosInstance, AxiosError } from 'axios';
import { MatchesResponse, MatchDetails } from '@/types/match.types';

// ✅ MEMORY CACHE untuk mengurangi API calls
const memoryCache = new Map<string, { data: any; expiry: number }>();

class ApiService {
  private client: AxiosInstance;
  private baseURL = 'https://www.fotmob.com/api/data';

  constructor() {
    // ✅ Axios untuk client-side only
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (config.params) {
          config.params._t = Date.now();
        } else {
          config.params = { _t: Date.now() };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error('API Error:', error.response.status);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * ✅ UNIVERSAL FETCH - Works in both server & client
   */
  private async universalFetch<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}${endpoint}?${queryString}`;

    // ✅ Server-side: Use native fetch (serializable for ISR)
    if (typeof window === 'undefined') {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 120 }, // ISR cache 2 minutes
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    }

    // ✅ Client-side: Use Axios (better error handling)
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  /**
   * ✅ FETCH dengan Memory Cache (client-side only)
   */
  private async cachedFetch<T>(
    key: string, 
    fetcher: () => Promise<T>,
    ttl: number = 2 * 60 * 1000
  ): Promise<T> {
    // Skip cache on server-side (ISR handles caching)
    if (typeof window === 'undefined') {
      return fetcher();
    }

    // Client-side cache
    const cached = memoryCache.get(key);
    if (cached && Date.now() < cached.expiry) {
      console.log(`✅ Cache hit: ${key}`);
      return cached.data;
    }

    console.log(`🔄 Fetching: ${key}`);
    const data = await fetcher();
    
    memoryCache.set(key, {
      data,
      expiry: Date.now() + ttl
    });

    return data;
  }

  /**
   * ✅ FETCH MATCHES - Works in both server & client
   */
  async fetchMatches(date: Date): Promise<MatchesResponse> {
    const dateStr = this.formatDate(date);
    const cacheKey = `matches-${dateStr}`;

    return this.cachedFetch(
      cacheKey,
      async () => {
        const data = await this.universalFetch<MatchesResponse>('/matches', {
          date: dateStr,
          timezone: 'Asia/Bangkok',
          ccode3: 'IDN',
        });

        // Process scores
        if (data.leagues) {
          data.leagues.forEach((league) => {
            league.matches?.forEach((match) => {
              if (!match.status?.started && !match.status?.finished) {
                match.home.score = undefined;
                match.away.score = undefined;
              }
            });
          });
        }

        return data;
      },
      2 * 60 * 1000
    );
  }

  /**
   * ✅ FETCH MATCH DETAILS
   */
  async fetchMatchDetails(matchId: string): Promise<MatchDetails> {
    const cacheKey = `match-${matchId}`;
    
    return this.cachedFetch(
      cacheKey,
      async () => {
        return this.universalFetch<MatchDetails>('/matchDetails', {
          matchId,
        });
      },
      5 * 60 * 1000
    );
  }

  /**
   * ✅ FETCH LEAGUES
   */
  async fetchLeagues(): Promise<any> {
    const cacheKey = 'leagues-all';
    
    return this.cachedFetch(
      cacheKey,
      async () => {
        return this.universalFetch('/allLeagues', {
          locale: 'en',
          ccode3: 'IDN',
        });
      },
      30 * 60 * 1000
    );
  }

  /**
   * ✅ FETCH STANDINGS
   */
  async fetchStandings(leagueId: number = 47): Promise<any> {
    const cacheKey = `standings-${leagueId}`;
    
    return this.cachedFetch(
      cacheKey,
      async () => {
        return this.universalFetch('/leagues', {
          id: leagueId,
          ccode3: 'IDN',
        });
      },
      10 * 60 * 1000
    );
  }

  /**
   * ✅ CLEAR CACHE
   */
  clearCache(): void {
    memoryCache.clear();
    console.log('✅ Cache cleared');
  }

  /**
   * Format date to YYYYMMDD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}

// Singleton instance
export const apiService = new ApiService();
export default apiService;