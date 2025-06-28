import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Prompt } from '../types';
import PromptCard from '../components/UI/PromptCard';
import Modal from '../components/UI/Modal';
import { 
  Crown,
  Zap,
  FileText,
  Calendar,
  Search
} from 'lucide-react';

const ClaimedPrompts: React.FC = () => {
  const { user } = useAuth();
  const [claimedPrompts, setClaimedPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'exclusive' | 'super'>('all');

  useEffect(() => {
    loadClaimedPrompts();
  }, [user]);

  useEffect(() => {
    filterPrompts();
  }, [claimedPrompts, searchTerm, filterType]);

  const loadClaimedPrompts = () => {
    if (!user?.claimedPrompts.length) {
      setClaimedPrompts([]);
      return;
    }

    try {
      const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      const claimed = allPrompts.filter((prompt: Prompt) => 
        user.claimedPrompts.includes(prompt.id)
      );
      setClaimedPrompts(claimed);
    } catch (error) {
      console.error('Error loading claimed prompts:', error);
    }
  };

  const filterPrompts = () => {
    let filtered = claimedPrompts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(prompt => prompt.type === filterType);
    }

    setFilteredPrompts(filtered);
  };

  const getTypeStats = () => {
    const exclusive = claimedPrompts.filter(p => p.type === 'exclusive').length;
    const super_ = claimedPrompts.filter(p => p.type === 'super').length;
    return { exclusive, super: super_ };
  };

  const stats = getTypeStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt yang Diklaim
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Koleksi prompt eksklusif dan super yang telah Anda klaim
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  Total Diklaim
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {claimedPrompts.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
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

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  Bergabung
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Cari prompt yang diklaim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="all">Semua Tipe</option>
                <option value="exclusive">Eksklusif</option>
                <option value="super">Super</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onFavorite={() => {/* Handle favorite */}}
                onView={setSelectedPrompt}
                showContent={false}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {claimedPrompts.length === 0 ? (
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              ) : (
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {claimedPrompts.length === 0 
                ? 'Belum ada prompt yang diklaim'
                : 'Tidak ada prompt ditemukan'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4">
              {claimedPrompts.length === 0 
                ? 'Klaim prompt eksklusif dan super menggunakan kode redeem'
                : 'Coba ubah kata kunci pencarian atau filter Anda'
              }
            </p>
            {claimedPrompts.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/redeem"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Klaim Kode Sekarang
                </a>
                <a
                  href="/explore"
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Jelajahi Prompt
                </a>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default ClaimedPrompts;