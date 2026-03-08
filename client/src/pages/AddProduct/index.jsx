import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { scaleIn } from '../../animations/gsapAnimations';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import Button from '../../components/Button';
import { CATEGORIES } from '../../utils/helpers';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Khad',
    price: '',
    description: '',
    stock: '',
    featured: false,
  });

  useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin]);

  useEffect(() => {
    if (formRef.current) scaleIn(formRef.current);
  }, []);

  // Fetch product data for edit
  const { data: existingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id),
    select: (res) => res.data.product,
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingProduct) {
      setForm({
        name: existingProduct.name,
        category: existingProduct.category,
        price: existingProduct.price,
        description: existingProduct.description,
        stock: existingProduct.stock,
        featured: existingProduct.featured,
      });
      if (existingProduct.image?.url) {
        setImagePreview(existingProduct.image.url);
      }
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return false; }
    if (!form.price || isNaN(form.price) || form.price <= 0) { toast.error('Valid price is required'); return false; }
    if (!form.description.trim()) { toast.error('Description is required'); return false; }
    if (form.stock === '' || isNaN(form.stock) || form.stock < 0) { toast.error('Valid stock is required'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEdit) {
        await productAPI.update(id, formData);
        toast.success('Product updated successfully! ✅');
      } else {
        await productAPI.create(formData);
        toast.success('Product added successfully! 🌱');
      }
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['products']);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="font-body text-white/40 text-sm mt-0.5">
              {isEdit ? 'Update product details' : 'Fill in product information'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div ref={formRef} className="opacity-0 card p-8 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="label">Product Image</label>
            <div
              onClick={() => document.getElementById('imageInput').click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                imagePreview
                  ? 'border-primary-500/30 h-48'
                  : 'border-white/10 hover:border-primary-500/30 h-32 flex items-center justify-center'
              }`}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white font-body text-sm flex items-center gap-2">
                      <FiUpload size={16} /> Change Image
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white"
                  >
                    <FiX size={14} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <FiUpload className="text-white/20 mx-auto mb-2" size={24} />
                  <p className="font-body text-white/30 text-sm">Click to upload image</p>
                  <p className="font-body text-white/20 text-xs mt-0.5">JPG, PNG, WebP • Max 5MB</p>
                </div>
              )}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="label">Product Name *</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. DAP Fertilizer 50kg"
              value={form.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Category + Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
              >
                {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat} className="bg-dark">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Price (₹) *</label>
              <input
                name="price"
                type="number"
                placeholder="e.g. 1200"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <textarea
              name="description"
              placeholder="Describe the product, its benefits, usage instructions..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {/* Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Stock Quantity *</label>
              <input
                name="stock"
                type="number"
                placeholder="e.g. 100"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer pb-3">
                <div
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-12 h-6 rounded-full transition-all duration-200 flex items-center ${
                    form.featured ? 'bg-primary-500' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    form.featured ? 'translate-x-6.5 ml-0.5' : 'ml-0.5'
                  }`} />
                </div>
                <span className="font-body text-white/70 text-sm">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              loading={loading}
              className="flex-1"
            >
              {isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
            <Link to="/admin" className="btn-outline flex items-center justify-center px-6">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
