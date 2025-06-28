import React from 'react';
import { DigitalProduct } from '../../types';
import { 
  ExternalLink,
  Tag,
  Crown,
  Sparkles
} from 'lucide-react';

interface DigitalProductCardProps {
  product: DigitalProduct;
}

const DigitalProductCard: React.FC<DigitalProductCardProps> = ({ product }) => {
  const handleClick = () => {
    window.open(product.external_url || product.externalUrl, '_blank', 'noopener,noreferrer');
  };

  const getProductTypeIcon = () => {
    switch (product.product_type || product.productType) {
      case 'sponsor': return <Crown className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getProductTypeColor = () => {
    switch (product.product_type || product.productType) {
      case 'sponsor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getProductTypeLabel = () => {
    switch (product.product_type || product.productType) {
      case 'sponsor': return 'SPONSOR';
      default: return 'PRODUK KAMI';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProductTypeColor()}`}>
              {getProductTypeIcon()}
              <span className="ml-1 hidden xs:inline">{getProductTypeLabel()}</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {product.category}
            </span>
          </div>
          
          {/* Discount Badge */}
          {(product.discount_percentage || product.discountPercentage) && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex-shrink-0">
              -{product.discount_percentage || product.discountPercentage}%
            </div>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
              +{product.tags.length - 3}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {product.price}
            </span>
            {(product.original_price || product.originalPrice) && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {product.original_price || product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1">
            <button className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none justify-center text-xs sm:text-sm font-medium">
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Lihat Detail</span>
            </button>
            <button className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-1 sm:flex-none justify-center text-xs sm:text-sm font-medium">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalProductCard;