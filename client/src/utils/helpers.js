export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

export const getCategoryIcon = (category) => {
  const icons = {
    Khad: '🌿',
    Beej: '🌱',
    Kitnashak: '🛡️',
    'Farming Tools': '🔧',
    Other: '📦',
  };
  return icons[category] || '📦';
};

export const getCategoryColor = (category) => {
  const colors = {
    Khad: 'text-green-400 bg-green-400/10 border-green-400/20',
    Beej: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Kitnashak: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Farming Tools': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Other: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };
  return colors[category] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-400' };
  if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-400' };
  return { label: 'In Stock', color: 'text-green-400' };
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const CATEGORIES = ['All', 'Khad', 'Beej', 'Kitnashak', 'Farming Tools', 'Other'];
