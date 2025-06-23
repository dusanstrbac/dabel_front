'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArtikalType } from '@/types/artikal';
import { dajKorisnikaIzTokena } from '@/lib/auth';

const PretragaProizvoda = () => {
  const [query, setQuery] = useState('');
  const [rezultati, setRezultati] = useState<ArtikalType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const korisnik = dajKorisnikaIzTokena();

  useEffect(() => {
    const fetchData = async () => {
      if (query.length < 2) {
        setRezultati([]);
        return;
      }
      
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      try {

        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        const res = await fetch(
          `${apiAddress}/api/Artikal/DajFilterArtikle?idPartnera=${korisnik?.idKorisnika}&batchSize=1000&naziv=${encodeURIComponent(trimmedQuery)}`
        );

        const data = await res.json();
        console.log('Raw data:', data);

        setRezultati(data.items || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Greška pri pretrazi:', err);
        setRezultati([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleRedirect = (idArtikla: string) => {
    setShowDropdown(false);
    setQuery('');
    router.push(`/proizvodi/${idArtikla}`);
  };

  return (
    <div className="w-[40%] relative ml-16 mr-2">
      <Input
        placeholder="Pretraga"
        className="pl-4 pr-10 py-2 border border-black rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />

      {/* Dropdown rezultati */}
      {showDropdown && rezultati.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {rezultati.map((artikal) => (
            <div
              key={artikal.idArtikla}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleRedirect(artikal.idArtikla)}
            >
              {artikal.naziv}
            </div>
          ))}
        </div>
      )}

      {/* Ako nema rezultata */}
      {showDropdown && query.length >= 2 && rezultati.length === 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg px-4 py-2 text-sm text-gray-500">
          Nema rezultata.
        </div>
      )}
    </div>
  );
};

export default PretragaProizvoda;
