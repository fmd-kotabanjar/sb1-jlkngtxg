import { ApiClient, API_ENDPOINTS } from '../config/api';
import { PromptRequest } from '../types';

export interface RequestFilters {
  user_id?: number;
  status?: 'all' | 'pending' | 'approved' | 'rejected';
  priority?: 'all' | 'low' | 'medium' | 'high';
  search?: string;
}

export interface CreateRequestData {
  user_id: number;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateRequestData {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export class RequestService {
  static async getRequests(filters: RequestFilters = {}): Promise<PromptRequest[]> {
    const params: Record<string, string> = {};
    
    if (filters.user_id) {
      params.user_id = filters.user_id.toString();
    }
    
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    
    if (filters.priority && filters.priority !== 'all') {
      params.priority = filters.priority;
    }
    
    if (filters.search) {
      params.search = filters.search;
    }

    const response = await ApiClient.get(API_ENDPOINTS.REQUESTS, params);
    return response.requests || [];
  }

  static async createRequest(data: CreateRequestData): Promise<PromptRequest> {
    const response = await ApiClient.post(API_ENDPOINTS.REQUESTS_CREATE, data);
    return response.request;
  }

  static async updateRequest(data: UpdateRequestData): Promise<PromptRequest> {
    const response = await ApiClient.put(API_ENDPOINTS.REQUESTS_UPDATE, data);
    return response.request;
  }
}