import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI, orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getCategoryColor, getCategoryIcon, getStockStatus } from '../../utils/helpers';
import { scaleIn, fadeInLeft } from '../../animations/gsapAnimations';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiShoppingCart, FiPackage, FiStar, FiShare2, FiX, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import Loader from '../../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    address: '',
    city: '',
    postalCode: '',
  });

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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.mobileNumber || !form.address || !form.city || !form.postalCode) {
      toast.error('Please fill all fields');
      return;
    }
    setOrdering(true);
    try {
      await orderAPI.create({
        orderItems: [{ product: product._id, qty }],
        shippingAddress: form,
        paymentMethod: 'COD',
      });
      toast.success('Order placed successfully! 🎉');
      setShowModal(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
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

  const stockStatus = getStockStatus(product.stock, product.inStock);
  const isOutOfStock = product.inStock === false || product.stock === 0;

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
                <img src={product.image.url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl opacity-30">{getCategoryIcon(product.category)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div ref={contentRef} className="opacity-0 flex flex-col justify-center">
            <span className={`badge border w-fit text-sm mb-4 ${getCategoryColor(product.category)}`}>
              {getCategoryIcon(product.category)} {product.category}
            </span>

            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.round(product.ratings) ? 'text-earth-400 fill-earth-400' : 'text-white/20'} />
                ))}
              </div>
              <span className="font-body text-white/40 text-sm">({product.numReviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display font-bold text-4xl text-primary-400">
                {formatPrice(product.price)}
              </span>
            </div>

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

            {/* Quantity + Buy */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3 mb-4">
                <span className="font-body text-white/50 text-sm">Qty:</span>
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors">−</button>
                  <span className="px-4 py-2 font-body text-white text-sm border-x border-white/10">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors">+</button>
                </div>
                <span className="font-body text-white/30 text-xs">Total: {formatPrice(product.price * qty)}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-base py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={20} />
                {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
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
                <div className="font-body text-white/30 text-xs mb-1">Payment</div>
                <div className="font-body text-white text-sm font-medium">Cash on Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg glass rounded-3xl border border-white/10 shadow-2xl p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">🛒 Place Order</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <FiX size={20} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-6">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary-500/10 flex-shrink-0">
                {product.image?.url ? (
                  <img src={product.image.url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{getCategoryIcon(product.category)}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body font-medium text-white text-sm truncate">{product.name}</div>
                <div className="font-body text-white/40 text-xs">{qty} × {formatPrice(product.price)}</div>
              </div>
              <div className="font-display font-bold text-primary-400">{formatPrice(product.price * qty)}</div>
            </div>

            {/* Shipping Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="font-body text-white/50 text-xs mb-1.5 block">
                  <FiUser size={12} className="inline mr-1" /> Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="font-body text-white/50 text-xs mb-1.5 block">
                  <FiPhone size={12} className="inline mr-1" /> Mobile Number
                </label>
                <input
                  type="tel"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="font-body text-white/50 text-xs mb-1.5 block">
                  <FiMapPin size={12} className="inline mr-1" /> Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street address, Colony, Landmark"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-white/50 text-xs mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="font-body text-white/50 text-xs mb-1.5 block">Postal Code</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="PIN Code"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 mt-2">
                <span className="font-body text-white/60 text-sm">💰 Payment Method</span>
                <span className="font-body text-primary-400 font-medium text-sm">Cash on Delivery</span>
              </div>

              <button
                type="submit"
                disabled={ordering}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {ordering ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <FiShoppingCart size={18} />
                    Place Order — {formatPrice(product.price * qty)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
