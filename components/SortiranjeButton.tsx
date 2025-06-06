'use client';

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SortiranjeButtonProps } from "@/types/artikal";

const SortiranjeButton = ({ artikli, setArtikli }: SortiranjeButtonProps) => {
    
  // Funkcije za sortiranje
  const sortirajRastuce = () => {
    console.log('Sortiraj rastuce pozvano', artikli);  // Proveri artikle pre sortiranja
    const sorted = [...artikli].sort((a, b) => {
      // Pristupamo ceni iz artikalCene[0].cena
      const cenaA = a.artikalCene?.[0]?.cena || 0;
      const cenaB = b.artikalCene?.[0]?.cena || 0;
      return cenaA - cenaB;
    });
    console.log('Sorted rastuce', sorted);  // Proveri sortirane artikle
    setArtikli(sorted);
  };

  const sortirajOpadajuce = () => {
    console.log('Sortiraj opadajuce pozvano', artikli);  // Proveri artikle pre sortiranja
    const sorted = [...artikli].sort((a, b) => {
      // Pristupamo ceni iz artikalCene[0].cena
      const cenaA = a.artikalCene?.[0]?.cena || 0;
      const cenaB = b.artikalCene?.[0]?.cena || 0;
      return cenaB - cenaA;
    });
    console.log('Sorted opadajuce', sorted);  // Proveri sortirane artikle
    setArtikli(sorted);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
          Sortiraj
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44">
        <div className="flex flex-col gap-2">
          <button onClick={sortirajRastuce} className="text-left hover:underline">
            Cena: Rastuće
          </button>
          <button onClick={sortirajOpadajuce} className="text-left hover:underline">
            Cena: Opadajuće
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SortiranjeButton;
