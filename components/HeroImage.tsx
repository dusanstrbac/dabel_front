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
      <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden relative">
        {WebHeroImage && (
          <Image
            src={WebHeroImage}
            alt="Main Photo"
            fill
            className="object-cover object-center static"
            priority
          />
        )}
      </div>
    </div>
  );
};

export default HeroImage;
