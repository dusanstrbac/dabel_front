import '@/app/globals.css';
import Image from 'next/image';
import { Button } from './ui/button';
import { ShoppingCartIcon } from 'lucide-react';


const ArticleCard = () => {

    return (
        <div className='articleSize relative articleBorder w-full'>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-[9px]"></div>

            {/* Slika */}
            <div>
            <Image
                src="/Artikal.jpg"
                alt="Article Image"
                width={318}
                height={400}
                className='rounded-lg w-full h-full object-cover'
            />
            </div>

            {/* Tekst */}
            <div className='flex flex-col'>
            <h2 className='text-sm lg:text-lg font-bold text-center'>
                Kvaka-rozeta  Ms LISABOA M173/42/42S 8x8mm Cil (516674)
            </h2>
            <div className='flex justify-between items-center px-2'>
                <p className='text-md lg:text-xl font-semibold text-red-500'>
                <span>500</span>RSD
                </p>
                <div>
                    <Button variant="outline" size="icon">
                        <ShoppingCartIcon color='red'/>
                    </Button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default ArticleCard;