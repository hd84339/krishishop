import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { CATEGORIES, getCategoryIcon, debounce } from '../../utils/helpers';
import { scrollReveal } from '../../animations/gsapAnimations';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useRef(null);

  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    if (headerRef.current) scrollReveal(headerRef.current);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', category, debouncedSearch, currentPage],
    queryFn: () =>
      productAPI.getAll({
        category: category === 'All' ? undefined : category,
        search: debouncedSearch || undefined,
        page: currentPage,
        limit: 12,
      }),
    select: (res) => res.data,
    keepPreviousData: true,
  });

  const setCategory = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-10 opacity-0">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-2">
            All Products
          </h1>
          <p className="font-body text-white/50">
            {data?.total ? `${data.total} products found` : 'Browse our collection'}
          </p>
        </div>

        {/* Search + Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                  : 'border border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-white/5'
              }`}
            >
              {cat !== 'All' && <span>{getCategoryIcon(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCard key={i} skeleton />
            ))}
          </div>
        ) : data?.products?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft size={18} />
                </button>

                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'border border-white/10 text-white/50 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(data.pages, p + 1))}
                  disabled={currentPage === data.pages}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-6 opacity-30">🔍</div>
            <h3 className="font-display text-2xl text-white/60 mb-2">No products found</h3>
            <p className="font-body text-white/30">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
