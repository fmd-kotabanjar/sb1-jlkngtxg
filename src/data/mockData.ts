import { Prompt, User, PromptRequest, RedeemCode } from '../types';

export const mockPrompts: Prompt[] = [
  {
    id: 'prompt-001',
    title: 'Content Marketing Strategy',
    description: 'Comprehensive prompt for creating engaging content marketing strategies',
    content: 'As a content marketing expert, help me create a comprehensive content marketing strategy for [BUSINESS_TYPE]. Include content pillars, posting schedule, and engagement tactics.',
    type: 'free',
    category: 'Marketing',
    tags: ['marketing', 'content', 'strategy'],
    created_by: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true,
    usage_count: 1250,
    rating: 4.8,
    // Computed properties for compatibility
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true,
    usage: 1250
  },
  {
    id: 'prompt-002',
    title: 'Advanced SEO Optimization',
    description: 'Expert-level SEO prompt for comprehensive website optimization',
    content: 'Act as an SEO specialist and provide a detailed SEO audit and optimization plan for [WEBSITE_URL]. Include technical SEO, content optimization, and link building strategies.',
    type: 'exclusive',
    category: 'SEO',
    tags: ['seo', 'optimization', 'website'],
    created_by: 'admin',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    is_active: true,
    redeem_code: 'SEO2024',
    lynk_url: 'https://lynk.id/racikanprompt/seo-advanced',
    confirmation_url: 'https://racikanprompt.bincangkecil.com/xonfpro?id=2',
    usage_count: 850,
    rating: 4.9,
    // Computed properties for compatibility
    createdBy: 'admin',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    isActive: true,
    redeemCode: 'SEO2024',
    lynkUrl: 'https://lynk.id/racikanprompt/seo-advanced',
    confirmationUrl: 'https://racikanprompt.bincangkecil.com/xonfpro?id=2',
    usage: 850
  },
  {
    id: 'prompt-003',
    title: 'CustomGPT for E-commerce',
    description: 'Super prompt with custom GPT integration for e-commerce businesses',
    content: 'You are an e-commerce optimization specialist. Create a comprehensive analysis and improvement plan for [STORE_NAME]. Include conversion optimization, product descriptions, and customer journey mapping.',
    type: 'super',
    category: 'E-commerce',
    tags: ['ecommerce', 'customgpt', 'optimization'],
    created_by: 'admin',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    is_active: true,
    redeem_code: 'ECOM2024',
    lynk_url: 'https://lynk.id/racikanprompt/ecommerce-super',
    confirmation_url: 'https://racikanprompt.bincangkecil.com/xonfpro?id=3',
    usage_count: 420,
    rating: 5.0,
    // Computed properties for compatibility
    createdBy: 'admin',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    isActive: true,
    redeemCode: 'ECOM2024',
    lynkUrl: 'https://lynk.id/racikanprompt/ecommerce-super',
    confirmationUrl: 'https://racikanprompt.bincangkecil.com/xonfpro?id=3',
    usage: 420
  },
  {
    id: 'prompt-004',
    title: 'Social Media Campaign',
    description: 'Create viral social media campaigns across platforms',
    content: 'Design a comprehensive social media campaign for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include platform-specific content, hashtag strategy, and engagement metrics.',
    type: 'free',
    category: 'Social Media',
    tags: ['social', 'campaign', 'viral'],
    created_by: 'admin',
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    is_active: true,
    usage_count: 980,
    rating: 4.6,
    // Computed properties for compatibility
    createdBy: 'admin',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    isActive: true,
    usage: 980
  },
  {
    id: 'prompt-005',
    title: 'AI Copywriting Mastery',
    description: 'Premium copywriting prompts for high-converting sales copy',
    content: 'As a master copywriter, create high-converting sales copy for [PRODUCT]. Include headlines, subheadlines, benefits, objections handling, and call-to-action variations.',
    type: 'exclusive',
    category: 'Copywriting',
    tags: ['copywriting', 'sales', 'conversion'],
    created_by: 'admin',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    is_active: true,
    redeem_code: 'COPY2024',
    lynk_url: 'https://lynk.id/racikanprompt/copywriting-master',
    confirmation_url: 'https://racikanprompt.bincangkecil.com/xonfpro?id=5',
    usage_count: 650,
    rating: 4.7,
    // Computed properties for compatibility
    createdBy: 'admin',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    isActive: true,
    redeemCode: 'COPY2024',
    lynkUrl: 'https://lynk.id/racikanprompt/copywriting-master',
    confirmationUrl: 'https://racikanprompt.bincangkecil.com/xonfpro?id=5',
    usage: 650
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin-001',
    email: 'admin@racikanprompt.com',
    name: 'Admin User',
    role: 'admin',
    request_quota: 999,
    used_quota: 0,
    created_at: '2024-01-01T00:00:00Z',
    quota_reset_date: '2024-01-01T00:00:00Z',
    next_quota_reset: '2024-02-01T00:00:00Z',
    claimedPrompts: [],
    favoritePrompts: ['prompt-001', 'prompt-002', 'prompt-003'],
    // Computed properties for compatibility
    requestQuota: 999,
    usedQuota: 0,
    createdAt: '2024-01-01T00:00:00Z',
    quotaResetDate: '2024-01-01T00:00:00Z',
    nextQuotaReset: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user-001',
    email: 'premium@example.com',
    name: 'Premium User',
    role: 'premium',
    request_quota: 15,
    used_quota: 3,
    created_at: '2024-01-15T00:00:00Z',
    quota_reset_date: '2024-01-01T00:00:00Z',
    next_quota_reset: '2024-02-01T00:00:00Z',
    claimedPrompts: ['prompt-003'],
    favoritePrompts: ['prompt-001', 'prompt-002', 'prompt-004'],
    // Computed properties for compatibility
    requestQuota: 15,
    usedQuota: 3,
    createdAt: '2024-01-15T00:00:00Z',
    quotaResetDate: '2024-01-01T00:00:00Z',
    nextQuotaReset: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'basic@example.com',
    name: 'Basic User',
    role: 'basic',
    request_quota: 3,
    used_quota: 1,
    created_at: '2024-01-20T00:00:00Z',
    quota_reset_date: '2024-01-01T00:00:00Z',
    next_quota_reset: '2024-02-01T00:00:00Z',
    claimedPrompts: ['prompt-002'],
    favoritePrompts: ['prompt-001', 'prompt-004'],
    // Computed properties for compatibility
    requestQuota: 3,
    usedQuota: 1,
    createdAt: '2024-01-20T00:00:00Z',
    quotaResetDate: '2024-01-01T00:00:00Z',
    nextQuotaReset: '2024-02-01T00:00:00Z'
  },
  {
    id: 'demo-user',
    email: 'demo@racikanprompt.com',
    name: 'Demo User',
    role: 'basic',
    request_quota: 3,
    used_quota: 0,
    created_at: '2024-01-01T00:00:00Z',
    quota_reset_date: '2024-01-01T00:00:00Z',
    next_quota_reset: '2024-02-01T00:00:00Z',
    claimedPrompts: [],
    favoritePrompts: ['prompt-001'],
    // Computed properties for compatibility
    requestQuota: 3,
    usedQuota: 0,
    createdAt: '2024-01-01T00:00:00Z',
    quotaResetDate: '2024-01-01T00:00:00Z',
    nextQuotaReset: '2024-02-01T00:00:00Z'
  }
];

