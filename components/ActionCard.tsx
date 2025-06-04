import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';

const ActionCard = ({ id, naziv, cena, staraCena }: ArtikalType) => {
    const router = useRouter();
    const [isMounted, setMounted] = useState(false);
    
    const izracunajPopust = (staraCena: number | string | undefined, cena: number | string) => {
        if (!staraCena) return 0;
        const staraNum = Number(staraCena);
        const novaNum = Number(cena);
        if (!staraNum || staraNum <= novaNum) return 0;
        return Math.round(((staraNum - novaNum) / staraNum) * 100);
    };
    
    const popust = izracunajPopust(staraCena, cena);

    useEffect(() => {
        setMounted(true);
    }, []);

    const posaljiNaArtikal = (e: React.MouseEvent) => {
        //e.preventDefault();
        const target = e.target as HTMLElement;

        // Ako je klik bio na dugme ili njegov sadržaj (ikona, span), nemoj otvarati stranicu
        if (
            target.closest('button') || 
            target.closest('svg') || 
            target.closest('path')
        ) {
            return;
        }

        router.push(`/proizvodi/${id}`);
        /*if(isMounted) {
            router.push(`/proizvodi/${id}`);
        }*/
    };

    if(!isMounted) return null;

    return (
        <div
            className='articleSize cursor-pointer relative max-w-[320px] hover:shadow-2xl transition-shadow duration-300 rounded-2xl grid grid-rows-[auto,auto,auto]'
            onClickCapture={posaljiNaArtikal}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl pointer-events-none"></div>

            {/* Popust badge */}
            {popust > 0 && (
            <div className="absolute top-2 left-2 py-2 px-3 text-sm text-center rounded-2xl bg-red-500 text-white z-10 border-2">
                -{popust}%
            </div>
            )}
            {/* Slika */}
            <div className="w-full h-64 relative">
                <Image
                    src={'/artikal.jpg'}
                    alt={naziv}
                    layout="fill"
                    objectFit="cover"
                    className='rounded-lg w-full h-full object-cover'
                />
            </div>

            {/* Tekstualni deo */}
            <div className='flex flex-col justify-between px-2 py-3'>
                {/* Ime artikla */}
                <h2 className='text-sm lg:text-lg font-semibold text-center'>
                    {naziv}
                </h2>

                {/* Cena i dugme */}
                <div className='flex justify-between items-center'>
                    <p className='text-md lg:text-xl font-semibold text-red-500'>
                        <span className='line-through text-gray-400'>{staraCena}</span><span className='pl-[5px]'>{cena}</span> RSD
                    </p>
                    <div>
                        <AddToCartButton id={id}
                            getKolicina={() => Number(1)}
                            nazivArtikla={naziv}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionCard;
