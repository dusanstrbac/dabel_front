'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
// IZMENA 1: Uvozimo useWebParametri hook
import { useWebParametri } from "@/contexts/WebParametriContext"; 

const HeroImage = () => {
  // IZMENA 2: Uklanjamo lokalni state (useState) i useEffect.

  // IZMENA 3: Koristimo getParametar direktno iz Context-a.
  // Context je već osigurao da je vrednost HeroSekcija ažurna.
  const { getParametar } = useWebParametri();
  
  // Dohvatamo URL slike. Ako je null, biće string 'N/A' ili slično, ali provera dole to rešava.
  const rawUrl = getParametar('HeroSekcija');

  // Obezbeđujemo da je to validan string URL pre nego što ga prosledimo komponenti Image.
  const WebHeroImage = 
    (typeof rawUrl === 'string' && rawUrl.startsWith('http')) 
    ? rawUrl 
    : null;


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