import React, { useState, useEffect } from 'react';
import { DigitalProduct } from '../../types';
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
  Sparkles,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

const AdminDigitalProducts: React.FC = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DigitalProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'own' | 'sponsor'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercentage: 0,
    productType: 'own' as 'own' | 'sponsor',
    category: '',
    tags: '',
    externalUrl: '',
    isFeatured: false,
    isActive: true
  });

  const categories = [
    'Education', 'Content Creation', 'SEO', 'E-commerce', 'Social Media',
    'Marketing', 'Business Strategy', 'Technology', 'Design', 'Other'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterType, filterStatus]);

  const loadProducts = () => {
    try {
      const allProducts = JSON.parse(localStorage.getItem('digitalProducts') || '[]');
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading digital products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(product => (product.productType || product.product_type) === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => 
        filterStatus === 'active' ? (product.isActive || product.is_active) : !(product.isActive || product.is_active)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productId = editingProduct?.id || `product-${Date.now().toString().slice(-3).padStart(3, '0')}`;
    
    const productData: DigitalProduct = {
      id: productId,
      title: formData.title,
      description: formData.description,
      image_url: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
      imageUrl: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: formData.price,
      original_price: formData.originalPrice || undefined,
      originalPrice: formData.originalPrice || undefined,
      discount_percentage: formData.discountPercentage || undefined,
      discountPercentage: formData.discountPercentage || undefined,
      product_type: formData.productType,
      productType: formData.productType,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      external_url: formData.externalUrl,
      externalUrl: formData.externalUrl,
      is_featured: formData.isFeatured,
      isFeatured: formData.isFeatured,
      is_active: formData.isActive,
      isActive: formData.isActive,
      created_at: editingProduct?.created_at || editingProduct?.createdAt || new Date().toISOString(),
      createdAt: editingProduct?.created_at || editingProduct?.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const allProducts = JSON.parse(localStorage.getItem('digitalProducts') || '[]');
      
      if (editingProduct) {
        const index = allProducts.findIndex((p: DigitalProduct) => p.id === editingProduct.id);
        if (index !== -1) {
          allProducts[index] = productData;
        }
      } else {
        allProducts.push(productData);
      }

      localStorage.setItem('digitalProducts', JSON.stringify(allProducts));
      loadProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving digital product:', error);
    }
  };

  const handleEdit = (product: DigitalProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || product.original_price || '',
      discountPercentage: product.discountPercentage || product.discount_percentage || 0,
      productType: (product.productType || product.product_type) as 'own' | 'sponsor',
      category: product.category,
      tags: product.tags.join(', '),
      externalUrl: product.externalUrl || product.external_url,
      isFeatured: product.isFeatured || product.is_featured || false,
      isActive: product.isActive || product.is_active || false
    });
    setShowModal(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk digital ini?')) {
      try {
        const allProducts = JSON.parse(localStorage.getItem('digitalProducts') || '[]');
        const filtered = allProducts.filter((p: DigitalProduct) => p.id !== productId);
        localStorage.setItem('digitalProducts', JSON.stringify(filtered));
        loadProducts();
      } catch (error) {
        console.error('Error deleting digital product:', error);
      }
    }
  };

  const toggleStatus = (productId: string) => {
    try {
      const allProducts = JSON.parse(localStorage.getItem('digitalProducts') || '[]');
      const index = allProducts.findIndex((p: DigitalProduct) => p.id === productId);
      if (index !== -1) {
        allProducts[index].isActive = !allProducts[index].isActive;
        allProducts[index].is_active = allProducts[index].isActive;
        localStorage.setItem('digitalProducts', JSON.stringify(allProducts));
        loadProducts();
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      discountPercentage: 0,
      productType: 'own',
      category: '',
      tags: '',
      externalUrl: '',
      isFeatured: false,
      isActive: true
    });
    setEditingProduct(null);
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
      case 'sponsor': return <Crown className="w-4 h-4 text-yellow-600" />;
      default: return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sponsor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const exportProducts = () => {
    try {
      const headers = [
        'ID', 'Title', 'Description', 'Price', 'Original Price', 'Discount %', 
        'Type', 'Category', 'Tags', 'External URL', 'Featured', 'Active', 'Created At'
      ];

      const csvRows = [
        headers.join('\t'),
        ...products.map(product => [
          product.id,
          `"${product.title.replace(/"/g, '""')}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          product.price,
          product.originalPrice || product.original_price || '',
          product.discountPercentage || product.discount_percentage || 0,
          product.productType || product.product_type,
          product.category,
          `"${product.tags.join(', ')}"`,
          product.externalUrl || product.external_url,
          (product.isFeatured || product.is_featured) ? 'Yes' : 'No',
          (product.isActive || product.is_active) ? 'Yes' : 'No',
          product.createdAt || product.created_at || ''
        ].join('\t'))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `digital_products_export_${new Date().toISOString().split('T')[0]}.tsv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Berhasil mengekspor ${products.length} produk digital ke file TSV`);
      }
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Terjadi kesalahan saat mengekspor data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Kelola Produk Digital
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Tambah, edit, dan kelola semua produk digital di platform
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-0">
            <button
              onClick={exportProducts}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export ({products.length})
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
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
                placeholder="Cari produk digital..."
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
                <option value="own">Produk Kami</option>
                <option value="sponsor">Sponsor</option>
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

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {product.description}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <span>{product.category}</span>
                          {(product.isFeatured || product.is_featured) && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-yellow-600">Featured</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(product.productType || product.product_type)}`}>
                        {getTypeIcon(product.productType || product.product_type)}
                        <span className="ml-1">{(product.productType || product.product_type).toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.price}
                      </div>
                      {(product.originalPrice || product.original_price) && (
                        <div className="text-xs text-gray-500 line-through">
                          {product.originalPrice || product.original_price}
                        </div>
                      )}
                      {(product.discountPercentage || product.discount_percentage) && (
                        <div className="text-xs text-red-600">
                          -{product.discountPercentage || product.discount_percentage}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (product.isActive || product.is_active)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {(product.isActive || product.is_active) ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <a
                          href={product.externalUrl || product.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Link
                        </a>
                        <button
                          onClick={() => copyToClipboard(product.externalUrl || product.external_url, `url-${product.id}`)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          {copiedId === `url-${product.id}` ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStatus(product.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            (product.isActive || product.is_active)
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                              : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                          }`}
                          title={(product.isActive || product.is_active) ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {(product.isActive || product.is_active) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tidak ada produk digital ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Coba ubah filter atau tambah produk digital baru
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
          title={editingProduct ? 'Edit Produk Digital' : 'Tambah Produk Digital Baru'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Judul Produk *
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
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="own">Produk Kami</option>
                  <option value="sponsor">Sponsor</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harga *
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Rp 299.000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harga Asli (opsional)
                </label>
                <input
                  type="text"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="Rp 499.000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Diskon % (opsional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  placeholder="education, ai, tools"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Eksternal *
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://lynk.id/racikanprompt/product"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Produk unggulan
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Aktifkan produk
                  </span>
                </label>
              </div>
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
                {editingProduct ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDigitalProducts;