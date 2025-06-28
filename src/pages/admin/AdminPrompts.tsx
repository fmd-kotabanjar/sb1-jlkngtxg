import React, { useState, useEffect } from 'react';
import { Prompt, RedeemCode } from '../../types';
import Modal from '../../components/UI/Modal';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Upload,
  Download,
  Crown,
  Zap,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

const AdminPrompts: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'exclusive' | 'super'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'free' as 'free' | 'exclusive' | 'super',
    category: '',
    tags: '',
    lynkUrl: '',
    isActive: true
  });

  const categories = [
    'Marketing', 'SEO', 'Content Creation', 'E-commerce', 'Social Media',
    'Copywriting', 'Email Marketing', 'Business Strategy', 'Education',
    'Technology', 'Design', 'Other'
  ];

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    filterPrompts();
  }, [prompts, searchTerm, filterType, filterStatus]);

  const loadPrompts = () => {
    try {
      const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      setPrompts(allPrompts);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const filterPrompts = () => {
    let filtered = prompts;

    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(prompt => prompt.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(prompt => 
        filterStatus === 'active' ? (prompt.isActive || prompt.is_active) : !(prompt.isActive || prompt.is_active)
      );
    }

    setFilteredPrompts(filtered);
  };

  const generateRedeemCode = (type: 'exclusive' | 'super') => {
    const prefix = type === 'exclusive' ? 'EXC' : 'SUP';
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomString}`;
  };

  const generateConfirmationUrl = (promptId: string) => {
    // Extract number from prompt ID (e.g., "prompt-001" -> "1")
    const idNumber = promptId.replace('prompt-', '').replace(/^0+/, '') || '1';
    return `${window.location.origin}/xonfpro?id=${idNumber}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const promptId = editingPrompt?.id || `prompt-${Date.now().toString().slice(-3).padStart(3, '0')}`;
    
    // Generate redeem code for exclusive/super prompts
    let redeemCode = editingPrompt?.redeemCode || editingPrompt?.redeem_code;
    let confirmationUrl = editingPrompt?.confirmationUrl || editingPrompt?.confirmation_url;
    
    if ((formData.type === 'exclusive' || formData.type === 'super') && !redeemCode) {
      redeemCode = generateRedeemCode(formData.type);
      confirmationUrl = generateConfirmationUrl(promptId);
    }

    const promptData: Prompt = {
      id: promptId,
      title: formData.title,
      description: formData.description,
      content: formData.content,
      type: formData.type,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdBy: 'admin',
      created_by: 'admin',
      createdAt: editingPrompt?.createdAt || editingPrompt?.created_at || new Date().toISOString(),
      created_at: editingPrompt?.createdAt || editingPrompt?.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isActive: formData.isActive,
      is_active: formData.isActive,
      lynkUrl: formData.lynkUrl || undefined,
      lynk_url: formData.lynkUrl || undefined,
      redeemCode,
      redeem_code: redeemCode,
      confirmationUrl,
      confirmation_url: confirmationUrl,
      usage: editingPrompt?.usage || editingPrompt?.usage_count || 0,
      usage_count: editingPrompt?.usage || editingPrompt?.usage_count || 0,
      rating: editingPrompt?.rating || 5.0
    };

    try {
      const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      
      if (editingPrompt) {
        const index = allPrompts.findIndex((p: Prompt) => p.id === editingPrompt.id);
        if (index !== -1) {
          allPrompts[index] = promptData;
        }
      } else {
        allPrompts.push(promptData);
        
        // Create redeem code entry if needed
        if (redeemCode) {
          const redeemCodes = JSON.parse(localStorage.getItem('redeemCodes') || '[]');
          const newRedeemCode: RedeemCode = {
            id: `redeem-${Date.now()}`,
            code: redeemCode,
            type: 'prompt',
            target_id: promptId,
            targetId: promptId,
            is_used: false,
            isUsed: false,
            created_at: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          redeemCodes.push(newRedeemCode);
          localStorage.setItem('redeemCodes', JSON.stringify(redeemCodes));
        }
      }

      localStorage.setItem('prompts', JSON.stringify(allPrompts));
      loadPrompts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      type: prompt.type,
      category: prompt.category,
      tags: prompt.tags.join(', '),
      lynkUrl: prompt.lynkUrl || prompt.lynk_url || '',
      isActive: prompt.isActive || prompt.is_active || false
    });
    setShowModal(true);
  };

  const handleDelete = (promptId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus prompt ini?')) {
      try {
        const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
        const filtered = allPrompts.filter((p: Prompt) => p.id !== promptId);
        localStorage.setItem('prompts', JSON.stringify(filtered));
        loadPrompts();
      } catch (error) {
        console.error('Error deleting prompt:', error);
      }
    }
  };

  const toggleStatus = (promptId: string) => {
    try {
      const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
      const index = allPrompts.findIndex((p: Prompt) => p.id === promptId);
      if (index !== -1) {
        allPrompts[index].isActive = !allPrompts[index].isActive;
        allPrompts[index].is_active = allPrompts[index].isActive;
        localStorage.setItem('prompts', JSON.stringify(allPrompts));
        loadPrompts();
      }
    } catch (error) {
      console.error('Error toggling prompt status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      type: 'free',
      category: '',
      tags: '',
      lynkUrl: '',
      isActive: true
    });
    setEditingPrompt(null);
  };

  const handleBulkUpload = () => {
    try {
      const lines = bulkData.trim().split('\n');
      const newPrompts: Prompt[] = [];

      lines.forEach(line => {
        const [title, description, content, type, category, tags, lynkUrl] = line.split('\t');
        
        if (title && description && content) {
          const promptId = `prompt-${Date.now().toString().slice(-3).padStart(3, '0')}`;
          const promptType = (type?.trim() as 'free' | 'exclusive' | 'super') || 'free';
          
          let redeemCode;
          let confirmationUrl;
          
          if (promptType === 'exclusive' || promptType === 'super') {
            redeemCode = generateRedeemCode(promptType);
            confirmationUrl = generateConfirmationUrl(promptId);
          }

          const promptData: Prompt = {
            id: promptId,
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            type: promptType,
            category: category?.trim() || 'Other',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            createdBy: 'admin',
            created_by: 'admin',
            createdAt: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isActive: true,
            is_active: true,
            lynkUrl: lynkUrl?.trim() || undefined,
            lynk_url: lynkUrl?.trim() || undefined,
            redeemCode,
            redeem_code: redeemCode,
            confirmationUrl,
            confirmation_url: confirmationUrl,
            usage: 0,
            usage_count: 0,
            rating: 5.0
          };

          newPrompts.push(promptData);
        }
      });

      if (newPrompts.length > 0) {
        const allPrompts = JSON.parse(localStorage.getItem('prompts') || '[]');
        allPrompts.push(...newPrompts);
        localStorage.setItem('prompts', JSON.stringify(allPrompts));
        loadPrompts();
        setBulkData('');
        setShowBulkUpload(false);
        alert(`Berhasil menambahkan ${newPrompts.length} prompt`);
      }
    } catch (error) {
      console.error('Error bulk uploading prompts:', error);
      alert('Terjadi kesalahan saat upload bulk');
    }
  };

  const exportPrompts = () => {
    try {
      // Create CSV content with proper formatting
      const headers = [
        'ID',
        'Title', 
        'Description', 
        'Content', 
        'Type', 
        'Category', 
        'Tags', 
        'Lynk URL', 
        'Redeem Code', 
        'Confirmation URL', 
        'Active', 
        'Usage', 
        'Rating',
        'Created At',
        'Updated At'
      ];

      const csvRows = [
        headers.join('\t'), // Header row
        ...prompts.map(prompt => [
          prompt.id,
          `"${prompt.title.replace(/"/g, '""')}"`, // Escape quotes in title
          `"${prompt.description.replace(/"/g, '""')}"`, // Escape quotes in description
          `"${prompt.content.replace(/"/g, '""')}"`, // Escape quotes in content
          prompt.type,
          prompt.category,
          `"${prompt.tags.join(', ')}"`,
          prompt.lynkUrl || prompt.lynk_url || '',
          prompt.redeemCode || prompt.redeem_code || '',
          prompt.confirmationUrl || prompt.confirmation_url || '',
          (prompt.isActive || prompt.is_active) ? 'Yes' : 'No',
          prompt.usage || prompt.usage_count || 0,
          prompt.rating || 5.0,
          prompt.createdAt || prompt.created_at || '',
          prompt.updatedAt || prompt.updated_at || ''
        ].join('\t'))
      ];

      const csvContent = csvRows.join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `prompts_export_${new Date().toISOString().split('T')[0]}.tsv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success message
        alert(`Berhasil mengekspor ${prompts.length} prompt ke file TSV`);
      } else {
        // Fallback for older browsers
        alert('Browser Anda tidak mendukung download otomatis. Silakan copy data berikut:\n\n' + csvContent);
      }
    } catch (error) {
      console.error('Error exporting prompts:', error);
      alert('Terjadi kesalahan saat mengekspor data');
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exclusive': return <Crown className="w-4 h-4 text-purple-600" />;
      case 'super': return <Zap className="w-4 h-4 text-yellow-600" />;
      default: return <Eye className="w-4 h-4 text-green-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exclusive': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'super': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Kelola Prompt
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Tambah, edit, dan kelola semua prompt di platform
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowBulkUpload(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </button>
            <button
              onClick={exportPrompts}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export ({prompts.length})
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Prompt
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Cari prompt..."
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
                <option value="free">Gratis</option>
                <option value="exclusive">Eksklusif</option>
                <option value="super">Super</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prompts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prompt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kode/URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {prompt.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {prompt.description}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <span>Usage: {prompt.usage || prompt.usage_count || 0}</span>
                          <span className="mx-2">•</span>
                          <span>Rating: {prompt.rating || 5.0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(prompt.type)}`}>
                        {getTypeIcon(prompt.type)}
                        <span className="ml-1">{prompt.type.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {prompt.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (prompt.isActive || prompt.is_active)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {(prompt.isActive || prompt.is_active) ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {(prompt.redeemCode || prompt.redeem_code) && (
                          <div className="flex items-center">
                            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {prompt.redeemCode || prompt.redeem_code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(prompt.redeemCode || prompt.redeem_code || '', `code-${prompt.id}`)}
                              className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                            >
                              {copiedId === `code-${prompt.id}` ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                        {(prompt.confirmationUrl || prompt.confirmation_url) && (
                          <div className="flex items-center">
                            <a
                              href={prompt.confirmationUrl || prompt.confirmation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Konfirmasi
                            </a>
                          </div>
                        )}
                        {(prompt.lynkUrl || prompt.lynk_url) && (
                          <div className="flex items-center">
                            <a
                              href={prompt.lynkUrl || prompt.lynk_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Lynk
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStatus(prompt.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            (prompt.isActive || prompt.is_active)
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                              : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                          }`}
                          title={(prompt.isActive || prompt.is_active) ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {(prompt.isActive || prompt.is_active) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(prompt)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prompt.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tidak ada prompt ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Coba ubah filter atau tambah prompt baru
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingPrompt ? 'Edit Prompt' : 'Tambah Prompt Baru'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Judul Prompt *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipe *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="free">Gratis</option>
                  <option value="exclusive">Eksklusif</option>
                  <option value="super">Super</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konten Prompt *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="marketing, seo, content"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lynk URL (opsional)
                </label>
                <input
                  type="url"
                  value={formData.lynkUrl}
                  onChange={(e) => setFormData({ ...formData, lynkUrl: e.target.value })}
                  placeholder="https://lynk.id/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Aktifkan prompt
                  </span>
                </label>
              </div>

              {/* Auto-generated info */}
              {(formData.type === 'exclusive' || formData.type === 'super') && !editingPrompt && (
                <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Otomatis akan dibuat:</strong>
                  </p>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 mt-1 space-y-1">
                    <li>• Kode redeem unik</li>
                    <li>• URL konfirmasi (xonfpro)</li>
                    <li>• Entry di tabel redeem codes</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingPrompt ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Bulk Upload Modal */}
        <Modal
          isOpen={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          title="Bulk Upload Prompt"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                Format TSV (Tab-Separated Values)
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                Setiap baris harus berisi kolom berikut, dipisahkan dengan tab:
              </p>
              <code className="text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded block">
                Title	Description	Content	Type	Category	Tags	Lynk URL
              </code>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                Type: free, exclusive, atau super<br/>
                Tags: pisahkan dengan koma<br/>
                Kode redeem dan URL konfirmasi akan dibuat otomatis untuk exclusive/super
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data TSV
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                rows={10}
                placeholder="Paste data TSV di sini..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowBulkUpload(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkData.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPrompts;