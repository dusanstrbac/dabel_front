import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';


const ArticleCard = ({ naziv, idArtikla, artikalCene }: ArtikalType) => {
  const router = useRouter(); 
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const posaljiNaArtikal = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest('button') || target.closest('svg') || target.closest('path')) {
      return;
    }

    if (!idArtikla) {
      console.error("ID artikla nije definisan");
      return;
    }

    router.push(`/proizvodi/${idArtikla}`);
  };

  if (!isMounted) return null;

  // Provera cene i precrtavanje
  const cenaArtikla = artikalCene[0].cena > 0 ? artikalCene[0].cena : 0;  // Originalna cena
  const novaCena = artikalCene && artikalCene.length > 0 ? artikalCene[0].cena : null; // Ako postoji nova cena

  return (
    <div
      className="articleSize relative max-w-[320px] hover:shadow-2xl transition-shadow duration-300 rounded-2xl grid grid-rows-[auto,auto,auto]"
      onClickCapture={posaljiNaArtikal} 
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl pointer-events-none"></div>

      <div className="w-full h-64 relative">
        <Image
          src={'/artikal.jpg'}  // Dodajte default sliku ako slika nije dostupna
          alt={naziv}
          layout="fill"
          objectFit="cover"
          className="rounded-lg w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between px-2 py-3">
        <h2 className="text-sm lg:text-lg font-semibold text-center">{naziv}</h2>
        <div className="flex justify-between items-center">
          {/* Prikazivanje cene */}
          {novaCena && novaCena > 0 && artikalCene[0].cena > novaCena && (
            <p className="text-md lg:text-xl font-semibold text-red-500 line-through">
              <span>{artikalCene[0].cena}</span> RSD
            </p>
          )}
          
          {/* Prikazivanje nove cene */}
          {novaCena && novaCena > 0 && (
            <p className="text-md lg:text-xl font-semibold text-red-500">
              <span>{novaCena}</span> RSD
            </p>
          )}
          
          {/* Ako cena nije postavljena ili je 0 */}
          {artikalCene[0].cena > 0 && !novaCena && (
            <p className="text-md lg:text-xl font-semibold text-red-500">
              <span>{artikalCene[0].cena}</span> RSD
            </p>
          )}

          <div className="pointer-events-auto">
            <AddToCartButton
              id={idArtikla}
              getKolicina={() => Number(1)}
              nazivArtikla={naziv}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArticleCard;
