'use client';
import AddToCartButton from "@/components/AddToCartButton";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";

export default function Home() {


  return (
    <>
      <Header />
      <main className="px-4 flex flex-col items-center gap-6">
        <HeroImage />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          <ArticleCard />
          <ArticleCard />
          <ArticleCard />
          <ArticleCard />
        </div>
      </main>
    </>
  );
}
