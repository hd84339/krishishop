import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import { formatPrice, getCategoryColor, getCategoryIcon, getStockStatus } from '../../utils/helpers';
import { scaleIn, fadeInLeft } from '../../animations/gsapAnimations';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiShoppingCart, FiPackage, FiStar, FiShare2 } from 'react-icons/fi';
import Loader from '../../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id),
    select: (res) => res.data.product,
  });

  useEffect(() => {
    if (product) {
      if (imageRef.current) scaleIn(imageRef.current);
      if (contentRef.current) fadeInLeft(contentRef.current);
    }
  }, [product]);

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart! 🛒`, {
      style: {
        background: '#1a2e1a',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.2)',
      },
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) return <Loader fullScreen />;
  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-display text-2xl text-white mb-2">Product not found</h2>
          <Link to="/products" className="btn-primary mt-4">Back to Products</Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-body text-sm mb-8 transition-colors group">
          <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div ref={imageRef} className="opacity-0">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary-900/30 to-earth-900/20 border border-white/10">
              {product.image?.url ? (
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl opacity-30">{getCategoryIcon(product.category)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div ref={contentRef} className="opacity-0 flex flex-col justify-center">
            {/* Category badge */}
            <span className={`badge border w-fit text-sm mb-4 ${getCategoryColor(product.category)}`}>
              {getCategoryIcon(product.category)} {product.category}
            </span>

            {/* Name */}
            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.round(product.ratings) ? 'text-earth-400 fill-earth-400' : 'text-white/20'} />
                ))}
              </div>
              <span className="font-body text-white/40 text-sm">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display font-bold text-4xl text-primary-400">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-white/60 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
              <FiPackage size={18} className={stockStatus.color} />
              <div>
                <div className={`font-body font-medium text-sm ${stockStatus.color}`}>{stockStatus.label}</div>
                <div className="font-body text-white/30 text-xs">{product.stock} units available</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-base py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              >
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4 mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <div className="font-body text-white/30 text-xs mb-1">Category</div>
                <div className="font-body text-white text-sm font-medium">{product.category}</div>
              </div>
              <div>
                <div className="font-body text-white/30 text-xs mb-1">Stock</div>
                <div className="font-body text-white text-sm font-medium">{product.stock} units</div>
              </div>
              <div>
                <div className="font-body text-white/30 text-xs mb-1">Added</div>
                <div className="font-body text-white text-sm font-medium">
                  {new Date(product.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <div>
                <div className="font-body text-white/30 text-xs mb-1">Product ID</div>
                <div className="font-mono text-white/40 text-xs">{product._id.slice(-8)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
