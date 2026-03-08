import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navbarAnimation } from '../../animations/gsapAnimations';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navbarAnimation(navRef.current);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/products?category=Khad', label: 'Khad' },
    { to: '/products?category=Beej', label: 'Beej' },
    { to: '/products?category=Kitnashak', label: 'Kitnashak' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark/95 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow duration-300">
              <span className="text-lg">🌱</span>
            </div>
            <div>
              <span className="font-display font-bold text-xl text-white">Krishi</span>
              <span className="font-display font-bold text-xl text-primary-400">Shop</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors duration-200"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/50" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/50 flex items-center justify-center">
                      <span className="text-primary-400 text-sm font-medium">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-body text-white/80">{user?.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 glass rounded-2xl shadow-2xl border border-white/10 py-2 z-50">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <FiSettings size={15} />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm hidden md:flex items-center gap-2">
                <FiUser size={16} />
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-dark/95 backdrop-blur-xl border-t border-white/5 py-4 px-2">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-body text-sm"
              >
                {label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block mt-2 mx-2 btn-primary text-center text-sm"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
