'use client';
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";
import ListaArtikala from "@/components/ListaArtikala";

export default function Home() {

  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-2 px-1">
        <HeroImage />
        <div>
          <ListaArtikala />
        </div>
      </main>
    </>
  );
}