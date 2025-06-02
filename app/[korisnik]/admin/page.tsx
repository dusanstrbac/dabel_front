'use client';
import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React, { useEffect, useMemo, useRef, useState } from "react";


import {  Dialog, Tabs,
} from "radix-ui"
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka, PaginacijaTackice } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
import Image from "next/image";
import HeroImage from "@/components/HeroImage";
import { DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import PromeniButton from "@/components/ui/promeniButton";
import { ComboboxArtikli } from "@/components/ui/ComboboxArtikli";



const admin = () => {

    type artikalProp = {
        idArtikla: string;
        naziv: string;
        barkod: string;
        jm: string;
    };

    type Props = {
        artikal: artikalProp;
    };


    const [adminList, setAdminList] = useState([
            {
                naziv: "ActiveFaxInputDirectory",
                opis: "Putanja do ulaznog direktorijuma za Active Fax. Ovaj direktorijum je vidljiv za fax server.",
                vrednost: "\\\\10.0.2.19\\FaxInput"
            },
            {
                naziv: "AdminMail",
                opis: "Administratorski mail nalog",
                vrednost: "gojko.d@dabel.rs"
            },
            {
                naziv: "AdminPhone",
                opis: "Administratorski broj telefona",
                vrednost: "+38122802860"
            },
            {
                naziv: "AdresaFirmeZaIzvestaje",
                opis: "Adresa firme za izveštavanje",
                vrednost: "Šesta Industrijska 12"
            },
            {
                naziv: "AsortimanArtikalaPartneraVrDok",
                opis: "Vrsta dokumenta u NexT-u koji predstavlja dozvoljen asortiman za partnera.",
                vrednost: "35"
            },
            {
                naziv: "BrDanaNovopristigli",
                opis: "Broj dana koji se gleda unazad za izveštaj o novopristiglim artiklima",
                vrednost: "10"
            },
            {
                naziv: "DaLiKlasaIzAnalize",
                opis: "Da li se koristi klasifikacija iz analize za fin limite on-line naručivanja ili samo dozvoljeno zaduženje (1=Da, 0=Ne)",
                vrednost: "0"
            }
    ]);
    
   
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



    const [trenutnaStrana, setTrenutnaStrana] = useState(1)
    const stavkiPoStrani = 5
    const router = useRouter()
    const searchParams = useSearchParams()



    useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
        const pageNumber = parseInt(page, 10)
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= brojStranica) {
        setTrenutnaStrana(pageNumber)
        }
    }
    }, [searchParams]) 

    const prikazaneStavke = useMemo(() => {
    return adminList.slice(
        (trenutnaStrana - 1) * stavkiPoStrani,
        trenutnaStrana * stavkiPoStrani
    )
    }, [trenutnaStrana])

    const idiNaStranu = (broj: number) => {
    if (broj < 1 || broj > brojStranica || broj === trenutnaStrana) return
    
    setTrenutnaStrana(broj)
    router.push(`?page=${broj}`,{scroll : false})

    }

    
    //  DEO ZA SEARCH I PRIKAZ

    const options = adminList.map((item) => ({
        value: `${item.naziv} ${item.opis}`,   // Interna vrednost za pretragu
        label: item.naziv,  // Šta se prikazuje u dropdown-u
    }));

    type StavkaType = {
        naziv: string;
        opis: string;
        vrednost: string;
    };
    const userSelectedFromSearch = useRef(false);


    //const [selectedItem, setSelectedItem] = useState<null | typeof adminList[0]>(null);
    const [selectedItem, setSelectedItem] = useState<StavkaType | null>(null);

    const handleSelectOption = (label: string) => {
        const found = adminList.find((article: StavkaType) => article.naziv === label);
        if (found) {
            const selectedIndex = adminList.findIndex(item => item.naziv === label);
            if (selectedIndex !== -1) {
                const pageNumber = Math.floor(selectedIndex / stavkiPoStrani) + 1;
                setTrenutnaStrana(pageNumber);
                router.push(`?page=${pageNumber}`, { scroll: false });
            }

            setSelectedItem(found); // koristi samo za fokus/edit, ne za filtriranje
        
        }
    };
    
    const handleSelectedChange = (novaVrednost: string) => {
        if(!selectedItem) return;
        const updated = [...adminList];
        const index = updated.findIndex(item => item.naziv === selectedItem.naziv);
        if (index !== -1) {
            updated[index].vrednost = novaVrednost;
            setAdminList(updated);
            setSelectedItem({...updated[index]});
        }
    };

    const handleChange = (index: number, newValue: string) => {
        const updatedList = [...adminList];
        updatedList[index].vrednost = newValue;
        setAdminList(updatedList);
    };

    

    const brojStranica = useMemo(() => Math.ceil(adminList.length / stavkiPoStrani), [adminList]);

    const paginiraneStavke = useMemo(() => {
        return adminList.slice(
            (trenutnaStrana - 1) * stavkiPoStrani,
            trenutnaStrana * stavkiPoStrani
        );
    }, [adminList, trenutnaStrana]);


    useEffect(() => {
    if (selectedItem && userSelectedFromSearch.current) {
        const selectedIndex = adminList.findIndex(
            (item) => item.naziv === selectedItem.naziv
        );
        if (selectedIndex !== -1) {
            const pageNumber = Math.floor(selectedIndex / stavkiPoStrani) + 1;
            setTrenutnaStrana(pageNumber);
            router.push(`?page=${pageNumber}`, { scroll: false });
        }
        userSelectedFromSearch.current = false;  // resetuj nakon promene
    }
    }, [selectedItem, adminList]);

    
    const [articleList, setArticleList] = React.useState<artikalProp[]>([]);

    useEffect(() => {
        async function fetchArtikle() {
            try {
                const res = await fetch('http://10.0.0.38:7235/api/Artikal/DajArtikle');
                const data: artikalProp[] = await res.json();
                setArticleList(data); // napravi state sviArtikli, bolji od mog, mora da bude!!
            } catch(err) {
                console.error("Greska: ", err);
            }
        }
        fetchArtikle();
    }, []);


    return(
        <div className="p-4">

            <h1 className="text-left font-bold text-2xl">Podešavanja</h1>
            <Tabs.Root defaultValue="tab1" orientation="vertical" className="my-7 flex border rounded-md border-gray-500 py-4 px-2">
                  <Tabs.List aria-label="" className="w-[200px] flex flex-col items-center justify-items-start gap-4">
                      {menuList.map((article, index) => (
                        <div key={index} className="contents">
                            <Tabs.Trigger value={article.index} className="w-full py-1 border border-gray-500 hover:bg-[#ebe8e89e] cursor-pointer" >{article.txt}</Tabs.Trigger>
                        </div>
                      ))}
                  </Tabs.List>
                <div className="flex flex-col w-full ml-3 border-l border-gray-300">
                    
                    <Tabs.Content value="tab1" className="ml-5">
                        <div>
                                {articleList.slice(0, 4).map((article) => (
                                    <div key={article.idArtikla} className="flex mx-4 my-2 items-center justify-between">
                                        <div className="flex">
                                            <img
                                                src="/proizvod.jpg"
                                                alt="slika artikla"
                                                width={150}
                                                height={150}
                                                className="rounded-lg object-cover"
                                            />
                                            <div className="flex flex-col justify-between mx-4 my-2 h-[150px] w-full">
                                                <div>
                                                    <p className="text-lg font-semibold">{article.naziv}</p>
                                                    <p className="text-gray-500">{article.idArtikla}</p>
                                                    <p className="text-gray-500">{article.barkod}</p>
                                                </div>

                                                <span className="">Cena: 
                                                    <span className="font-bold text-red-500">2000</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        

                                        <div className="flex mx-4 my-2 items-center justify-between">
                                            <PromeniButton key={article.idArtikla} artikal={article} articleList={articleList}/>
                                        </div>
                                    </div>
                                ))}

                        </div>
                      

                    </Tabs.Content>

                    <Tabs.Content value="tab2">Bice ovde nesto</Tabs.Content>

                    <Tabs.Content value="tab3" className="ml-5"> 
                        {/* PARAMETRI SISTEMA */}
                        
                        <div className="flex relative justify-end">
                            <ComboboxDemo
                                options={options}
                                onSelectOption={handleSelectOption}
                                placeholder="Izaberite opciju"
                            />
                        </div>

                        {paginiraneStavke.map((article, index) => {
                        const globalIndex = (trenutnaStrana - 1) * stavkiPoStrani + index;
                        const isSelected = selectedItem?.naziv === article.naziv;

                        return (
                            <div key={index} className={`p-2 ${isSelected ? "bg-[#8282820b] rounded-md" : ""}`}>
                                <div key={article.naziv} className="contents">
                                <p className="align-top font-medium text-2xl">{article.naziv}</p>
                                <p className="align-top text-left text-gray-500 max-w-4xl">{article.opis}</p>
                                <input
                                    className="border-b border-red-200 px-2 py-1 h-10 mt-3 mb-9 w-[300px] max-w-[300px] min-h-[40px] justify-items-start"
                                    type="text"
                                    value={article.vrednost}
                                    onChange={(e) => handleChange(globalIndex, e.target.value)}
                                />
                                </div>
                            </div>
                        );
                        })}

                        
                    </Tabs.Content>
                    
                    

                    {/* Paginacija */}
                    <Paginacija className="my-[20px] flex w-full">
                        <PaginacijaSadrzaj>
                        {trenutnaStrana > 1 && (
                            <PaginacijaStavka>
                            <PaginacijaPrethodna
                                href="#"
                                onClick={(e) => {
                                e.preventDefault()
                                idiNaStranu(trenutnaStrana - 1)
                                }}
                            />
                            </PaginacijaStavka>
                        )}

                        {[...Array(brojStranica)].map((_, i) => {
                            const broj = i + 1

                            if (
                            broj === 1 ||
                            broj === brojStranica ||
                            Math.abs(trenutnaStrana - broj) <= 1
                            ) {
                            return (
                                <PaginacijaStavka key={broj}>
                                <PaginacijaLink
                                    href="#"
                                    isActive={trenutnaStrana === broj}
                                    onClick={(e) => {
                                    e.preventDefault()
                                    idiNaStranu(broj)
                                    }}
                                >
                                    {broj}
                                </PaginacijaLink>
                                </PaginacijaStavka>
                            )
                            }

                            if (
                            (broj === 2 && trenutnaStrana > 3) ||
                            (broj === brojStranica - 1 && trenutnaStrana < brojStranica - 2)
                            ) {
                            return (
                                <PaginacijaStavka key={`ellipsis-${broj}`}>
                                <PaginacijaTackice />
                                </PaginacijaStavka>
                            )
                            }

                            return null
                        })}

                        {trenutnaStrana < brojStranica && (
                            <PaginacijaStavka>
                            <PaginacijaSledeca
                                href="#"
                                onClick={(e) => {
                                e.preventDefault()
                                idiNaStranu(trenutnaStrana + 1)
                                }}
                            />
                            </PaginacijaStavka>
                        )}
                        </PaginacijaSadrzaj>
                    </Paginacija>
                </div>
            </Tabs.Root>
        </div>
    );
};

export default admin;