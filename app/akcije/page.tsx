'use client';
import ListaAkcijskihArtikala from "@/components/ListaAkcijskihArtikala";
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

        // 1. Prvi poziv - uzmi sve artikle u akciji (samo ID-jevi i cena npr.)
        const res = await fetch(`${apiAddress}/api/Artikal/Akcije`);
        if (!res.ok) throw new Error("Greška pri preuzimanju artikala");

        const akcijskiArtikli: { idArtikla: string; cena: number; staraCena: number; }[] = await res.json();

        // 2. Za svaki ID, pozovi API da uzmeš detaljne podatke
        const artikliDetalji = await Promise.all(
          akcijskiArtikli.map(async ({ idArtikla, cena, staraCena }) => {
            try {
              const resArtikal = await fetch(`${apiAddress}/api/Artikal/ArtikalId?ids=${idArtikla}`);
              if (!resArtikal.ok) return null;

              const artikalData = await resArtikal.json();

              // Pretpostavka: artikalData je niz, pa uzimamo prvi element
              const artikal = artikalData[0];
              if (!artikal) return null;

              return {
                ...artikal,
                cena,
                staraCena,
              };
            } catch (err) {
              console.error("Greška prilikom fetchovanja artikla:", err);
              return null;
            }
          })
        );

        // 3. Filtriraj null vrednosti
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
        <ListaAkcijskihArtikala artikli={artikli} />
      )}
    </div>
  );
};

export default Akcije;
