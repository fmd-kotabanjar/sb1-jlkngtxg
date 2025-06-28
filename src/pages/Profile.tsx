import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Prompt } from '../types';
import PromptCard from '../components/UI/PromptCard';
import Modal from '../components/UI/Modal';
import { 
  User,
  Mail,
  Calendar,
  Crown,
  Heart,
  FileText,
  Settings,
  Edit3,
  Save,
  X
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'favorites'>('info');

  React.useEffect(() => {
    loadFavoritePrompts();
  }, [user]);

  const loadFavoritePrompts = () => {
    if (!user?.favoritePrompts.length) {
      setFavoritePrompts([]);
      return;
    }

    try {
      const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      const favorites = allPrompts.filter((prompt: Prompt) => 
        user.favoritePrompts.includes(prompt.id)
      );
      setFavoritePrompts(favorites);
    } catch (error) {
      console.error('Error loading favorite prompts:', error);
    }
  };

  const handleSaveProfile = () => {
    if (editForm.name.trim() && editForm.email.trim()) {
      updateUser({
        name: editForm.name.trim(),
        email: editForm.email.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'premium': return '⭐';
      default: return '👤';
    }
  };

  const getStats = () => {
    return {
      totalFavorites: user?.favoritePrompts.length || 0,
      totalClaimed: user?.claimedPrompts.length || 0,
      remainingQuota: (user?.requestQuota || 0) - (user?.usedQuota || 0),
      memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '-'
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profil Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Kelola informasi akun dan lihat aktivitas Anda
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                  activeTab === 'info'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline-block mr-2" />
                Informasi Akun
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                  activeTab === 'favorites'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Heart className="w-4 h-4 inline-block mr-2" />
                Favorit ({stats.totalFavorites})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Informasi Pribadi
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Batal
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama Lengkap
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <User className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900 dark:text-white">{user?.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <Mail className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900 dark:text-white">{user?.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <span className="text-lg mr-3">{getRoleIcon(user?.role || 'basic')}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role || 'basic')}`}>
                          {user?.role?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bergabung Sejak
                      </label>
                      <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">{stats.memberSince}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Prompt Favorit
                        </p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                          {stats.totalFavorites}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <Crown className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-300">
                          Prompt Diklaim
                        </p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-300">
                          {stats.totalClaimed}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                          Kuota Request
                        </p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                          {stats.remainingQuota}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                {favoritePrompts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoritePrompts.map((prompt) => (
                      <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        onFavorite={() => {/* Handle favorite */}}
                        onView={setSelectedPrompt}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Belum ada prompt favorit
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Tambahkan prompt ke favorit untuk akses cepat
                    </p>
                    <a
                      href="/explore"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Jelajahi Prompt
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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

export default Profile;