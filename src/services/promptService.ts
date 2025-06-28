import { ApiClient, API_ENDPOINTS } from '../config/api';
import { Prompt } from '../types';

export interface PromptFilters {
  type?: 'all' | 'free' | 'exclusive' | 'super';
  category?: string;
  search?: string;
  active_only?: boolean;
}

export interface CreatePromptData {
  title: string;
  description: string;
  content: string;
  type: 'free' | 'exclusive' | 'super';
  category: string;
  tags: string[];
  created_by: number;
  isActive?: boolean;
  lynkUrl?: string;
}

export interface UpdatePromptData extends CreatePromptData {
  id: number;
}

export class PromptService {
  static async getPrompts(filters: PromptFilters = {}): Promise<Prompt[]> {
    const params: Record<string, string> = {};
    
    if (filters.type && filters.type !== 'all') {
      params.type = filters.type;
    }
    
    if (filters.category && filters.category !== 'all') {
      params.category = filters.category;
    }
    
    if (filters.search) {
      params.search = filters.search;
    }
    
    if (filters.active_only !== undefined) {
      params.active_only = filters.active_only.toString();
    }

    const response = await ApiClient.get(API_ENDPOINTS.PROMPTS, params);
    return response.prompts || [];
  }

  static async createPrompt(data: CreatePromptData): Promise<Prompt> {
    const response = await ApiClient.post(API_ENDPOINTS.PROMPTS_CREATE, data);
    return response.prompt;
  }

  static async updatePrompt(data: UpdatePromptData): Promise<Prompt> {
    const response = await ApiClient.put(API_ENDPOINTS.PROMPTS_UPDATE, data);
    return response.prompt;
  }

  static async deletePrompt(id: number): Promise<void> {
    await ApiClient.delete(API_ENDPOINTS.PROMPTS_DELETE, { id: id.toString() });
  }

  static async toggleFavorite(userId: number, promptId: number): Promise<string> {
    const response = await ApiClient.post(API_ENDPOINTS.FAVORITES_TOGGLE, {
      user_id: userId,
      prompt_id: promptId
    });
    return response.action; // 'added' or 'removed'
  }
}