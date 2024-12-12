import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && adminOnly && user?.role !== 'admin') {
      router.push('/login');
    }
  }, [user, loading, adminOnly, router]);

  if (loading || !user) {
    return null;
  }

  return children;
}