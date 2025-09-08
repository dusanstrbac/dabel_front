'use client';

import axios from "axios";
import { useCallback, useEffect, useState } from 'react';

export type webparametri = {
  id: number;
  naziv: string;
  vrednost: string;
  deskripcija: string;
  cena?: number;
};

const LOCAL_STORAGE_KEY = "webparametri";
const TIMESTAMP_KEY = `${LOCAL_STORAGE_KEY}-timestamp`;
const REFRESH_INTERVAL_HOURS = 6;
const sixHoursInMs = REFRESH_INTERVAL_HOURS * 60 * 60 * 1000;


// Postojeće funkcije
export function DajParametre(): webparametri[] | null {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Parametri ne postoje u localStorage:", error);
    return null;
  }
}

export function TrebaOsvezitiParametre(): boolean {
  const lastFetched = localStorage.getItem(TIMESTAMP_KEY);
  const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  const now = Date.now();

  if (!cachedData) return true;
  
  return !lastFetched || now - parseInt(lastFetched) >= sixHoursInMs;
}

export async function OsveziParametre(): Promise<webparametri[] | null> {
  try {
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const response = await axios.get(`${apiAddress}/api/Web/WEBParametrizacija`);
    const data = response.data;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());

    return data;
  } catch (error) {
    console.error("Greška prilikom osvežavanja parametara:", error);
    return null;
  }
}

export function useWebParametri() {
  const [parametri, setParametri] = useState<webparametri[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Proveri da li treba osvežiti (ili ako je forsiran refresh)
      const shouldRefresh = forceRefresh || TrebaOsvezitiParametre();
      
      if (shouldRefresh) {
        setParametri(await OsveziParametre());
      } else {
        setParametri(DajParametre());
      }
    } catch (err) {
      console.error('Greška pri dobavljanju parametara:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      
      // Fallback na cached podatke ako postoje
      setParametri(DajParametre());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mountovanje useWebParametri hooka
    
    // Prvo proveri localStorage pre nego što pokreneš fetch
    const initialData = DajParametre();
    if (initialData) {
      setParametri(initialData);
    }

    // U svakom slučaju pokreni fetch da proveri da li treba osvežiti
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, sixHoursInMs); // 10 sekundi za testiranje

    return () => {
      clearInterval(interval);
    };
  }, [fetchData]);

  // Dodaj funkciju za ručno osvežavanje ako je potrebno
  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return { parametri, isLoading, error, refresh };
}