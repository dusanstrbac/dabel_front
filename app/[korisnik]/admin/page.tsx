'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "radix-ui";
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
import PromeniButton from "@/components/ui/promeniButton";
import { artikalProp, StavkaType } from "@/types/artikal";
import { Parametar } from "@/types/parametri";
import { Button } from "@/components/ui/button";
import PdfThumbnail from "@/components/PdfThumbnail";
import { any } from "zod";

const admin = () => {
  const [adminList, setAdminList] = useState<Parametar[]>([]);
  const [menuList, setMenuList] = useState([
    { txt: "Kreiranje kataloga", index: "tab1" },
    { txt: "Parametri sistema", index: "tab2" },
  ]);

  const [articleList, setArticleList] = React.useState<artikalProp[]>([]);
  const [selectedItem, setSelectedItem] = useState<Parametar | null>(null);
  const [trenutnaStrana, setTrenutnaStrana] = useState(1);
  const [featuredArtikli, setFeaturedArtikli] = useState<artikalProp[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);    
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const stavkiPoStrani = 5;
  const brojStranica = useMemo(() => Math.ceil(adminList.length / stavkiPoStrani), [adminList]);
  const [katalogFile, setKatalogFile] = useState<File | null>(null);
  const [katalogImported, setKatalogImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [setLoading, setIsLoading] = useState(false);


  const paginiraneStavke = useMemo(() => {
    return adminList.slice(
      (trenutnaStrana - 1) * stavkiPoStrani,
      trenutnaStrana * stavkiPoStrani
    );
  }, [adminList, trenutnaStrana]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const options = adminList.map((item) => ({
    value: `${item.naziv} ${item.deskripcija}`,
    label: item.naziv,
  }));

  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= brojStranica) {
        setTrenutnaStrana(pageNumber);
      }
    }

    const AdminParametri = localStorage.getItem("webparametri");
    if (AdminParametri) {
      try {
        const parsed: Parametar[] = JSON.parse(AdminParametri);
        setAdminList(parsed);
      } catch (err) {
        console.error("Greška prilikom parsiranja lokalnih parametara:", err);
      }

    }
  }, [searchParams]);

  const idiNaStranu = (broj: number) => {
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return;
    
    setTrenutnaStrana(broj);
    router.push(`?page=${broj}`, { scroll: false });
  };

  const handleSelectOption = (label: string) => {
    const found = adminList.find((article: Parametar) => article.naziv === label);
    if (found) {
      const selectedIndex = adminList.findIndex(item => item.naziv === label);
      if (selectedIndex !== -1) {
        const pageNumber = Math.floor(selectedIndex / stavkiPoStrani) + 1;
        setTrenutnaStrana(pageNumber);
        router.push(`?page=${pageNumber}`, { scroll: false });
      }
      setSelectedItem(found);
    }
  };

  const handleChange = async (index: number, newValue: string) => {
    const updatedList = [...adminList];
    updatedList[index].vrednost = newValue;
    setAdminList(updatedList);

    const updatedParam = updatedList[index];

    try {
      const res = await fetch(`${apiAddress}/api/Auth/UpisParametra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naziv: updatedParam.naziv,
          vrednost: newValue,
          deskripcija: updatedParam.deskripcija
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Greska pri update parametara:', errorText);
        throw new Error('Neuspešan update parametara');
      }
      const responseText = await res.text();
    } catch (err) {
      console.error('Error updating parameter:', err);
    }
  };

  const handlePromeniArtikal = (stariId: string, noviArtikal: artikalProp) => {
    setFeaturedArtikli((prev) =>
      prev.map((a) => a.idArtikla === stariId ? { ...noviArtikal } : a)
    );
  };

  // --- PDF upload i preview deo ---

const handleKatalogUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]; // Ovo uzima fajl direktno iz inputa

  if (file && file.type === "application/pdf") {
    setKatalogFile(file);
    setKatalogImported(true);
  } else {
    alert("Molimo importujte validan PDF fajl.");
    setKatalogFile(null);
    setKatalogImported(false);
  }
};

const handleKatalogSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault(); // Zaustavi podrazumevano ponašanje

  const file = katalogFile;  // Ovo je fajl koji je korisnik odabrao
  const thumbnailPutanja = "putanja_do_thumbnaila";  // Ovdje stavi stvarnu putanju do thumbnail-a

  if (!file) {
    console.error("PDF fajl nije odabran!");
    return;
  }

  setIsLoading(true);  // Početak učitavanja

  // FormData za slanje na server
  const formData = new FormData();
  formData.append('katalog', file);
  formData.append('thumbnailPutanja', thumbnailPutanja);  // Dodaj putanju thumbnail-a

  try {
    const response = await fetch('http://localhost:7235/api/Web/UploadKatalog', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Kloniraj odgovor da bi mogao da pročitaš telo kao tekst
      const responseClone = response.clone();
      try {
        const errorText = await responseClone.text();  // Pročitaj kao tekst
        console.error('Greška:', errorText);
        throw new Error(errorText || 'Došlo je do greške prilikom upload-a.');
      } catch (error) {
        console.error('Greška pri obradi odgovora:', error);
        throw new Error('Došlo je do greške prilikom upload-a.');
      }
    }

    const data = await response.json();  // Ako je uspešan odgovor, pročitaj kao JSON
    alert(data.message);  // Prikazivanje poruke korisniku

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Greška pri uploadu:', err.message);
      alert(`Greška pri uploadu: ${err.message}`);
    } else {
      console.error('Nepoznata greška:', err);
      alert('Došlo je do nepoznate greške.');
    }
  } finally {
    setIsLoading(false);  // Kraj učitavanja
  }
};


  // --- Kraj PDF dela ---

  return (
    <div className="py-2">
      <h1 className="text-left font-bold text-2xl">Podešavanja</h1>
      <Tabs.Root defaultValue="tab1" orientation="vertical" className="flex flex-col lg:flex-row my-7 border rounded-md border-gray-500 py-4 px-2">
        
        <Tabs.List aria-label="" className="w-full lg:w-[200px] flex flex-col items-center justify-items-center gap-4 mb-5">
          {menuList.map((item, index) => (
            <div key={index} className="contents">
              <Tabs.Trigger value={item.index} className="w-full max-w-[750px] py-1 border border-gray-500 hover:bg-[#ebe8e89e] cursor-pointer">
                {item.txt}
              </Tabs.Trigger>
            </div>
          ))}
        </Tabs.List>

        <div className="flex flex-col w-full ml-3 lg:border-l border-gray-300">

          {/* TAB: Kreiranje kataloga */}
          <Tabs.Content value="tab1" className="mx-5">

            {!katalogImported ? (
              <div className="flex flex-col items-center justify-center mt-10">
                <p className="text-center max-w-xl text-gray-600 mb-6">
                  Da biste importovali katalog, kliknite na dugme ispod i izaberite PDF fajl koji sadrži proizvode.
                  Nakon uspešnog importovanja, biće vam omogućeno da sačuvate promene.
                </p>

                <label className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                  Importuj katalog
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleKatalogUpload}
                    ref={fileInputRef}  // Povezivanje sa ref
                    className="hidden"
                  />
                </label>

                {/* Prikaz imena fajla ako postoji */}
                {katalogFile && (
                  <p className="mt-4 text-sm text-gray-700">📄 {katalogFile.name}</p>
                )}

                {/* Prikaz thumbnail-a prve strane PDF-a */}
                {katalogFile && (
                  <div className="mt-6 border p-2 rounded-md shadow-md max-w-xs">
                    <h3 className="mb-2 font-semibold text-gray-700">Thumbnail prve strane PDF-a:</h3>
                    <PdfThumbnail file={katalogFile} width={200} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-10">
                <p className="text-green-600 font-semibold mb-4">✅ Katalog uspešno importovan</p>
                <Button onClick={handleKatalogSave} className="bg-green-600 text-white hover:bg-green-700">
                  Sačuvaj promene
                </Button>
              </div>
            )}

          </Tabs.Content>

          {/* TAB: Parametri sistema */}
          <Tabs.Content value="tab2" className="flex flex-col mx-5 justify-between"> 
            <div className="flex relative justify-end min-w-[200px]">
              <ComboboxDemo
                options={options}
                onSelectOption={handleSelectOption}
                placeholder="Izaberite opciju"
              />
            </div>
            {paginiraneStavke.map((article, index) => {
              const globalIndex = (trenutnaStrana - 1) * stavkiPoStrani + index;
              const isSelected = selectedItem?.naziv === article.naziv;
              const ref = isSelected ? scrollRef : null;

              return (
                <div key={index} className={`p-2 ${isSelected ? "bg-gray-100 rounded-md" : ""}`} ref={ref}>
                  <div key={article.naziv} className="contents">
                    <p className="align-top font-medium text-xl">{article.naziv}</p>
                    <p className="align-top text-left text-gray-500 max-w-4xl whitespace-break-spaces">{article.deskripcija}</p>
                    <input
                      className="border-b border-red-200 px-2 py-1 h-10 mt-3 mb-9 min-w-[400px] min-h-[40px] justify-items-start"
                      type="text"
                      defaultValue={article.vrednost}
                      onBlur={(e) => handleChange(globalIndex, e.target.value)}
                      onChange={(e) => handleChange(globalIndex, e.target.value)}
                    />
                  </div>
                </div>
              );
            })}

            {/* Paginacija */}
            <Paginacija className="my-[20px] flex w-full">
              <PaginacijaSadrzaj>
                {trenutnaStrana > 1 && (
                  <PaginacijaStavka>
                    <PaginacijaPrethodna
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        idiNaStranu(trenutnaStrana - 1);
                      }}
                    />
                  </PaginacijaStavka>
                )}

                {[...Array(brojStranica)].map((_, i) => {
                  const broj = i + 1;
                  if (broj === 1 || broj === brojStranica || Math.abs(trenutnaStrana - broj) <= 1) {
                    return (
                      <PaginacijaStavka key={broj}>
                        <PaginacijaLink
                          href="#"
                          isActive={trenutnaStrana === broj}
                          onClick={(e) => {
                            e.preventDefault();
                            idiNaStranu(broj);
                          }}
                        >
                          {broj}
                        </PaginacijaLink>
                      </PaginacijaStavka>
                    );
                  }

                  if (
                    (broj === 2 && trenutnaStrana > 3) ||
                    (broj === brojStranica - 1 && trenutnaStrana < brojStranica - 2)
                  ) {
                    return (
                      <PaginacijaStavka key={`ellipsis-${broj}`}>
                        {/* Možeš dodati "..." ako želiš */}
                      </PaginacijaStavka>
                    );
                  }

                  return null;
                })}

                {trenutnaStrana < brojStranica && (
                  <PaginacijaStavka>
                    <PaginacijaSledeca
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        idiNaStranu(trenutnaStrana + 1);
                      }}
                    />
                  </PaginacijaStavka>
                )}
              </PaginacijaSadrzaj>
            </Paginacija>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default admin;
