import { useEffect, useState } from 'react';
import AppRouter from './router.jsx';
import ToastHost from '../components/common/ToastHost.jsx';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';

export default function App() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    const onKey = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        window.location.href = '/explore';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <ErrorBoundary>
      {offline && (
        <div className="bg-amber-500/20 px-4 py-2 text-center text-sm text-amber-100">You're offline</div>
      )}
      <AppRouter />
      <ToastHost />
    </ErrorBoundary>
  );
}
