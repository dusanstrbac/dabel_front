'use client';
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";
import PoruciPonovo from "@/components/PoruciPonovo";
import { Suspense } from "react";

export default function Home() {


  return (
    <>
    <Suspense fallback={<div>Učitavanje...</div>}> 
      <Header />
      <main className="flex flex-col items-center gap-2">
        <HeroImage />
        <div className="w-full px-2">
          <PoruciPonovo />
        </div>
      </main>
      </Suspense>
    </>
  );
}