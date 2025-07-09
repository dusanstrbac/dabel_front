'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArtikalType } from "@/types/artikal";
import { DokumentInfo } from "@/types/dokument";
import { dajKorisnikaIzTokena } from "@/lib/auth";


const DokumentPage = () => {
  const [stavke, setStavke] = useState<ArtikalType[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<DokumentInfo>();
  const [rabatPartnera, setRabatPartnera] = useState<number>(0);
  const [dostava, setDostava] = useState<number>(0);
  const [ukupnoSaDostavom, setUkupnoSaDostavom] = useState<number>(0);
 // get metoda sa brojDokumenta
const PDV = 20;

  useEffect(() => {
    const dostavaSession = sessionStorage.getItem("dostava");
    if (dostavaSession) setDostava(Number(dostavaSession));
    localStorage.removeItem("cart");

    sessionStorage.removeItem("dostava");
    sessionStorage.removeItem("cene-sa-pdv");
  }, []);


  //metoda za broj dokumenta
  useEffect(() => {
  const korisnik = dajKorisnikaIzTokena();

  const izvuciCeoDokument = async () => {
    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const idKorisnika = korisnik?.idKorisnika;
      
      const resDoc = await fetch(
        `${apiAddress}/api/Dokument/DajDokumentPoBroju?idPartnera=${idKorisnika}`
      );

      if (!resDoc.ok) throw new Error("Greška pri učitavanju podataka.");
      

      const data = await resDoc.json();
      const dokument: DokumentInfo = data.dokument;

      if (!dokument) {
        console.error("Dokument nije pronađen u odgovoru.");
        return;
      }

      const resPartner = await fetch(`${apiAddress}/api/Partner/DajPartnere?email=${korisnik?.email}`);
      if (!resPartner.ok) throw new Error("Greška pri učitavanju partnera.");

      const partnerNiz = await resPartner.json();
      const partner: KorisnikPodaciType = partnerNiz[0];
      dokument.partner = partner;


      if (!partner || !partner.komercijalisti) {
        console.error("Partner ili njegovi podaci nisu validni.");
        return;
      }

      setRabatPartnera(partner?.partnerRabat?.rabat ?? 0);
      setPartnerInfo(dokument);

      const artikli: ArtikalType[] = (dokument.stavkeDokumenata ?? []).map((stavka: any) => ({
        idArtikla: stavka.idArtikla,
        naziv: stavka.nazivArtikla,
        kolicina: stavka.kolicina,
        jm: "kom",
        kategorijaId: "",
        barkod: "",
        artikalAtributi: [],
        artikalCene: [
          {
            id: "", // Možeš staviti fiksnu vrednost ako ne postoji u fetch-u
            idCenovnika: "",
            valutaISO: "RSD",
            idArtikla: stavka.idArtikla,
            cena: stavka.cena,
            akcija: {
              idArtikla: stavka.idArtikla,
              cena: stavka.originalnaCena ?? 0,
              datumOd: "", // ako nemaš, stavi ""
              datumDo: "",
              tipAkcije: "",
              kolicina: 0,
              naziv: "",
              staraCena: stavka.originalnaCena?.toString() ?? "0"
            }
          }
        ]
      }));
    
      setStavke(artikli);
      console.log("Mapped artikli:", artikli);
      if (!artikli.length) {
        console.warn("Nema artikala nakon mapiranja!", dokument.stavkeDokumenata);
      }

    } catch (err: any) {
      console.error("Greška pri fetchovanju dokumenta:", err);
    }
  };

  izvuciCeoDokument();
}, []);




  const handlePrint = () => window.print();

  const izracunajStavku = (stavka: ArtikalType) => {
    const artikalCena = stavka.artikalCene[0].akcija.cena > 0 ? stavka.artikalCene[0].akcija.cena : stavka.artikalCene[0].cena;
    const cenaPosleRabata = artikalCena * (1 - rabatPartnera / 100);
    const cenaBezPDV = cenaPosleRabata;
    const cenaSaPDV = cenaBezPDV * (1 + PDV / 100);
    const vrednost = cenaSaPDV * Number(stavka.kolicina);

    return { cenaBezPDV, cenaSaPDV, vrednost, rabatPartnera };
  };

  const ukupno = stavke.reduce(
    (acc, stavka) => {
      const { cenaBezPDV, cenaSaPDV } = izracunajStavku(stavka);
      acc.ukupnoBezPDV += cenaBezPDV * Number(stavka.kolicina);
      acc.ukupnoSaPDV += cenaSaPDV * Number(stavka.kolicina);
      return acc;
    },
    { ukupnoBezPDV: 0, ukupnoSaPDV: 0 }
  );

  useEffect(() => {
    const novaUkupnaCena = ukupno.ukupnoSaPDV + dostava;
    setUkupnoSaDostavom(novaUkupnaCena);
  }, [ukupno, dostava]);


  if (!partnerInfo || stavke.length === 0) {
    return <div className="p-10 text-red-600">Nema dostupnih podataka za prikaz dokumenta.</div>;
  }

  return (
    <div className="mx-auto bg-white text-black p-10 print:p-0">
      <div className="flex items-center justify-between mb-5">
        <Image src="/Dabel-logo-2.png" alt="Dabel Logo" width={150} height={150} />
        <button onClick={handlePrint} className="text-blue-600 underline hover:text-blue-800 no-print">
          Štampaj
        </button>
      </div>

      {/* INFO */}
      <div className="mt-10 w-full">
        <p className="mt-2 font-semibold">NP</p>
        <p>Nova Pazova, Šesta Industrijska 12</p>

        <div className="flex justify-between gap-8 w-full mt-4">
          {/* KONTAKT OSOBA */}
          <div className="border border-black p-4 w-[48%]">
            <h1 className="font-bold mb-2">Kontakt osoba:</h1>
            <p>Ime i prezime: {partnerInfo.partner.komercijalisti.naziv || "Nepoznato"}</p>
            <p>Mob. telefon: {partnerInfo.partner.komercijalisti.telefon || "Nepoznato"}</p>
            <p>Email adresa: {partnerInfo.partner.komercijalisti.email || "Nepoznato"}</p>
          </div>

          
          {/* PARTNER */}
          <div className="border border-black p-4 w-[48%]">
            <p>Partner: {partnerInfo.partner.idPartnera || "?"}</p>
            <h3 className="mb-2 font-bold">{partnerInfo.partner.ime || "Nepoznaaaato"}</h3>
            <p>{partnerInfo.partner.adresa}, {partnerInfo.partner.grad}</p>
            <p>Mob. telefon: {partnerInfo.partner.telefon}</p>
            <p>Email: {partnerInfo.partner.email}</p>
          </div>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">Naručeno</h3>
          <p>{partnerInfo.brojDokumenta}</p>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">Adresa isporuke</h3>
          {partnerInfo.lokacija}
        </div>
        <p className="mt-1">
          Datum izdavanja:{" "}
          {new Date(partnerInfo.datumDokumenta).toLocaleString("sr-RS", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>

      </div>

      {/* Artikli */}
      <div className="mt-6">
        <h2 className="font-bold text-lg mb-2">Sadržaj</h2>
        <table className="w-full table-fixed border border-black text-sm">
          <thead>
            <tr className="border-b border-black text-xs uppercase bg-transparent print:bg-white">
              <th className="border-r border-black px-2 py-1 w-[40px]">R. br.</th>
              <th className="border-r border-black px-2 py-1 text-left w-[200px]">Artikl</th>
              <th className="border-r border-black px-2 py-1 w-[50px]">JM</th>
              <th className="border-r border-black px-2 py-1 w-[70px]">Količina</th>
              <th className="border-r border-black px-2 py-1 w-[90px]">Cena</th>
              <th className="border-r border-black px-2 py-1 w-[80px]">Rabat (%)</th>
              <th className="border-r border-black px-2 py-1 w-[100px]">Cena bez PDV</th>
              <th className="border-r border-black px-2 py-1 w-[70px]">PDV (%)</th>
              <th className="border-r border-black px-2 py-1 w-[100px]">Cena sa PDV</th>
              <th className="px-2 py-1 w-[110px]">Vrednost</th>
            </tr>
          </thead>
          <tbody>
            {stavke.map((stavka, index) => {
              const { cenaBezPDV, cenaSaPDV, vrednost, rabatPartnera } = izracunajStavku(stavka);
              return (
                <tr key={index} className="text-center border-t border-black">
                  <td className="border-r border-black px-2 py-1">{index + 1}</td>
                  <td className="border-r border-black px-2 py-1 text-left">{stavka.naziv || "Nepoznato"}</td>
                  <td className="border-r border-black px-2 py-1">{stavka.jm}</td>
                  <td className="border-r border-black px-2 py-1">{stavka.kolicina}</td>
                  <td className="border-r border-black px-2 py-1">{(stavka.artikalCene[0].akcija.cena > 0 ? stavka.artikalCene[0].akcija.cena : stavka.artikalCene[0].cena)}</td>
                  <td className="border-r border-black px-2 py-1">{rabatPartnera ?? 0}%</td>
                  <td className="border-r border-black px-2 py-1">{cenaBezPDV.toFixed(2)}</td>
                  <td className="border-r border-black px-2 py-1">{PDV} %</td>
                  <td className="border-r border-black px-2 py-1">{cenaSaPDV.toFixed(2)}</td>
                  <td className="px-2 py-1">{vrednost.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ukupno */}
      <div className="mt-4 flex flex-col items-end text-sm">
        <div className="flex gap-4">
          <span className="font-semibold">Ukupno bez PDV:</span>
          <span>{ukupno.ukupnoBezPDV.toFixed(2)} RSD</span>
        </div>
        {dostava > 0 && (
          <div className="flex gap-4 w-39 justify-between">
            <span className="font-semibold">Dostava:</span>
            <span>{dostava.toLocaleString("sr-RS")} RSD</span>
          </div>
        )}
        <div className="flex gap-4">
          <span className="font-semibold">Ukupno sa PDV:</span>
          <span>{ukupnoSaDostavom.toFixed(2)} RSD</span>
        </div>
      </div>

      {/* Napomena */}
      <div className="mt-10 space-y-2">
        <p className="text-center">
          Isporučene količine mogu biti manje u zavisnosti od stanja na lageru
        </p>

        {partnerInfo.napomena && partnerInfo.napomena.trim().length > 0 && (
        <div className="border border-black w-full">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">Napomena</p>
          </div>
          <div className="px-2 py-2 text-sm space-y-1">
            <p >{partnerInfo.napomena}</p>
          </div>
        </div>
        )}

        <div className="border border-black w-full mt-5">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">Dokument kreirao:</p>
          </div>
          <div className="px-2 py-1 text-sm space-y-1">
            <p><span className="">Korisničko ime:</span> {partnerInfo.partner.komercijalisti.id}</p> 
            <p><span className="">Ime i prezime:</span> {partnerInfo.partner.komercijalisti.naziv || "Nepoznato"}</p>
            <p><span className="">Email adresa:</span> {partnerInfo.partner.komercijalisti.email}</p>
            <p><span className="">Mob. telefon:</span> {partnerInfo.partner.komercijalisti.telefon}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokumentPage;
