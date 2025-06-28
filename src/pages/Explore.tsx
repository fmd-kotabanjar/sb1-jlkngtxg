import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Prompt, DigitalProduct } from '../types';
import PromptCard from '../components/UI/PromptCard';
import DigitalProductCard from '../components/UI/DigitalProductCard';
import ContactAdmin from '../components/UI/ContactAdmin';
import Modal from '../components/UI/Modal';
import { initializeDigitalProducts } from '../data/digitalProducts';
import { 
  Search,
  Filter,
  SlidersHorizontal,
  FileText,
  Eye,
  Crown,
  Zap,
  MessageCircle
} from 'lucide-react';

const Explore: React.FC = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [digitalProducts, setDigitalProducts] = useState<DigitalProduct[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DigitalProduct[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'exclusive' | 'super'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    loadPrompts();
    loadDigitalProducts();
  }, []);

  useEffect(() => {
    filterContent();
  }, [prompts, digitalProducts, searchTerm, filterType, filterCategory]);

  const loadPrompts = () => {
    try {
      const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      setPrompts(allPrompts.filter((prompt: Prompt) => prompt.isActive || prompt.is_active));
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const loadDigitalProducts = () => {
    try {
      // Initialize digital products if not exists
      initializeDigitalProducts();
      
      const allProducts = JSON.parse(localStorage.getItem('digitalProducts') || '[]');
      setDigitalProducts(allProducts.filter((product: DigitalProduct) => product.isActive || product.is_active));
    } catch (error) {
      console.error('Error loading digital products:', error);
    }
  };

  const filterContent = () => {
    // Filter prompts
    let filteredP = prompts;

    if (searchTerm) {
      filteredP = filteredP.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filteredP = filteredP.filter(prompt => prompt.type === filterType);
    }

    if (filterCategory !== 'all') {
      filteredP = filteredP.filter(prompt => prompt.category === filterCategory);
    }

    setFilteredPrompts(filteredP);

    // Filter products
    let filteredProd = digitalProducts;

    if (searchTerm) {
      filteredProd = filteredProd.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCategory !== 'all') {
      filteredProd = filteredProd.filter(product => product.category === filterCategory);
    }

    setFilteredProducts(filteredProd);
  };

  const getUniqueCategories = () => {
    const promptCategories = prompts.map(prompt => prompt.category);
    const productCategories = digitalProducts.map(product => product.category);
    return [...new Set([...promptCategories, ...productCategories])];
  };

  const getStats = () => {
    const free = prompts.filter(p => p.type === 'free').length;
    const exclusive = prompts.filter(p => p.type === 'exclusive').length;
    const super_ = prompts.filter(p => p.type === 'super').length;
    
    return { free, exclusive, super: super_ };
  };

  // Create mixed content for display (prompts + products interspersed)
  const getMixedContent = () => {
    const content: Array<{type: 'prompt' | 'product', data: Prompt | DigitalProduct, index: number}> = [];
    
    // Add all prompts first
    filteredPrompts.forEach((prompt, index) => {
      content.push({ type: 'prompt', data: prompt, index });
    });
    
    // Insert products at strategic positions (every 4-5 items)
    const productInsertPositions = [3, 8, 13, 18, 23]; // After 4th, 9th, 14th, etc.
    
    filteredProducts.forEach((product, productIndex) => {
      const insertPosition = productInsertPositions[productIndex % productInsertPositions.length] + 
                           Math.floor(productIndex / productInsertPositions.length) * 25;
      
      if (insertPosition < content.length) {
        content.splice(insertPosition, 0, { type: 'product', data: product, index: productIndex });
      } else {
        content.push({ type: 'product', data: product, index: productIndex });
      }
    });
    
    return content;
  };

  const stats = getStats();
  const mixedContent = getMixedContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Jelajahi Prompt & Produk
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Temukan prompt AI terbaik dan produk digital berkualitas dalam satu tempat
            </p>
          </div>
          
          {/* Contact Admin Button */}
          <button
            onClick={() => setShowContactModal(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Kontak Admin</span>
          </button>
        </div>

        {/* Stats Cards - Only for Prompts */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  Gratis
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.free}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  Eksklusif
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.exclusive}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  Super
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.super}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="flex gap-2 sm:gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Cari prompt atau produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 sm:p-3 rounded-lg border transition-colors flex-shrink-0 ${
                showFilters 
                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                  : 'bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Type Filter (for prompts) */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipe Prompt
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="free">Gratis</option>
                    <option value="exclusive">Eksklusif</option>
                    <option value="super">Super</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategori
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">Semua Kategori</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Access Info for Basic Users */}
        {user?.role === 'basic' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Informasi Akses
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>• <strong>Prompt Gratis:</strong> Dapat diakses langsung</p>
              <p>• <strong>Prompt Eksklusif:</strong> Perlu kode redeem atau upgrade Premium</p>
              <p>• <strong>Prompt Super:</strong> Perlu kode redeem khusus</p>
              <p>• <strong>Produk Digital:</strong> Klik untuk melihat detail dan membeli</p>
            </div>
          </div>
        )}

        {/* Mixed Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {mixedContent.map((item, index) => (
            <div key={`${item.type}-${item.data.id}-${index}`}>
              {item.type === 'prompt' ? (
                <PromptCard
                  prompt={item.data as Prompt}
                  onFavorite={() => {/* Handle favorite */}}
                  onView={setSelectedPrompt}
                />
              ) : (
                <DigitalProductCard product={item.data as DigitalProduct} />
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mixedContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Tidak ada konten ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}

        {/* Content Summary */}
        {mixedContent.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {filteredPrompts.length} prompt dan {filteredProducts.length} produk digital
            </p>
          </div>
        )}

        {/* Prompt Detail Modal */}
        <Modal
          isOpen={selectedPrompt !== null}
          onClose={() => setSelectedPrompt(null)}
          title={selectedPrompt?.title || ''}
          maxWidth="2xl"
        >
          {selectedPrompt && (
            <PromptCard
              prompt={selectedPrompt}
              showContent={true}
              onFavorite={() => {/* Handle favorite */}}
            />
          )}
        </Modal>

        {/* Contact Admin Modal */}
        <ContactAdmin 
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      </div>
    </div>
  );
};

export default Explore;