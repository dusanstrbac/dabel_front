'use client';
import { SwissFranc } from "lucide-react";
import { useState } from "react";

const admin = () => {

        const [adminList, setAdminList] = useState([
            {
                sifra: "ActiveFaxInputDirectory",
                opis: "Putanja do ulaznog direktorijuma za Active Fax. Ovaj direktorijum je vidljiv za fax server.",
                vrednost: "\\\\10.0.2.19\\FaxInput"
            },
            {
                sifra: "AdminMail",
                opis: "Administratorski mail nalog",
                vrednost: "gojko.d@dabel.rs"
            },
            {
                sifra: "AdminPhone",
                opis: "Administratorski broj telefona",
                vrednost: "+38122802860"
            },
            {
                sifra: "AdresaFirmeZaIzvestaje",
                opis: "Adresa firme za izveštavanje",
                vrednost: "Šesta Industrijska 12"
            },
            {
                sifra: "AsortimanArtikalaPartneraVrDok",
                opis: "Vrsta dokumenta u NexT-u koji predstavlja dozvoljen asortiman za partnera.",
                vrednost: "35"
            },
            {
                sifra: "BrDanaNovopristigli",
                opis: "Broj dana koji se gleda unazad za izveštaj o novopristiglim artiklima",
                vrednost: "10"
            },
            {
                sifra: "DaLiKlasaIzAnalize",
                opis: "Da li se koristi klasifikacija iz analize za fin limite on-line naručivanja ili samo dozvoljeno zaduženje (1=Da, 0=Ne)",
                vrednost: "0"
            },
            {
                sifra: "DefaultCenovnik",
                opis: "Pretpostavljeni cenovnik",
                vrednost: "04"
            },
            {
                sifra: "DefaultValuta",
                opis: "Podrazumevana valuta pri naručivanju. Posebna se postavlja na nivou partnera (pored cenovnika, objekta).",
                vrednost: "RSD"
            },
            {
                sifra: "EmailAdresaPosiljaoca",
                opis: "Email adresa koja će se videti na primljenoj poruci kod primaoca (F111)",
                vrednost: "mail@dabel.rs"
            },
            {
                sifra: "GraceKontroleNaplate",
                opis: "Koji je grace period u danima u kome se neće zabraniti poručivanje iako nije platio.",
                vrednost: "3"
            },
            {
                sifra: "GradFirmeZaIzvestaje",
                opis: "Grad firme za izveštavanje",
                vrednost: "Nova Pazova"
            },
            {
                sifra: "GrupaPartneraSvacijePravoUnosa",
                opis: "Grupa partnera u kojoj svi korisnici Dabel web mogu unositi narudžbenice.",
                vrednost: "58"
            },
            {
                sifra: "KoeficijentKvalitetaRada",
                opis: "Kojim se koeficijentom množi dozvoljeno zaduženje kako bi se dobio plan prodaje po partneru (0-1)",
                vrednost: "0.7"
            },
            {
                sifra: "KoeficijentKvalitetaRadaGR",
                opis: "Granice koeficijenata rada za kartone - dve cifre odvojene zarezima",
                vrednost: "30,90"
            },
            {
                sifra: "KontaZaPregled",
                opis: "Konta koja će se pratiti u izveštajima (karticama)",
                vrednost: "'2010','2020','885','CGD','KSD','MKD','BHD'"
            },
            {
                sifra: "Korpa.MinIznosZaIsporuku",
                opis: "Granični iznos bez PDV ispod koga se naplaćuje isporuka robe.",
                vrednost: "7000"
            },
            {
                sifra: "Korpa.SifArtiklaIsporuka",
                opis: "Šifra artikla koji nosi cenu prevoza (isporuke) ukoliko je vrednost korpe manja od granične.",
                vrednost: "001"
            },
            {
                sifra: "Korpa.SifArtiklaRaspakivanje",
                opis: "Šifra artikla koji nosi cenu za raspakivanje robe ukoliko količina nije umnožak one za poručivanje.",
                vrednost: "002"
            },
            {
                sifra: "KvalitetRada.LimitDozvoljenogZaduzenjaZaKartone",
                opis: "Granični iznos dozvoljenog zaduženja za partnera iznad  kojeg partner ulazi u Izveštaj o kvalitetu rada.",
                vrednost: "50000"
            },
            {
                sifra: "KvalitetRadaLimitDuga",
                opis: "Kvalitet rada: limit minimalnog duga iznad kojeg se izveštava",
                vrednost: "500"
            },
            {
                sifra: "LokacijaKontrolneDatotekeFaxServer",
                opis: "Lokacija kontrolne datoteke na FAX serveru. Primer: c\\faxes\\",
                vrednost: ""
            },
            {
                sifra: "MinimalniDugZaPrikaz",
                opis: "Minimalni iznos duga koji će se prikazati kao kašnjenje",
                vrednost: "1000"
            },
            {
                sifra: "MinIznosNarudzbenice",
                opis: "Minimalni iznos jedne on-line narudžbenice",
                vrednost: "1"
            },
            {
                sifra: "MinIznosNarudzbenice.API",
                opis: "Minimalni iznos jedne API narudžbenice",
                vrednost: "10000"
            },
            {
                sifra: "Narucivanje.DodatniPopustPoruka",
                opis: "Poruka koja će se prikazati pri potvrdi narudžbenice (dodatna 2% na kraju godine).",
                vrednost: "Poručivanjem preko Dabel Web portala ostvarujete popust od dodatnih {0}% na svaku Vašu porudžbinu. Na ovoj porudžbini ustedećete {1:0.00} RSD bez PDV. Hvala što koristite naš servis."
            },
            {
                sifra: "Narucivanje.DodatniPopustProcenat",
                opis: "Dodatni popust koji će se obračunati u B2B narudžbenicama za samostalno naručivanje (bilo je 2% na kraju godine).",
                vrednost: "5"
            },
            {
                sifra: "Narucivanje.HelpFileName",
                opis: "Putanja i naziv datoteke uputstva za poručivanje za partnere.",
                vrednost: "C:/Temp/DabelOnLineManual.pdf"
            },
            {
                sifra: "Narucivanje.KomentarUNarudzbenici",
                opis: "Slobodan tekst koji će se štampati na narudžbenici",
                vrednost: "U zavisnosti od brzine slanja dokumenta zavisi raspoloživost robe."
            },
            {
                sifra: "Narucivanje.KontaktIme",
                opis: "Kontakt koji se štampa na dokumentu porudžbenice.",
                vrednost: ""
            },
            {
                sifra: "Narucivanje.KontaktTelefon",
                opis: "Broj telefona kao kontakt koji se štampa na dokumentu porudžbenice.",
                vrednost: ""
            },
            {
                sifra: "Narucivanje.MaxBrojOpozvanihNarudzbenicaUTokuDana",
                opis: "Najveći broj opozvanih dokumenata u toku dana za naručivanje",
                vrednost: "0"
            },
            {
                sifra: "Narucivanje.MaxBrojRezervacijaPoPartneru",
                opis: "Maksimalni broj aktivnih rezervacija po partneru.",
                vrednost: "1"
            },
            {
                sifra: "Narucivanje.MaxIznosJedneRezervacije",
                opis: "Maksimalni iznos jedne rezervacije. Uzima se manji iznos između ovog i raspoloživog stanja.",
                vrednost: "180000"
            },
            {
                sifra: "Narucivanje.RokVazenjaRezervacije",
                opis: "Rok važenja Rezervacije u danima",
                vrednost: "6"
            },
            {
                sifra: "Narucivanje.TipDokOnLineNarudzbenice.Avans",
                opis: "Tip dokumenta avansne narudžbenice-predračuna",
                vrednost: "18"
            },
            {
                sifra: "Narucivanje.TipDokOnLineNarudzbenice.Kredit",
                opis: "Tip dokumenta kreditne narudžbenice-predračuna",
                vrednost: "09"
            },
            {
                sifra: "Narucivanje.TipDokOpozvanaRezervacija",
                opis: "Tip dokumenta Opozvane Rezervacije",
                vrednost: "07"
            },
            {
                sifra: "Narucivanje.TipDokRezervacija",
                opis: "Tip dokumenta Rezervacije",
                vrednost: "88"
            },
            {
                sifra: "Narucivanje.UploadTempFileLokacija",
                opis: "Privremena lokacija za otpremanje fajlova.",
                vrednost: "d:/TemporaryUoploads"
            },
            {
                sifra: "Narucivanje.VrDokOnLineNarudzbenice.Avans",
                opis: "Vrsta dokumenta avansne narudžbenice-predračuna",
                vrednost: "20"
            },
            {
                sifra: "Narucivanje.VrDokOnLineNarudzbenice.Kredit",
                opis: "Vrsta dokumenta kreditne narudžbenice-predračuna",
                vrednost: "09"
            },
            {
                sifra: "Narucivanje.VrDokRezervacija",
                opis: "Vrsta dokumenta Rezervacije",
                vrednost: "88"
            },
            {
                sifra: "Narucivanje.ZatvoriNextDokument",
                opis: "Da li se Next dokument (narudzbenica) zatvara nakon slanja u NexT ili ne (0).",
                vrednost: ""
            },
            {
                sifra: "NazivFirmeZaIzvestaje",
                opis: "Naziv preduzeća-firme koji će biti u izveštajima",
                vrednost: "Dabel d.o.o."
            },
            {
                sifra: "ObjektKorpe",
                opis: "Objekt po kome se listaju proizvodi za naručivanje",
                vrednost: "NP"
            },
            {
                sifra: "OSObjekat",
                opis: "Šifra objekta u kome se vode osnovna sredstva kod partnera.",
                vrednost: "G"
            },
            {
                sifra: "OSOTipDok",
                opis: "Tip dokumenta kojim se menja stanje osnovnih sredstava kod partnera.",
                vrednost: "04"
            },
            {
                sifra: "OSVrstaDok",
                opis: "Vrsta dokumenta kojim se menja stanje osnovnih sredstava kod partnera.",
                vrednost: "14"
            },
            {
                sifra: "Ponude.KreditMinVrednost",
                opis: "Vrednost ispod koje se ne smatra da PARTNER ima kredit.",
                vrednost: "10"
            },
            {
                sifra: "Ponude.MaxRabatProc",
                opis: "Maksimalni rabat u procentima za kreiranje ponude partneru bez ugovora",
                vrednost: "34"
            },
            {
                sifra: "Ponude.MaxRokDana",
                opis: "Maksimalni rok u danima za kreiranje ponude partneru bez ugovora",
                vrednost: "5"
            },
            {
                sifra: "Ponude.RokVazenjaDana",
                opis: "Rok važenja ponude koju šalje komercijalista u danima.",
                vrednost: "3"
            },
            {
                sifra: "Ponude.TipDok",
                opis: "Tip dokumenta za ponude",
                vrednost: "38"
            },
            {
                sifra: "Ponude.VrstaDok",
                opis: "Vrsta dokumenta za ponude",
                vrednost: "16"
            },
            {
                sifra: "Ponude.VrstaNaloga",
                opis: "Vrsta naloga za ponude",
                vrednost: "98"
            },
            {
                sifra: "PonudeAPI.VrstaNaloga",
                opis: "Vrsta naloga za ponude preko API-ja.",
                vrednost: "1"
            },
            {
                sifra: "PPAutoPlaniranjeBrisanje",
                opis: "Kod planiranja pravaca, da li automatsko planiranje briše prethodni plan za taj dan. Vrednosti D i N. Podrazumeva se D.",
                vrednost: "N"
            },
            {
                sifra: "PPBrojDanaZaNerealizovane",
                opis: "Broj dana unazad za auto ubacivanje nerealizovanih planiranih poseta partneru",
                vrednost: "7"
            },
            {
                sifra: "PPGranicaIznosPlanaProdaje",
                opis: "Kod planiranja pravaca, granična vrednost iznosa koji ulazi u automatsko planiranje. Vrednost mora biti pozitivna, može i 0.",
                vrednost: "14500"
            },
            {
                sifra: "PPPoslednjiPresecniDan",
                opis: "NE DIRATI! Kod planiranja pravaca, poslednji dan prelaska sa prve na drugu nedelju.",
                vrednost: "07.10.2024"
            },
            {
                sifra: "PPTrenutnaNedeljaPlana",
                opis: "NE DIRATI! Kod planiranja pravaca, koja je aktuelna nedelja. Može imati vrednosti 1 i 2",
                vrednost: "2"
            },
            {
                sifra: "PredlogArtikalaPartneraVrDok",
                opis: "Vrsta dokumenta u NexT-u koji predstavlja predložen asortiman za partnera.",
                vrednost: "59"
            },
            {
                sifra: "PrioritetKanalaZaSlanjePoruke",
                opis: "Prioritet kanala slanja kada ima definisana oba (e-mail = EMAIL, fax = FAX)",
                vrednost: "EMAIL"
            },
            {
                sifra: "PromenjeneCeneDana",
                opis: "Broj dana za unazad za koji se prikazuju promene cena",
                vrednost: "7"
            },
            {
                sifra: "StanjePartnera.DlKoristiDnevnuKorekcijuStanja",
                opis: "Da li se koristi korekcija stanja naručene robe u toku dana (1) ili ne (0).",
                vrednost: "1"
            },
            {
                sifra: "TipDokNovopristigli",
                opis: "Tipovi dokumenata koji stavljaju robu u magacin, koristi se za izveštaj o novopristiglim artiklima",
                vrednost: "'71'"
            },
            {
                sifra: "TipDokOnLineNarudzbenice",
                opis: "Tip dokumenta B2B narudžbenice",
                vrednost: "09"
            },
            {
                sifra: "TipDokOpozvaneNextNarudzbenice",
                opis: "Tip dokumenta nakon opoziva narudžbenice.",
                vrednost: "07"
            },
            {
                sifra: "TipDokOpozvaneOnLineNarudzbenice",
                opis: "Tip dokumenta nakon opoziva on-line narudžbenice. Koristi se kod zabrane naručivanja nakon opoziva.",
                vrednost: "65"
            },
            {
                sifra: "TipDokZaPregled",
                opis: "Tipovi dokumenata za pregled prodate robe distributeru odvojen zarezima",
                vrednost: "'02','80'"
            },
            {
                sifra: "TipKlas",
                opis: "Tip klase artikala za grupisanje",
                vrednost: "02"
            },
            {
                sifra: "UlogePlanPoseta",
                opis: "Koje uloge korisnika se ulaze u plan poseta partnerima? (Sa apostrofima, odvojene zarezima)",
                vrednost: "'KOMERCIJALISTA', 'DIREKTOR REGIJE','KOMERCIJALISTA_OSNOVNI'"
            },
            {
                sifra: "UnosPartnera.DozvoljenoZaduzenje",
                opis: "Podrazumevano dozvoljeno zaduženje u RSD za uspešno evidentirane partnere preko WEB-a.",
                vrednost: "1"
            },
            {
                sifra: "UnosPartnera.OpsegRabat",
                opis: "Opseg rabata u % koji može komercijalista unese za partnera od,do.",
                vrednost: "0,5"
            },
            {
                sifra: "UnosPartnera.OpsegRok",
                opis: "Opseg roka (valute plaćanja) u danima koji može komercijalista unese za partnera od,do.",
                vrednost: "0,1"
            },
            {
                sifra: "UnosPartnera.OpsegZaduzenje",
                opis: "Opseg dozvoljenog zaduženja (kredita) koji može komercijalista unese za partnera od,do.",
                vrednost: "0,5000"
            },
            {
                sifra: "UnosPartnera.PodrazumevanaGrupaPartnera",
                opis: "Podrazumevana grupa partnera (GRP) za partnere evidentirane preko WEB-a.",
                vrednost: "40"
            },
            {
                sifra: "UnosPartnera.PodrazumevanaRegija",
                opis: "Podrazumevana šifra regije za unos partnera preko WEB-a.",
                vrednost: "W"
            },
            {
                sifra: "UnosPartnera.Rabat",
                opis: "Podrazumevani rabat u procentima za uspešno evidentirane partnere preko WEB-a.",
                vrednost: "30"
            },
            {
                sifra: "UnosPartnera.Rabat6",
                opis: "Podrazumevani rabat u procentima za uspešno evidentirane INO partnere preko WEB-a.",
                vrednost: "3"
            },
            {
                sifra: "UnosPartnera.RabatBezKredita",
                opis: "Podrazumevani rabat u procentima za uspešno evidentirane partnere bez mogućnosti kreditiranja (samo avans).",
                vrednost: "5"
            },
            {
                sifra: "UnosPartnera.ValutaPlacanja",
                opis: "Podrazumevana valuta plaćanja u danima za uspešno evidentirane partnere preko WEB-a.",
                vrednost: "1"
            },
            {
                sifra: "VidljivaCena",
                opis: "Da li je vidjiva cena bez rabata na cenovniku (1-da, 0-ne)",
                vrednost: "1"
            },
            {
                sifra: "VidljivaCenaPriNarucivanju",
                opis: "Da li je vidljiva cena artikala u Dabel On-Line (1=Da, 0=Ne)",
                vrednost: "1"
            },
            {
                sifra: "VidljivaCenaSaRabatom",
                opis: "Da li je vidjiva cena sa urač. rabatom na cenovniku (1-da, 0-ne)",
                vrednost: "1"
            },
            {
                sifra: "Vlasnik",
                opis: "Vlasnik",
                vrednost: "01"
            },
            {
                sifra: "VrDokIzvod",
                opis: "Vrsta dokumenta izvoda za pregled plaćenog iznosa partnera",
                vrednost: "'51','56','45','78'"
            },
            {
                sifra: "VrDokNarudzbenica",
                opis: "Vrste dokumenata koje predstavljaju šta je partner naručio",
                vrednost: "'09'"
            },
            {
                sifra: "VrDokOnLineNarudzbenice",
                opis: "Vrsta dokumenta B2B narudžbenice",
                vrednost: "09"
            },
            {
                sifra: "VrDokOtpremnica",
                opis: "Vrste dokumenata otpremnice kupcu odvojene zarezom",
                vrednost: "'12','04','78'"
            },
            {
                sifra: "VrDokVremeIsporuke",
                opis: "Vrsta dokumenta sa vremenima isporuke artikala",
                vrednost: "VR"
            },
            {
                sifra: "VrDokZaPregled",
                opis: "Vrste dokumenata za pregled prodate robe distributeru odvojen zarezima",
                vrednost: "'12','26','27','28','43','78'"
            },
            {
                sifra: "VrstaNalogaZaNarudzbenice",
                opis: "Vrsta naloga za narudžbenice",
                vrednost: "19"
            },
            {
                sifra: "ZeljeniFaxModem",
                opis: "Zeljeni fax modem na serveru preko koga se salje. Moze se ostaviti prazno ako server sam odlucuje koji modem se koristi. Primer: COM2 ili COM5",
                vrednost: ""
            }

    ]);

    const [quantities, setQuantities] = useState(
        adminList.map((article) => article)
    );

    const handleChange = (index: number, newValue: string) => {
        const updatedList = [...adminList];
        updatedList[index].vrednost = newValue;
        setAdminList(updatedList);
    };

    return(
        <div className="p-4">
            <h1 className="text-center font-bold mb-4">Parametri sistema</h1>

            <div className="grid grid-cols-3 gap-2 font-bold border-b pb-2">
                <p>Šifra parametara</p>
                <p className="">Opis parametara</p>
                <p className="text-right">Vrednost parametara</p>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] gap-4 mt-3">
                {adminList.map((article, index) => (
                    <div key={index} className="contents">
                        <p className="py-1 border-b align-top">{article.sifra}</p>
                        <p className="py-1 border-b align-top text-left">{article.opis}</p>
                        <input
                            key={`input-${index}`}
                            className="border px-2 py-1 h-10 w-[300px] max-w-[300px] min-h-[40px]"
                            type="text"
                            value={article.vrednost}
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default admin;