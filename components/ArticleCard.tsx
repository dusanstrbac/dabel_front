import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import AddToCartButton from './AddToCartButton';
import { NoviArtikalType } from '@/types/artikal';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { dajKorisnikaIzTokena } from '@/lib/auth';

interface ArticleCardProps {
  idPartnera: string;
  lastPurchaseDate?: string;
  datumPoslednjeKupovine?: string;
  kolicinaKupovine?: number;
  kolicinaPristizanja?: number;
}

// Izbaci ono "extends NoviArtikalType"
interface ArticleCardProps {
  idPartnera: string;
  Artikal: string;
  Naziv: string;
  Cena: number;
  AkcijskaCena: number;
  AkcijskaKolicina?: number;
  KolicinaNaStanju: number;
  KolicinaZaIzdavanje: number;
  datumPristizanja?: Date;
  datumPoslednjeKupovine?: string;
}

const ArticleCard = ({Naziv, Artikal, Cena, AkcijskaCena, AkcijskaKolicina, KolicinaZaIzdavanje, datumPoslednjeKupovine, datumPristizanja }: ArticleCardProps) => {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const imageUrl = '/images';
  const fotografijaProizvoda = `${imageUrl}/s${Artikal}.jpg`;
  
  const korisnik = dajKorisnikaIzTokena();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const [partner, setPartner] = useState<KorisnikPodaciType | null>(null);

  useEffect(() => {
      const fetchPartner = async () => {
        const idPartnera = korisnik?.partner;
        const idKorisnika = korisnik?.idKorisnika;
        try{
          const res = await fetch(`${apiAddress}/api/Partner/DajPartnere?idPartnera=${idPartnera}&idKorisnika=${idKorisnika}`);
          const data = await res.json();
          const fPartner = data[0] as KorisnikPodaciType;
          setPartner(fPartner);
        }
        catch (err) {
          console.error(t('greskaFetchPartnera'), err);
        }
        
      };
      fetchPartner();
  }, []);

  const rabat = partner?.partnerRabat.rabat ?? 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest('button') || target.closest('svg') || target.closest('path')) {
      return;
    }

    if (!Artikal) {
      console.error("ID artikla nije definisan");
      return;
    }

    sessionStorage.setItem("prethodnaRuta", window.location.href);
    router.push(`/proizvodi/${Artikal}`);
  };

  const cenaBezRabata = Cena ?? 0;
  const cenaArtikla = cenaBezRabata.toFixed(2);
  const novaCenaBezRabata = AkcijskaCena ?? null;
  // const AkCena = Number.isInteger(novaCenaBezRabata).toFixed(2);
  // const AkCena = novaCenaBezRabata.toFixed(2);
  const AkCena = novaCenaBezRabata != null
                                  ? Number(novaCenaBezRabata).toFixed(2)
                                  : null;


  const formatDate = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "";

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      // Nije validan datum
      return "";
    }

    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };


  return (
    <div
      className={`articleSize relative w-full sm:max-w-[280px] md:max-w-[300px] lg:max-w-[320px] 
        rounded-2xl flex flex-col justify-between bg-white shadow-sm 
        hover:shadow-2xl transition-shadow duration-300
        ${Number(KolicinaZaIzdavanje) <= 0 ? 'opacity-50' : ''}`}
      onClickCapture={handleCardClick}
    >
      {/* Sloj preko slike */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-60 z-10 rounded-2xl pointer-events-none"></div>

      {/* Slika */}
      <div className="w-full aspect-[4/3] flex justify-center items-center overflow-hidden rounded-t-2xl bg-white">
        <img
          src={fotografijaProizvoda}
          alt={Naziv}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Detalji */}
      <div className="flex flex-col justify-between px-3 py-4 gap-3 flex-grow">
        <h2 className="text-md lg:text-lg font-semibold text-center break-words leading-tight line-clamp-3">
          {Naziv}
        </h2>

        <p
          className={`text-xs text-center text-gray-600 italic transition-all duration-200 ${
            datumPoslednjeKupovine ? 'min-h-[1.25rem] opacity-100' : 'min-h-[0.25rem] opacity-0'
          }`}
        >
          {datumPoslednjeKupovine && `${t('main.Poslednja kupovina')} ${formatDate(datumPoslednjeKupovine)}`}
        </p>

        {/* Datum pristizanja artikla */}
        {Number(KolicinaZaIzdavanje) <= 0 && datumPristizanja && (
          <p className="text-xs text-center text-gray-600 italic transition-all duration-200">
            {`${t('main.Planirani datum pristizanja')} ${formatDate(datumPristizanja)}`}
          </p>
        )}

        {typeof AkcijskaKolicina === 'number' &&
        AkcijskaCena > 0 && (
          <p className="text-xs text-center text-gray-600 italic transition-all duration-200">
            {`Akcijska količina: ${AkcijskaKolicina} kom${AkcijskaKolicina === 1 ? 'ad' : 'ada'}`}
          </p>
        )}




        {/* Cena i dugme */}
        <div className="flex justify-between items-end mt-auto">
          {/* Cena */}
          <div className="flex flex-col items-start gap-1">
            {AkCena && Number(AkCena) > 0 ? (
              <>
                <p className="text-sm font-semibold text-gray-500 line-through opacity-60 relative">
                  {cenaArtikla}
                  <span className="absolute -right-5 text-[10px]">{partner?.valutaNovca}</span>
                </p>
                <p className="text-[22px] lg:text-xl font-bold text-red-500 relative">
                  {AkCena}
                  <span className="absolute -right-8 text-sm">{partner?.valutaNovca}</span>
                </p>
              </>
            ) : (
              <p className="text-[22px] lg:text-xl font-bold text-red-500 relative">
                {cenaArtikla}
                <span className="absolute -right-8 text-sm">{partner?.valutaNovca}</span>
              </p>
            )}
          </div>

          {/* Dugme */}
          <div className="pointer-events-auto">
            <AddToCartButton
              id={Artikal}
              getKolicina={() => KolicinaZaIzdavanje || 1} 
              kolZaIzdavanje={KolicinaZaIzdavanje}
              nazivArtikla={Naziv}
              disabled={Number(KolicinaZaIzdavanje) <= 0}
              ukupnaKolicina={Number(KolicinaZaIzdavanje)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default ArticleCard;
