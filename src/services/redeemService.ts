import { ApiClient, API_ENDPOINTS } from '../config/api';

export interface RedeemCodeData {
  code: string;
  user_id: number;
}

export interface RedeemResponse {
  success: boolean;
  message: string;
  type: 'prompt' | 'upgrade';
}

export class RedeemService {
  static async claimCode(data: RedeemCodeData): Promise<RedeemResponse> {
    const response = await ApiClient.post(API_ENDPOINTS.REDEEM_CLAIM, data);
    return response;
  }
}