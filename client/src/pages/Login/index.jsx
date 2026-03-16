import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scaleIn } from '../../animations/gsapAnimations';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const cardRef = useRef(null);
  const { handleOAuthCallback, isAuthenticated } = useAuth();
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
            <span className="font-display font-bold text-2xl text-white">Krishi<span className="text-primary-400">Shop</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white">
            Welcome to KrishiShop
          </h1>
          <p className="font-body text-white/50 mt-2 text-sm">
            Empowering farmers with modern commerce
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="text-center mb-6">
            <p className="font-body text-white/50 text-sm">
              Please use your Google account to access your dashboard and manage your orders.
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 font-display font-semibold text-white shadow-lg hover:shadow-primary-500/10 group"
          >
            <FcGoogle size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-lg">Continue with Google</span>
          </button>

          <div className="mt-8 flex justify-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center text-[10px] overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="ml-3 flex items-center">
              <span className="text-xs font-body text-white/30">Trusted by 1000+ farmers</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 font-body text-xs text-white/20 px-6">
          By continuing, you agree to VindhyaKrishi's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
