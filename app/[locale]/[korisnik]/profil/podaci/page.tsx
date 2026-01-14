'use client';

import { useEffect, useState } from 'react';
import { CircleUser, Map, MapPinned, Phone, PhoneCall, UserCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { dajKorisnikaIzTokena } from '@/lib/auth';

interface FinKartaType {
  dozvoljenoZaduzenje: number;
  trenutnoZaduzenje: number;
  pristigloNaNaplatu: number;
  raspolozivoStanje: number;
}

interface KomercijalistaType {
  naziv: string;
  telefon: string;
}

interface PodaciOKorisnikuType {
  ime: string;
  adresa: string;
  grad: string;
  telefon: string;
  maticniBroj: string;
  pib: string;
  komercijalisti: KomercijalistaType;
  korisnik: KorisnikPodaciType;
  finKarta: FinKartaType;
}

const ProfilPodaci = () => {
  const t = useTranslations('profile'); // Koristi namespace 'profile'
  const [userData, setUserData] = useState<PodaciOKorisnikuType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKorisnikData = async () => {
      try {
        const korisnik = dajKorisnikaIzTokena();
        if (!korisnik) {
          setError(t('notLoggedIn'));
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const response = await fetch(`${apiAddress}/api/Partner/DajPartnere?idPartnera=${korisnik.partner}&idKorisnika=${korisnik.idKorisnika}`);
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          setUserData(data[0]);
        } else {
          setError(t('notFound'));
        }
      } catch (err) {
        console.error(err);
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchKorisnikData();
  }, [t]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
  };

  if (loading) return <div>{t('loading')}</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!userData) return <div>{t('notFound')}</div>;

  const { finKarta } = userData;

  return (
    <div className="lg:px-[120px] lg:mt-[40px]">
      <div className="flex flex-wrap justify-between gap-10 lg:gap-4">
        <div>
          <h1 className="text-3xl font-bold">{userData.ime}</h1>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MapPinned />
              <p>{userData.adresa}</p>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall />
              <p>{userData.telefon || t('noPhoneNumber')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Map />
              <p>{userData.grad}</p>
            </div>

            <div>
              <p>Mesto isporuke: {userData.korisnik?.partnerDostava[0]?.adresa || ""}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:gap-3 text-left lg:text-right">
          <p className="text-gray-600">{getTodayDate()}</p>
          <p className="font-semibold">{t('allowedDebt')}: <span className="font-extrabold">{userData.finKarta?.dozvoljenoZaduzenje ?? 'N/A'}</span></p>
          <p className="font-semibold">{t('currentDebt')}: <span className="font-extrabold">{userData.finKarta?.trenutnoZaduzenje ?? 'N/A'}</span></p>
          <p className="font-semibold">{t('unrealizedAmount')}: <span className="font-extrabold">{userData.finKarta?.pristigloNaNaplatu ?? 'N/A'}</span></p>
          <p className="font-semibold">
            {t('availableBalance')}:{" "}
            <span className="font-extrabold">
              {finKarta?.pristigloNaNaplatu !== 0 ? 0 : finKarta?.raspolozivoStanje ?? 'N/A'}
            </span>
          </p>

        </div>
      </div>

      <div className="mt-[50px] flex gap-10 lg:gap-[150px]">
        <div className="flex flex-col gap-2">
          <p>{t('mb')}: <span>{userData.maticniBroj}</span></p>
          <p>{t('pib')}: <span>{userData.pib}</span></p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CircleUser />
            <h1>{userData.ime}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall />
            <p>{userData.telefon || t('noPhoneNumber')}</p>
          </div>
        </div>
      </div>

      <div className='mt-[40px] lg:mt-[40px] flex gap-[20px]'>
        <UserCircle color='grey' size={80} className='p-[20px] border border-gray-400 rounded-[25px]' />
        <div className='flex flex-col'>
          <h1 className='font-bold text-xl'>{userData.komercijalisti.naziv}</h1>
          <div className='flex items-center gap-2'>
            <Phone color='grey' />
            <p className='text-lg'>{userData.komercijalisti.telefon}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPodaci;
