// Environment Variables - These should be in a .env.local file
// NESSIE_API_KEY=your_nessie_api_key_here
// NEXT_PUBLIC_API_URL=http://localhost:3000

// For production:
// NEXT_PUBLIC_API_URL=https://your-domain.com

// Optional: Add these for future AI integration
// OPENAI_API_KEY=your_openai_key_here
// ANTHROPIC_API_KEY=your_anthropic_key_here

// constants/api.ts - API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    CUSTOMERS: '/api/customers',
    PROPOSE_RULE: '/api/propose-rule', 
    SPIN: '/api/spin',
  },
  TIMEOUT: 10000, // 10 seconds
};

// API client with error handling
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Customer API methods
  async getCustomer(customerId: string, includeWalletWizard = true) {
    return this.request(`${API_CONFIG.ENDPOINTS.CUSTOMERS}?id=${customerId}&includeWalletWizard=${includeWalletWizard}`);
  }

  async updateCustomerStats(customerId: string, data: any) {
    return this.request(API_CONFIG.ENDPOINTS.CUSTOMERS, {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateWalletWizardStats',
        customerId,
        data
      })
    });
  }

  async updateCustomerChallenge(customerId: string, challengeData: any) {
    return this.request(API_CONFIG.ENDPOINTS.CUSTOMERS, {
      method: 'POST', 
      body: JSON.stringify({
        action: 'completeChallenge',
        customerId,
        data: challengeData
      })
    });
  }

  // Spin API methods
  async getTodaysChallenge(customerId: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.SPIN}?customerId=${customerId}&action=today`);
  }

  async getSpinStats(customerId: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.SPIN}?customerId=${customerId}&action=stats`);
  }

  async getSpinHistory(customerId: string) {
    return this.request(`${API_CONFIG.ENDPOINTS.SPIN}?customerId=${customerId}&action=history`);
  }

  async proposeChallenge(customerId: string, sessionData: any) {
    return this.request(API_CONFIG.ENDPOINTS.SPIN, {
      method: 'POST',
      body: JSON.stringify({
        action: 'propose',
        customerId,
        ...sessionData
      })
    });
  }

  async acceptChallenge(customerId: string, challengeId: string) {
    return this.request(API_CONFIG.ENDPOINTS.SPIN, {
      method: 'POST',
      body: JSON.stringify({
        action: 'accept',
        customerId,
        challengeId
      })
    });
  }

  async completeChallenge(customerId: string, challengeId: string, completionData: any) {
    return this.request(API_CONFIG.ENDPOINTS.SPIN, {
      method: 'POST',
      body: JSON.stringify({
        action: 'complete',
        customerId,
        challengeId,
        data: completionData
      })
    });
  }

  async rejectChallenge(customerId: string, challengeId: string) {
    return this.request(API_CONFIG.ENDPOINTS.SPIN, {
      method: 'POST',
      body: JSON.stringify({
        action: 'reject',
        customerId,
        challengeId
      })
    });
  }

  // Rule API methods
  async proposeRule(data: any) {
    return this.request(API_CONFIG.ENDPOINTS.PROPOSE_RULE, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getRules(category?: string, difficulty?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    const endpoint = `${API_CONFIG.ENDPOINTS.PROPOSE_RULE}${params.toString() ? '?' + params.toString() : ''}`;
    return this.request(endpoint);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();