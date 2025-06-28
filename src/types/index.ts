export type UserRole = 'basic' | 'premium' | 'admin';

export type PromptType = 'free' | 'exclusive' | 'super';

export type ProductType = 'own' | 'sponsor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  request_quota: number;
  used_quota: number;
  created_at: string;
  quota_reset_date?: string;
  next_quota_reset?: string;
  claimedPrompts: string[];
  favoritePrompts: string[];
  // Computed properties for compatibility
  requestQuota: number;
  usedQuota: number;
  createdAt: string;
  quotaResetDate?: string;
  nextQuotaReset?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  type: PromptType;
  category: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  redeem_code?: string;
  lynk_url?: string;
  confirmation_url?: string;
  usage_count: number;
  rating: number;
  // Computed properties for compatibility
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  redeemCode?: string;
  lynkUrl?: string;
  confirmationUrl?: string;
  usage: number;
}

export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: string;
  original_price?: string;
  discount_percentage?: number;
  product_type: ProductType;
  category: string;
  tags: string[];
  external_url: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Computed properties for compatibility
  imageUrl: string;
  originalPrice?: string;
  discountPercentage?: number;
  productType: ProductType;
  isFeatured: boolean;
  isActive: boolean;
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptRequest {
  id: string;
  user_id: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
  // Computed properties for compatibility
  userId: string;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface RedeemCode {
  id: string;
  code: string;
  type: 'prompt' | 'upgrade';
  target_id?: string;
  target_role?: UserRole;
  is_used: boolean;
  used_by?: string;
  used_at?: string;
  created_at: string;
  expires_at?: string;
  // Computed properties for compatibility
  targetId?: string;
  targetRole?: UserRole;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface AppStats {
  totalUsers: number;
  totalPrompts: number;
  totalRequests: number;
  activeUsers: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'user_registered' | 'prompt_created' | 'prompt_claimed' | 'request_submitted';
  description: string;
  timestamp: string;
  userId?: string;
}