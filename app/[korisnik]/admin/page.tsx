'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";

import {  Dialog, Tabs,
} from "radix-ui"
import { Paginacija, PaginacijaLink, PaginacijaPrethodna, PaginacijaSadrzaj, PaginacijaSledeca, PaginacijaStavka, PaginacijaTackice } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
import PromeniButton from "@/components/ui/promeniButton";



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


    // const [adminList, setAdminList] = useState([
    //         {
    //             naziv: "ActiveFaxInputDirectory",
    //             opis: "Putanja do ulaznog direktorijuma za Active Fax. Ovaj direktorijum je vidljiv za fax server.",
    //             vrednost: "\\\\10.0.2.19\\FaxInput"
    //         },
    //         {
    //             naziv: "AdminMail",
    //             opis: "Administratorski mail nalog",
    //             vrednost: "gojko.d@dabel.rs"
    //         },
    //         {
    //             naziv: "AdminPhone",
    //             opis: "Administratorski broj telefona",
    //             vrednost: "+38122802860"
    //         },
    //         {
    //             naziv: "AdresaFirmeZaIzvestaje",
    //             opis: "Adresa firme za izveštavanje",
    //             vrednost: "Šesta Industrijska 12"
    //         },
    //         {
    //             naziv: "AsortimanArtikalaPartneraVrDok",
    //             opis: "Vrsta dokumenta u NexT-u koji predstavlja dozvoljen asortiman za partnera.",
    //             vrednost: "35"
    //         },
    //         {
    //             naziv: "BrDanaNovopristigli",
    //             opis: "Broj dana koji se gleda unazad za izveštaj o novopristiglim artiklima",
    //             vrednost: "10"
    //         },
    //         {
    //             naziv: "DaLiKlasaIzAnalize",
    //             opis: "Da li se koristi klasifikacija iz analize za fin limite on-line naručivanja ili samo dozvoljeno zaduženje (1=Da, 0=Ne)",
    //             vrednost: "0"
    //         }
    // ]);
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
            },
            {
                naziv: "DefaultCenovnik",
                opis: "Pretpostavljeni cenovnik",
                vrednost: "04"
            },
            {
                naziv: "DefaultValuta",
                opis: "Podrazumevana valuta pri naručivanju. Posebna se postavlja na nivou partnera (pored cenovnika, objekta).",
                vrednost: "RSD"
            },
            {
                naziv: "EmailAdresaPosiljaoca",
                opis: "Email adresa koja će se videti na primljenoj poruci kod primaoca (F111)",
                vrednost: "mail@dabel.rs"
            },
            {
                naziv: "GraceKontroleNaplate",
                opis: "Koji je grace period u danima u kome se neće zabraniti poručivanje iako nije platio.",
                vrednost: "3"
            },
            {
                naziv: "GradFirmeZaIzvestaje",
                opis: "Grad firme za izveštavanje",
                vrednost: "Nova Pazova"
            },
            {
                naziv: "GrupaPartneraSvacijePravoUnosa",
                opis: "Grupa partnera u kojoj svi korisnici Dabel web mogu unositi narudžbenice.",
                vrednost: "58"
            },
            {
                naziv: "KoeficijentKvalitetaRada",
                opis: "Kojim se koeficijentom množi dozvoljeno zaduženje kako bi se dobio plan prodaje po partneru (0-1)",
                vrednost: "0.7"
            },
            {
                naziv: "KoeficijentKvalitetaRadaGR",
                opis: "Granice koeficijenata rada za kartone - dve cifre odvojene zarezima",
                vrednost: "30,90"
            },
            {
                naziv: "KontaZaPregled",
                opis: "Konta koja će se pratiti u izveštajima (karticama)",
                vrednost: "'2010','2020','885','CGD','KSD','MKD','BHD'"
            },
            {
                naziv: "Korpa.MinIznosZaIsporuku",
                opis: "Granični iznos bez PDV ispod koga se naplaćuje isporuka robe.",
                vrednost: "7000"
            },
            {
                naziv: "Korpa.SifArtiklaIsporuka",
                opis: "Šifra artikla koji nosi cenu prevoza (isporuke) ukoliko je vrednost korpe manja od granične.",
                vrednost: "001"
            },
            {
                naziv: "Korpa.SifArtiklaRaspakivanje",
                opis: "Šifra artikla koji nosi cenu za raspakivanje robe ukoliko količina nije umnožak one za poručivanje.",
                vrednost: "002"
            },
            {
                naziv: "KvalitetRada.LimitDozvoljenogZaduzenjaZaKartone",
                opis: "Granični iznos dozvoljenog zaduženja za partnera iznad  kojeg partner ulazi u Izveštaj o kvalitetu rada.",
                vrednost: "50000"
            },
            {
                naziv: "KvalitetRadaLimitDuga",
                opis: "Kvalitet rada: limit minimalnog duga iznad kojeg se izveštava",
                vrednost: "500"
            },
            {
                naziv: "LokacijaKontrolneDatotekeFaxServer",
                opis: "Lokacija kontrolne datoteke na FAX serveru. Primer: c\\faxes\\",
                vrednost: ""
            },
            {
                naziv: "MinimalniDugZaPrikaz",
                opis: "Minimalni iznos duga koji će se prikazati kao kašnjenje",
                vrednost: "1000"
            },
            {
                naziv: "MinIznosNarudzbenice",
                opis: "Minimalni iznos jedne on-line narudžbenice",
                vrednost: "1"
            },
            {
                naziv: "MinIznosNarudzbenice.API",
                opis: "Minimalni iznos jedne API narudžbenice",
                vrednost: "10000"
            },
            {
                naziv: "Narucivanje.DodatniPopustPoruka",
                opis: "Poruka koja će se prikazati pri potvrdi narudžbenice (dodatna 2% na kraju godine).",
                vrednost: "Poručivanjem preko Dabel Web portala ostvarujete popust od dodatnih {0}% na svaku Vašu porudžbinu. Na ovoj porudžbini ustedećete {1:0.00} RSD bez PDV. Hvala što koristite naš servis."
            },
            {
                naziv: "Narucivanje.DodatniPopustProcenat",
                opis: "Dodatni popust koji će se obračunati u B2B narudžbenicama za samostalno naručivanje (bilo je 2% na kraju godine).",
                vrednost: "5"
            },
            {
                naziv: "Narucivanje.HelpFileName",
                opis: "Putanja i naziv datoteke uputstva za poručivanje za partnere.",
                vrednost: "C:/Temp/DabelOnLineManual.pdf"
            },
            {
                naziv: "Narucivanje.KomentarUNarudzbenici",
                opis: "Slobodan tekst koji će se štampati na narudžbenici",
                vrednost: "U zavisnosti od brzine slanja dokumenta zavisi raspoloživost robe."
            },
            {
                naziv: "Narucivanje.KontaktIme",
                opis: "Kontakt koji se štampa na dokumentu porudžbenice.",
                vrednost: ""
            },
            {
                naziv: "Narucivanje.KontaktTelefon",
                opis: "Broj telefona kao kontakt koji se štampa na dokumentu porudžbenice.",
                vrednost: ""
            },
            {
                naziv: "Narucivanje.MaxBrojOpozvanihNarudzbenicaUTokuDana",
                opis: "Najveći broj opozvanih dokumenata u toku dana za naručivanje",
                vrednost: "0"
            },
            {
                naziv: "Narucivanje.MaxBrojRezervacijaPoPartneru",
                opis: "Maksimalni broj aktivnih rezervacija po partneru.",
                vrednost: "1"
            },
            {
                naziv: "Narucivanje.MaxIznosJedneRezervacije",
                opis: "Maksimalni iznos jedne rezervacije. Uzima se manji iznos između ovog i raspoloživog stanja.",
                vrednost: "180000"
            },
            {
                naziv: "Narucivanje.RokVazenjaRezervacije",
                opis: "Rok važenja Rezervacije u danima",
                vrednost: "6"
            },
            {
                naziv: "Narucivanje.TipDokOnLineNarudzbenice.Avans",
                opis: "Tip dokumenta avansne narudžbenice-predračuna",
                vrednost: "18"
            },
            {
                naziv: "Narucivanje.TipDokOnLineNarudzbenice.Kredit",
                opis: "Tip dokumenta kreditne narudžbenice-predračuna",
                vrednost: "09"
            },
            {
                naziv: "Narucivanje.TipDokOpozvanaRezervacija",
                opis: "Tip dokumenta Opozvane Rezervacije",
                vrednost: "07"
            },
            {
                naziv: "Narucivanje.TipDokRezervacija",
                opis: "Tip dokumenta Rezervacije",
                vrednost: "88"
            },
            {
                naziv: "Narucivanje.UploadTempFileLokacija",
                opis: "Privremena lokacija za otpremanje fajlova.",
                vrednost: "d:/TemporaryUoploads"
            },
            {
                naziv: "Narucivanje.VrDokOnLineNarudzbenice.Avans",
                opis: "Vrsta dokumenta avansne narudžbenice-predračuna",
                vrednost: "20"
            },
            {
                naziv: "Narucivanje.VrDokOnLineNarudzbenice.Kredit",
                opis: "Vrsta dokumenta kreditne narudžbenice-predračuna",
                vrednost: "09"
            },
            {
                naziv: "Narucivanje.VrDokRezervacija",
                opis: "Vrsta dokumenta Rezervacije",
                vrednost: "88"
            },
            {
                naziv: "Narucivanje.ZatvoriNextDokument",
                opis: "Da li se Next dokument (narudzbenica) zatvara nakon slanja u NexT ili ne (0).",
                vrednost: ""
            },
            {
                naziv: "NazivFirmeZaIzvestaje",
                opis: "Naziv preduzeća-firme koji će biti u izveštajima",
                vrednost: "Dabel d.o.o."
            },
            {
                naziv: "ObjektKorpe",
                opis: "Objekt po kome se listaju proizvodi za naručivanje",
                vrednost: "NP"
            },
            {
                naziv: "OSObjekat",
                opis: "Šifra objekta u kome se vode osnovna sredstva kod partnera.",
                vrednost: "G"
            },
            {
                naziv: "OSOTipDok",
                opis: "Tip dokumenta kojim se menja stanje osnovnih sredstava kod partnera.",
                vrednost: "04"
            },
            {
                naziv: "OSVrstaDok",
                opis: "Vrsta dokumenta kojim se menja stanje osnovnih sredstava kod partnera.",
                vrednost: "14"
            },
            {
                naziv: "Ponude.KreditMinVrednost",
                opis: "Vrednost ispod koje se ne smatra da PARTNER ima kredit.",
                vrednost: "10"
            },
            {
                naziv: "Ponude.MaxRabatProc",
                opis: "Maksimalni rabat u procentima za kreiranje ponude partneru bez ugovora",
                vrednost: "34"
            },
            {
                naziv: "Ponude.MaxRokDana",
                opis: "Maksimalni rok u danima za kreiranje ponude partneru bez ugovora",
                vrednost: "5"
            },
            {
                naziv: "Ponude.RokVazenjaDana",
                opis: "Rok važenja ponude koju šalje komercijalista u danima.",
                vrednost: "3"
            },
            {
                naziv: "Ponude.TipDok",
                opis: "Tip dokumenta za ponude",
                vrednost: "38"
            },
            {
                naziv: "Ponude.VrstaDok",
                opis: "Vrsta dokumenta za ponude",
                vrednost: "16"
            },
            {
                naziv: "Ponude.VrstaNaloga",
                opis: "Vrsta naloga za ponude",
                vrednost: "98"
            },
            {
                naziv: "PonudeAPI.VrstaNaloga",
                opis: "Vrsta naloga za ponude preko API-ja.",
                vrednost: "1"
            },
            {
                naziv: "PPAutoPlaniranjeBrisanje",
                opis: "Kod planiranja pravaca, da li automatsko planiranje briše prethodni plan za taj dan. Vrednosti D i N. Podrazumeva se D.",
                vrednost: "N"
            },
            {
                naziv: "PPBrojDanaZaNerealizovane",
                opis: "Broj dana unazad za auto ubacivanje nerealizovanih planiranih poseta partneru",
                vrednost: "7"
            },
            {
                naziv: "PPGranicaIznosPlanaProdaje",
                opis: "Kod planiranja pravaca, granična vrednost iznosa koji ulazi u automatsko planiranje. Vrednost mora biti pozitivna, može i 0.",
                vrednost: "14500"
            },
            {
                naziv: "PPPoslednjiPresecniDan",
                opis: "NE DIRATI! Kod planiranja pravaca, poslednji dan prelaska sa prve na drugu nedelju.",
                vrednost: "07.10.2024"
            },
            {
                naziv: "PPTrenutnaNedeljaPlana",
                opis: "NE DIRATI! Kod planiranja pravaca, koja je aktuelna nedelja. Može imati vrednosti 1 i 2",
                vrednost: "2"
            },
            {
                naziv: "PredlogArtikalaPartneraVrDok",
                opis: "Vrsta dokumenta u NexT-u koji predstavlja predložen asortiman za partnera.",
                vrednost: "59"
            },
            {
                naziv: "PrioritetKanalaZaSlanjePoruke",
                opis: "Prioritet kanala slanja kada ima definisana oba (e-mail = EMAIL, fax = FAX)",
                vrednost: "EMAIL"
            },
            {
                naziv: "PromenjeneCeneDana",
                opis: "Broj dana za unazad za koji se prikazuju promene cena",
                vrednost: "7"
            },
            {
                naziv: "StanjePartnera.DlKoristiDnevnuKorekcijuStanja",
                opis: "Da li se koristi korekcija stanja naručene robe u toku dana (1) ili ne (0).",
                vrednost: "1"
            },
            {
                naziv: "TipDokNovopristigli",
                opis: "Tipovi dokumenata koji stavljaju robu u magacin, koristi se za izveštaj o novopristiglim artiklima",
                vrednost: "'71'"
            },
            {
                naziv: "TipDokOnLineNarudzbenice",
                opis: "Tip dokumenta B2B narudžbenice",
                vrednost: "09"
            },
            {
                naziv: "TipDokOpozvaneNextNarudzbenice",
                opis: "Tip dokumenta nakon opoziva narudžbenice.",
                vrednost: "07"
            },
            {
                naziv: "TipDokOpozvaneOnLineNarudzbenice",
                opis: "Tip dokumenta nakon opoziva on-line narudžbenice. Koristi se kod zabrane naručivanja nakon opoziva.",
                vrednost: "65"
            },
            {
                naziv: "TipDokZaPregled",
                opis: "Tipovi dokumenata za pregled prodate robe distributeru odvojen zarezima",
                vrednost: "'02','80'"
            },
            {
                naziv: "TipKlas",
                opis: "Tip klase artikala za grupisanje",
                vrednost: "02"
            },
            {
                naziv: "UlogePlanPoseta",
                opis: "Koje uloge korisnika se ulaze u plan poseta partnerima? (Sa apostrofima, odvojene zarezima)",
                vrednost: "'KOMERCIJALISTA', 'DIREKTOR REGIJE','KOMERCIJALISTA_OSNOVNI'"
            },
            {
                naziv: "UnosPartnera.DozvoljenoZaduzenje",
                opis: "Podrazumevano dozvoljeno zaduženje u RSD za uspešno evidentirane partnere preko WEB-a.",
                vrednost: "1"
            },
            {
                naziv: "UnosPartnera.OpsegRabat",
                opis: "Opseg rabata u % koji može komercijalista unese za partnera od,do.",
                vrednost: "0,5"
            },
            {
                naziv: "UnosPartnera.OpsegRok",
                opis: "Opseg roka (valute plaćanja) u danima koji može komercijalista unese za partnera od,do.",
                vrednost: "0,1"
            },
            {
                naziv: "UnosPartnera.OpsegZaduzenje",
                opis: "Opseg dozvoljenog zaduženja (kredita) koji može komercijalista unese za partnera od,do.",
                vrednost: "0,5000"
            },
            {
                naziv: "UnosPartnera.PodrazumevanaGrupaPartnera",
                opis: "Podrazumevana grupa partnera (GRP) za partnere evidentirane preko WEB-a.",
                vrednost: "40"
            },
            {
                naziv: "UnosPartnera.PodrazumevanaRegija",
                opis: "Podrazumevana šifra regije za unos partnera preko WEB-a.",
                vrednost: "W"
            },
            {
                naziv: "UnosPartnera.Rabat",
                opis: "Podrazumevani rabat u procentima za uspešno evidentirane partnere preko WEB-a.",
                vrednost: "30"
            },
            {
                naziv: "UnosPartnera.Rabat6",
                opis: "Podrazumevani rabat u procentima za uspešno evidentirane INO partnere preko WEB-a.",
                vrednost: "3"
            },
            {
                naziv: "UnosPartnera.RabatBezKredita",
                opis: "Podrazumevani rabat u procentima za uspešno evidentirane partnere bez mogućnosti kreditiranja (samo avans).",
                vrednost: "5"
            },
            {
                naziv: "UnosPartnera.ValutaPlacanja",
                opis: "Podrazumevana valuta plaćanja u danima za uspešno evidentirane partnere preko WEB-a.",
                vrednost: "1"
            },
            {
                naziv: "VidljivaCena",
                opis: "Da li je vidjiva cena bez rabata na cenovniku (1-da, 0-ne)",
                vrednost: "1"
            },
            {
                naziv: "VidljivaCenaPriNarucivanju",
                opis: "Da li je vidljiva cena artikala u Dabel On-Line (1=Da, 0=Ne)",
                vrednost: "1"
            },
            {
                naziv: "VidljivaCenaSaRabatom",
                opis: "Da li je vidjiva cena sa urač. rabatom na cenovniku (1-da, 0-ne)",
                vrednost: "1"
            },
            {
                naziv: "Vlasnik",
                opis: "Vlasnik",
                vrednost: "01"
            },
            {
                naziv: "VrDokIzvod",
                opis: "Vrsta dokumenta izvoda za pregled plaćenog iznosa partnera",
                vrednost: "'51','56','45','78'"
            },
            {
                naziv: "VrDokNarudzbenica",
                opis: "Vrste dokumenata koje predstavljaju šta je partner naručio",
                vrednost: "'09'"
            },
            {
                naziv: "VrDokOnLineNarudzbenice",
                opis: "Vrsta dokumenta B2B narudžbenice",
                vrednost: "09"
            },
            {
                naziv: "VrDokOtpremnica",
                opis: "Vrste dokumenata otpremnice kupcu odvojene zarezom",
                vrednost: "'12','04','78'"
            },
            {
                naziv: "VrDokVremeIsporuke",
                opis: "Vrsta dokumenta sa vremenima isporuke artikala",
                vrednost: "VR"
            },
            {
                naziv: "VrDokZaPregled",
                opis: "Vrste dokumenata za pregled prodate robe distributeru odvojen zarezima",
                vrednost: "'12','26','27','28','43','78'"
            },
            {
                naziv: "VrstaNalogaZaNarudzbenice",
                opis: "Vrsta naloga za narudžbenice",
                vrednost: "19"
            },
            {
                naziv: "ZeljeniFaxModem",
                opis: "Zeljeni fax modem na serveru preko koga se salje. Moze se ostaviti prazno ako server sam odlucuje koji modem se koristi. Primer: COM2 ili COM5",
                vrednost: ""
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
    
    useEffect(() => {
        if (selectedItem && userSelectedFromSearch.current) {
            const selectedIndex = adminList.findIndex(
                (item) => item.naziv === selectedItem.naziv
            );
            if (selectedIndex !== -1) {
                const pageNumber = Math.floor(selectedIndex / stavkiPoStrani) + 1;
                setTrenutnaStrana(pageNumber);
                router.push(`?page=${pageNumber}`, { scroll: false });

                // OVDE dodaj scroll samo ako je ref tu
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
            }

            userSelectedFromSearch.current = false;
        }
    }, [selectedItem, adminList]);


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

    
    const [featuredArtikli, setFeaturedArtikli] = useState<artikalProp[]>([]);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const brojStranica = useMemo(() => Math.ceil(adminList.length / stavkiPoStrani), [adminList]);

    const paginiraneStavke = useMemo(() => {
        return adminList.slice(
            (trenutnaStrana - 1) * stavkiPoStrani,
            trenutnaStrana * stavkiPoStrani
        );
    }, [adminList, trenutnaStrana]);


    const handlePromeniArtikal = (stariId: string, noviArtikal: artikalProp) => {
        setFeaturedArtikli((prev) =>
            prev.map((a) => a.idArtikla === stariId ? { ...noviArtikal } : a
        ));
    };


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

    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    useEffect(() => {
        async function fetchArtikle() {
            try {
                const res = await fetch(`${apiAddress}/api/Artikal/DajArtikle`);
                const data: artikalProp[] = await res.json();
                setArticleList(data); // napravi state sviArtikli, bolji od mog, mora da bude!!
                setFeaturedArtikli(data.slice(0, 4));
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
                        {/* ISTAKNUTI ARTIKLI */}
                        <div> 
                            {featuredArtikli.map((article) => (
                                <div key={article.idArtikla} className="flex mx-4 pt-5 pb-5 items-center justify-between border-b border-b-red-200">
                                    <div className="flex">
                                        <img
                                            src="/artikal.jpg"
                                            alt="slika artikla"
                                            width={150}
                                            height={150}
                                            className="object-cover"
                                        />
                                        <div className="flex flex-col justify-between px-4 py-2 h-[150px] w-full">
                                            <div>
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
                                            //usedArtikalIds={articleList.map((a) => a.idArtikla).filter((id) => id !== article.idArtikla)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tabs.Content>
                    <Tabs.Content value="tab2">Bice ovde nesto</Tabs.Content>
                    <Tabs.Content value="tab3" className="flex flex-col ml-5 mr-5 justify-between"> 
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
                        const isLastItem = index === paginiraneStavke.length - 1;

                        const ref = isSelected ? scrollRef : null;
                        
                        return (
                            <div 
                                key={index} 
                                className={`p-2 ${isSelected ? "bg-[#8282820b] rounded-md" : ""}`}
                                ref={ref}
                            >
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
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    );
};
export default admin;