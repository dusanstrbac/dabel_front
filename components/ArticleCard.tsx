import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { ArtikalType } from '@/types/artikal';
import { useEffect, useState } from 'react';

const ArticleCard = ({ id, naziv, cena, slika }: ArtikalType) => {
    const router = useRouter(); // Korišćenje router-a iz next/router
    const [isMounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);


    const posaljiNaArtikal = ( e: React.MouseEvent) => {
        e.preventDefault();
        if(isMounted) {
            router.push(`/proizvodi/${id}`);
        }
    };

    if(!isMounted) return null;

    return (
        <div
            className='articleSize relative max-w-[320px] hover:shadow-2xl transition-shadow duration-300 rounded-2xl grid grid-rows-[auto,auto,auto]'
            onClick={posaljiNaArtikal}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl"></div>

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
                        <span>{cena}</span> RSD
                    </p>
                    <div>
                        <AddToCartButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