export const mockRequests: PromptRequest[] = [
  {
    id: 'req-001',
    user_id: 'user-002',
    userName: 'Basic User',
    title: 'YouTube Content Strategy',
    description: 'Need a comprehensive prompt for creating YouTube content strategy for tech channels',
    category: 'Content Creation',
    priority: 'high',
    status: 'pending',
    created_at: '2024-01-25T00:00:00Z',
    // Computed properties for compatibility
    userId: 'user-002',
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: 'req-002',
    user_id: 'user-001',
    userName: 'Premium User',
    title: 'Email Marketing Automation',
    description: 'Request for email marketing automation prompt with personalization',
    category: 'Email Marketing',
    priority: 'medium',
    status: 'approved',
    created_at: '2024-01-24T00:00:00Z',
    admin_notes: 'Great request, will be implemented in next update',
    // Computed properties for compatibility
    userId: 'user-001',
    createdAt: '2024-01-24T00:00:00Z',
    adminNotes: 'Great request, will be implemented in next update'
  }
];

export const mockRedeemCodes: RedeemCode[] = [
  {
    id: 'redeem-001',
    code: 'SEO2024',
    type: 'prompt',
    target_id: 'prompt-002',
    is_used: false,
    created_at: '2024-01-02T00:00:00Z',
    // Computed properties for compatibility
    targetId: 'prompt-002',
    isUsed: false,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'redeem-002',
    code: 'ECOM2024',
    type: 'prompt',
    target_id: 'prompt-003',
    is_used: false,
    created_at: '2024-01-03T00:00:00Z',
    // Computed properties for compatibility
    targetId: 'prompt-003',
    isUsed: false,
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'redeem-003',
    code: 'COPY2024',
    type: 'prompt',
    target_id: 'prompt-005',
    is_used: false,
    created_at: '2024-01-05T00:00:00Z',
    // Computed properties for compatibility
    targetId: 'prompt-005',
    isUsed: false,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'redeem-004',
    code: 'PREMIUM2024',
    type: 'upgrade',
    target_role: 'premium',
    is_used: false,
    created_at: '2024-01-01T00:00:00Z',
    // Computed properties for compatibility
    targetRole: 'premium',
    isUsed: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Initialize mock data in localStorage with better error handling
export const initializeMockData = () => {
  try {
    // Only initialize if data doesn't exist
    if (!localStorage.getItem('prompts')) {
      localStorage.setItem('prompts', JSON.stringify(mockPrompts));
      console.log('✅ Mock prompts initialized');
    }
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(mockUsers));
      console.log('✅ Mock users initialized');
    }
    if (!localStorage.getItem('promptRequests')) {
      localStorage.setItem('promptRequests', JSON.stringify(mockRequests));
      console.log('✅ Mock requests initialized');
    }
    if (!localStorage.getItem('redeemCodes')) {
      localStorage.setItem('redeemCodes', JSON.stringify(mockRedeemCodes));
      console.log('✅ Mock redeem codes initialized');
    }
    
    console.log('🎉 All mock data initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing mock data:', error);
    // Fallback: clear localStorage and try again
    try {
      localStorage.clear();
      localStorage.setItem('prompts', JSON.stringify(mockPrompts));
      localStorage.setItem('users', JSON.stringify(mockUsers));
      localStorage.setItem('promptRequests', JSON.stringify(mockRequests));
      localStorage.setItem('redeemCodes', JSON.stringify(mockRedeemCodes));
      console.log('✅ Mock data initialized after clearing localStorage');
    } catch (fallbackError) {
      console.error('❌ Fallback initialization failed:', fallbackError);
    }
  }
};