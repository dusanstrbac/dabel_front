'use client';
import { CircleUser, MapIcon, MapPinnedIcon, Phone, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    params: {
        korisnik: string;
    };
};

const ProfilPodaci = ({ params } : Props) => {

    const [userData, setUserData] = useState<KorisnikType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchKorisnikData = async () => {
          console.log('Fetching korisnik: ', params.korisnik);  // Dodaj log da vidiš vrednost
          try {
            const response = await fetch(`/api/korisnici/${encodeURIComponent(params.korisnik)}`);
            if (!response.ok) throw new Error('Korisnik nije pronadjen');
    
            const data = await response.json();
            setUserData(data);
            setLoading(false);
          } catch (err) {
            console.error('Greska prilikom preuzimanja podataka: ', err);
            setLoading(false);
          }
        };
    
        if (params.korisnik) {
          fetchKorisnikData();
        } else {
          console.error('Email korisnika nije definisan');
          setLoading(false);
        }
      }, [params.korisnik]);

    if(loading) return <div>Ucitavanje podataka ...</div>
    if(!userData) return <div>Korisnik nije pronadjen.</div>

    return (
        <div className='lg:px-[120px] lg:mt-[40px]'>
            <div className='flex flex-wrap justify-between gap-10 lg:gap-4 '>
                <div>
                    <h1 className='text-3xl font-bold'>{userData.naziv_firme}</h1>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <MapIcon color='grey' />
                            <p>{userData.lokacija}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Phone color='grey' />
                            <p>{userData.telefon_firma}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <MapPinnedIcon color='grey' />
                            <p>{userData.lokacija}</p>
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
                    <h1>Delatnost: <span>{userData.delatnost}</span></h1>
                    <p>MB: <span>{userData.MB}</span></p>
                    <p>PIB: <span>{userData.PIB}</span></p>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                        <CircleUser color='grey' />
                        <h1>Slavica </h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Phone color='grey' />
                        <p>+38135232316</p>
                    </div>
                </div>
            </div>

            {/* NEKI BROJ TELEFONA */}
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
    )
}

export default ProfilPodaci;