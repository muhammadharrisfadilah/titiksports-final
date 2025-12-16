import axios, { AxiosInstance, AxiosError } from 'axios';
import { MatchesResponse, MatchDetails } from '@/types/match.types';

class ApiService {
  private client: AxiosInstance;
  private useProxy: boolean;

  constructor() {
    this.useProxy = process.env.NODE_ENV === 'production';
    
    this.client = axios.create({
      baseURL: this.useProxy 
        ? '/api/proxy' // Use Next.js API route as proxy
        : process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp to prevent caching
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
          console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch matches for a specific date
   */
  async fetchMatches(date: Date): Promise<MatchesResponse> {
    const dateStr = this.formatDate(date);
    
    try {
      const response = await this.client.get<MatchesResponse>('/data/matches', {
        params: {
          date: dateStr,
          timezone: 'Asia/Bangkok',
          ccode3: 'IDN',
        },
      });

      // Process scores untuk matches yang belum dimulai
      if (response.data.leagues) {
        response.data.leagues.forEach((league) => {
          league.matches?.forEach((match) => {
            if (!match.status?.started && !match.status?.finished) {
              match.home.score = undefined;
              match.away.score = undefined;
            }
          });
        });
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  /**
   * Fetch match details
   */
  async fetchMatchDetails(matchId: string): Promise<MatchDetails> {
    try {
      const response = await this.client.get<MatchDetails>('/data/matchDetails', {
        params: { matchId },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

  /**
   * Fetch leagues
   */
  async fetchLeagues(): Promise<any> {
    try {
      const response = await this.client.get('/allLeagues', {
        params: {
          locale: 'en',
          ccode3: 'IDN',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  }

  /**
   * Fetch standings
   */
  async fetchStandings(leagueId: number = 47): Promise<any> {
    try {
      const response = await this.client.get('/leagues', {
        params: {
          id: leagueId,
          ccode3: 'IDN',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
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

// Export untuk digunakan di components
export default apiService;