import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, RefreshCw, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { getProductsApi } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';
import ErrorMessage from '../components/common/ErrorMessage';

const CATEGORIES = [
  'All',
  'Organic',
  'Reusable',
  'Sustainable Home',
  'Plastic-Free',
  'Energy Saving',
  'Personal Care',
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States initialized from URL query params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Synchronize state whenever URL searchParams change (from Navbar search, links, etc.)
  useEffect(() => {
    const s = searchParams.get('search') || '';
    const c = searchParams.get('category') || 'All';
    const min = searchParams.get('minPrice') || '';
    const max = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'recommended';
    const page = Number(searchParams.get('page')) || 1;

    setSearchQuery(s);
    setSelectedCategory(c);
    setMinPrice(min);
    setMaxPrice(max);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await getProductsApi(params);
      if (data.success) {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
      }
    } catch (err) {
      setError(err.message || 'Unable to load products right now.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (updates) => {
    const newSearch = updates.searchQuery !== undefined ? updates.searchQuery : searchQuery;
    const newCategory = updates.selectedCategory !== undefined ? updates.selectedCategory : selectedCategory;
    const newMin = updates.minPrice !== undefined ? updates.minPrice : minPrice;
    const newMax = updates.maxPrice !== undefined ? updates.maxPrice : maxPrice;
    const newSort = updates.sortBy !== undefined ? updates.sortBy : sortBy;
    const newPage = updates.currentPage !== undefined ? updates.currentPage : 1;

    setSearchQuery(newSearch);
    setSelectedCategory(newCategory);
    setMinPrice(newMin);
    setMaxPrice(newMax);
    setSortBy(newSort);
    setCurrentPage(newPage);

    const params = {};
    if (newSearch.trim()) params.search = newSearch.trim();
    if (newCategory !== 'All') params.category = newCategory;
    if (newMin) params.minPrice = newMin;
    if (newMax) params.maxPrice = newMax;
    if (newSort !== 'recommended') params.sort = newSort;
    if (newPage > 1) params.page = newPage;

    setSearchParams(params, { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter({ currentPage: 1 });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('recommended');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
          Sustainable Marketplace 🌱
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          Shop Sustainable Products
        </h1>
        <p className="text-sm text-[#6B7280]">
          Discover better choices for your everyday lifestyle.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search sustainable products..."
              value={searchQuery}
              onChange={(e) => updateFilter({ searchQuery: e.target.value, currentPage: 1 })}
              className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-full text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D32]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => updateFilter({ searchQuery: '', currentPage: 1 })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Price Filters */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => updateFilter({ minPrice: e.target.value, currentPage: 1 })}
              className="w-full px-3 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
            />
            <span className="text-xs text-gray-400">–</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => updateFilter({ maxPrice: e.target.value, currentPage: 1 })}
              className="w-full px-3 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#2E7D32]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => updateFilter({ sortBy: e.target.value, currentPage: 1 })}
              className="w-full px-4 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-full text-xs text-[#1F2937] font-medium focus:outline-none focus:border-[#2E7D32]"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="eco-score">Highest Eco Score</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter({ selectedCategory: cat, currentPage: 1 })}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-[#F8FAF8] text-[#6B7280] hover:bg-[#E8F5E9] hover:text-[#2E7D32]'
              }`}
            >
              {cat}
            </button>
          ))}
          
          {(selectedCategory !== 'All' || searchQuery || minPrice || maxPrice || sortBy !== 'recommended') && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

      </div>

      {/* Error Alert */}
      {error && (
        <div className="space-y-4">
          <ErrorMessage message={error} />
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-[#2E7D32] text-white text-xs font-semibold rounded-full flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
          </button>
        </div>
      )}

      {/* Product Grid Content */}
      {loading ? (
        <ProductSkeleton count={8} />
      ) : products.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-full border border-gray-200 text-gray-600 disabled:opacity-30 hover:border-[#2E7D32] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-semibold text-[#1F2937]">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                className="p-2.5 rounded-full border border-gray-200 text-gray-600 disabled:opacity-30 hover:border-[#2E7D32] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty Search Results State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Leaf className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1F2937]">No products found</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Try another search or explore a different category.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default ShopPage;
