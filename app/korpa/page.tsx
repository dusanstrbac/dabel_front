'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NaruciButton from "@/components/ui/NaruciButton";
import Image from "next/image";
import RezervisiButton from "@/components/RezervisiButton";

type ArtikalCena = {
  cena: number;
  akcija?: {
    cena: number;
  };
};

type Artikal = {
  id: string;
  idArtikla: string;
  naziv: string;
  artikalCene: ArtikalCena[];
  pakovanje: number;
  jm: string;
  barkod: string;
  kolicina: string;
  stanje?: string;
};

const Korpa = () => {
  const [articleList, setArticleList] = useState<Artikal[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const storedIds = Object.keys(cart);
    if (storedIds.length === 0) {
      return;
    }
    const queryString = storedIds.map(id => `ids=${id}`).join("&");
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const url = `${apiAddress}/api/Artikal/DajArtikalPoId?${queryString}`;



    const fetchArticles = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();

        const transformed = data.map((artikal: any) => ({
          ...artikal,
          id: artikal.idArtikla,
          artikalCene: artikal.artikalCene || [],
          pakovanje: Number(artikal.pakovanje) || 1,
        }));

        setArticleList(transformed);
        setQuantities(transformed.map((a: any) => cart[a.id]?.kolicina || a.pakovanje));
      } catch (error) {
        console.error("Greška pri učitavanju artikala:", error);
      }
    };
    fetchArticles();
  }, []);

  const isprazniKorpu = () => {
    setArticleList([]);
    setQuantities([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storage"));
  };

  const removeArticle = (index: number) => {
    const updatedArticles = [...articleList];
    const updatedQuantities = [...quantities];

    const removed = updatedArticles.splice(index, 1)[0];
    updatedQuantities.splice(index, 1);

    setArticleList(updatedArticles);
    setQuantities(updatedQuantities);

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    delete cart[removed.id];
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = newQuantity;
    setQuantities(updatedQuantities);

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const articleId = articleList[index].id;
    cart[articleId] = { kolicina: newQuantity };
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const getRoundedQuantity = (requested: number, packSize: number) => {
    if (requested <= 0 || isNaN(requested)) return 0;
    return requested <= packSize
      ? packSize
      : Math.ceil(requested / packSize) * packSize;
  };

  const getCenaZaArtikal = (artikal: Artikal) => {
    const cenaAkcija = artikal.artikalCene?.[0]?.akcija?.cena;
    const cenaRegularna = artikal.artikalCene?.[0]?.cena;
    return (cenaAkcija && cenaAkcija > 0) ? cenaAkcija : cenaRegularna || 0;
  };

  const getOriginalnaCena = (artikal: Artikal) => {
    return Number(artikal.artikalCene?.[0]?.cena) || 0;
  };

  const formatCena = (cena: number) => {
    return Number(cena).toFixed(2);
  };

  const totalAmount = quantities.reduce((sum, quantity, index) => {
    const packSize = articleList[index]?.pakovanje || 1;
    const cena = getCenaZaArtikal(articleList[index]);
    const rounded = getRoundedQuantity(quantity, packSize);
    return sum + rounded * cena;
  }, 0);

    const totalAmountWithPDV = totalAmount * 1.2;

    const getSlikaArtikla = (idArtikla: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_ADDRESS;
    return `${baseUrl}/s${idArtikla}.jpg`;
    };

    
    if (!isClient) return null;

  return (
    <div className="flex flex-col p-2 md:p-5">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h1 className="font-bold text-lg">Pregled korpe</h1>
        <Button onClick={isprazniKorpu} variant={"outline"} className="cursor-pointer">Isprazni korpu</Button>
      </div>

      {/* DESKTOP VERZIJA */}
      <div className="flex-col flex-wrap py-3 hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead className="text-xl font-light">Naziv artikla</TableHead>
              <TableHead className="text-xl text-center font-light">JM</TableHead>
              <TableHead className="text-xl text-center font-light">Cena</TableHead>
              <TableHead className="text-xl text-center font-light">Pakovanje</TableHead>
              <TableHead className="text-xl text-center font-light">Trebovana količina</TableHead>
              <TableHead className="text-xl text-center font-light">Količina</TableHead>
              <TableHead className="text-xl text-center font-light">Iznos</TableHead>
              <TableHead className="text-xl text-center font-light">Iznos sa PDV</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {articleList.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="italic text-center py-4">
                  Ni jedan artikal nije dodat u korpu.
                </TableCell>
              </TableRow>
            )}
            {articleList.map((article, index) => {
              const imaAkciju = (article.artikalCene?.[0]?.akcija?.cena || 0) > 0;
              const pakovanje = article.pakovanje || 1;
              const kolicina = getRoundedQuantity(quantities[index], pakovanje);
              const cena = getCenaZaArtikal(article);
              const originalnaCena = getOriginalnaCena(article);
              const iznos = kolicina * cena;
              const iznosSaPDV = iznos * 1.2;

              return (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    <img
                      src={getSlikaArtikla(article.idArtikla)}
                      alt={article.naziv}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">{article.naziv}</span>
                      <span>Šifra: {article.id}</span>
                      <span>BarKod: {article.barkod}</span>
                      {article.stanje && <span className="text-sm text-red-500">{article.stanje}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{article.jm}</TableCell>
                  <TableCell className="text-center">
                    {imaAkciju ? (
                      <div className="flex flex-col items-center">
                        <span className="text-gray-500 line-through text-sm">
                          {formatCena(originalnaCena)} RSD
                        </span>
                        <span className="text-red-500 font-semibold">
                          {formatCena(cena)} RSD
                        </span>
                      </div>
                    ) : (
                      <span>{formatCena(originalnaCena)} RSD</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{pakovanje}</TableCell>
                  <TableCell className="text-center">
                    <input
                      type="number"
                      min="1"
                      className="w-20 border rounded px-2 py-1 text-center"
                      value={quantities[index]}
                      max={article.kolicina}
                      onChange={(e) => updateQuantity(index, Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell className="text-center">{kolicina}</TableCell>
                  <TableCell className="text-center">{formatCena(iznos)} RSD</TableCell>
                  <TableCell className="text-center">{formatCena(iznosSaPDV)} RSD</TableCell>
                  <TableCell>
                    <Button onClick={() => removeArticle(index)}>Ukloni</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-center">Ukupno:</TableCell>
              <TableCell colSpan={6}></TableCell>
              <TableCell className="text-center font-bold">{formatCena(totalAmount)} RSD</TableCell>
              <TableCell className="text-center font-bold">{formatCena(totalAmountWithPDV)} RSD</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>

        <div className="flex justify-end gap-4 pt-4">
          <RezervisiButton ukupnaCena={totalAmountWithPDV} />
          <NaruciButton />
        </div>
      </div>

      {/* MOBILNA VERZIJA */}
      <div className="py-2 block lg:hidden">
        {articleList.map((article, index) => {
          const imaAkciju = (article.artikalCene?.[0]?.akcija?.cena || 0) > 0;
          const pakovanje = article.pakovanje || 1;
          const kolicina = getRoundedQuantity(quantities[index], pakovanje);
          const cena = getCenaZaArtikal(article);
          const originalnaCena = getOriginalnaCena(article);
          const iznos = kolicina * cena;
          const iznosSaPDV = iznos * 1.2;

          return (
            <Card key={index} className="p-3 shadow-md flex flex-col sm:flex-row gap-2 items-center mb-4">
              <img
                src={getSlikaArtikla(article.idArtikla)}
                alt={article.naziv}
                width={128}
                height={128}
                className="w-32 h-auto object-contain"
              />
              <CardContent className="flex-1">
                <h2 className="font-semibold">{article.naziv}</h2>
                <div className="text-sm text-muted-foreground">
                  <p>Šifra: {article.id}</p>
                  <p>Barkod: {article.barkod}</p>
                  <p>JM: {article.jm}</p>
                  <p className="font-bold">
                    {imaAkciju ? (
                      <>
                        <span className="line-through text-gray-500 text-sm mr-2">
                          {formatCena(originalnaCena)} RSD
                        </span>
                        <span className="text-red-600">{formatCena(cena)} RSD</span>
                      </>
                    ) : (
                      <span className="text-red-600">{formatCena(originalnaCena)} RSD</span>
                    )}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="mb-2">
                    <span className="mr-2">Trebovana količina:</span>
                    <input
                      type="number"
                      min="1"
                      className="w-20 border rounded px-2 py-1 text-center"
                      value={quantities[index]}
                      onChange={(e) => updateQuantity(index, Number(e.target.value))}
                    />
                  </div>
                  <p>Pakovanje: {pakovanje}</p>
                  <p>Količina: {kolicina}</p>
                  <p>Iznos: {formatCena(iznos)} RSD</p>
                  <p className="font-bold">Sa PDV: {formatCena(iznosSaPDV)} RSD</p>
                  <div className="mt-2">
                    <Button onClick={() => removeArticle(index)}>Ukloni</Button>
                  </div>
                </div>
                {article.stanje && <p className="text-red-500 mt-2">{article.stanje}</p>}
              </CardContent>
            </Card>
          );
        })}
        <div className="flex justify-between font-semibold py-5">
          <span>Ukupno (bez PDV):</span>
          <span>{formatCena(totalAmount)} RSD</span>
        </div>
        
        <div className="flex justify-between font-semibold text-red-600">
          <span>Ukupno (sa PDV):</span>
          <span>{formatCena(totalAmountWithPDV)} RSD</span>
        </div>
        
        <div className="flex gap-2 items-center justify-center pt-4">
          <RezervisiButton ukupnaCena={totalAmountWithPDV}/>
          <NaruciButton />
        </div>
      </div>
    </div>
  );
};

export default Korpa;
