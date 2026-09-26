import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search, 
  X, 
  Check, 
  ShoppingBag,
  Leaf,
  CheckCircle 
} from 'lucide-react';
import { 
  getAdminProductsApi, 
  createAdminProductApi, 
  updateAdminProductApi, 
  deleteAdminProductApi 
} from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CATEGORIES = [
  'Organic',
  'Reusable',
  'Sustainable Home',
  'Plastic-Free',
  'Energy Saving',
  'Personal Care',
];

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Reusable',
    ecoScore: 90,
    description: '',
    shortDescription: '',
    images: '/products/product-01.jpg',
  });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProductsApi();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '20',
      category: 'Reusable',
      ecoScore: 90,
      description: '',
      shortDescription: '',
      images: '/products/product-01.jpg',
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      stock: prod.stock,
      category: prod.category,
      ecoScore: prod.ecoScore || 90,
      description: prod.description || '',
      shortDescription: prod.shortDescription || '',
      images: prod.images?.[0] || '/products/product-01.jpg',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      ecoScore: Number(formData.ecoScore),
      images: [formData.images],
    };

    try {
      if (editingProduct) {
        await updateAdminProductApi(editingProduct._id, payload);
        setMessage('Product updated successfully.');
      } else {
        await createAdminProductApi(payload);
        setMessage('Product added successfully.');
      }
      setModalOpen(false);
      setTimeout(() => setMessage(null), 4000);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteAdminProductApi(id);
        setMessage('Product deleted successfully.');
        setTimeout(() => setMessage(null), 4000);
        fetchProducts();
      } catch (err) {
        setError('Could not delete product.');
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingPage message="Loading products table..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <Link to="/admin" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Admin Product Management</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4332] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {message && (
        <div className="bg-[#2E7D32] text-white text-xs font-semibold py-3 px-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAF8] border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#2E7D32]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-[#1F2937]">
            <thead className="bg-[#F8FAF8] text-[#6B7280] uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Owner</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Eco Score</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-[#F8FAF8]/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={p.images?.[0] || '/products/product-01.jpg'}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover bg-[#F8FAF8] border border-gray-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-[#1F2937] line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-500 font-mono">No. {p.productNumber || '-'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {p.owner?.name || p.owner?.email || 'Admin Catalog'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full font-semibold text-xs">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1B4332]">₹{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold">{p.stock} units</td>
                  <td className="px-6 py-4 font-bold text-[#2E7D32]">🌱 {p.ecoScore}/100</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#1F2937]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Organic Eco Product"
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="499"
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Eco Score (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ecoScore}
                    onChange={(e) => setFormData({ ...formData, ecoScore: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image Path (/products/product-XX.jpg) *</label>
                <input
                  type="text"
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="/products/product-01.jpg"
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Eco-friendly sustainable choice"
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="High quality sustainable product designed to minimize plastic waste."
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-full font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#2E7D32] hover:bg-[#1B4332] text-white rounded-full font-semibold shadow-sm"
                >
                  {saving ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;
