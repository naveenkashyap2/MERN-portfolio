import { useCallback, useState } from 'react';
import { getCurrentPosition } from '../../../services/location.service.js';

export function useGeolocation() {
  const [point, setPoint] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const locate = useCallback(async () => {
    setStatus('locating');
    try {
      const p = await getCurrentPosition();
      setPoint(p);
      setStatus('detected');
      setError('');
      return p;
    } catch (err) {
      setStatus(err.code === 1 ? 'denied' : 'unavailable');
      setError(err.message);
      throw err;
    }
  }, []);

  return { point, error, status, locate };
}
