import { ApiClient, API_ENDPOINTS } from '../config/api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    const response: AuthResponse = await ApiClient.post(API_ENDPOINTS.LOGIN, credentials);
    
    if (response.success && response.user) {
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return response.user;
    }
    
    throw new Error('Login failed');
  }

  static async register(data: RegisterData): Promise<User> {
    const response: AuthResponse = await ApiClient.post(API_ENDPOINTS.REGISTER, data);
    
    if (response.success && response.user) {
      // Store user in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return response.user;
    }
    
    throw new Error('Registration failed');
  }

  static logout(): void {
    localStorage.removeItem('currentUser');
  }

  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  static updateStoredUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}