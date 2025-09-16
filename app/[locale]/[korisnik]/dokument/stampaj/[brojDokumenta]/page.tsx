'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { DokumentInfo, StavkaDokumenta } from "@/types/dokument";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const DokumentPage = () => {
  const t = useTranslations();
  const [stavke, setStavke] = useState<StavkaDokumenta[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<KorisnikPodaciType>();
  const [minCena, setMinCena] = useState<number>(0);
  const [ukupnoSaDostavom, setUkupnoSaDostavom] = useState<number>(0);
  const [dostava, setDostava] = useState<number | null>(null);

  const params = useParams();
  const brojDokumenta = params.brojDokumenta as string;
  const [docc, setDOCC] = useState<DokumentInfo | null>(null);

  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const korisnik = dajKorisnikaIzTokena();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Učitavanje minimalne cene za besplatnu dostavu iz localStorage
    const local = localStorage.getItem("webparametri");
    if (local) {
      const parsed = JSON.parse(local);
      const parsedMinCena = parsed.find((p: any) => p.naziv === "MinCenaZaBesplatnuDostavu")?.vrednost;
      if (parsedMinCena) {
        const minCenaParsed = parseFloat(parsedMinCena);
        if (!isNaN(minCenaParsed)) {
          setMinCena(minCenaParsed);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dohvati partnera
        const PartnerResponse = await fetch(`${apiAddress}/api/Partner/DajPartnere?idPartnera=${korisnik?.partner}&idKorisnika=${korisnik?.idKorisnika}`);
        if (!PartnerResponse.ok) throw new Error("Greška pri dohvatanju partnera");
        const partnerData = await PartnerResponse.json();

        // Dohvati dokument
        const DokumentResponse = await fetch(
          `${apiAddress}/api/Dokument/DajDokumentPoBroju?brojDokumenta=${brojDokumenta}&idPartnera=${korisnik?.partner}&idKorisnika=${korisnik?.idKorisnika}`
        );
        if (!DokumentResponse.ok) throw new Error("Greška pri dohvatanju dokumenta");
        const dokument = await DokumentResponse.json();

        if (!dokument) {
          throw new Error("Dokument nije pronađen");
        }

        // Postavi dokument u stanje sa konvertovanim datumima
        setDOCC({
          ...dokument,
          datumDokumenta: new Date(dokument.datumDokumenta),
          datumVazenja: new Date(dokument.datumVazenja),
        });

        // Postavi partnera u stanje (uzmi prvi ako je niz)
        setPartnerInfo(Array.isArray(partnerData) ? partnerData[0] : partnerData);

        // Postavi dostavu iz dokumenta
        if (dokument.dostava !== undefined && dokument.dostava !== null) {
          const dostavaParsed = Number(dokument.dostava);
          setDostava(!isNaN(dostavaParsed) ? dostavaParsed : 0);
        } else {
          setDostava(0);
        }
      } catch (error: any) {
        console.error("Greška:", error);
        setError(error.message || "Nepoznata greška");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiAddress, korisnik?.email, korisnik?.idKorisnika, brojDokumenta]);

  useEffect(() => {
    if (docc && docc.stavkeDokumenata && Array.isArray(docc.stavkeDokumenata)) {
      setStavke(docc.stavkeDokumenata);
    }
  }, [docc]);

  const handlePrint = () => window.print();

  const izracunajStavku = (stavka: StavkaDokumenta) => {
    const artikalCena = stavka.cena > 0 ? stavka.cena : stavka.originalnaCena;
    const rabat = Number(partnerInfo?.partnerRabat.rabat ?? 0);
    const cenaPosleRabata = artikalCena * (1 - rabat / 100);
    const cenaBezPDV = cenaPosleRabata;
    const cenaSaPDV = cenaBezPDV * (1 + Number(stavka.pdv) / 100);
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
    if (ukupno.ukupnoSaPDV < minCena) {
      setUkupnoSaDostavom(ukupno.ukupnoSaPDV + (dostava ?? 0));
    } else {
      setUkupnoSaDostavom(ukupno.ukupnoSaPDV);
    }
  }, [ukupno, dostava, minCena]);

  if (isLoading) {
    return <div className="p-10">{t('profile.loading')}</div>;
  }

  if (error) {
    return <div className="p-10 text-red-600">{t('narudzbenica.Greska')} {error}</div>;
  }

  if (!partnerInfo || !docc) {
    return <div className="p-10 text-red-600">{t('stampaj.Nema dostupnih podataka za prikaz dokumenta')}</div>;
  }

  return (
    <div className="mx-auto bg-white text-black p-10 print:p-0">
      <div className="flex items-center justify-between mb-5">
        <Image src="/Dabel-logo-2.png" alt="Dabel Logo" width={150} height={150} />
        <button onClick={handlePrint} className="text-blue-600 underline hover:text-blue-800 no-print">
          {t('brojDokumenta.Štampaj')}
        </button>
      </div>

      {/* INFO */}
      <div className="mt-10 w-full">
        <p className="mt-2 font-semibold">NP</p>
        <p>Nova Pazova, Šesta Industrijska 12</p>

        <div className="flex justify-between gap-8 w-full mt-4">
          {/* KONTAKT OSOBA */}
          <div className="border border-black p-4 w-[48%]">
            <h1 className="font-bold mb-2">{t('stampaj.Kontakt osoba:')}</h1>
            <p>{t('stampaj.Ime i prezime')} {partnerInfo?.partnerDostava?.[0]?.kontaktOsoba || t('stampaj.Nepoznato')}</p>
            <p>{t('stampaj.Mob telefon')} {partnerInfo?.partnerDostava?.[0]?.telefon || t('stampaj.Nepoznato')}</p>
            <p>{t('stampaj.E-mail adresa')} {partnerInfo?.partnerDostava?.[0]?.email || t('stampaj.Nepoznato')}</p>
          </div>

          {/* PARTNER */}
          <div className="border border-black p-4 w-[48%]">
            <p>{t('brojDokumenta.Partner')}: {partnerInfo.idPartnera || "?"}</p>
            <h3 className="mb-2 font-bold">{partnerInfo.ime || t('stampaj.Nepoznato')}</h3>
            <p>{t('kontakt.kontakt-Adresa')} {partnerInfo.adresa}, {partnerInfo.grad}</p>
            <p>{t('stampaj.Mob telefon')} {partnerInfo.telefon}</p>
            <p>{t('kontakt.kontakt-Email')} {partnerInfo.email}</p>
          </div>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">{t('stampaj.Naručeno')}</h3>
          <p>{docc?.brojDokumenta}</p>
        </div>

        <div className="border border-black p-4 mt-4 w-full max-w-full">
          <h3 className="font-semibold mb-1">{t('stampaj.Adresa isporuke')}</h3>
          <p>{docc?.lokacija}</p>
        </div>

        <p className="mt-1">
          {t('stampaj.Datum izdavanja')}{" "}
          {docc?.datumDokumenta &&
            new Date(docc.datumDokumenta).toLocaleString("sr-RS", {
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
        <h2 className="font-bold text-lg mb-2">{t('stampaj.Sadržaj')}</h2>
        <table className="w-full table-fixed border border-black text-sm">
          <thead>
            <tr className="border-b border-black text-xs uppercase bg-transparent print:bg-white">
              <th className="border-r border-black px-2 py-1 w-[40px]">{t('stampaj.Redni broj')}</th>
              <th className="border-r border-black px-2 py-1 text-left w-[200px]">{t('brojDokumenta.Artikal')}</th>
              <th className="border-r border-black px-2 py-1 w-[50px]">{t('stampaj.Jedinica mere')}</th>
              <th className="border-r border-black px-2 py-1 w-[70px]">{t('brojDokumenta.Količina')}</th>
              <th className="border-r border-black px-2 py-1 w-[90px]">{t('stampaj.Cena bez PDV')}</th>
              <th className="border-r border-black px-2 py-1 w-[80px]">{t('stampaj.Rabat')} (%)</th>
              <th className="border-r border-black px-2 py-1 w-[100px]">{t('stampaj.Cena sa Rabatom')}</th>
              <th className="border-r border-black px-2 py-1 w-[70px]">{t('stampaj.PDV')} (%)</th>
              <th className="border-r border-black px-2 py-1 w-[100px]">{t('stampaj.Cena sa PDV')}</th>
              <th className="px-2 py-1 w-[110px]">{t('stampaj.Vrednost')}</th>
            </tr>
          </thead>
          <tbody>
            {stavke.map((stavka, index) => (
              <tr key={index} className="text-center border-t border-black">
                <td className="border-r border-black px-2 py-1">{index + 1}</td>
                <td className="border-r border-black px-2 py-1 text-left">{stavka.nazivArtikla || t('stampaj.Nepoznato')}</td>
                <td className="border-r border-black px-2 py-1">{stavka.jm}</td>
                <td className="border-r border-black px-2 py-1">{stavka.kolicina}</td>
                <td className="border-r border-black px-2 py-1">{stavka.cena.toFixed(2)}</td>
                <td className="border-r border-black px-2 py-1">{partnerInfo?.partnerRabat.rabat ?? 0}%</td>
                <td className="border-r border-black px-2 py-1">
                  {(stavka.cena * (1 - Number(partnerInfo.partnerRabat.rabat) / 100) * Number(stavka.kolicina)).toFixed(2)}
                </td>
                <td className="border-r border-black px-2 py-1">{stavka.pdv} %</td>
                <td className="border-r border-black px-2 py-1">
                  {(stavka.cena * (1 - Number(partnerInfo.partnerRabat.rabat) / 100) * (1 + Number(stavka.pdv) / 100) * Number(stavka.kolicina)).toFixed(2)}
                </td>
                <td className="px-2 py-1">{stavka.ukupnaCena.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ukupno */}
      <div className="text-[15px] mt-4 flex flex-col gap-1 items-end">
        <div className="flex gap-4 w-full justify-end">
          <span>{t('stampaj.Ukupno sa PDV:')}</span>
          <span>{ukupno.ukupnoSaPDV.toFixed(2)} RSD</span>
        </div>
        {ukupno.ukupnoSaPDV < minCena && (
          <div className="flex gap-[32px] w-full justify-end">
            <span>{t('brojDokumenta.Dostava:')}</span>
            <span>
              {dostava === null || dostava === 0
                ? t('brojDokumenta.Besplatna dostava')
                : `${dostava.toLocaleString("sr-RS")} RSD`}
            </span>
          </div>
        )}
        <div className="flex gap-4 w-full text-[16px] font-bold justify-end">
          <span>{t('narudzbenica.Ukupno')}</span>
          <span>
            {(ukupno.ukupnoSaPDV + (ukupno.ukupnoSaPDV < minCena ? (dostava ?? 0) : 0)).toFixed(2)} RSD
          </span>
        </div>
      </div>

      {/* Napomena */}
      <div className="mt-10 space-y-2">
        <p className="text-center">{t('stampaj.Isporučene količine mogu biti manje u zavisnosti od stanja na lageru')}</p>

        {docc?.napomena && docc.napomena.trim().length > 0 && (
          <div className="border border-black w-full">
            <div className="border-b border-black px-2 py-1">
              <p className="font-semibold uppercase text-sm tracking-wide">{t('stampaj.Napomena')}</p>
            </div>
            <div className="px-2 py-2 text-sm space-y-1">
              <p>{docc.napomena}</p>
            </div>
          </div>
        )}

        <div className="border border-black w-full mt-5">
          <div className="border-b border-black px-2 py-1">
            <p className="font-semibold uppercase text-sm tracking-wide">{t('stampaj.Dokument kreirao')}</p>
          </div>
          <div className="px-2 py-1 text-sm space-y-1">
            <p>
              <span>{t('korisnici.Korisničko ime')}:</span> {partnerInfo.komercijalisti?.id}
            </p>
            <p>
              <span>{t('stampaj.Ime i prezime')}</span> {partnerInfo.komercijalisti?.naziv || t('stampaj.Nepoznato')}
            </p>
            <p>
              <span>{t('stampaj.E-mail adresa')}</span> {partnerInfo.komercijalisti?.email}
            </p>
            <p>
              <span>{t('stampaj.Mob telefon')}</span> {partnerInfo.komercijalisti?.telefon}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokumentPage;
