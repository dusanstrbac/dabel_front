'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tabs } from "radix-ui";
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka } from "@/components/ui/pagination";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
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
import { DozvoleInfo, DozvoleType } from "@/types/dozvole";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { toast } from "sonner";

const admin = () => {
  const [adminList, setAdminList] = useState<Parametar[]>([]);
  const [menuList, setMenuList] = useState([
    { txt: "Kreiranje kataloga", index: "tab1" },
    { txt: "Parametri sistema", index: "tab2" },
    { txt: "Dozvole korisnika", index: "tab3"},
  ]);

  const [selectedItem, setSelectedItem] = useState<Parametar | null>(null);
  const [trenutnaStrana, setTrenutnaStrana] = useState(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const stavkiPoStrani = 5;
  const brojStranica = useMemo(() => Math.ceil(adminList.length / stavkiPoStrani), [adminList]);
  const [katalogFile, setKatalogFile] = useState<File | null>(null);
  const [katalogImported, setKatalogImported] = useState(false);
  const [setLoading, setIsLoading] = useState(false);
  const korisnikaPoStrani = 10;
  const [pretraga, setPretraga] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sviPartneri, setSviPartneri] = useState<KorisnikPodaciType[]>([]);

  const [trenutniPartner, setTrenutniPartner] = useState<KorisnikPodaciType | null>(null);
  const [partnerDozvole, setPartnerDozvole] = useState<DozvoleInfo[]>([]);
  const [sveDostupneDozvole, setSveDostupneDozvole] = useState<DozvoleType[]>([]);



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
      const fetchData = async () => {
        try {
          const response = await fetch(`${apiAddress}/api/Web/WEBParametrizacija`);
          if (response.ok) {
            const data = await response.json();
            setAdminList(data);
          } else {
            console.error("Greška prilikom učitavanja parametara");
          }
        } catch (err) {
          console.error("Greška u komunikaciji sa serverom:", err);
        }
      };

      fetchData();
    }, []);

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
      const res = await fetch(`${apiAddress}/api/Web/UpisParametra`, {
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
        console.error('Greška pri update parametara:', errorText);
        throw new Error('Neuspešan update parametara');
      }
    } catch (err) {
      console.error('Greška pri update parametara:', err);
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
    event.preventDefault();

    const file = katalogFile;
    const thumbnailPutanja = "putanja_do_thumbnaila";

    if (!file) {
      console.error("PDF fajl nije odabran!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('katalog', file);
    formData.append('thumbnailPutanja', thumbnailPutanja);

    try {
      const response = await fetch(`${apiAddress}/api/Web/UploadKatalog`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const responseClone = response.clone();
        try {
          const errorText = await responseClone.text();
          console.error('Greška:', errorText);
          throw new Error(errorText || 'Došlo je do greške prilikom upload-a.');
        } catch (error) {
          console.error('Greška pri obradi odgovora:', error);
          throw new Error('Došlo je do greške prilikom upload-a.');
        }
      }

      const data = await response.json();
      alert(data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Greška pri uploadu:', err.message);
        alert(`Greška pri uploadu: ${err.message}`);
      } else {
        alert("Molimo importujte validan PDF fajl.");
        setKatalogFile(null);
        setKatalogImported(false);
      }
    }
    setIsLoading(false); 
  };
  // --- Kraj PDF dela ---


  // Dozvola za korisnike deo (TAB-3)

  async function ucitajPartnere() {
    try {
      const sviPartneriResponse = await fetch(`${apiAddress}/api/Partner/DajPartnere`);
      if (!sviPartneriResponse.ok) {
        const errorText = await sviPartneriResponse.text();
        throw new Error(errorText || 'Greška pri dohvatanju partnera');
      }
      const sviPartneri: KorisnikPodaciType[] = await sviPartneriResponse.json();

      return sviPartneri.map(partner => ({
        ...partner,
        id: 0,
        idDozvole: 0,
        status: 0
      }));
    } catch (error) {
      console.error('Greška pri učitavanju partnera:', error);
      throw error;
    }
  }


  // Pozivamo fetch

  useEffect(() => {
    const loadData = async () => {
      try {
        const podaci = await ucitajPartnere();
        setSviPartneri(podaci || []);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        toast.error('Došlo je do greške pri učitavanju podataka');
      }
    };
    loadData();
  }, []);


  const filtriraniKorisnici = useMemo(() => 
    sviPartneri.filter((korisnik) => 
      korisnik.ime.toLowerCase().includes(pretraga.toLowerCase()) ||
      korisnik.email.toLowerCase().includes(pretraga.toLowerCase())
    ),
    [sviPartneri, pretraga]
  );

  const trenutniBrojKorisnika = useMemo(() =>   
    filtriraniKorisnici.slice(
      (trenutnaStrana - 1) * korisnikaPoStrani,
      trenutnaStrana * korisnikaPoStrani
    ),
    [filtriraniKorisnici, trenutnaStrana]
  );



// Funkcija za dobijanje svih dostupnih dozvola
  const ucitajSveDozvole = async () => {
    try {
      const response = await fetch(`${apiAddress}/api/Web/DajDozvole`);
      if (!response.ok) {
        throw new Error('Greška pri učitavanju dozvola');
      }
      const dozvole = await response.json();
      setSveDostupneDozvole(dozvole);
    } catch (error) {
      console.error('Greška:', error);
      toast.error('Došlo je do greške pri učitavanju dozvola');
    }
  };

  useEffect(() => {
    ucitajSveDozvole();
  }, []);

  //FJ-a ZA FETCHOVANJE DOZVOLA ZA KONKRETNOG PARTNERA
  const DajDozvole = async (partner: KorisnikPodaciType) => {
    try {
      setTrenutniPartner(partner);
      
      const response = await fetch(`${apiAddress}/api/Web/DajDozvoleKorisnika?idKorisnika=${partner.idPartnera}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Greška pri dohvatanju dozvola');
      }

      const korisnikoveDozvole: DozvoleInfo[] = await response.json();

      const sveDozvoleSaStatusom = sveDostupneDozvole.map(dostupnaDozvola => {
      const korisnikovaDozvola = korisnikoveDozvole.find(d => d.idDozvole === dostupnaDozvola.id);
      
      // Ako korisnik ima dozvolu, koristimo njene podatke, inače koristimo podrazumevane vrednosti
      return korisnikovaDozvola 
        ? {
            id: korisnikovaDozvola.id,
            idDozvole: dostupnaDozvola.id, // id iz DozvoleType
            imeDozvole: dostupnaDozvola.dozvola, // dozvola iz DozvoleType postaje imeDozvole
            idKorisnika: partner.idPartnera,
            status: korisnikovaDozvola.status
          }
        : {
            id: 0,
            idDozvole: dostupnaDozvola.id,
            imeDozvole: dostupnaDozvola.dozvola,
            idKorisnika: partner.idPartnera,
            status: 0 // podrazumevano unchecked
          };
      });
      
      setPartnerDozvole(sveDozvoleSaStatusom);
    } catch (error) {
      console.error('Greška:', error);
      // alert('Došlo je do greške pri učitavanju dozvola');
      toast.error(error instanceof Error ? error.message : 'Došlo je do greške pri učitavanju dozvola');
    }
  };

  // const UpdateDozvole = async (partner: KorisnikPodaciType) => {
  //   try {
  //     // Prikupimo samo ID-jeve dozvola
  //     const idDozvola = partnerDozvole.map(d => d.idDozvole);
      
  //     // Šaljemo kao čisti niz brojeva [1, 2, 3...]
  //     const response = await fetch(
  //       `${apiAddress}/api/Web/UpdateDozvole?idKorisnika=${partner.idPartnera}`, 
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(idDozvola) // Ovo će poslati niz kao [1,2,3]
  //       }
  //     );
      
  //     if (!response.ok) throw new Error('Greška pri ažuriranju dozvola');
      
  //     toast.success("Dozvole su uspešno ažurirane");
  //     // DajDozvole(partner); // Osveži podatke
  //     const refreshedDozvole = await fetch(`${apiAddress}/api/Web/DajDozvoleKorisnika?idKorisnika=${partner.idPartnera}`);
  //     const newDozvole = await refreshedDozvole.json();
  //     setPartnerDozvole(newDozvole);
      
  //   } catch (error) {
  //     toast.error("Došlo je do greške pri ažuriranju dozvola");
  //     console.error('Greška:', error);
  //   }
  // };


  //FJ-a ZA FETCHOVANJE DOZVOLA ZA KONKRETNOG PARTNERA
  const UpdateDozvole = async (partner: KorisnikPodaciType, dozvola: DozvoleInfo) => {
    try {
      if (!Array.isArray([dozvola.idDozvole]) || typeof dozvola.idDozvole !== 'number') {
        toast.error("Greška: Dozvola nema validan ID");
        return;
      }
      const response = await fetch(
        `${apiAddress}/api/Web/UpdateDozvole?idKorisnika=${partner.idPartnera}`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([dozvola.idDozvole]),
        }
      );
      
      const responseText = await response.text();


      if (!response.ok) {
        throw new Error(responseText || 'Greška pri ažuriranju dozvole');
      }
      
      // Proverimo da li je odgovor JSON ili plain text
      let result;
      try {
        result = JSON.parse(responseText); 
      } catch {
        result = { message: responseText };
      }
      // const result = await response.json();
      
      toast.success(result.message || "Dozvola je uspešno ažurirana");
      
      // Osveži podatke nakon čuvanja
      await DajDozvole(partner);
      return true;
      
    } catch (error) {
      console.error('Greška:', error);
      toast.error(error instanceof Error ? error.message : "Došlo je do greške pri ažuriranju dozvole");
      return false;
    }
  };

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
            <div className="flex relative justify-end min-w-[200px] mb-[10px]">
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
                      className="border-b border-red-200 px-2 py-1 h-10 mt-3 mb-9 min-w-[400px] min-h-[40px] justify-items-start w-full"
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

          {/* TAB: Otvaranje pakovanja// DOZVOLE */}
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
                          <Button
                            className="p-2 rounded border-2 border-black cursor-pointer hover:bg-gray-700"
                            // className="fixed bottom-6 left-6 z-50 md:hidden w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg hover:bg-blue-700 transition"
                            type="button"
                            onClick={() => DajDozvole(korisnik)}
                          >
                            Sve dozvole
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm z-[200]">
                          <DialogHeader>
                            <DialogTitle>Lista svih dozvola za {trenutniPartner?.ime}</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 mt-4">
                            {sveDostupneDozvole.map((dozvola) => {
                              const korisnikovaDozvola = partnerDozvole.find(d => d.idDozvole === dozvola.id);
                              const checked = korisnikovaDozvola ? korisnikovaDozvola.status === 1 : false;
                              
                              return (
                                <div key={dozvola.id} className="flex items-center justify-between">
                                  <span>{dozvola.dozvola}</span>
                                  <MaliCheckbox
                                    checked={checked}
                                    onChange={async (checked) => {
                                      try {
                                        if (trenutniPartner) {
                                          const dozvolaInfo: DozvoleInfo = {
                                            id: korisnikovaDozvola?.id || 0, // Use existing ID or 0 if new
                                            idDozvole: dozvola.id,
                                            imeDozvole: dozvola.dozvola,
                                            idKorisnika: trenutniPartner.idPartnera.toString(),
                                            status: checked ? 1 : 0
                                          };
                                          
                                          await UpdateDozvole(trenutniPartner, dozvolaInfo);
                                          await DajDozvole(trenutniPartner);
                                        }
                                      } catch (error) {
                                        console.error('Greška pri ažuriranju dozvole:', error);
                                      }
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-6">
                            <DialogClose className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                              Zatvori
                            </DialogClose>
                            {/* <Button 
                              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700"
                              onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const success = await UpdateDozvole(korisnik);
                                  if (success) {
                                    // Zatvori dialog samo ako je uspešno sačuvano
                                    document.getElementById('dialog-close-btn')?.click();
                                  }
                              }}
                            >
                                Sačuvaj izmene
                              </Button> */}
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
                                e.stopPropagation();
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
