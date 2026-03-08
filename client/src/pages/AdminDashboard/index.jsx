import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getCategoryIcon } from '../../utils/helpers';
import { fadeInUp } from '../../animations/gsapAnimations';
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiLayers, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin]);

  useEffect(() => {
    if (headerRef.current) fadeInUp(headerRef.current);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productAPI.getAll({ limit: 100 }),
    select: (res) => res.data,
    enabled: isAdmin,
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

  const products = data?.products || [];
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const categoryCount = [...new Set(products.map(p => p.category))].length;

  if (!isAdmin) return null;

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 opacity-0">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white">Admin Dashboard</h1>
            <p className="font-body text-white/40 mt-1">Welcome back, {user?.name} 👋</p>
          </div>
          <Link to="/admin/add-product" className="btn-primary flex items-center gap-2 w-fit">
            <FiPlus size={18} />
            Add Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-spin mx-auto" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4 opacity-30">📦</div>
              <p className="font-body text-white/40">No products yet. Add your first product!</p>
              <Link to="/admin/add-product" className="btn-primary mt-4 inline-flex">
                <FiPlus size={16} /> Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 font-body text-xs font-medium text-white/30 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/2 transition-colors group">
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-500/10 flex-shrink-0">
                            {product.image?.url ? (
                              <img src={product.image.url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                {getCategoryIcon(product.category)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-body font-medium text-white text-sm line-clamp-1">{product.name}</div>
                            <div className="font-mono text-white/20 text-xs">{product._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="font-body text-white/50 text-sm flex items-center gap-1.5">
                          {getCategoryIcon(product.category)} {product.category}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="font-display font-semibold text-primary-400 text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span className="font-body text-white/50 text-sm">{product.stock}</span>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`badge border text-xs ${
                          product.stock === 0
                            ? 'text-red-400 bg-red-400/10 border-red-400/20'
                            : product.stock < 10
                            ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                            : 'text-green-400 bg-green-400/10 border-green-400/20'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="p-2 rounded-lg text-white/30 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                          >
                            <FiEdit2 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
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
      </div>
    </div>
  );
};

export default AdminDashboard;
