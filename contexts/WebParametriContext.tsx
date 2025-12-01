// contexts/WebParametriContext.tsx
'use client';

import axios from "axios";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Tipovi ostaju isti
export type webparametri = {
  id: number;
  naziv: string;
  vrednost: string;
  deskripcija: string;
  cena?: number;
};

type WebParametriContextType = {
  parametri: webparametri[] | null;
  isLoading: boolean;
  getParametar: (naziv: string) => string | undefined; // Helper funkcija za lakši pristup
  osvezi: () => Promise<void>;
};

const WebParametriContext = createContext<WebParametriContextType | undefined>(undefined);

// Konstante
const LOCAL_STORAGE_KEY = "webparametri";
const TIMESTAMP_KEY = `${LOCAL_STORAGE_KEY}-timestamp`;
const REFRESH_INTERVAL_HOURS = 6;
const sixHoursInMs = REFRESH_INTERVAL_HOURS * 60 * 60 * 1000;

export function WebParametriProvider({ children }: { children: React.ReactNode }) {
  const [parametri, setParametri] = useState<webparametri[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interna funkcija za čitanje iz LocalStorage-a
  const readFromStorage = () => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  };

  const fetchData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const lastFetched = localStorage.getItem(TIMESTAMP_KEY);
      const cachedData = readFromStorage();
      const now = Date.now();
      
      const shouldRefresh = forceRefresh || !cachedData || !lastFetched || (now - parseInt(lastFetched) >= sixHoursInMs);

      if (shouldRefresh) {
        // Fetch sa API-ja
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const response = await axios.get(`${apiAddress}/api/Web/WEBParametrizacija`);
        const data = response.data;

        // Čuvanje u storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
        
        // Ažuriranje STATE-a (ovo je ključno za re-render aplikacije)
        setParametri(data);
      } else {
        // Ako ne treba refresh, samo osiguraj da je state sinhronizovan sa storage-om
        setParametri(cachedData);
      }
    } catch (error) {
      console.error("Greška pri osvežavanju parametara:", error);
      // Fallback na keš ako API pukne
      const cached = readFromStorage();
      if (cached) setParametri(cached);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inicijalno učitavanje
  useEffect(() => {
    // 1. Odmah učitaj iz storage-a da korisnik ne čeka (Optimistic UI)
    const initialData = readFromStorage();
    if (initialData) {
      setParametri(initialData);
    }

    // 2. Proveri da li treba fetch u pozadini
    fetchData();

    // 3. Postavi interval
    const interval = setInterval(() => {
      fetchData();
    }, sixHoursInMs);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Helper za lako dobijanje vrednosti (npr. daj mi 'email')
  const getParametar = useCallback((naziv: string) => {
    return parametri?.find(p => p.naziv === naziv)?.vrednost;
  }, [parametri]);

  return (
    <WebParametriContext.Provider value={{ parametri, isLoading, getParametar, osvezi: () => fetchData(true) }}>
      {children}
    </WebParametriContext.Provider>
  );
}

// Hook za korišćenje u komponentama
export function useWebParametri() {
  const context = useContext(WebParametriContext);
  if (context === undefined) {
    throw new Error('useWebParametri must be used within a WebParametriProvider');
  }
  return context;
}