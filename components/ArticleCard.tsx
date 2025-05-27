import '@/app/globals.css';
import Image from 'next/image';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext'; // prilagodi putanju
import { ShoppingCartIcon } from 'lucide-react';

type ArticleCardProps = {
  naslov: string;
  cena: number;
  slika: string;
};

const ArticleCard = ({ naslov, cena, slika }: ArticleCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      imageUrl: slika,
      name: naslov,
      sifra: "Šifra: dummy", // možeš dodati pravi prop kasnije
      barkod: "Barkod: dummy",
      stanje: "",
      jm: "KD",
      cena,
      pakovanje: 1,
      kolicina: 1,
    });
  };

  return (
    <div className='articleSize relative max-w-[320px] hover:shadow-2xl transition-shadow duration-300 rounded-2xl'>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent opacity-90 z-10 rounded-2xl"></div>

      <Image
        src={slika}
        alt={naslov}
        width={318}
        height={400}
        className='rounded-lg w-full h-full object-cover'
      />

      <div className='flex flex-col pb-4 px-2'>
        <h2 className='text-sm lg:text-lg font-bold text-center'>
          {naslov}
        </h2>
        <div className='flex justify-between items-center px-2'>
          <p className='text-md lg:text-xl font-semibold text-red-500'>
            <span>{cena}</span> RSD
          </p>
          <Button onClick={handleAddToCart}>
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            Dodaj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
