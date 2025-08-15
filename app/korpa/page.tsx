'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NaruciButton from "@/components/ui/NaruciButton";
import Image from "next/image";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DozvoleInfo } from "@/types/dozvole";

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
  kolZaIzdavanje?: number;
};

const Korpa = () => {
  const [articleList, setArticleList] = useState<Artikal[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [partner, setPartner] = useState<KorisnikPodaciType | null>(null);
  const [rabatPartnera, setRabatPartnera] = useState<number>(0);
  const [nerealizovanIznos, setNerealizovanIznos] = useState<number>(0);
  const [validnaKolicina, setValidnaKolicina] = useState(true);
  const korisnik = dajKorisnikaIzTokena();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

  const [imaDozvoluZaPakovanje, setImaDozvoluZaPakovanje] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceVreme = 700;
  

  

  useEffect(() => {
    const postojiPrekoracenje = articleList.some((article, index) => {
      const kolicinaNaStanju = Number(article.kolicina) || 0;
      const trazenaKolicina = getRoundedQuantity(quantities[index], article.pakovanje || 1);
      return trazenaKolicina > kolicinaNaStanju;
    });

    setValidnaKolicina(!postojiPrekoracenje);
  }, [quantities, articleList]);

  useEffect(() => {
    if (!validnaKolicina) {
      toast.error("Uneta količina je veća od dostupne na stanju.");
    }
  }, [validnaKolicina]);


  useEffect(() => {
    setIsClient(true);

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const storedIds = Object.keys(cart);
    if (storedIds.length === 0) {
      return;
    }
    const queryString = storedIds.map(id => `ids=${id}`).join("&");
    const url = `${apiAddress}/api/Artikal/DajArtikalPoId?idPartnera=${korisnik?.idKorisnika}&${queryString}`;

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
        // setQuantities(transformed.map((a: any) => cart[a.id]?.kolicina || a.pakovanje));
        setQuantities(transformed.map((a: any) => {
          const savedQty = cart[a.id]?.kolicina;
          return savedQty ? getRoundedQuantity(savedQty, a.pakovanje || 1) : (a.pakovanje || 1);
        }));
      } catch (error) {
        console.error("Greška pri učitavanju artikala:", error);
      }
    };

    const fetchPartner = async () => {
      if (!korisnik) {
          console.warn("Nema korisnika iz tokena.");
          return;
      }

      const idPartnera = korisnik?.partner;
      const idKorisnika = korisnik?.idKorisnika
      try {
          const res = await fetch(`${apiAddress}/api/Partner/DajPartnere?idPartnera=${idPartnera}&idKorisnika=${idKorisnika}`);
          const data = await res.json();
          const fPartner = data[0] as KorisnikPodaciType;
          setPartner(fPartner);
          console.log(data);

          if (fPartner.partnerRabat.rabat) {
            setRabatPartnera(fPartner.partnerRabat.rabat);
          }
          if (fPartner.finKarta?.nijeDospelo) {
            setNerealizovanIznos(parseFloat(fPartner.finKarta.nijeDospelo)); 
            if (parseFloat(fPartner.finKarta.nijeDospelo) > 0) {
              toast.error("Imate neplaćene fakture, pa vam je poručivanje zabranjeno");
              return;
            }
          }
      } catch (err) {
          console.error("Greška pri fetchovanju partnera:", err);
      }
    };

    fetchPartner();
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

  // const getRoundedQuantity = (requested: number, packSize: number) => {
  //   if (requested <= 0 || isNaN(requested)) return 0;
  //   return requested <= packSize
  //     ? packSize
  //     : Math.ceil(requested / packSize) * packSize;
  // };

  const getRoundedQuantity = (requested: number, packSize: number) => {
    if (requested <= 0 || isNaN(requested)) {
      return imaDozvoluZaPakovanje ? 1 : packSize;
    }
    
    return imaDozvoluZaPakovanje 
      ? requested 
      : Math.ceil(requested / packSize) * packSize;
  };

  const getMaxAllowedQuantity = (kolicina: string, pakovanje: number) => {
    const maxKolicina = Number(kolicina) || 0;
    return Math.floor(maxKolicina / pakovanje) * pakovanje;
  };

  const getCenaZaArtikal = (artikal: Artikal) => {
    const cenaAkcija = artikal.artikalCene?.[0]?.akcija?.cena;
    const cenaRegularna = artikal.artikalCene?.[0]?.cena;
    const cena = (cenaAkcija && cenaAkcija > 0) ? cenaAkcija : cenaRegularna || 0;
    return Number(cena) || 0;
  };

  const getOriginalnaCena = (artikal: Artikal) => {
    return Number(artikal.artikalCene[0].cena) || 0;
  };

  const formatCena = (cena: number) => {
    return Number(cena).toFixed(2);
  };


  const totalAmount = articleList.reduce((sum, artikal, index) => {
    const packSize = artikal.pakovanje || 1;
    const rounded = getRoundedQuantity(quantities[index], packSize);
    const cena = getCenaZaArtikal(artikal);
    const rabat = partner?.partnerRabat.rabat ?? 0;
    const cenaSaRabat = cena * (1 - rabat / 100);
    return sum + rounded * cenaSaRabat;
}, 0);

  const totalAmountWithPDV = totalAmount * 1.2;

  const getSlikaArtikla = (idArtikla: string) => {
    const baseUrl = '/images';
    return `${baseUrl}/s${idArtikla}.jpg`;    
  };
    

  useEffect(() => {
    if (!isClient || articleList.length === 0 || !partner) return;

    const PDV = 0.2;

    const artikliZaSlanje = articleList.map((article, index) => {
      const pakovanje = article.pakovanje || 1;
      const kolicina = getRoundedQuantity(quantities[index], pakovanje);
      const originalnaCena = getOriginalnaCena(article);
      const koriscenaCena = getCenaZaArtikal(article);
      const cenaPosleRabat = koriscenaCena * (1 - rabatPartnera / 100);
      const iznosSaPDV = cenaPosleRabat * kolicina * (1 + PDV);

      return {
        idArtikla: article.idArtikla,
        naziv: article.naziv,
        jm: article.jm,
        originalnaCena: Number(originalnaCena.toFixed(2)),
        koriscenaCena: Number(koriscenaCena.toFixed(2)),
        kolicina,
        IznosSaPDV: Number(iznosSaPDV.toFixed(2)),
        pdv: 20,
      };
    });

    const payload = {
      partner,
      artikli: artikliZaSlanje,
      ukupnaCenaBezPDV: Number(totalAmount.toFixed(2)),
      ukupnaCenaSaPDV: Number(totalAmountWithPDV.toFixed(2)),
    };

    sessionStorage.setItem("korpaPodaci", JSON.stringify(payload));
  }, [articleList, quantities, partner, totalAmount, totalAmountWithPDV, isClient]);



  //LOGIKA ZA FETCH ZA DOZVOLE
  useEffect(() => {
    const fetchDozvole = async () => {
      if (!korisnik) {
        console.warn("Nema korisnika iz tokena.");
        return;
      }
      
      try {
        const res = await fetch(
          `${apiAddress}/api/Web/DajDozvoleKorisnika?idKorisnika=${korisnik.idKorisnika}&idDozvole=1`
        );
        const data: DozvoleInfo[] = await res.json();
        
        const imaDozvolu = data.some(dozvola => dozvola.status === 1);
        setImaDozvoluZaPakovanje(imaDozvolu);
      } catch (error) {
        console.error("Greška pri dobavljanju dozvola:", error);
        setImaDozvoluZaPakovanje(false);
      }
    };

    fetchDozvole();
  }, [korisnik, apiAddress]);

  const narucivanjeDisabled = nerealizovanIznos > 0 || articleList.length === 0 || !validnaKolicina;

  
  const razlogZabraneNarucivanja = narucivanjeDisabled
    ? "Imate  neizmirene dugove."
    : undefined;


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
              <TableHead className="text-xl text-center font-light">Rabat</TableHead>
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
              const pakovanje = article.kolZaIzdavanje || 1;
              const kolicina = getRoundedQuantity(quantities[index], pakovanje);
              const cena = getCenaZaArtikal(article);
              const originalnaCena = getOriginalnaCena(article);
              const cenaPosleRabat = cena * (1 - rabatPartnera / 100);
              const iznos = kolicina * cenaPosleRabat;
              const iznosSaPDV = iznos * 1.2;

              return (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    <Image
                      src={getSlikaArtikla(article.idArtikla)}
                      alt={article.naziv}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col max-w-[500px]">
                      <span className="font-semibold text-base whitespace-pre-wrap mb-2">{article.naziv}</span>
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
                    <Input
                      className="flex justify-center min-w-10 w-full max-w-21"
                      type="number"
                      step={imaDozvoluZaPakovanje ? 1 : (pakovanje || 1)}
                      min={0}
                      value={quantities[index]}
                      onChange={(e) => {
                        if (debounceTimeout.current) {
                          clearTimeout(debounceTimeout.current);
                        }
                        
                        const newValue = Number(e.target.value);
                        const newQuantities = [...quantities];
                        newQuantities[index] = isNaN(newValue) ? (imaDozvoluZaPakovanje ? 1 : pakovanje) : newValue;
                        setQuantities(newQuantities);

                        debounceTimeout.current = setTimeout(() => {
                          const pakovanjeValue = article.kolZaIzdavanje || 1;
                          let enteredValue = Number(e.target.value);
                          const maxAllowed = getMaxAllowedQuantity(article.kolicina, pakovanjeValue);

                          if (isNaN(enteredValue)) {
                            enteredValue = imaDozvoluZaPakovanje ? 1 : pakovanjeValue;
                          }

                          // Ako korisnik nema dozvolu, zaokružujemo na pakovanje
                          const roundedValue = imaDozvoluZaPakovanje 
                            ? enteredValue 
                            : Math.ceil(enteredValue / pakovanjeValue) * pakovanjeValue;
                          
                          const finalValue = Math.min(roundedValue, maxAllowed);
                          updateQuantity(index, finalValue);
                        }, debounceVreme)
                      }} 
                    />
                  </TableCell>
                  <TableCell className="text-center">{kolicina}</TableCell>
                  <TableCell className="text-center">{rabatPartnera}</TableCell>
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
              <TableCell colSpan={7}></TableCell>
              <TableCell className="text-center font-bold">{formatCena(totalAmount)} RSD</TableCell>
              <TableCell className="text-center font-bold">{formatCena(totalAmountWithPDV)} RSD</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>

        <div className="flex justify-end gap-4 pt-4">
          <NaruciButton disabled={narucivanjeDisabled || !validnaKolicina} />
        </div>
      </div>

      {/* MOBILNA VERZIJA */}
      <div className="py-2 block lg:hidden">
        {articleList.map((article, index) => {
          const imaAkciju = (article.artikalCene?.[0]?.akcija?.cena || 0) > 0;
          const pakovanje = article.kolZaIzdavanje || 1;
          const kolicina = getRoundedQuantity(quantities[index], pakovanje);
          const cena = getCenaZaArtikal(article);
          const originalnaCena = getOriginalnaCena(article);
          const cenaPosleRabat = cena * (1 - rabatPartnera / 100);
          const iznos = kolicina * cenaPosleRabat;
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
                  <div className="mb-2 flex items-center gap-2">
                    <span className="mr-2 whitespace-nowrap">Trebovana količina:</span>
                      <input
                        className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        step={imaDozvoluZaPakovanje ? 1 : (pakovanje || 1)}
                        min={0}
                        value={quantities[index]}
                        onChange={(e) => {
                          if (debounceTimeout.current) {
                            clearTimeout(debounceTimeout.current);
                          }
                        
                          const newValue = Number(e.target.value);
                          const newQuantities = [...quantities];
                          newQuantities[index] = isNaN(newValue) ? (imaDozvoluZaPakovanje ? 1 : pakovanje) : newValue;
                          setQuantities(newQuantities);

                          debounceTimeout.current = setTimeout(() => {
                            const pakovanjeValue = article.kolZaIzdavanje || 1;
                            let enteredValue = Number(e.target.value);
                            const maxAllowed = getMaxAllowedQuantity(article.kolicina, pakovanjeValue);

                            if (isNaN(enteredValue)) {
                              enteredValue = imaDozvoluZaPakovanje ? 1 : pakovanjeValue;
                            }

                            // Ako korisnik nema dozvolu, zaokružujemo na pakovanje
                            const roundedValue = imaDozvoluZaPakovanje 
                              ? enteredValue 
                              : Math.ceil(enteredValue / pakovanjeValue) * pakovanjeValue;
                            
                            const finalValue = Math.min(roundedValue, maxAllowed);
                            updateQuantity(index, finalValue);
                          }, debounceVreme);
                        }}
                        onBlur={(e) => {
                          const pakovanjeValue = article.kolZaIzdavanje || 1;
                          if (quantities[index] < (imaDozvoluZaPakovanje ? 1 : pakovanjeValue)) {
                            updateQuantity(index, imaDozvoluZaPakovanje ? 1 : pakovanjeValue);
                          }
                        }}
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
          <NaruciButton disabled={narucivanjeDisabled} />
        </div>
      </div>
    </div>
  );
};

export default Korpa;
