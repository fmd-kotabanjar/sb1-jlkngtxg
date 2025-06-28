import { ApiClient, API_ENDPOINTS } from '../config/api';

export interface DashboardStats {
  totalUsers: number;
  totalPrompts: number;
  totalRequests: number;
  pendingRequests: number;
  promptTypes: {
    free: number;
    exclusive: number;
    super: number;
  };
  userRoles: {
    basic: number;
    premium: number;
    admin: number;
  };
}

export class StatsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await ApiClient.get(API_ENDPOINTS.STATS_DASHBOARD);
    return response.stats;
  }
}