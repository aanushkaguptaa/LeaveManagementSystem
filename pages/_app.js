import { AuthProvider } from '@/contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  // Wrap the application with AuthProvider to manage authentication state
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;