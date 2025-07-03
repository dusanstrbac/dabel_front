'use client';

import { Input } from '@/components/ui/input';
import { Camera, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArtikalType } from '@/types/artikal';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const PretragaProizvoda = () => {
  const [query, setQuery] = useState('');
  const [rezultati, setRezultati] = useState<ArtikalType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
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

  const handleBarcodeRedirect = (idArtikla: string) => {
    router.push(`/proizvodi/${idArtikla}`);
    setScannerActive(false);
  };

  return (
    <div className="w-[40%] relative ml-16 mr-2">
      <div className='relative'>
        <Input
          placeholder="Pretraga"
          className="pl-4 pr-10 py-2 border border-black rounded-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
        />
        
        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          <Search
            className="text-gray-500 h-5 w-5"
          />

          <Dialog open={scannerActive} onOpenChange={setScannerActive}>
            <DialogTrigger asChild>
              <Camera className="cursor-pointer text-gray-500 hover:text-black h-5 w-5"/>
            </DialogTrigger>

              {/* max-w-[300px] w-[400px] md:max-w-full p-4 */}
            <DialogContent className="max-w-[calc(100%-30px)] w-full sm:max-w-[500px] p-6">
              <DialogHeader>
                <DialogTitle className="text-center text-lg mb-2">Skeniranje barkoda</DialogTitle>
              </DialogHeader>
              
              <div className="flex justify-center">
                <BarcodeScannerComponent
                  width={400}
                  height={310}
                  onUpdate={(err, result) => {
                    if (result) {
                      const barkod = result.getText(); 
                      handleBarcodeRedirect(barkod);
                    }
                  }}
                />
              </div>

              <DialogClose className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Zatvori
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
