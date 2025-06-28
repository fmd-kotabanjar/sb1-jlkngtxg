import { ApiClient, API_ENDPOINTS } from '../config/api';
import { User } from '../types';

export interface UserFilters {
  role?: 'all' | 'basic' | 'premium' | 'admin';
  search?: string;
}

export interface UpdateUserData {
  id: number;
  name: string;
  email: string;
  role: 'basic' | 'premium' | 'admin';
  requestQuota: number;
  usedQuota: number;
}

export class UserService {
  static async getUsers(filters: UserFilters = {}): Promise<User[]> {
    const params: Record<string, string> = {};
    
    if (filters.role && filters.role !== 'all') {
      params.role = filters.role;
    }
    
    if (filters.search) {
      params.search = filters.search;
    }

    const response = await ApiClient.get(API_ENDPOINTS.USERS, params);
    return response.users || [];
  }

  static async updateUser(data: UpdateUserData): Promise<User> {
    const response = await ApiClient.put(API_ENDPOINTS.USERS_UPDATE, data);
    return response.user;
  }

  static async deleteUser(id: number): Promise<void> {
    await ApiClient.delete(API_ENDPOINTS.USERS_DELETE, { id: id.toString() });
  }
}