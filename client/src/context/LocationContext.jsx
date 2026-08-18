import { createContext, useContext, useMemo, useState } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [consent, setConsent] = useState(false);
  const [session, setSession] = useState(null);
  const value = useMemo(() => ({ consent, setConsent, session, setSession }), [consent, session]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext() {
  return useContext(LocationContext);
}
