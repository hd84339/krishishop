import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-lg">🌱</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Krishi<span className="text-primary-400">Shop</span></span>
            </div>
            <p className="font-body text-white/50 text-sm leading-relaxed">
              Empowering Indian farmers with quality agricultural products — fertilizers, seeds, pesticides and tools delivered to your doorstep.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Khad', label: 'Fertilizers (Khad)' },
                { to: '/products?category=Beej', label: 'Seeds (Beej)' },
                { to: '/products?category=Kitnashak', label: 'Pesticides' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {['Khad', 'Beej', 'Kitnashak', 'Farming Tools', 'Other'].map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin size={15} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-white/50">Farmers Market, Sector 21, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={15} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={15} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:support@krishishop.in" className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors">support@krishishop.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/30">© {new Date().getFullYear()} KrishiShop. All rights reserved.</p>
          <p className="font-body text-xs text-white/20">Made with 💚 for Indian Farmers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
