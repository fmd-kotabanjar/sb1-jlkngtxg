import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Crown,
  Check,
  Zap,
  Star,
  Users,
  MessageSquare,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Upgrade: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = {
    basic: [
      'Akses prompt gratis',
      '3 request prompt per bulan',
      'Fitur favorit',
      'Salin dan bagikan prompt',
      'Support komunitas'
    ],
    premium: [
      'Semua fitur Basic',
      'Akses semua prompt eksklusif',
      '15 request prompt per bulan',
      'Priority support',
      'Update prompt terbaru',
      'Akses beta features',
      'No ads experience'
    ]
  };

  const handleUpgradeClick = () => {
    navigate('/redeem');
  };

  const handleContactAdmin = () => {
    // In a real app, this would open a contact form or redirect to support
    alert('Hubungi admin di email: admin@racikanprompt.com untuk mendapatkan kode upgrade premium');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade ke Premium
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dapatkan akses penuh ke semua prompt eksklusif dan fitur premium lainnya
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Plan Saat Ini: {user?.role?.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.role === 'basic' ? 'Akses terbatas ke prompt gratis' : 'Akses penuh ke semua fitur'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Kuota Request</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {((user?.request_quota || user?.requestQuota || 0) - (user?.used_quota || user?.usedQuota || 0))} / {user?.request_quota || user?.requestQuota || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Basic Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Basic
              </h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Gratis
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Untuk pemula yang ingin mencoba
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {features.basic.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              disabled={user?.role === 'basic'}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user?.role === 'basic' ? 'Plan Aktif' : 'Downgrade ke Basic'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
              POPULER
            </div>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Premium
              </h3>
              <div className="text-3xl font-bold mb-1">
                Kode Redeem
              </div>
              <p className="text-sm text-purple-100">
                Akses penuh ke semua fitur premium
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                  <span className="text-white text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgradeClick}
              disabled={user?.role === 'premium' || user?.role === 'admin'}
              className="w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {user?.role === 'premium' || user?.role === 'admin' 
                ? 'Sudah Premium' 
                : (
                  <>
                    Gunakan Kode Redeem
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )
              }
            </button>
          </div>
        </div>

        {/* How to Upgrade */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Cara Upgrade ke Premium
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Hubungi Admin
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Hubungi admin untuk mendapatkan kode redeem premium
              </p>
              <button
                onClick={handleContactAdmin}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Hubungi Sekarang
              </button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Dapatkan Kode
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Terima kode redeem premium dari admin
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                3. Klaim Kode
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Gunakan kode di halaman "Klaim Kode" untuk upgrade
              </p>
              <button
                onClick={handleUpgradeClick}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Klaim Sekarang
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleUpgradeClick}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              <Zap className="w-5 h-5 mr-2" />
              Klaim Kode Sekarang
            </button>
          </div>
        </div>

        {/* Benefits Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800">
          <div className="text-center mb-6">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Mengapa Upgrade ke Premium?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Dapatkan nilai lebih dari investasi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Akses Eksklusif
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Prompt premium berkualitas tinggi
              </p>
            </div>

            <div className="text-center p-4">
              <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Priority Support
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dukungan prioritas dari tim
              </p>
            </div>

            <div className="text-center p-4">
              <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Kuota Lebih Besar
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                15 request prompt per bulan
              </p>
            </div>

            <div className="text-center p-4">
              <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Beta Features
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Akses fitur terbaru lebih dulu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;