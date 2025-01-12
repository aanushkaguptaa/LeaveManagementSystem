'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page on component mount
    router.push('/login');
  }, [router]);

  // This component does not render any UI
  return null;
}
