import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/'];
    const isPublicPath = publicPaths.includes(router.pathname);

    if (!token && !isPublicPath) {
      router.push('/');
    } else if (token) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [router.pathname]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <Component {...pageProps} isAuthenticated={isAuthenticated} />
    </Layout>
  );
}

export default MyApp;