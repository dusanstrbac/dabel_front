'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "radix-ui";
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka, PaginacijaTackice } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
import PromeniButton from "@/components/ui/promeniButton";
import { artikalProp, StavkaType } from "@/types/artikal";
import { Parametar } from "@/types/parametri";

const admin = () => {
  const [adminList, setAdminList] = useState<Parametar[]>([]); // Startuje kao prazan objekat za pocetak 
  const [menuList, setMenuList] = useState([
    {
      txt: "Istaknuti artikli",
      index: "tab1",
    },
    {
      txt: "two",
      index: "tab2",
    },
    {
      txt: "Parametri sistema",
      index: "tab3",
    }
  ]);

  const [articleList, setArticleList] = React.useState<artikalProp[]>([]);
  const [selectedItem, setSelectedItem] = useState<Parametar | null>(null);
  const [trenutnaStrana, setTrenutnaStrana] = useState(1);
  const [featuredArtikli, setFeaturedArtikli] = useState<artikalProp[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);    
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const stavkiPoStrani = 5;
  const brojStranica = useMemo(() => Math.ceil(adminList.length / stavkiPoStrani), [adminList]);

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

    async function fetchAdminParams() {
      try {
        
        const res = await fetch(`${apiAddress}/api/Auth/WEBParametrizacija`);
        const data = await res.json();
        setAdminList(data);
      } catch (err) {
        console.error("Error fetching admin parameters: ", err);
      }
    }
    fetchAdminParams();
  }, [searchParams]);

  const idiNaStranu = (broj: number) => {
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return;
    
    setTrenutnaStrana(broj);
    router.push(`?page=${broj}`,{scroll : false});
  };

  //  DEO ZA SEARCH I PRIKAZ
  const handleSelectOption = (label: string) => {
    const found = adminList.find((article: Parametar) => article.naziv === label);  // Koristi Parametar, ne StavkaType
    if (found) {
      const selectedIndex = adminList.findIndex(item => item.naziv === label);
      if (selectedIndex !== -1) {
        const pageNumber = Math.floor(selectedIndex / stavkiPoStrani) + 1;
        setTrenutnaStrana(pageNumber);
        router.push(`?page=${pageNumber}`, { scroll: false });
      }
      setSelectedItem(found);  // koristi samo za fokus/edit, ne za filtriranje
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    console.log(responseText);
  } catch (err) {
    console.error('Error updating parameter:', err);
  }
};

  const handlePromeniArtikal = (stariId: string, noviArtikal: artikalProp) => {
    setFeaturedArtikli((prev) =>
      prev.map((a) => a.idArtikla === stariId ? { ...noviArtikal } : a
    ));
  };

  useEffect(() => {
    async function fetchArtikle() {
      try {
        // Promeniti fetch da cita artikle iz parametara, takodje tamo da ih i upisuje da bi se ova metoda obrisala.
        // Promeniti fetch da ne postoji vise ovaj DajArtikle jer je los
        const res = await fetch(`${apiAddress}/api/Artikal/DajArtikle`);
        const data: artikalProp[] = await res.json();
        setArticleList(data);
        setFeaturedArtikli(data.slice(0, 4));
      } catch(err) {
        console.error("Greska: ", err);
      }
    }
    fetchArtikle();
  }, []);

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
          <Tabs.Content value="tab1" className="">
            {/* ISTAKNUTI ARTIKLI */}
            <div> 
              {featuredArtikli.map((article) => (
                <div key={article.idArtikla} className="flex sm:flex-row flex-col mx-4 pt-5 pb-5 items-center justify-between border-b border-b-red-200">
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src="/artikal.jpg"
                      alt="slika artikla"
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                    <div className="flex flex-col justify-between px-4 py-2 w-full">
                      <div className="">
                        <p className="text-lg font-semibold">{article.naziv}</p>
                        <p className="text-gray-500">ID: {article.idArtikla}</p>
                        <p className="text-gray-500">Barkod: {article.barkod}</p>
                      </div>

                      <span className="">Cena: 
                        <span className="font-bold text-red-500">2000</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex px-4 py-2 items-center justify-between">
                    <PromeniButton 
                      key={article.idArtikla}
                      artikal={article}
                      articleList={articleList}
                      onArtikalPromenjen={handlePromeniArtikal}
                      iskljuceniArtikli={featuredArtikli}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>
          <Tabs.Content value="tab2">Bice ovde nesto</Tabs.Content>
          <Tabs.Content value="tab3" className="flex flex-col ml-5 mr-5 justify-between"> 


            {/* PARAMETRI SISTEMA */}
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
              const isLastItem = index === paginiraneStavke.length - 1;

              const ref = isSelected ? scrollRef : null;
              
              return (
                <div key={index} className={`p-2 ${isSelected ? "bg-[#8282820b] rounded-md" : ""}`} ref={ref}>
                  <div key={article.naziv} className="contents">
                    <p className="align-top font-medium text-xl">{article.naziv}</p>
                    <p className="align-top text-left text-gray-500 max-w-4xl whitespace-break-spaces">{article.deskripcija}</p>
                    <input
                      className="border-b border-red-200 px-2 py-1 h-10 mt-3 mb-9  min-w-[400px] min-h-[40px] justify-items-start"
                      type="text"
                      defaultValue={article.vrednost}
                      onBlur={(e) => handleChange(globalIndex, e.target.value)} // kada izgubi fokus
                      onChange={(e) => handleChange(globalIndex, e.target.value)} // automatski poziv na promene
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
                        <PaginacijaTackice />
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
