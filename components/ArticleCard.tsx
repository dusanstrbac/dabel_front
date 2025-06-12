import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';


const ArticleCard = ({ naziv, idArtikla, artikalCene }: ArtikalType) => {
  const router = useRouter(); 
  const [isMounted, setMounted] = useState(false);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_ADDRESS;
  const fotografijaProizvoda = `${imageUrl}/s${idArtikla}.jpg`;
  
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
  const cenaArtikla = artikalCene?.[0]?.cena ?? 0;  // Originalna cena
  const novaCena = artikalCene?.[0]?.akcija?.cena ?? null; // Ako postoji nova cena

  return (
    <div
      className="articleSize relative max-w-[320px] hover:shadow-2xl transition-shadow duration-300 rounded-2xl grid grid-rows-[auto,auto,auto]"
      onClickCapture={posaljiNaArtikal} 
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl pointer-events-none"></div>

      <div className="w-full h-64 relative">
        <img
          src={fotografijaProizvoda}
          alt={naziv}
          sizes="(max-width: 768px) 100vw, 320px"
          style={{objectFit: 'cover'}}
          className="rounded-lg w-full h-full object-cover scale-95"
        />
      </div>

      <div className="flex flex-col justify-between px-2 py-3">
        <h2 className="text-sm lg:text-lg font-semibold text-center">{naziv}</h2>
        <div className="flex justify-between items-center">
          
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          {novaCena && novaCena > 0 ? (

            <div className='flex items-center gap-2'>
              <p className="text-md lg:text-xl font-semibold text-gray-500 line-through">
                <span>{cenaArtikla}</span> RSD
              </p>

              <p className="text-md lg:text-xl font-semibold text-red-500">
                <span>{novaCena}</span> RSD
              </p>
            </div>

          ) : (
            <p className="text-md lg:text-xl font-semibold text-red-500">
              <span>{artikalCene[0].cena}</span> RSD
            </p>
          )}
        </div>

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
