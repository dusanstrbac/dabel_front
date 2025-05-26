'use client';
import AddToCartButton from "@/components/AddToCartButton";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";

export default function Home() {

  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-2 px-1">
        <HeroImage />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 align-middle">
          <ArticleCard naslov="Artikal" cena={2000} slika= "/Artikal.jpg" />
          <ArticleCard naslov="Artikal" cena={2000} slika= "/Artikal.jpg" />
          <ArticleCard naslov="Artikal" cena={2000} slika= "/Artikal.jpg" />
          <ArticleCard naslov="Artikal" cena={2000} slika= "/Artikal.jpg" />
        </div>
      </main>
    </>
  );
}
