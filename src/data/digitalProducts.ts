import { DigitalProduct } from '../types';

export const mockDigitalProducts: DigitalProduct[] = [
  {
    id: 'product-001',
    title: 'CustomGPT Max Lingo untuk Belajar Bahasa Inggris',
    description: 'AI tutor personal yang membantu Anda menguasai bahasa Inggris dengan metode interaktif dan personalisasi pembelajaran.',
    image_url: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'Rp 299.000',
    original_price: 'Rp 499.000',
    discount_percentage: 40,
    product_type: 'own',
    category: 'Education',
    tags: ['english', 'learning', 'customgpt', 'ai-tutor'],
    external_url: 'https://lynk.id/racikanprompt/max-lingo-english',
    is_featured: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    // Computed properties for compatibility
    imageUrl: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalPrice: 'Rp 499.000',
    discountPercentage: 40,
    productType: 'own',
    isFeatured: true,
    isActive: true,
    externalUrl: 'https://lynk.id/racikanprompt/max-lingo-english',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-002',
    title: 'AI Content Creator Pro',
    description: 'Toolkit lengkap untuk content creator dengan 100+ template prompt untuk berbagai platform media sosial.',
    image_url: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'Rp 199.000',
    original_price: 'Rp 299.000',
    discount_percentage: 33,
    product_type: 'own',
    category: 'Content Creation',
    tags: ['content', 'social-media', 'templates', 'creator'],
    external_url: 'https://lynk.id/racikanprompt/ai-content-creator',
    is_featured: false,
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    // Computed properties for compatibility
    imageUrl: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalPrice: 'Rp 299.000',
    discountPercentage: 33,
    productType: 'own',
    isFeatured: false,
    isActive: true,
    externalUrl: 'https://lynk.id/racikanprompt/ai-content-creator',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 'product-003',
    title: 'SEO Master Course by DigitalBoost',
    description: 'Kursus SEO komprehensif dari mitra kami DigitalBoost. Pelajari teknik SEO terbaru untuk meningkatkan ranking website.',
    image_url: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'Rp 399.000',
    original_price: 'Rp 599.000',
    discount_percentage: 33,
    product_type: 'sponsor',
    category: 'SEO',
    tags: ['seo', 'course', 'marketing', 'website'],
    external_url: 'https://digitalboost.id/seo-master-course',
    is_featured: true,
    is_active: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    // Computed properties for compatibility
    imageUrl: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
    originalPrice: 'Rp 599.000',
    discountPercentage: 33,
    productType: 'sponsor',
    isFeatured: true,
    isActive: true,
    externalUrl: 'https://digitalboost.id/seo-master-course',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 'product-004',
    title: 'E-commerce Automation Tools',
    description: 'Otomatisasi toko online Anda dengan AI. Kelola inventory, customer service, dan marketing secara otomatis.',
    image_url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'Rp 599.000',
    product_type: 'own',
    category: 'E-commerce',
    tags: ['ecommerce', 'automation', 'ai', 'tools'],
    external_url: 'https://lynk.id/racikanprompt/ecommerce-automation',
    is_featured: false,
    is_active: true,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    // Computed properties for compatibility
    imageUrl: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    productType: 'own',
    isFeatured: false,
    isActive: true,
    externalUrl: 'https://lynk.id/racikanprompt/ecommerce-automation',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  }
];

// Initialize digital products in localStorage
export const initializeDigitalProducts = () => {
  try {
    if (!localStorage.getItem('digitalProducts')) {
      localStorage.setItem('digitalProducts', JSON.stringify(mockDigitalProducts));
      console.log('✅ Mock digital products initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing digital products:', error);
  }
};