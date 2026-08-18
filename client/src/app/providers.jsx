import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './queryClient.js';
import { AuthProvider } from '../context/AuthContext.jsx';
import { TripProvider } from '../context/TripContext.jsx';
import { LocationProvider } from '../context/LocationContext.jsx';
import { useState } from 'react';

export default function Providers({ children }) {
  const [client] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <TripProvider>
          <LocationProvider>{children}</LocationProvider>
        </TripProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
