import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft, CheckCircle, Sparkles, Upload, Image as ImageIcon, X } from 'lucide-react';
import { createProductApi } from '../services/api';
import ErrorMessage from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CATEGORIES = [
  'Organic',
  'Reusable',
  'Sustainable Home',
  'Plastic-Free',
  'Energy Saving',
  'Personal Care',
];

const SellProductPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '15',
    category: 'Reusable',
    ecoScore: 92,
    shortDescription: '',
    description: '',
    images: '/products/product-01.jpg',
    featured: false,
    reusable: true,
    sustainableMaterial: true,
    plasticFree: true,
    organic: false,
  });

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      // Compress image client-side to ensure lightweight payload
      const compressedDataUrl = await compressImage(file, 800, 0.8);
      setFormData((prev) => ({ ...prev, images: compressedDataUrl }));
      setUploadedFileName(file.name);
      setError(null);
    } catch (err) {
      setError('Failed to process image file. Please try another image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      ecoScore: Number(formData.ecoScore),
      shortDescription: formData.shortDescription,
      description: formData.description,
      images: [formData.images],
      featured: formData.featured,
      ecoAttributes: {
        reusable: formData.reusable,
        sustainableMaterial: formData.sustainableMaterial,
        plasticFree: formData.plasticFree,
        organic: formData.organic,
      },
    };

    try {
      const data = await createProductApi(payload);
      if (data.success) {
        navigate('/my-products', { state: { message: 'Product listed for sale successfully! 🌱' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not list product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Leaf className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              Sell on GreenBasket 🌱
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Give sustainable products a new home and promote eco-conscious living.
          </p>
        </div>

        <Link
          to="/my-products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#2E7D32] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> My Listed Products
        </Link>
      </div>

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-[#1F2937] border-b border-gray-100 pb-2">
              Product Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#1F2937] mb-1">Product Title *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Handmade Organic Cotton Grocery Tote Bag"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="699"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Available Stock Units *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="1"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="15"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Eco Score (0 - 100) *</label>
                <input
                  type="number"
                  name="ecoScore"
                  required
                  min="0"
                  max="100"
                  value={formData.ecoScore}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>
          </div>

          {/* Image & Description Section */}
          <div className="space-y-4 pt-2">
            <h3 className="font-extrabold text-sm text-[#1F2937] border-b border-gray-100 pb-2">
              Product Image & Description
            </h3>

            {/* Upload Button Only */}
            <div className="space-y-2">
              <label className="block font-semibold text-[#1F2937]">Product Image *</label>

              <div className="flex flex-wrap items-center gap-3">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B4332] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {uploadedFileName ? 'Change Product Image' : 'Upload Product Image'}
                </button>

                {uploadedFileName ? (
                  <span className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1.5 bg-[#E8F5E9] px-3 py-1.5 rounded-lg border border-[#2E7D32]/20">
                    <CheckCircle className="w-4 h-4 text-[#2E7D32]" /> {uploadedFileName}
                  </span>
                ) : (
                  <span className="text-gray-400 text-[11px]">Upload PNG, JPG, or WEBP (Max 5MB)</span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1F2937] mb-1">Short Tagline Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Zero-waste organic cotton handbag for everyday shopping."
                className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2937] mb-1">Detailed Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your eco product's materials, benefits, and sustainability features..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          {/* Sustainability Badges */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-sm text-[#1F2937] border-b border-gray-100 pb-2">
              Eco Attributes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 bg-[#F8FAF8] border border-gray-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="reusable"
                  checked={formData.reusable}
                  onChange={handleChange}
                  className="rounded text-[#2E7D32] focus:ring-0"
                />
                <span className="font-semibold text-[#1F2937]">♻️ Reusable</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-[#F8FAF8] border border-gray-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="sustainableMaterial"
                  checked={formData.sustainableMaterial}
                  onChange={handleChange}
                  className="rounded text-[#2E7D32] focus:ring-0"
                />
                <span className="font-semibold text-[#1F2937]">🌿 Sustainable</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-[#F8FAF8] border border-gray-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="plasticFree"
                  checked={formData.plasticFree}
                  onChange={handleChange}
                  className="rounded text-[#2E7D32] focus:ring-0"
                />
                <span className="font-semibold text-[#1F2937]">🚫 Plastic-Free</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-[#F8FAF8] border border-gray-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  name="organic"
                  checked={formData.organic}
                  onChange={handleChange}
                  className="rounded text-[#2E7D32] focus:ring-0"
                />
                <span className="font-semibold text-[#1F2937]">🌾 Organic</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              to="/my-products"
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B4332] text-white font-bold rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> List Product for Sale 🌱
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default SellProductPage;
