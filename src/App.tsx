import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { initDatabase } from '@/lib/database';
import { useAuthStore } from '@/lib/auth-store';

// Web pages
import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import Cart from '@/pages/Cart';
import Account from '@/pages/Account';
import Customize from '@/pages/Customize';
import Orders from '@/pages/Orders';
import Auth from '@/pages/Auth';
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';

// Global styles
import './globals.css';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        await checkAuth();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();
  }, [checkAuth]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="chicker-theme">
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/customize" element={<Customize />} />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;