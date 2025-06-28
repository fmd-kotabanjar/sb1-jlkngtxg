// API Configuration for RumahWeb deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // Production: relative path untuk RumahWeb
  : '/api'; // Development: juga gunakan relative path

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Prompts
  PROMPTS: `${API_BASE_URL}/prompts`,
  PROMPTS_CREATE: `${API_BASE_URL}/prompts/create`,
  PROMPTS_UPDATE: `${API_BASE_URL}/prompts/update`,
  PROMPTS_DELETE: `${API_BASE_URL}/prompts/delete`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  USERS_UPDATE: `${API_BASE_URL}/users/update`,
  USERS_DELETE: `${API_BASE_URL}/users/delete`,
  
  // Requests
  REQUESTS: `${API_BASE_URL}/requests`,
  REQUESTS_CREATE: `${API_BASE_URL}/requests/create`,
  REQUESTS_UPDATE: `${API_BASE_URL}/requests/update`,
  
  // Redeem
  REDEEM_CLAIM: `${API_BASE_URL}/redeem/claim`,
  
  // Favorites
  FAVORITES_TOGGLE: `${API_BASE_URL}/favorites/toggle`,
  
  // Stats
  STATS_DASHBOARD: `${API_BASE_URL}/stats/dashboard`,
};

// HTTP client with error handling
export class ApiClient {
  private static async request(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get(url: string, params?: Record<string, string>) {
    const searchParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(url + searchParams, { method: 'GET' });
  }

  static async post(url: string, data?: any) {
    return this.request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put(url: string, data?: any) {
    return this.request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete(url: string, params?: Record<string, string>) {
    const searchParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(url + searchParams, { method: 'DELETE' });
  }
}

export default ApiClient;