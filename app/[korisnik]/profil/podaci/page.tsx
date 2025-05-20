'use client';
import { CircleUser, MapIcon, MapPinnedIcon, Phone, UserCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProfilPodaci = () => {
  const [userData, setUserData] = useState<KorisnikType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { korisnik } = useParams<{ korisnik: string | string[] }>();  // Dodajemo tip string | string[] za korisnik parametar

  useEffect(() => {
    // Provera da li korisnik nije niz, ako jeste, uzimamo prvi element
    const email = Array.isArray(korisnik) ? korisnik[0] : korisnik;

    const fetchKorisnikData = async () => {
      if (!email) {
        console.error('Email nije prosleđen');
        throw Error('Email korisnika nije prosleđen');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);  // Resetovanje greške pre svakog pokušaja

        const response = await fetch(`/api/korisnici/${email}`);

        if (!response.ok) {
          throw new Error('Korisnik nije pronađen');
        }

        const data = await response.json();

        setUserData(data);
      } catch (err) {
        console.error('Greška prilikom učitavanja korisnika:', err);
        throw Error('Greška prilikom učitavanja korisnika');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchKorisnikData();
    }
  }, [korisnik]);  // Ovaj hook zavisi od korisnik parametra

  if (loading) return <div>Učitavanje podataka...</div>;
  if (error) return <div>{error}</div>;
  if (!userData) return <div>Korisnik nije pronađen.</div>;

    return (
        <div className='lg:px-[120px] lg:mt-[40px]'>
            <div className='flex flex-wrap justify-between gap-10 lg:gap-4 '>
                <div>
                    <h1 className='text-3xl font-bold'>{userData.firma.naziv_firme}</h1>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <MapIcon color='grey' />
                            <p>{userData.firma.lokacija}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Phone color='grey' />
                            <p>{userData.firma.telefon_firma}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <MapPinnedIcon color='grey' />
                            <p>{userData.firma.drzava}</p>
                        </div>
                    </div>
                </div>                

                <div className='flex flex-col lg:gap-6 text-left lg:text-right'>
                    <p className='text-gray-600'>14.04.2025</p>
                    <p className='font-semibold'>Dozvoljeno zaduženje: <span className='font-extrabold'>18000000.00</span></p>
                    <p className='font-semibold'>Trenutno zaduženje: <span className='font-extrabold'>820976.50</span></p>
                </div>
            </div>

            <div className='mt-[50px] flex gap-10 lg:gap-[150px]'>
                <div className='flex flex-col gap-2'>
                    <h1>Delatnost: <span>{userData.firma.delatnost}</span></h1>
                    <p>MB: <span>{userData.firma.MB}</span></p>
                    <p>PIB: <span>{userData.firma.PIB}</span></p>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <CircleUser color='grey' />
                        <h1>{userData.ime} </h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Phone color='grey' />
                        <p>{userData.mobilni}</p>
                    </div>
                </div>
            </div>

            {/* NEKI BROJ TELEFONA */}
            <div className='mt-[40px] lg:mt-[40px] flex gap-[20px]'>
                <UserCircle color='grey' size={80} className='p-[20px] border border-gray-400 rounded-[25px]'/>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-xl'>{userData.komercijalista.ime}</h1>
                    <div className='flex items-center gap-2'>
                        <Phone color='grey' />
                        <p className='text-lg'>{userData.komercijalista.telefon}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilPodaci;
