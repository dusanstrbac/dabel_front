import '@/app/globals.css';
import Image from 'next/image';
import { Button } from './ui/button';
import { ShoppingCartIcon } from 'lucide-react';

type ArticleCardProps = {
    naslov: string;
    cena: number;
    slika: string;
}

const ArticleCard = ({ naslov, cena, slika }: ArticleCardProps) => {

    return (
        <div className='articleSize relative articleBorder max-w-[320px]'>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-[9px]"></div>

            {/* Slika */}
            <div>
                <Image
                    src={slika}
                    alt={naslov}
                    width={318}
                    height={400}
                    className='rounded-lg w-full h-full object-cover'
                />
            </div>

            {/* Tekst */}
            <div className='flex flex-col'>
                <h2 className='text-sm lg:text-lg font-bold text-center'>
                    {naslov}
                </h2>
                <div className='flex justify-between items-center px-2'>
                    <p className='text-md lg:text-xl font-semibold text-red-500'>
                        <span>{cena}</span> RSD
                    </p>
                    <div>
                        <Button variant="outline" size="icon" className='cursor-pointer'>
                            <ShoppingCartIcon color='red' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleCard;
