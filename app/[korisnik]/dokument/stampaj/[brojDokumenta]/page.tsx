'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { AritkalKorpaType } from "@/types/artikal";
import { DokumentInfo, StavkaDokumenta } from "@/types/dokument";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import korisnici from "@/app/[korisnik]/profil/korisnici/page";


const DokumentPage = () => {
  const [stavke, setStavke] = useState<StavkaDokumenta[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<KorisnikPodaciType>();
  const [minCena, setMinCena] = useState<number>(0);
  const [ukupnoSaDostavom, setUkupnoSaDostavom] = useState<number>(0);
  const [dostava, setDostava] = useState(0);
  const [docc, setDOCC] = useState<DokumentInfo>();

  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const korisnik = dajKorisnikaIzTokena();

  

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const value = sessionStorage.getItem("dostava");
  //     const parsed = value !== null ? parseFloat(value) : NaN;
  //     if (!isNaN(parsed)) setDostava(parsed);
  //   }
  // }, []);

  useEffect(() => {
    const value = sessionStorage.getItem("dostava");
    const parsed = value !== null ? parseFloat(value) : NaN;
    if (!isNaN(parsed)) setDostava(parsed);
  }, []);

  useEffect(() => {
    
    const local = localStorage.getItem("webparametri");
    if (local) {
      const parsed = JSON.parse(local);
      const parsedMinCena = parsed.find((p: any) => p.naziv === "MinCenaZaBesplatnuDostavu")?.vrednost;
      
      if (parsedMinCena) {
        const minCena = parseFloat(parsedMinCena);
        if(!isNaN(minCena)) {
          setMinCena(minCena);
        }        
      }
    }
  }, []);

  useEffect(() => {
    try {

    }
    catch(error) {
      console.error(`Greska prilikom povezivanja dokumenta`, error);
    }

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const PartnerResponse = await fetch(`${apiAddress}/api/Partner/DajPartnere?email=${korisnik?.email}`);
        if (!PartnerResponse.ok) throw new Error('Greska pri dohvatanju partnera');
        const partnerData : KorisnikPodaciType = await PartnerResponse.json();
        
        const DokumentResponse = await fetch(`${apiAddress}/api/Dokument/DajDokumentPoBroju?idPartnera=${korisnik?.idKorisnika}`);
        if (!DokumentResponse.ok) throw new Error('Greska pri dohvatanju dokumenta');
        const documentData: DokumentInfo = await DokumentResponse.json();
        
        setDOCC({
          ...documentData,
          partner: partnerData
        });
        setPartnerInfo(partnerData);

      } catch (error) {
        console.error("Greška pri učitavanju podataka sa servera:", error);
      }
    };

    fetchData();
  }, [apiAddress, korisnik?.email, korisnik?.idKorisnika]);

  
  useEffect(() => {
    if (docc && docc.stavkeDokumenata && Array.isArray(docc.stavkeDokumenata)) {
      setStavke(docc.stavkeDokumenata);
    }
  }, [docc]);


  useEffect(() => {
    const kanal = new BroadcastChannel("dokument-kanal");
    kanal.postMessage("dokument_je_ucitan");
    return () => kanal.close();
  }, []);


  const handlePrint = () => window.print();

  const izracunajStavku = (stavka: StavkaDokumenta) => {
    const artikalCena = stavka.cena > 0 ? stavka.cena : stavka.originalnaCena;
    const rabat = Number(docc?.partner.partnerRabat.rabat);
    const cenaPosleRabata = artikalCena * (1 - rabat/ 100);
    const cenaBezPDV = cenaPosleRabata;
    const cenaSaPDV = cenaBezPDV * (1 + Number(stavka.pdv)/ 100);
    const vrednost = cenaSaPDV * Number(stavka.kolicina);

    return { cenaBezPDV, cenaSaPDV, vrednost };
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
    if (ukupno.ukupnoSaPDV < minCena)  {
      setUkupnoSaDostavom(ukupno.ukupnoSaPDV + dostava);
    } else {
      setUkupnoSaDostavom(ukupno.ukupnoSaPDV);
    }
    
  }, [ukupno, dostava]);



 console.log("ceo doccccc", docc);
 console.log("ppppapertner", docc?.partner);



  if (!partnerInfo || !docc) {
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
            <p>Ime i prezime: {docc?.partner?.komercijalisti?.naziv || "Nepoznato"}</p>
            <p>Mob. telefon: {docc?.partner?.komercijalisti?.telefon || "Nepoznato"}</p>
            <p>Email adresa: {docc?.partner?.komercijalisti?.email || "Nepoznato"}</p>
          </div>

          
          {/* PARTNER */}
          <div className="border border-black p-4 w-[48%]">
            <p>Partner: {docc?.partner?.idPartnera || "?"}</p>
            <h3 className="mb-2 font-bold">{docc?.partner.ime || "Nepoznaaaato"}</h3>
            <p>{docc?.partner?.adresa}, {docc?.partner?.grad}</p>
            <p>Mob. telefon: {docc?.partner?.telefon}</p>
            <p>Email: {docc?.partner?.email}</p>
          </div>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">Naručeno</h3>
          <p>{docc?.brojDokumenta}</p>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">Adresa isporuke</h3>
          {docc?.lokacija}
        </div>
        <p className="mt-1">
          Datum izdavanja:{" "}
          {docc?.datumDokumenta && new Date(docc.datumDokumenta).toLocaleString("sr-RS", {
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
              <th className="border-r border-black px-2 py-1 w-[90px]">Cena bez PDV</th>
              <th className="border-r border-black px-2 py-1 w-[80px]">Rabat (%)</th>
              <th className="border-r border-black px-2 py-1 w-[100px]">Cena sa Rabatom</th>
              <th className="border-r border-black px-2 py-1 w-[70px]">PDV (%)</th>
              <th className="border-r border-black px-2 py-1 w-[100px]">Cena sa PDV</th>
              <th className="px-2 py-1 w-[110px]">Vrednost</th>
            </tr>
          </thead>
          <tbody>
            {docc?.stavkeDokumenata && stavke.map((stavka, index) => {
              // const rabatCena = stavka.originalnaCena *
              return (
                <tr key={index} className="text-center border-t border-black">
                  <td className="border-r border-black px-2 py-1">{index + 1}</td>
                  <td className="border-r border-black px-2 py-1 text-left">{stavka.nazivArtikla || "Nepoznato"}</td>
                  <td className="border-r border-black px-2 py-1">{stavka.jm}</td>
                  <td className="border-r border-black px-2 py-1">{stavka.kolicina}</td>
                  <td className="border-r border-black px-2 py-1">{stavka.cena}</td> 
                  <td className="border-r border-black px-2 py-1">{docc.partner.partnerRabat.rabat ?? 0}%</td>
                  <td className="border-r border-black px-2 py-1">{(stavka.cena * (1 - Number(docc.partner.partnerRabat.rabat)/100) * Number(stavka.kolicina)).toFixed(2)}</td>
                  <td className="border-r border-black px-2 py-1">{stavka.pdv} %</td>
                  <td className="border-r border-black px-2 py-1">{(stavka.cena * (1 - Number(docc.partner.partnerRabat.rabat)/100) * (1 + Number(stavka.pdv)/100) * Number(stavka.kolicina)).toFixed(2)}</td>
                  <td className="px-2 py-1">{stavka.ukupnaCena.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ukupno */}
      <div className="text-[15px] mt-4 flex flex-col gap-1 items-end">
        <div className="flex gap-4 w-full justify-end">
          <span>Ukupno sa PDV:</span>
          <span>{ukupno.ukupnoSaPDV.toFixed(2)} RSD</span>
        </div>
        {ukupno.ukupnoSaPDV < minCena && (
          <div className="flex gap-[32px] w-full justify-end">
            <span>Dostava:</span>
            <span>{dostava.toLocaleString("sr-RS")} RSD</span>
          </div>
        )}
        <div className="flex gap-4 w-full text-[16px] font-bold justify-end">
          <span>Ukupno:</span>
          <span>{ukupnoSaDostavom.toFixed(2)} RSD</span>
        </div>
      </div>

      {/* Napomena */}
      <div className="mt-10 space-y-2">
        <p className="text-center">
          Isporučene količine mogu biti manje u zavisnosti od stanja na lageru
        </p>

        {docc?.napomena && docc?.napomena.trim().length > 0 && (
        <div className="border border-black w-full">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">Napomena</p>
          </div>
          <div className="px-2 py-2 text-sm space-y-1">
            <p >{docc?.napomena}</p>
          </div>
        </div>
        )}

        <div className="border border-black w-full mt-5">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">Dokument kreirao:</p>
          </div>
          <div className="px-2 py-1 text-sm space-y-1">
            <p><span className="">Korisničko ime:</span> {docc?.partner?.komercijalisti?.id}</p> 
            <p><span className="">Ime i prezime:</span> {docc?.partner?.komercijalisti?.naziv || "Nepoznato"}</p>
            <p><span className="">Email adresa:</span> {docc?.partner?.komercijalisti?.email}</p>
            <p><span className="">Mob. telefon:</span> {docc?.partner?.komercijalisti?.telefon}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokumentPage;
