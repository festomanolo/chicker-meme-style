import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth-store';
import { Loading } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to auth page with return path
      navigate('/auth', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Loading className="min-h-screen" size="lg" />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}