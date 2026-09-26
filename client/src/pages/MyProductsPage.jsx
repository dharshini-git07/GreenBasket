import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search, 
  X, 
  Leaf, 
  CheckCircle,
  Package 
} from 'lucide-react';
import { 
  getMyProductsApi, 
  updateProductApi, 
  deleteProductApi 
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

const MyProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);
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
    shortDescription: '',
    description: '',
    images: '/products/product-01.jpg',
  });
  const [saving, setSaving] = useState(false);

  const fetchMyProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProductsApi();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      stock: prod.stock,
      category: prod.category,
      ecoScore: prod.ecoScore || 90,
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
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
      await updateProductApi(editingProduct._id, payload);
      setMessage('Product updated successfully.');
      setModalOpen(false);
      setTimeout(() => setMessage(null), 4000);
      fetchMyProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from sale?`)) {
      try {
        await deleteProductApi(id);
        setMessage('Product removed successfully.');
        setTimeout(() => setMessage(null), 4000);
        fetchMyProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Could not delete product.');
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingPage message="Loading your listed products..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <Link to="/account" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">My Listed Products</h1>
          <p className="text-xs text-gray-500">Manage sustainable items you are selling on GreenBasket.</p>
        </div>

        <Link
          to="/sell"
          className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4332] text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Sell a Product 🌱
        </Link>
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

      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1F2937]">No products listed yet</h3>
          <p className="text-xs text-gray-500">
            You haven't listed any eco products for sale. Start selling on GreenBasket today!
          </p>
          <Link
            to="/sell"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full shadow-sm"
          >
            <Plus className="w-4 h-4" /> List Product for Sale
          </Link>
        </div>
      ) : (
        <>
          {/* Search Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search your products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAF8] border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#2E7D32]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredProducts.length} of {products.length} listed items
            </span>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-44 bg-[#F8FAF8] rounded-xl overflow-hidden mb-3">
                    <img
                      src={p.images?.[0] || '/products/product-01.jpg'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-white/95 backdrop-blur-xs text-[#2E7D32] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-[#2E7D32]/20">
                        🌱 Eco Score {p.ecoScore}/100
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-md inline-block mb-1">
                    {p.category}
                  </span>

                  <h3 className="text-sm font-bold text-[#1F2937] line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{p.shortDescription || p.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Price</span>
                    <span className="text-base font-extrabold text-[#1B4332]">₹{p.price?.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-blue-600 hover:bg-blue-50 border border-gray-100 rounded-xl transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      className="p-2 text-red-600 hover:bg-red-50 border border-gray-100 rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#1F2937]">Edit Listed Product</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {saving ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyProductsPage;
