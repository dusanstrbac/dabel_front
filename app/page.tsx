'use client';
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";
import ListaArtikala from "@/components/ListaArtikala";

export default function Home() {

// Ovde treba ubaciti u listu artikala, fetch za preporucene artikle

  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-2 px-1">
        <HeroImage />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle">
          <ListaArtikala />
        </div>
      </main>
    </>
  );
}
