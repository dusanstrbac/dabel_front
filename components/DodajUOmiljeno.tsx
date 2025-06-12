'use client';

import { dajKorisnikaIzTokena } from "@/lib/auth";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface OmiljeniType {
  idArtikla: string;
  idPartnera: string;
}

const DodajUOmiljeno = ({ idArtikla }: OmiljeniType) => {
  const [lajkovano, setLajkovano] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const korisnik = dajKorisnikaIzTokena();
  const idPartnera = korisnik?.idKorisnika

  useEffect(() => {
    const fetchStatus = async () => {
      if (!korisnik?.idKorisnika) {
        setLoading(false);
        setError("Korisnik nije prijavljen");
        return;
      }

      try {
        const res = await fetch(
          `${apiAddress}/api/Partner/DajOmiljeneArtikle?idPartnera=${korisnik?.idKorisnika}`
        );

        if (!res.ok) {
          console.error(`Greška pri odgovoru od API: ${res.statusText}`);
          throw new Error("Greška prilikom učitavanja omiljenih");
        }

        const data = await res.json();

        // Ako API vraća objekat sa poljem 'artikli'
        const omiljeniArtikli: string[] = data.artikli.map(
          (artikal: any) => artikal.idArtikla
        ); // Pretpostavljam da 'idArtikla' postoji u svakom artiklu

        // Proveri da li je artikal već lajkovan
        setLajkovano(omiljeniArtikli.includes(idArtikla));
      } catch (err) {
        console.error("Greška pri učitavanju omiljenih:", err);
        setError("Ne mogu da učitam status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [idArtikla, korisnik?.idKorisnika]);

  const toggleOmiljeni = async () => {
    if (!korisnik?.idKorisnika) {
      alert("Morate biti prijavljeni da biste dodali u omiljeno.");
      return;
    }

    try {
      const noviStatus = lajkovano ? 0 : 1;

      // Pokušaj da izvršiš API poziv pre nego što promeniš stanje
      const res = await fetch(`${apiAddress}/api/Partner/OmiljeniArtikal/Toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPartnera,
          idArtikla,
          status: noviStatus
        })
      });

      if (!res.ok) {
        throw new Error("Neuspešan zahtev");
      }

      // Ako API poziv uspe, onda menjaš stanje
      setLajkovano(prev => !prev); // Toggle status lokalno
    } catch (err) {
      console.error("Greška pri promeni statusa omiljenog:", err);
      // Ako se desi greška, nemoj promeniti stanje
      setLajkovano(prev => prev); 
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Proveravam status...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  const proveriStatus = () => {
    return lajkovano ? (
      <p className="text-[16px]">Ukloni iz omiljenog</p>
    ) : (
      <p className="text-[16px]">Dodaj u omiljeno</p>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {proveriStatus()}
      <Heart
        width={25}
        height={25}
        onClick={toggleOmiljeni}
        className="cursor-pointer transition-all duration-200"
        color={lajkovano ? "red" : "gray"}
        fill={lajkovano ? "red" : "none"}
      />
    </div>
  );
};

export default DodajUOmiljeno;
