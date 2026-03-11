import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scaleIn } from '../../animations/gsapAnimations';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Button from '../../components/Button';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);
  const { login, register, handleOAuthCallback, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth callback params
  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed. Please try again.');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        handleOAuthCallback(token, user);
        toast.success(`Welcome, ${user.name}! 🌱`);
        navigate(user.role === 'admin' ? '/admin' : '/');
      } catch {
        toast.error('Login failed. Please try again.');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  useEffect(() => {
    if (cardRef.current) scaleIn(cardRef.current);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return false;
    }
    if (mode === 'register' && !form.name) {
      toast.error('Name is required');
      return false;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let user;
      if (mode === 'login') {
        user = await login(form.email, form.password);
        toast.success(`Welcome back, ${user.name}! 🌱`);
      } else {
        user = await register(form.name, form.email, form.password);
        toast.success(`Account created! Welcome, ${user.name}! 🌱`);
      }
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/google`;
  };

  return (
    <div className="bg-mesh min-h-screen flex items-center justify-center p-4 pt-24">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-earth-500/8 rounded-full blur-3xl" />
      </div>

      <div ref={cardRef} className="opacity-0 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-xl">🌱</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">Vindhya<span className="text-primary-400">Krishi</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white">
            {mode === 'login' ? 'Welcome back' : 'Join VindhyaKrishi'}
          </h1>
          <p className="font-body text-white/50 mt-2 text-sm">
            {mode === 'login' ? 'Login to access your account' : 'Create an account to start shopping'}
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-primary-500 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pl-11 pr-11"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              loading={loading}
              className="w-full py-3 mt-2"
            >
              {mode === 'login' ? 'Login to Account' : 'Create Account'}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-body text-white/30 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-200 font-body text-sm text-white/70 hover:text-white"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* Admin hint */}
          <div className="mt-5 p-3 rounded-xl bg-primary-500/5 border border-primary-500/15">
            <p className="font-body text-xs text-white/30 text-center">
              Admin: <span className="text-primary-400/70">hd84339@gmail.com</span> / <span className="text-primary-400/70">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-5 font-body text-sm text-white/30">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-primary-400 hover:text-primary-300 transition-colors"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
