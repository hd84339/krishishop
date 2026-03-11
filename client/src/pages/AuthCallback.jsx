import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed.');
      navigate('/login');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        handleOAuthCallback(token, user);
        toast.success(`Welcome, ${user.name}! 🌱`);
        navigate(user.role === 'admin' ? '/admin' : '/');
      } catch {
        toast.error('Login failed.');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  return <Loader fullScreen />;
};

export default AuthCallback;
