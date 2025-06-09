'use client';
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";
import ListaArtikala from "@/components/ListaArtikala";
import { ArtikalType } from "@/types/artikal";
import { useState } from "react";

export default function Home() {

  // Uraditi fetch metodu za preporucene artikle ( takodje kesirati na par sati )
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);


  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-2 px-1">
        <HeroImage />
        <div>
          <ListaArtikala artikli={artikli}/>
        </div>
      </main>
    </>
  );
}