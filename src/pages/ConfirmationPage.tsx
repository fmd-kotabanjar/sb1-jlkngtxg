import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Prompt, RedeemCode } from '../types';
import { 
  Gift,
  Crown,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

const ConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [redeemCode, setRedeemCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const promptId = searchParams.get('id');

  useEffect(() => {
    if (promptId) {
      loadPromptData();
    } else {
      setLoading(false);
    }
  }, [promptId]);

  const loadPromptData = () => {
    try {
      const prompts: Prompt[] = JSON.parse(localStorage.getItem('prompts') || '[]');
      
      // Try different ID formats to find the prompt
      let foundPrompt = null;
      
      // Try exact match first
      foundPrompt = prompts.find(p => p.id === promptId);
      
      // Try with prompt- prefix
      if (!foundPrompt) {
        foundPrompt = prompts.find(p => p.id === `prompt-${promptId}`);
      }
      
      // Try with padded zeros
      if (!foundPrompt && promptId) {
        const paddedId = `prompt-${promptId.padStart(3, '0')}`;
        foundPrompt = prompts.find(p => p.id === paddedId);
      }
      
      // Try finding by confirmation URL or redeem code
      if (!foundPrompt && promptId) {
        foundPrompt = prompts.find(p => 
          (p.confirmationUrl || p.confirmation_url)?.includes(`id=${promptId}`) ||
          (p.redeemCode || p.redeem_code)?.toLowerCase().includes(promptId.toLowerCase())
        );
      }
      
      if (foundPrompt) {
        setPrompt(foundPrompt);
        setRedeemCode(foundPrompt.redeemCode || foundPrompt.redeem_code || '');
      } else {
        console.log('Prompt not found for ID:', promptId);
        console.log('Available prompts:', prompts.map(p => ({ id: p.id, title: p.title })));
      }
    } catch (error) {
      console.error('Error loading prompt data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(redeemCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleAutoRedeem = async () => {
    if (!user || !redeemCode || !prompt) {
      setMessage({
        type: 'error',
        text: 'Anda harus login terlebih dahulu untuk mengklaim prompt'
      });
      return;
    }

    setClaiming(true);
    setMessage(null);

    try {
      // Get redeem codes
      const redeemCodes: RedeemCode[] = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
      
      // Find the code
      const foundCode = redeemCodes.find(rc => 
        rc.code.toLowerCase() === redeemCode.toLowerCase() && !rc.is_used && !rc.isUsed
      );

      if (!foundCode) {
        setMessage({
          type: 'error',
          text: 'Kode tidak valid atau sudah digunakan'
        });
        setClaiming(false);
        return;
      }

      // Check if user already has this prompt
      if (user.claimedPrompts.includes(prompt.id)) {
        setMessage({
          type: 'info',
          text: 'Anda sudah memiliki prompt ini'
        });
        setClaiming(false);
        return;
      }

      // Add prompt to user's claimed prompts
      const newClaimedPrompts = [...user.claimedPrompts, prompt.id];
      updateUser({ claimedPrompts: newClaimedPrompts });

      // Mark code as used
      const updatedCodes = redeemCodes.map(rc => 
        rc.id === foundCode.id 
          ? { 
              ...rc, 
              is_used: true, 
              isUsed: true,
              used_by: user.id, 
              usedBy: user.id,
              used_at: new Date().toISOString(),
              usedAt: new Date().toISOString()
            }
          : rc
      );
      localStorage.setItem('redeemCodes', JSON.stringify(updatedCodes));

      setMessage({
        type: 'success',
        text: `Berhasil mengklaim prompt: ${prompt.title}`
      });

      // Redirect to claimed prompts after 3 seconds
      setTimeout(() => {
        navigate('/claimed');
      }, 3000);

    } catch (error) {
      console.error('Error claiming prompt:', error);
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat mengklaim prompt'
      });
    } finally {
      setClaiming(false);
    }
  };

  const getTypeIcon = () => {
    if (!prompt) return <Gift className="w-8 h-8 text-gray-400" />;
    
    switch (prompt.type) {
      case 'exclusive': return <Crown className="w-8 h-8 text-purple-600" />;
      case 'super': return <Zap className="w-8 h-8 text-yellow-600" />;
      default: return <Gift className="w-8 h-8 text-blue-600" />;
    }
  };

  const getTypeColor = () => {
    if (!prompt) return 'from-gray-600 to-gray-700';
    
    switch (prompt.type) {
      case 'exclusive': return 'from-purple-600 to-blue-600';
      case 'super': return 'from-yellow-600 to-orange-600';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading confirmation page...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt Tidak Ditemukan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Prompt dengan ID "{promptId}" tidak ditemukan atau tidak tersedia.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/explore')}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Jelajahi Prompt
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 bg-gradient-to-r ${getTypeColor()} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {getTypeIcon()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Konfirmasi Prompt
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Klaim prompt eksklusif dengan kode redeem
          </p>
        </div>

        {/* Prompt Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  prompt.type === 'exclusive' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : prompt.type === 'super'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {prompt.type === 'exclusive' && <Crown className="w-4 h-4 mr-1" />}
                  {prompt.type === 'super' && <Zap className="w-4 h-4 mr-1" />}
                  {prompt.type.toUpperCase()}
                </span>
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                  {prompt.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {prompt.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {prompt.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Rating: {prompt.rating}/5</span>
                <span>•</span>
                <span>Usage: {prompt.usage || prompt.usage_count}</span>
              </div>
            </div>
          </div>

          {/* Redeem Code Section */}
          {redeemCode && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Kode Redeem
              </h3>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 mb-4">
                <code className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                  {redeemCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Salin
                    </>
                  )}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-4 p-4 rounded-lg flex items-center ${
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {user ? (
                  <button
                    onClick={handleAutoRedeem}
                    disabled={claiming || user.claimedPrompts.includes(prompt.id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {claiming ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Mengklaim...
                      </>
                    ) : user.claimedPrompts.includes(prompt.id) ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Sudah Diklaim
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Klaim Otomatis
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                  >
                    Login untuk Klaim
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/redeem')}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  Klaim Manual
                </button>
              </div>

              {/* Lynk URL */}
              {(prompt.lynkUrl || prompt.lynk_url) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Atau beli kode redeem:
                  </p>
                  <a
                    href={prompt.lynkUrl || prompt.lynk_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Beli di Lynk.id
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            Cara Menggunakan Kode Redeem
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>Salin kode redeem di atas</li>
            <li>Klik "Klaim Otomatis" jika sudah login, atau login terlebih dahulu</li>
            <li>Atau pergi ke halaman "Klaim Kode" dan masukkan kode secara manual</li>
            <li>Prompt akan tersedia di halaman "Prompt Diklaim" Anda</li>
          </ol>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;