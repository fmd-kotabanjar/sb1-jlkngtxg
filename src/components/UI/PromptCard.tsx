import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Prompt } from '../../types';
import { 
  Heart, 
  Copy, 
  Share2, 
  Star, 
  Eye, 
  Lock, 
  Crown, 
  Zap,
  ExternalLink,
  Check,
  StarIcon
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onFavorite?: (promptId: string) => void;
  onView?: (prompt: Prompt) => void;
  onRate?: (promptId: string, rating: number) => void;
  showContent?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  onFavorite, 
  onView, 
  onRate,
  showContent = false 
}) => {
  const { user, updateUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const canAccess = () => {
    if (prompt.type === 'free') return true;
    if (user?.role === 'admin') return true;
    if (user?.role === 'premium' && prompt.type === 'exclusive') return true;
    if (user?.claimedPrompts.includes(prompt.id)) return true;
    return false;
  };

  const getTypeIcon = () => {
    switch (prompt.type) {
      case 'free': return <Eye className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'exclusive': return <Crown className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'super': return <Zap className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (prompt.type) {
      case 'free': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'exclusive': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'super': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const handleCopy = async () => {
    if (canAccess()) {
      try {
        await navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: prompt.title,
        text: prompt.description,
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        const shareUrl = `${window.location.origin}/prompt/${prompt.id}`;
        await navigator.clipboard.writeText(shareUrl);
      }
      
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error('Error sharing: ', err);
    }
  };

  const handleFavorite = () => {
    if (user && onFavorite) {
      const isFavorited = user.favoritePrompts.includes(prompt.id);
      const newFavorites = isFavorited
        ? user.favoritePrompts.filter(id => id !== prompt.id)
        : [...user.favoritePrompts, prompt.id];
      
      updateUser({ favoritePrompts: newFavorites });
      onFavorite(prompt.id);
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    if (onRate) {
      onRate(prompt.id, rating);
    }
    
    // Update prompt rating in localStorage
    try {
      const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      const promptIndex = prompts.findIndex((p: Prompt) => p.id === prompt.id);
      if (promptIndex !== -1) {
        // Simple rating update - in real app, this would be more sophisticated
        const currentRating = prompts[promptIndex].rating || 5.0;
        const newRating = (currentRating + rating) / 2; // Simple average
        prompts[promptIndex].rating = Math.round(newRating * 10) / 10;
        localStorage.setItem('prompts', JSON.stringify(prompts));
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const isFavorited = user?.favoritePrompts.includes(prompt.id) || false;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
              {getTypeIcon()}
              <span className="ml-1 hidden xs:inline">{prompt.type.toUpperCase()}</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {prompt.category}
            </span>
          </div>
          <button
            onClick={handleFavorite}
            className={`p-1.5 sm:p-2 rounded-full transition-colors flex-shrink-0 ${
              isFavorited 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {prompt.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {prompt.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
              +{prompt.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span className="text-xs sm:text-sm">{prompt.rating || 5.0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{prompt.usage || prompt.usage_count || 0}</span>
            </div>
          </div>

          {/* Rating Stars */}
          {canAccess() && (
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <StarIcon 
                    className={`w-3 h-3 ${
                      star <= (hoveredRating || userRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Preview */}
        {showContent && (
          <div className="mb-4">
            {canAccess() ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {prompt.content}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {prompt.type === 'exclusive' ? 'Konten eksklusif untuk Premium & Admin' : 'Konten super untuk yang sudah diklaim'}
                </p>
                {(prompt.lynkUrl || prompt.lynk_url) && (
                  <a
                    href={prompt.lynkUrl || prompt.lynk_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Beli Kode Redeem
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1">
            <button
              onClick={handleCopy}
              disabled={!canAccess()}
              className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none justify-center ${
                canAccess()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {copied ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden xs:inline">{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-1 sm:flex-none justify-center"
            >
              {shared ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden xs:inline">{shared ? 'Dibagikan!' : 'Bagikan'}</span>
            </button>
          </div>
          {onView && (
            <button
              onClick={() => onView(prompt)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Detail
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard;