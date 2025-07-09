import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';

interface ArticleCardProps extends ArtikalType {
  lastPurchaseDate?: string; // Dodato polje za datum poslednje kupovine
}

const ArticleCard = ({
  naziv,
  idArtikla,
  artikalCene,
  kolicina,
  lastPurchaseDate,
}: ArticleCardProps) => {
  const router = useRouter(); 
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageUrl = '/images';
  const fotografijaProizvoda = `${imageUrl}/s${idArtikla}.jpg`;

  const handleCardClick = (e: React.MouseEvent) => {
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

  const cenaArtikla = artikalCene?.[0]?.cena ?? 0;
  const novaCena = artikalCene?.[0]?.akcija?.cena ?? null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`
        articleSize relative max-w-[320px] rounded-2xl grid grid-rows-[auto,auto,auto]
        hover:shadow-2xl transition-shadow duration-300 
        ${Number(kolicina) <= 0 ? 'opacity-50' : ''}
      `}
      onClickCapture={handleCardClick}
    >
      {/* Sloj preko slike */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl pointer-events-none"></div>

      {/* Slika */}
      <div className="w-full h-64 relative">
        <img
          src={fotografijaProizvoda}
          alt={naziv}
          sizes="(max-width: 768px) 100vw, 320px"
          className="rounded-lg w-full h-full object-cover scale-95"
        />
      </div>

      {/* Detalji */}
      <div className="flex flex-col justify-between px-2 py-3 gap-2">
        <h2 className="text-sm lg:text-lg font-semibold text-center">{naziv}</h2>

        {/* Datum poslednje kupovine */}
        {/* {formatDate(lastPurchaseDate)} */}
        {lastPurchaseDate && (
          <p className="text-xs text-center text-gray-600 italic">
            Poslednja kupovina: {formatDate(lastPurchaseDate)}
          </p>
        )}

        {/* Cena i dugme */}
        <div className="flex justify-between items-center">
          {/* Cena */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            {novaCena && novaCena > 0 ? (
              <div className="flex items-center gap-2">
                <p className="text-md lg:text-xl font-semibold text-gray-500 line-through">
                  {cenaArtikla} RSD
                </p>
                <p className="text-md lg:text-xl font-semibold text-red-500">
                  {novaCena} RSD
                </p>
              </div>
            ) : (
              <p className="text-md lg:text-xl font-semibold text-red-500">
                {cenaArtikla} RSD
              </p>
            )}
          </div>

          {/* Dugme */}
          <div className="pointer-events-auto">
            <AddToCartButton
              id={idArtikla}
              getKolicina={() => 1}
              nazivArtikla={naziv}
              disabled={Number(kolicina) <= 0}
              ukupnaKolicina={Number(kolicina)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
