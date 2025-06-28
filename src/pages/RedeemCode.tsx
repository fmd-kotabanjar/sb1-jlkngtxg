import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RedeemCode as RedeemCodeType, Prompt } from '../types';
import { 
  Gift,
  Crown,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

const RedeemCode: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // Get redeem codes and prompts
      const redeemCodes: RedeemCodeType[] = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
      const prompts: Prompt[] = JSON.parse(localStorage.getItem('prompts') || '[]');

      // Find the code
      const foundCode = redeemCodes.find(rc => 
        rc.code.toLowerCase() === code.toLowerCase() && !rc.isUsed
      );

      if (!foundCode) {
        setMessage({
          type: 'error',
          text: 'Kode tidak valid atau sudah digunakan'
        });
        setIsLoading(false);
        return;
      }

      // Check if code is expired
      if (foundCode.expiresAt && new Date(foundCode.expiresAt) < new Date()) {
        setMessage({
          type: 'error',
          text: 'Kode sudah kedaluwarsa'
        });
        setIsLoading(false);
        return;
      }

      if (foundCode.type === 'prompt') {
        // Redeem prompt
        const targetPrompt = prompts.find(p => p.id === foundCode.targetId);
        if (!targetPrompt) {
          setMessage({
            type: 'error',
            text: 'Prompt tidak ditemukan'
          });
          setIsLoading(false);
          return;
        }

        // Check if user already has this prompt
        if (user?.claimedPrompts.includes(targetPrompt.id)) {
          setMessage({
            type: 'info',
            text: 'Anda sudah memiliki prompt ini'
          });
          setIsLoading(false);
          return;
        }

        // Add prompt to user's claimed prompts
        const newClaimedPrompts = [...(user?.claimedPrompts || []), targetPrompt.id];
        updateUser({ claimedPrompts: newClaimedPrompts });

        setMessage({
          type: 'success',
          text: `Berhasil mengklaim prompt: ${targetPrompt.title}`
        });

      } else if (foundCode.type === 'upgrade') {
        // Upgrade user role
        if (user?.role === 'premium' || user?.role === 'admin') {
          setMessage({
            type: 'info',
            text: 'Akun Anda sudah Premium atau Admin'
          });
          setIsLoading(false);
          return;
        }

        updateUser({ 
          role: foundCode.targetRole || 'premium',
          requestQuota: 15 // Premium quota
        });

        setMessage({
          type: 'success',
          text: `Selamat! Akun Anda berhasil diupgrade ke ${foundCode.targetRole?.toUpperCase()}`
        });
      }

      // Mark code as used
      const updatedCodes = redeemCodes.map(rc => 
        rc.id === foundCode.id 
          ? { ...rc, isUsed: true, usedBy: user?.id, usedAt: new Date().toISOString() }
          : rc
      );
      localStorage.setItem('redeemCodes', JSON.stringify(updatedCodes));

      setCode('');

    } catch (error) {
      console.error('Error redeeming code:', error);
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat mengklaim kode'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentClaims = () => {
    try {
      const redeemCodes: RedeemCodeType[] = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
      const prompts: Prompt[] = JSON.parse(localStorage.getItem('prompts') || '[]');
      
      return redeemCodes
        .filter(rc => rc.isUsed && rc.usedBy === user?.id)
        .map(rc => {
          if (rc.type === 'prompt') {
            const prompt = prompts.find(p => p.id === rc.targetId);
            return {
              ...rc,
              title: prompt?.title || 'Prompt tidak ditemukan',
              description: prompt?.description || ''
            };
          }
          return {
            ...rc,
            title: `Upgrade ke ${rc.targetRole?.toUpperCase()}`,
            description: 'Upgrade akun berhasil'
          };
        })
        .sort((a, b) => new Date(b.usedAt || '').getTime() - new Date(a.usedAt || '').getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting recent claims:', error);
      return [];
    }
  };

  const recentClaims = getRecentClaims();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Klaim Kode Redeem
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Masukkan kode redeem untuk mengklaim prompt eksklusif atau upgrade akun
          </p>
        </div>

        {/* Redeem Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 sm:mb-8">
          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kode Redeem
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode redeem..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-lg font-mono tracking-wider"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Mengklaim...
                </>
              ) : (
                'Klaim Sekarang'
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : message.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            }`}>
              {message.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />}
              {message.type === 'error' && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />}
              {message.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
              <p className={`text-sm ${
                message.type === 'success' 
                  ? 'text-green-700 dark:text-green-300'
                  : message.type === 'error'
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {message.text}
              </p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg mr-4">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Prompt Eksklusif
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Akses prompt premium berkualitas tinggi
                </p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Prompt yang dikurasi khusus</li>
              <li>• Konten berkualitas tinggi</li>
              <li>• Update rutin</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Prompt Super
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prompt dengan CustomGPT terintegrasi
                </p>
              </div>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Integrasi CustomGPT</li>
              <li>• Fitur advanced</li>
              <li>• Support prioritas</li>
            </ul>
          </div>
        </div>

        {/* Recent Claims */}
        {recentClaims.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Klaim Terbaru
            </h3>
            <div className="space-y-3">
              {recentClaims.map((claim, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                    {claim.type === 'prompt' ? (
                      <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Crown className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {claim.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {claim.usedAt ? new Date(claim.usedAt).toLocaleDateString('id-ID') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemCode;