import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { fadeInUp } from '../../animations/gsapAnimations';
import {
  FiShoppingBag, FiUser, FiMail, FiCalendar, FiClock,
  FiCheck, FiX, FiPackage, FiMapPin, FiPhone
} from 'react-icons/fi';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated]);

  useEffect(() => {
    if (headerRef.current) fadeInUp(headerRef.current);
  }, []);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await orderAPI.getMyOrders();
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <FiCheck size={14} />;
      case 'Rejected': return <FiX size={14} />;
      default: return <FiClock size={14} />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Profile */}
        <div ref={headerRef} className="opacity-0 mb-10">
          <div className="card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-500/50" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white">{user?.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 font-body text-white/40 text-sm">
                    <FiMail size={14} /> {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5 font-body text-white/40 text-sm">
                    <FiCalendar size={14} /> Joined {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <div className="font-display font-bold text-xl text-primary-400">{orders?.length || 0}</div>
                  <div className="font-body text-white/40 text-xs">Orders</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <FiShoppingBag size={20} className="text-primary-400" /> My Orders
          </h2>
          <Link to="/products" className="btn-outline text-sm">Continue Shopping</Link>
        </div>

        {isLoading ? (
          <div className="card p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4 opacity-30">🛒</div>
            <h3 className="font-display font-semibold text-white text-lg mb-2">No orders yet</h3>
            <p className="font-body text-white/40 text-sm mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card p-5 md:p-6 hover:border-white/10 transition-colors">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4 pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-bold text-white">Order #{order._id.substring(0, 8)}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-body text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={11} /> {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={11} /> {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-body text-white/30 text-xs">Total</div>
                    <div className="font-display font-bold text-lg text-primary-400">{formatPrice(order.totalPrice)}</div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiPackage size={16} className="text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-body text-sm text-white truncate">{item.name}</div>
                        <div className="font-body text-xs text-white/40">{item.qty} × {formatPrice(item.price)}</div>
                      </div>
                      <div className="font-body text-sm text-white/60 font-medium">{formatPrice(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>

                {/* Shipping Info */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="font-body text-[10px] uppercase tracking-widest text-white/30 mb-2">Shipping Details</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-white/50 font-body">
                      <FiUser size={11} /> {order.shippingAddress?.fullName}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/50 font-body">
                      <FiPhone size={11} /> {order.shippingAddress?.mobileNumber}
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-white/40 font-body sm:col-span-2">
                      <FiMapPin size={11} className="mt-0.5 flex-shrink-0" />
                      <span>{order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
