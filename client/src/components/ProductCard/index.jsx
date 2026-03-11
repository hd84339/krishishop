import { Link } from 'react-router-dom';
import { formatPrice, getCategoryColor, getCategoryIcon, getStockStatus, truncateText } from '../../utils/helpers';
import { FiStar, FiPackage } from 'react-icons/fi';

const ProductCard = ({ product, skeleton = false }) => {
  if (skeleton) {
    return (
      <div className="card p-0 overflow-hidden">
        <div className="skeleton aspect-square w-full" />
        <div className="p-4 space-y-3">
          <div className="skeleton h-3 w-16 rounded-full" />
          <div className="skeleton h-5 w-3/4 rounded-lg" />
          <div className="skeleton h-3 w-full rounded-lg" />
          <div className="skeleton h-3 w-2/3 rounded-lg" />
          <div className="flex justify-between items-center mt-4">
            <div className="skeleton h-6 w-20 rounded-lg" />
            <div className="skeleton h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <Link
      to={`/products/${product._id}`}
      className="card group block p-0 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary-900/30 to-earth-900/20">
        {product.image?.url ? (
          <img
            src={product.image.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl opacity-40">{getCategoryIcon(product.category)}</span>
          </div>
        )}
        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            ⭐ Featured
          </div>
        )}
        {/* Stock overlay */}
        {(product.inStock === false || product.stock === 0) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white/80 font-medium text-sm bg-red-500/80 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className={`badge border text-xs ${getCategoryColor(product.category)}`}>
          {getCategoryIcon(product.category)} {product.category}
        </span>

        {/* Name */}
        <h3 className="font-display font-semibold text-white mt-2 group-hover:text-primary-300 transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="font-body text-white/50 text-sm mt-1.5 line-clamp-2 leading-relaxed">
          {truncateText(product.description, 80)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="font-display font-bold text-lg text-primary-400">
              {formatPrice(product.price)}
            </div>
            <div className={`text-xs font-body mt-0.5 ${stockStatus.color}`}>
              {stockStatus.label}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30 font-body">
            <FiPackage size={13} />
            <span>{product.stock} left</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
