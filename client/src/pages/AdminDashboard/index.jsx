import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productAPI, orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getCategoryIcon } from '../../utils/helpers';
import { fadeInUp } from '../../animations/gsapAnimations';
import {
  FiPackage, FiPlus, FiEdit2, FiTrash2, FiTrendingUp,
  FiLayers, FiAlertCircle, FiShoppingBag, FiCheck, FiX, FiClock,
  FiCalendar, FiPhone, FiMapPin, FiUser
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin]);

  useEffect(() => {
    if (headerRef.current) fadeInUp(headerRef.current);
  }, []);

  // Products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productAPI.getAll({ limit: 100 }),
    select: (res) => res.data,
    enabled: isAdmin,
  });

  // Orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await orderAPI.getAllOrders();
      return res.data;
    },
    enabled: isAdmin && activeTab === 'orders',
  });

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['products']);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('description', product.description);
      formData.append('stock', product.stock);
      formData.append('featured', product.featured);
      formData.append('inStock', !product.inStock);

      await productAPI.update(product._id, formData);
      toast.success(`${product.name} is now ${!product.inStock ? 'In Stock' : 'Out of Stock'}`);
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['products']);
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      queryClient.invalidateQueries(['admin-orders']);
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const products = productsData?.products || [];
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0 || p.inStock === false).length;
  const categoryCount = [...new Set(products.map(p => p.category))].length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    }
  };

  const tabs = [
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
  ];

  if (!isAdmin) return null;

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 opacity-0">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white">Admin Dashboard</h1>
            <p className="font-body text-white/40 mt-1">Welcome back, {user?.name} 👋</p>
          </div>
          {activeTab === 'products' && (
            <Link to="/admin/add-product" className="btn-primary flex items-center gap-2 w-fit">
              <FiPlus size={18} /> Add Product
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 mb-8 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* ===== Products Tab ===== */}
        {activeTab === 'products' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Products', value: products.length, icon: FiPackage, color: 'primary' },
                { label: 'Categories', value: categoryCount, icon: FiLayers, color: 'earth' },
                { label: 'Out of Stock', value: outOfStock, icon: FiAlertCircle, color: 'red' },
                { label: 'Inventory Value', value: formatPrice(totalValue), icon: FiTrendingUp, color: 'primary' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    color === 'primary' ? 'bg-primary-500/10' :
                    color === 'earth' ? 'bg-earth-500/10' : 'bg-red-500/10'
                  }`}>
                    <Icon size={18} className={
                      color === 'primary' ? 'text-primary-400' :
                      color === 'earth' ? 'text-earth-400' : 'text-red-400'
                    } />
                  </div>
                  <div className="font-display font-bold text-xl text-white">{value}</div>
                  <div className="font-body text-white/40 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Products Table */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="font-display font-semibold text-white text-lg">All Products</h2>
                <Link to="/admin/add-product" className="btn-outline text-sm flex items-center gap-2">
                  <FiPlus size={15} /> Add New
                </Link>
              </div>
              {productsLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto" />
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4 opacity-30">📦</div>
                  <p className="font-body text-white/40">No products yet. Add your first product!</p>
                  <Link to="/admin/add-product" className="btn-primary mt-4 inline-flex"><FiPlus size={16} /> Add Product</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-6 py-3 font-body text-xs font-medium text-white/30 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-white/2 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-500/10 flex-shrink-0">
                                {product.image?.url ? (
                                  <img src={product.image.url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-lg">{getCategoryIcon(product.category)}</div>
                                )}
                              </div>
                              <div>
                                <div className="font-body font-medium text-white text-sm line-clamp-1">{product.name}</div>
                                <div className="font-mono text-white/20 text-xs">{product._id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-body text-white/50 text-sm flex items-center gap-1.5">
                              {getCategoryIcon(product.category)} {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-display font-semibold text-primary-400 text-sm">{formatPrice(product.price)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-body text-white/50 text-sm">{product.stock}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`badge border text-xs ${
                              !product.inStock || product.stock === 0
                                ? 'text-red-400 bg-red-400/10 border-red-400/20'
                                : product.stock < 10
                                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                                : 'text-green-400 bg-green-400/10 border-green-400/20'
                            }`}>
                              {!product.inStock || product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleAvailability(product)}
                                title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                                className={`p-2 rounded-lg transition-all ${
                                  product.inStock
                                    ? 'text-white/30 hover:text-red-400 hover:bg-red-500/10'
                                    : 'text-green-400 bg-green-500/10 hover:bg-green-500/20'
                                }`}
                              >
                                {product.inStock ? <FiX size={15} /> : <FiCheck size={15} />}
                              </button>
                              <Link to={`/admin/edit-product/${product._id}`} className="p-2 rounded-lg text-white/30 hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                                <FiEdit2 size={15} />
                              </Link>
                              <button onClick={() => handleDelete(product._id, product.name)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <FiTrash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== Orders Tab ===== */}
        {activeTab === 'orders' && (
          <div>
            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Orders', value: orders?.length || 0, icon: FiShoppingBag, color: 'primary' },
                { label: 'Pending', value: orders?.filter(o => o.status === 'Pending').length || 0, icon: FiClock, color: 'earth' },
                { label: 'Completed', value: orders?.filter(o => o.status === 'Done').length || 0, icon: FiCheck, color: 'primary' },
                { label: 'Rejected', value: orders?.filter(o => o.status === 'Rejected').length || 0, icon: FiX, color: 'red' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    color === 'primary' ? 'bg-primary-500/10' :
                    color === 'earth' ? 'bg-earth-500/10' : 'bg-red-500/10'
                  }`}>
                    <Icon size={18} className={
                      color === 'primary' ? 'text-primary-400' :
                      color === 'earth' ? 'text-earth-400' : 'text-red-400'
                    } />
                  </div>
                  <div className="font-display font-bold text-xl text-white">{value}</div>
                  <div className="font-body text-white/40 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Orders List */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h2 className="font-display font-semibold text-white text-lg">All Orders</h2>
              </div>

              {ordersLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto" />
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4 opacity-30">📋</div>
                  <p className="font-body text-white/40">No orders received yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <div key={order._id} className="p-5 sm:p-6 hover:bg-white/[0.02] transition-colors">
                      {/* Order Header Row */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="font-display font-bold text-white">#{order._id.substring(0, 8)}</span>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 font-body text-xs text-white/40">
                            <span className="flex items-center gap-1"><FiCalendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FiClock size={12}/> {new Date(order.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {['Pending', 'Done', 'Rejected'].map((s) => (
                            <button
                              key={s}
                              disabled={order.status === s}
                              onClick={() => handleStatusChange(order._id, s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all duration-200 ${
                                order.status === s
                                  ? s === 'Done' ? 'bg-green-500/20 text-green-400 border-green-500/30 cursor-default'
                                    : s === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30 cursor-default'
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30 cursor-default'
                                  : 'text-white/40 border-white/10 hover:text-white hover:bg-white/5 hover:border-white/20'
                              }`}
                            >
                              {s === 'Done' && <FiCheck size={12} className="inline mr-1" />}
                              {s === 'Rejected' && <FiX size={12} className="inline mr-1" />}
                              {s === 'Pending' && <FiClock size={12} className="inline mr-1" />}
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                        {/* Customer Info */}
                        <div>
                          <div className="font-body text-[10px] uppercase tracking-widest text-white/30 mb-2">Customer</div>
                          <div className="font-body text-sm text-white font-medium">{order.user?.name || 'N/A'}</div>
                          <div className="font-body text-xs text-white/40 mt-0.5">{order.user?.email || 'N/A'}</div>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-white/50">
                            <FiPhone size={11}/> {order.shippingAddress?.mobileNumber}
                          </div>
                          <div className="flex items-start gap-1.5 mt-1 text-xs text-white/40">
                            <FiMapPin size={11} className="mt-0.5 flex-shrink-0"/>
                            <span>{order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}</span>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <div className="font-body text-[10px] uppercase tracking-widest text-white/30 mb-2">Items</div>
                          <div className="space-y-2">
                            {order.orderItems.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><FiPackage size={12} className="text-white/30"/></div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-body text-xs text-white">{item.name}</div>
                                  <div className="font-body text-[10px] text-white/40">{item.qty} × ₹{item.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="font-body text-[10px] uppercase tracking-widest text-white/30 mb-2">Payment</div>
                            <div className="font-body text-xs text-white/50">{order.paymentMethod || 'COD'}</div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <div className="font-body text-[10px] text-white/30 mb-0.5">Total</div>
                            <div className="font-display font-bold text-xl text-primary-400">₹{order.totalPrice?.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
