'use client';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { CircleUser, Map, MapPinned, Phone, PhoneCall, UserCircle } from 'lucide-react';

const ProfilPodaci = () => {
  const [userData, setUserData] = useState<KorisnikPodaciType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKorisnikData = async () => {
      try {
        const emailFromCookie = await getCookie('Email');

        if (!emailFromCookie) {
          console.error('Email nije prisutan u kolačiću');
          setLoading(false);
          return;
        }

        const emailEncoded = emailFromCookie.replace('@', '%40');

        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5128/api/Partner/Partner?email=${emailEncoded}`);

        if (!response.ok) {
          throw new Error('Korisnik nije pronađen');
        }

        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          // Ako je odgovor niz, uzimamo prvi element (korisnika)
          setUserData(data[0]);
        } else {
          console.error('Korisnik nije pronađen ili API ne vraća ispravan odgovor');
        }
      } catch (err) {
        console.error('Greška prilikom učitavanja korisnika:', err);
        throw Error('Greška prilikom učitavanja korisnika');
      } finally {
        setLoading(false);
      }
    };

    fetchKorisnikData();
  }, []);

  if (loading) return <div>Učitavanje podataka...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>Korisnik nije pronađen.</div>;

  const getTodayDate = () => {
    const today = new Date();
    
    // Dobijanje godine, meseca i dana
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Dodajemo 1 jer meseci u JS idu od 0
    const day = today.getDate().toString().padStart(2, '0'); // Dodajemo 0 ako je dan manji od 10
    
    return `${day}.${month}.${year}`;
  };


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
              <p>{userData.telefon}</p>
            </div>
            <div className="flex items-center gap-2">
              <Map />
              <p>{userData.grad}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:gap-6 text-left lg:text-right">
          <p className="text-gray-600">{getTodayDate()}</p>
          <p className="font-semibold">Dozvoljeno zaduženje: <span className="font-extrabold">{userData.kredit}</span></p>
          <p className="font-semibold">Trenutno zaduženje: <span className="font-extrabold">{userData.raspolozivoStanje}</span></p>
        </div>
      </div>

      <div className="mt-[50px] flex gap-10 lg:gap-[150px]">
        <div className="flex flex-col gap-2">
          <h1>Delatnost: <span>{userData.delatnost}</span></h1>
          <p>MB: <span>{userData.maticniBroj}</span></p>
          <p>PIB: <span>{userData.pib}</span></p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CircleUser />
            <h1>{userData.ime}</h1>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall />
            <p>{userData.telefon}</p>
          </div>
        </div>
      </div>
      <div className='mt-[40px] lg:mt-[40px] flex gap-[20px]'>
                <UserCircle color='grey' size={80} className='p-[20px] border border-gray-400 rounded-[25px]'/>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-xl'>Petar Petrović</h1>
                    <div className='flex items-center gap-2'>
                        <Phone color='grey' />
                        <p className='text-lg'>+38135232316</p>
                    </div>
                </div>
      </div>
    </div>
  );
};

export default ProfilPodaci;
