import { createContext, useContext, useMemo, useState } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [draft, setDraft] = useState({
    origin: 'Delhi',
    destination: 'Agra',
    startDate: '',
    endDate: '',
    travelers: { adults: 2, children: 0 },
    budget: 5000,
    transportPreference: 'train',
    stayPreference: 'medium',
    interests: ['historical', 'temple', 'food'],
    naturalLanguage: '',
  });

  const value = useMemo(() => ({ draft, setDraft }), [draft]);
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTripContext() {
  return useContext(TripContext);
}
