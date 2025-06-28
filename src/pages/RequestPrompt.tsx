import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PromptRequest } from '../types';
import { QuotaManager } from '../utils/quotaManager';
import { 
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  User,
  Calendar,
  RefreshCw,
  Info
} from 'lucide-react';

const RequestPrompt: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [userRequests, setUserRequests] = useState<PromptRequest[]>([]);

  const categories = [
    'Marketing',
    'SEO',
    'Content Creation',
    'E-commerce',
    'Social Media',
    'Copywriting',
    'Email Marketing',
    'Business Strategy',
    'Education',
    'Technology',
    'Design',
    'Other'
  ];

  useEffect(() => {
    loadUserRequests();
  }, [user]);

  const loadUserRequests = () => {
    try {
      const allRequests: PromptRequest[] = JSON.parse(localStorage.getItem('promptRequests') || '[]');
      const filtered = allRequests.filter(req => req.user_id === user?.id || req.userId === user?.id);
      setUserRequests(filtered.sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading user requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Fix: Properly calculate remaining quota
    const requestQuota = user.request_quota || user.requestQuota || 3;
    const usedQuota = user.used_quota || user.usedQuota || 0;
    const remainingQuota = requestQuota - usedQuota;

    if (remainingQuota <= 0) {
      setMessage({
        type: 'error',
        text: 'Kuota request Anda sudah habis untuk bulan ini'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Create new request
      const newRequest: PromptRequest = {
        id: `req-${Date.now()}`,
        user_id: user.id,
        userId: user.id,
        userName: user.name,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'pending',
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const allRequests: PromptRequest[] = JSON.parse(localStorage.getItem('promptRequests') || '[]');
      allRequests.push(newRequest);
      localStorage.setItem('promptRequests', JSON.stringify(allRequests));

      // Update user quota
      const newUsedQuota = usedQuota + 1;
      updateUser({ 
        used_quota: newUsedQuota,
        usedQuota: newUsedQuota 
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium'
      });

      setMessage({
        type: 'success',
        text: 'Request prompt berhasil dikirim! Tim kami akan meninjau permintaan Anda.'
      });

      // Reload user requests
      loadUserRequests();

    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan saat mengirim request'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Fix: Properly calculate remaining quota
  const requestQuota = user?.request_quota || user?.requestQuota || 3;
  const usedQuota = user?.used_quota || user?.usedQuota || 0;
  const remainingQuota = requestQuota - usedQuota;

  // Get quota reset info
  const daysUntilReset = user ? QuotaManager.getDaysUntilReset(user.next_quota_reset || user.nextQuotaReset) : 0;
  const nextResetDate = user ? QuotaManager.formatNextResetDate(user.next_quota_reset || user.nextQuotaReset) : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Request Prompt
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Ajukan permintaan prompt baru sesuai kebutuhan Anda
          </p>
        </div>

        {/* Quota Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Kuota Request
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sisa kuota untuk bulan ini
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {remainingQuota}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                dari {requestQuota}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(remainingQuota / requestQuota) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Terpakai: {usedQuota}</span>
              <span>Sisa: {remainingQuota}</span>
            </div>
          </div>

          {/* Quota Reset Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center">
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <span className="text-blue-700 dark:text-blue-300">
                Kuota akan direset pada: <strong>{nextResetDate}</strong>
              </span>
              <span className="text-blue-600 dark:text-blue-400 ml-2">
                ({daysUntilReset} hari lagi)
              </span>
            </div>
          </div>
          
          {remainingQuota <= 0 && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
              <div className="text-sm">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  Kuota request Anda sudah habis untuk bulan ini
                </p>
                <p className="text-red-600 dark:text-red-400 mt-1">
                  Kuota akan direset otomatis pada {nextResetDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Request Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Buat Request Baru
          </h2>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : message.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            }`}>
              {message.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />}
              {message.type === 'error' && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />}
              {message.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Judul Request *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Prompt untuk strategi content marketing B2B"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={remainingQuota <= 0}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={remainingQuota <= 0}
              >
                <option value="">Pilih kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prioritas
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={remainingQuota <= 0}
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi Detail *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Jelaskan secara detail prompt yang Anda butuhkan, termasuk konteks penggunaan, target audience, dan hasil yang diharapkan..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
                disabled={remainingQuota <= 0}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || remainingQuota <= 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Kirim Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* User Requests History */}
        {userRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Riwayat Request Anda
            </h3>
            <div className="space-y-4">
              {userRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        {request.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                    <div className="flex items-center ml-4">
                      {getStatusIcon(request.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' ? 'Menunggu' : 
                         request.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(request.created_at || request.createdAt).toLocaleDateString('id-ID')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority === 'high' ? 'Tinggi' : 
                         request.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {request.category}
                      </span>
                    </div>
                  </div>

                  {(request.admin_notes || request.adminNotes) && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Catatan Admin:</strong> {request.admin_notes || request.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPrompt;