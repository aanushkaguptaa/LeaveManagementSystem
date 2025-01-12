import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
    // Redirect to login if user is not an admin but admin access is required
    if (!loading && adminOnly && user?.role !== 'admin') {
      router.push('/login');
    }
  }, [user, loading, adminOnly, router]);

  // Render nothing while loading or if user is not authenticated
  if (loading || !user) {
    return null;
  }

  // Render children components if user is authenticated
  return children;
}