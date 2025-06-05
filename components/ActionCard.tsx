import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';

const ActionCard = ({ idArtikla, naziv, artikalCene }: ArtikalType) => {
  const router = useRouter();
  const [isMounted, setMounted] = useState(false);

  const izracunajPopust = (
    staraCena: number | string | undefined, 
    cena: number | string | undefined
  ) => {
    if (!staraCena || !cena) return 0;

    const staraNum = Number(staraCena);
    const novaNum = Number(cena);

    if (isNaN(staraNum) || isNaN(novaNum)) return 0;
    if (staraNum <= novaNum) return 0;

    return Math.round(((staraNum - novaNum) / staraNum) * 100);
  };

  // Pristupaj prvoj ceni i akciji sigurno sa optional chaining
  const cenaAkcije = artikalCene?.[0]?.akcija?.cena;
  const staraCenaAkcije = artikalCene?.[0]?.akcija?.staraCena;
  const popust = izracunajPopust(staraCenaAkcije, cenaAkcije);

  useEffect(() => {
    setMounted(true);
  }, []);

  const posaljiNaArtikal = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest('button') ||
      target.closest('svg') ||
      target.closest('path')
    ) {
      return;
    }

    router.push(`/proizvodi/${idArtikla}`);
  };

  if (!isMounted) return null;

  return (
    <div
      className="articleSize cursor-pointer relative max-w-[320px] hover:shadow-2xl transition-shadow duration-300 rounded-2xl grid grid-rows-[auto,auto,auto]"
      onClickCapture={posaljiNaArtikal}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl pointer-events-none"></div>

      {/* Popust badge */}
      {popust > 0 && (
        <div className="absolute top-2 left-2 py-2 px-3 text-sm text-center rounded-2xl bg-red-500 text-white z-10 border-2">
          -{popust}%
        </div>
      )}

      {/* Slika */}
      <div className="w-full h-64 relative">
        <Image
          src={'/artikal.jpg'}
          alt={naziv}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-lg w-full h-full object-cover"
        />
      </div>

      {/* Tekstualni deo */}
      <div className="flex flex-col justify-between px-2 py-3">
        {/* Ime artikla */}
        <h2 className="text-sm lg:text-lg font-semibold text-center">{naziv}</h2>

        {/* Cena i dugme */}
        <div className="flex justify-between items-center">
          <p className="text-md lg:text-xl font-semibold text-red-500">
            {staraCenaAkcije && (
              <span className="line-through text-gray-400">{staraCenaAkcije} </span>
            )}
            <span className="pl-[5px]">{cenaAkcije} RSD</span>
          </p>

          <div>
            <AddToCartButton
              id={idArtikla}
              getKolicina={() => 1}
              nazivArtikla={naziv}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;