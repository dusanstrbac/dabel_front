'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroImage = () => {
  const [WebHeroImage, setWebHeroImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parametriIzLocalStorage = JSON.parse(localStorage.getItem('webparametri') || '[]');
      const urlFotografija = parametriIzLocalStorage.find(
        (param: any) => param.naziv === 'HeroSekcija'
      )?.vrednost;

      if (urlFotografija && typeof urlFotografija === 'string' && urlFotografija.startsWith('http')) {
        setWebHeroImage(urlFotografija);
      } else {
        console.warn('❌ Hero image URL nije validan:', urlFotografija);
      }
    } catch (err) {
      console.error('❌ Greška pri čitanju localStorage:', err);
    }
  }, []);

  return (
    <div className="relative w-full mx-auto z-[-1]">
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[21/7] rounded-lg overflow-hidden">
        {WebHeroImage && (
          <Image
            src={WebHeroImage}
            alt="Main Photo"
            fill
            sizes="100vw"
            className="object-contain sm:object-cover object-center"
            priority
          />
        )}
      </div>
    </div>
  );
};

export default HeroImage;