import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';

interface ArticleCardProps extends ArtikalType {
  idPartnera: string;
  lastPurchaseDate?: string;  // <- dodaj ovo
}

const ArticleCard = ({ naziv, idArtikla, artikalCene, kolicina, idPartnera}: ArticleCardProps) => {
  const router = useRouter(); 
  const [isMounted, setMounted] = useState(false);
  const [lastPurchaseDate, setLastPurchaseDate] = useState<string | undefined>(undefined);


  useEffect(() => {
    setMounted(true);

    const fetchDatumPoslednjeKupovine = async() => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ADDRESS}/api/Artikal/ArtikalDatumKupovine?idPartnera=${idPartnera}&idArtikla=${idArtikla}`);
        if(response.ok) {
          const data = await response.json();
          setLastPurchaseDate(data.datumPoslednjeKupovine);
        }
      } catch (error) {
        console.error("Došlo je do greške prilikom dohvatanja istorije kupovine: ", error);
      }
    };

    if(idArtikla && idPartnera) fetchDatumPoslednjeKupovine();

  }, [idArtikla, idPartnera]);

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

    sessionStorage.setItem("prethodnaRuta", window.location.href);
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
        articleSize relative max-w-[320px] lg:max-w-[300px] rounded-2xl grid grid-rows-[auto,auto,auto]
        hover:shadow-2xl transition-shadow duration-300 min-h-[300px] 
        ${Number(kolicina) <= 0 ? 'opacity-50' : ''}
      `}
      onClickCapture={handleCardClick}
    >
      {/* Sloj preko slike */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-60 z-10 rounded-2xl pointer-events-none"></div>

      {/* Slika */}
      <div className="w-full h-[200px] flex justify-center items-center overflow-hidden rounded-2xl">
        <img
          src={fotografijaProizvoda}
          alt={naziv}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Detalji */}
      <div className="flex flex-col justify-between px-2 py-3 gap-2">
        <h2 className="text-md lg:text-lg font-semibold text-center break-words leading-tight line-clamp-3">
          {naziv}
        </h2>

        {/* Poslednja kupovina
        <p className="text-xs text-center text-gray-600 italic ">
          {lastPurchaseDate ? `Poslednja kupovina: ${formatDate(lastPurchaseDate)}` : ''}
        </p> */}

          {/* Poslednja kupovina */}
        <p className={`text-xs text-center text-gray-600 italic transition-all duration-200 ${lastPurchaseDate ? 'min-h-[1.25rem] opacity-100' : 'min-h-[0.25rem] opacity-0'}`}>
          {lastPurchaseDate && `Poslednja kupovina: ${formatDate(lastPurchaseDate)}`}
        </p>


        {/* Cena i dugme */}
        <div className="flex justify-between items-center">
          {/* Cena */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            {novaCena && novaCena > 0 ? (
              <div className="flex flex-col items-center  relative">
                <p className="text-sm font-semibold text-gray-500 line-through relative opacity-60">
                  {cenaArtikla}  
                  <span className='absolute -top-0.5 -right-5 text-[10px] line-through'>RSD</span>
                </p>

                <p className="text-[25px] lg:text-xl font-bold text-red-500 relative">
                  {novaCena}
                  <span className='absolute -right-8 text-sm'>RSD</span>
                </p>
              </div>
            ) : (
              <p className="text-[25px] lg:text-xl font-bold text-red-500 relative">
                  {cenaArtikla}
                  <span className='absolute -right-8 text-sm'>RSD</span>
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
