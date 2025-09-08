'use client';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";
import Najprodavanije from "@/components/Najprodavanije";
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
          <Najprodavanije />
        </div>
      </main>
      <Footer />
      </Suspense>
    </>
  );
}