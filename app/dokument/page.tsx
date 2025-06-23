'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArtikalType } from "@/types/artikal";


type PartnerInfo = {
  partner: KorisnikPodaciType;
  idDokumenta: string;
  DatumKreiranja: Date; 
  imeiPrezime: string;
  mestoIsporuke: string; //lokacija
  napomena: string;
  grad: string;
  telefon: string;
  email: string;
};

const PDV = 20;

const DokumentPage = () => {
  const [stavke, setStavke] = useState<ArtikalType[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>();
  const [rabatPartnera, setRabatPartnera] = useState<number>(0);

  useEffect(() => {
    const data = sessionStorage.getItem("narudzbenica-podaci");
    if (data) {
      const parsed = JSON.parse(data);
      setRabatPartnera(parsed.partner.partnerRabat.rabat ?? 0);

      setStavke(parsed.artikli);
      setPartnerInfo({
        idDokumenta: String(parsed.idDokumenta),
        partner: parsed.partner,
        DatumKreiranja: new Date(parsed.DatumKreiranja),
        imeiPrezime: parsed.imeiPrezime,
        mestoIsporuke: parsed.mestoIsporuke,
        napomena: parsed.napomena,
        grad: parsed.grad,
        telefon: parsed.telefon,
        email: parsed.email,
      });

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage")); // za ažuriranje ikonice korpe
      console.log("🗑️ Korpa je ispražnjena iz localStorage-a.");
    }
  }, []);

  const handlePrint = () => window.print();

  const izracunajStavku = (stavka: ArtikalType) => {
    const artikalCena = stavka.artikalCene[0].akcija.cena > 0 ? stavka.artikalCene[0].akcija.cena : stavka.artikalCene[0].cena;
    const cenaPosleRabata = artikalCena * (1 - rabatPartnera / 100);
    const cenaBezPDV = cenaPosleRabata;
    const cenaSaPDV = cenaBezPDV * (1 + PDV / 100);
    const vrednost = cenaSaPDV * Number(stavka.kolicina);

    console.log(rabatPartnera);

    return { cenaBezPDV, cenaSaPDV, vrednost, rabatPartnera };
  };

  const ukupno = stavke.reduce(
    (acc, stavka) => {
      const { cenaBezPDV, cenaSaPDV, vrednost } = izracunajStavku(stavka);
      acc.ukupnoBezPDV += cenaBezPDV * Number(stavka.kolicina);
      acc.ukupnoSaPDV += cenaSaPDV * Number(stavka.kolicina);
      return acc;
    },
    { ukupnoBezPDV: 0, ukupnoSaPDV: 0 }
  );

  console.log("koji majmun stize ovde ?", partnerInfo);

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
            <p>Ime i prezime: {partnerInfo.imeiPrezime || "Nepoznato"}</p>
            <p>Mob. telefon: {partnerInfo.telefon || "Nepoznato"}</p>
            <p>Grad: {partnerInfo.grad || "Nepoznato"}</p>
            <p>Email adresa: {partnerInfo.email || "Nepoznato"}</p>
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
          <p>{partnerInfo.idDokumenta}</p>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">Adresa isporuke</h3>
          {partnerInfo.mestoIsporuke}
        </div>
        <p className="mt-1">Datum izdavanja: {partnerInfo.DatumKreiranja.toLocaleString("sr-RS")}</p>
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
                  <td className="border-r border-black px-2 py-1">{stavka.artikalCene[0].cena.toFixed(2)}</td>
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
        <div className="flex gap-4">
          <span className="font-semibold">Ukupno sa PDV:</span>
          <span>{ukupno.ukupnoSaPDV.toFixed(2)} RSD</span>
        </div>
      </div>

      {/* Napomena */}
      <div className="mt-10 space-y-2">
        <p className="text-center">
          Isporučene količine mogu biti manje u zavisnosti od stanja na lageru
        </p>

        <div className="border border-black w-full">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">Napomena</p>
          </div>
          <div className="px-2 py-2 text-sm space-y-1">
            <p >{partnerInfo.napomena}</p>
          </div>
        </div>

        <div className="border border-black w-full mt-5">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">Dokument kreirao:</p>
          </div>
          <div className="px-2 py-1 text-sm space-y-1">
            <p><span className="">Korisničko ime:</span> 3005???</p> 
            {/* Ovo da se sredi? */}
            <p><span className="">Ime i prezime:</span> {partnerInfo.imeiPrezime || "Nepoznato"}</p>
            <p><span className="">Email adresa:</span> {partnerInfo.email}</p>
            <p><span className="">Mob. telefon:</span> {partnerInfo.telefon}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokumentPage;
