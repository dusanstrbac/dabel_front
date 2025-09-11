'use client';

import { useEffect, useState } from 'react';
import { Map, MapPinned, Phone, PhoneCall, UserCircle } from 'lucide-react';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { useTranslations } from '@/components/TranslationProvider';

// Definisanje tipova podataka
interface FinKartaType {
  kredit: number;
  nijeDospelo: number;
  nerealizovano: number;
  raspolozivoStanje: number;
}

interface KomercijalistaType {
  naziv: string;
  telefon: string;
}

interface KorisnikPodaciType {
  ime: string;
  adresa: string;
  grad: string;
  telefon: string;
  maticniBroj: string;
  pib: string;
  delatnost: string;
  komercijalisti: KomercijalistaType;
  finKarta: FinKartaType;
}

const ProfilPodaci = () => {
  const t = useTranslations();
  const [userData, setUserData] = useState<KorisnikPodaciType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
const fetchKorisnikData = async () => {
  setLoading(true);
  try {
    const korisnik = dajKorisnikaIzTokena();
    if (!korisnik) {
      setError(t('alerts.notLoggedIn'));
      setLoading(false);
      return;
    }

    console.log("Pokušavam da dohvatin podatke za partnera:", korisnik.partner, "i korisnika:", korisnik.idKorisnika);
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const url = `${apiAddress}/api/Partner/DajPartnere?idPartnera=${korisnik.partner}&idKorisnika=${korisnik.idKorisnika}`;
    
    console.log("API URL:", url);
    const response = await fetch(url);
    console.log("API odgovor:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`API server response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dohvaćeni podaci:", data);

    if (data && Array.isArray(data) && data.length > 0) {
      setUserData(data[0]);
    } else {
      console.error('Korisnik nije pronađen ili API ne vraća ispravan odgovor');
      setError(t('profile.notFound'));
    }
  } catch (err) {
    console.error('Greška prilikom učitavanja korisnika:', err);
    setError(t('profile.error'));
  } finally {
    setLoading(false);
  }
};

    fetchKorisnikData();
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
  };

  if (loading) return <div className="text-center p-4">{t('profile.loading')}</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;
  if (!userData) return <div className="text-center p-4">{t('profile.notFound')}</div>;

  return (
    <div className="lg:px-[120px] lg:mt-[40px] p-4">
      <div className="flex flex-wrap justify-between gap-10 lg:gap-4">
        <div>
          <h1 className="text-3xl font-bold">{userData.ime}</h1>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MapPinned className="text-gray-600" />
              <p>{userData.adresa}</p>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="text-gray-600" />
              <p>{userData.telefon || t('profile.noPhoneNumber')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Map className="text-gray-600" />
              <p>{userData.grad}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:gap-3 text-left lg:text-right">
          <p className="text-gray-600">{getTodayDate()}</p>
          <p className="font-semibold">{t('profile.section2.allowedDebt')} <span className="font-extrabold">{userData.finKarta?.kredit ?? 'N/A'}</span></p>
          <p className="font-semibold">{t('profile.section2.currentDebt')} <span className="font-extrabold">{userData.finKarta?.nijeDospelo ?? 'N/A'}</span></p>
          <p className="font-semibold">{t('profile.section2.unrealizedAmount')} <span className="font-extrabold">{userData.finKarta?.nerealizovano ?? 'N/A'}</span></p>
          <p className="font-semibold">{t('profile.section2.availableBalance')} <span className="font-extrabold">{userData.finKarta?.raspolozivoStanje ?? 'N/A'}</span></p>
        </div>
      </div>

      <div className="mt-[50px] flex gap-10 lg:gap-[150px]">
        <div className="flex flex-col gap-2">
          <p>{t('profile.section3.activity')} <span>{userData.delatnost || t('profile.noActivityCode')}</span></p>
          <p>{t('profile.section3.maticniBroj')} <span>{userData.maticniBroj}</span></p>
          <p>{t('profile.section3.pib')} <span>{userData.pib}</span></p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <UserCircle className="text-gray-600" />
            <p>{userData.ime}</p>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="text-gray-600" />
            <p>{userData.telefon || t('profile.noPhoneNumber')}</p>
          </div>
        </div>
      </div>
      <div className='mt-[40px] lg:mt-[40px] flex gap-[20px]'>
        <UserCircle color='grey' size={80} className='p-[20px] border border-gray-400 rounded-[25px]'/>
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