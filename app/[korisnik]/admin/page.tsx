'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "radix-ui";
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka } from "@/components/ui/pagination";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
import PromeniButton from "@/components/ui/promeniButton";
import { artikalProp, StavkaType } from "@/types/artikal";
import { Parametar } from "@/types/parametri";
import { Button } from "@/components/ui/button";
import PdfThumbnail from "@/components/PdfThumbnail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MaliCheckbox from "@/components/ui/MaliCheckBox";
import { DozvoleInfo, KombinovanoDozvolePartnerType } from "@/types/dozvole";
import { dajKorisnikaIzTokena } from "@/lib/auth";

const admin = () => {
  const [adminList, setAdminList] = useState<Parametar[]>([]);
  const [menuList, setMenuList] = useState([
    { txt: "Kreiranje kataloga", index: "tab1" },
    { txt: "Parametri sistema", index: "tab2" },
    { txt: "Otvaranje pakovanja", index: "tab3"},
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
  const korisnikaPoStrani = 10;
  const [pretraga, setPretraga] = useState("");

  const [tabelaStavke, setTabelaStavke] = useState<KombinovanoDozvolePartnerType[]>([]);

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
    const response = await fetch(`${apiAddress}/api/Web/UploadKatalog`, {
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






  // Dozvola za korisnike deo

  async function ucitajPodatke() {
    try {
      const sviPartneriResponse = await fetch(`${apiAddress}/api/Partner/DajPartnere`);
      if (!sviPartneriResponse.ok) throw new Error('Greška pri dohvatanju partnera');
      const sviPartneri: KorisnikPodaciType[] = await sviPartneriResponse.json();

      const dozvoleResponse = await fetch(`${apiAddress}/api/Web/DajDozvoleKorisnika`);
      if (!dozvoleResponse.ok) throw new Error('Greška pri dohvatanju dozvola');
      const dozvole: DozvoleInfo[] = await dozvoleResponse.json();

      
      return sviPartneri.map(partner => {
        const dozvola = dozvole.find(d => d.idKorisnika === partner.idPartnera);
        return {
          ...partner,
          ...(dozvola || {
              id: 0,
              idDozvole: 0,
              idKorisnika: partner.idPartnera,
              status: 0
            })
          // status: dozvola?.status || 0,
          // idDozvole: dozvola?.idDozvole || null
        };
      });
    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
    }
  }

  // Pozivamo fetch

  useEffect(() => {
    const loadData = async () => {
      const podaci = await ucitajPodatke();
      setTabelaStavke(podaci || []);
    };
    loadData();
  }, []);

  const filtriraniKorisnici = tabelaStavke.filter((korisnik) => 
      korisnik.ime.toLowerCase().includes(pretraga.toLowerCase()) ||
      korisnik.email.toLowerCase().includes(pretraga.toLowerCase()),
  )

  const trenutniBrojKorisnika = filtriraniKorisnici.slice(
        (trenutnaStrana - 1 ) * korisnikaPoStrani,
        trenutnaStrana * korisnikaPoStrani
  );

  




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

          {/* TAB: Otvaranje pakovanja */}
          <Tabs.Content value="tab3" className="mx-5">
            <div className="mb-4">
              <Input 
                type="text"
                placeholder="Pretraži korisnike po imenu ili emailu"
                className="border-2 w-full max-w-md"
                value={pretraga}
                onChange={(e) => {
                  setPretraga(e.target.value);
                  setTrenutnaStrana(1); // Resetujemo na prvu stranu prilikom pretrage
                }}
              />
            </div>

            <div className="w-full overflow-x-auto justify-center">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-400 hover:bg-gray-400">
                <TableRow className="text-xl text-right">
                  <TableHead>Korisničko ime</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead/>
                  <TableHead/>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trenutniBrojKorisnika.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center">
                      Nema podataka
                    </TableCell>
                  </TableRow>
                ) : (
                  trenutniBrojKorisnika.map((korisnik, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-left">{korisnik.ime || 'N/A'}</TableCell>
                    <TableCell className="text-left lg:pl-2 truncate">{korisnik.email || 'N/A'}</TableCell>
                    <TableCell/>
                    <TableCell className="lg:pl-2 items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="p-2 rounded border-2 border-black cursor-pointer hover:bg-gray-100"
                            // className="fixed bottom-6 left-6 z-50 md:hidden w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg hover:bg-blue-700 transition"
                            type="button"
                          >
                            Sve dozvole
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                          <DialogHeader>
                            <DialogTitle>Lista svih dozvola za {korisnik.ime}</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 mt-4">
                            {/* Privremena lista dozvola */}
                            {[
                              "Dozvola za pregled artikala",
                              "Dozvola za izmenu artikala",
                              "Dozvola za brisanje artikala",
                              "Dozvola za kreiranje narudžbina",
                              "Dozvola za administraciju"
                            ].map((dozvola, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span>{dozvola}</span>
                                <MaliCheckbox
                                  checked={false}
                                  onChange={(checked) => console.log(`Dozvola ${dozvola}: ${checked}`)}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-6">
                            <DialogClose className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                              Zatvori
                            </DialogClose>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Sačuvaj izmene
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                        
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>

            {/* Paginacija */}
            {filtriraniKorisnici.length > korisnikaPoStrani && (
              <div className="mt-4">
                <Paginacija>
                  <PaginacijaSadrzaj>
                    {trenutnaStrana > 1 && (
                      <PaginacijaStavka>
                        <PaginacijaPrethodna
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setTrenutnaStrana(trenutnaStrana - 1);
                          }}
                        />
                      </PaginacijaStavka>
                    )}

                    {Array.from({ length: Math.ceil(filtriraniKorisnici.length / korisnikaPoStrani) }).map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 || 
                        pageNum === Math.ceil(filtriraniKorisnici.length / korisnikaPoStrani) ||
                        Math.abs(pageNum - trenutnaStrana) <= 1
                      ) {
                        return (
                          <PaginacijaStavka key={pageNum}>
                            <PaginacijaLink
                              href="#"
                              isActive={trenutnaStrana === pageNum}
                              onClick={(e) => {
                                e.preventDefault();
                                setTrenutnaStrana(pageNum);
                              }}
                            >
                              {pageNum}
                            </PaginacijaLink>
                          </PaginacijaStavka>
                        );
                      }
                      return null;
                    })}

                    {trenutnaStrana < Math.ceil(filtriraniKorisnici.length / korisnikaPoStrani) && (
                      <PaginacijaStavka>
                        <PaginacijaSledeca
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setTrenutnaStrana(trenutnaStrana + 1);
                          }}
                        />
                      </PaginacijaStavka>
                    )}
                  </PaginacijaSadrzaj>
                </Paginacija>
              </div>
            )}

          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default admin;
