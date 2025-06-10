'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { ArtikalType } from "@/types/artikal";
import { useEffect, useState } from "react";

const Akcije = () => {
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchAkcijeArtikli = async () => {
    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const res = await fetch(`${apiAddress}/api/Artikal/Akcije`);
      const akcijskiArtikli: { idArtikla: string; cena: number; staraCena: number; }[] = await res.json();

      if (!res.ok) throw new Error("Greška pri preuzimanju artikala");

      
      const artikliDetalji = await Promise.all(
        akcijskiArtikli.map(async ({ idArtikla, cena, staraCena }) => {
          try {
            const resArtikal = await fetch(`${apiAddress}/api/Artikal/DajArtikalId?ids=${idArtikla}`);
            const artikalData = await resArtikal.json();
            const artikal = artikalData[0];

            if (!resArtikal.ok) return null;
            if (!artikal) return null;

            // Dodajemo akcijsku cenu, ukoliko postoji
            const akcija = {
              cena,
              staraCena,
            };

            return {
              ...artikal,
              cena,  // Regularna cena
              staraCena,
              akcija,  // Akcija je sada deo artikla
            };
          } catch (err) {
            console.error("Greška prilikom fetchovanja artikla:", err);
            return null;
          }
        })
      );
      const validArtikli = artikliDetalji.filter((a) => a !== null);

      setArtikli(validArtikli as ArtikalType[]);
    } catch (err: any) {
      setError(err.message || "Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  fetchAkcijeArtikli();
}, []);

  return (
    <div className="lg:p-4">
      <div className="w-full mx-auto flex justify-between items-center p-2">
        <h1 className="font-bold text-3xl">Akcije</h1>
        <SortiranjeButton artikli={artikli} setArtikli={setArtikli}/>
      </div>

      {loading ? (
        <p className="text-center mt-4">Učitavanje...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <ListaArtikala artikli={artikli} />
      )}
    </div>
  );
};

export default Akcije;
