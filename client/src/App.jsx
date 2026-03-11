import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './pages/AddProduct';
import AuthCallback from './pages/AuthCallback';
import UserDashboard from './pages/UserDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-dark flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><UserDashboard /></ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/add-product" element={
                  <AdminRoute><ProductForm /></AdminRoute>
                } />
                <Route path="/admin/edit-product/:id" element={
                  <AdminRoute><ProductForm /></AdminRoute>
                } />

                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-mesh">
                    <div className="text-center">
                      <div className="font-display font-bold text-8xl text-primary-500/30 mb-4">404</div>
                      <h2 className="font-display text-3xl text-white mb-2">Page not found</h2>
                      <p className="font-body text-white/40 mb-6">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a2e1a',
                color: '#fff',
                border: '1px solid rgba(34, 197, 94, 0.15)',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                borderRadius: '12px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#fff' },
              },
              error: {
                style: {
                  background: '#2e1a1a',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                },
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
