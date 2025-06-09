'use client';
import { useEffect, useState } from "react";
import ListaArtikala from "@/components/ListaArtikala";
import { ArtikalType } from "@/types/artikal";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import SortiranjeButton from "@/components/SortiranjeButton";

const Heart = () => {
    const [artikli, setArtikli] = useState<ArtikalType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchOmiljeni = async () => {
            const korisnik = dajKorisnikaIzTokena();
            const idPartnera = korisnik?.idKorisnika;
            

            try {
                const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
                const res = await fetch(`${apiAddress}/api/Partner/OmiljeniArtikli?idPartnera=${idPartnera}`);
                const data: { id: string }[] = await res.json();
                
                if (!res.ok) throw new Error(`Greška pri učitavanju omiljenih artikala: ${res.statusText}`);

                const artikliIzBaze = await Promise.all(
                    data.map(async (artikal) => {
                        try {
                            const artikalIzBazeRes = await fetch(`${apiAddress}/api/Artikal/DajArtikalId?ids=${artikal}`);
                            if (!artikalIzBazeRes.ok) {
                                return null;
                            }

                            const artikalData = await artikalIzBazeRes.json();

                            return artikalData && artikalData.length > 0 ? artikalData[0] : null;
                        } catch (error) {
                            console.error("Greška prilikom fetchovanja artikla:", error);
                            return null;
                        }
                    })
                );
            // Filtriranje null vrednosti
            const validArtikli = artikliIzBaze.filter(artikal => artikal !== null);
            setArtikli(validArtikli as ArtikalType[]);

            } catch (err) {
            console.error("Greška pri učitavanju omiljenih artikala:", err);
            setError("Trenutno nemate omiljene artikle");

            } finally {
            setLoading(false);
            }
        };
        fetchOmiljeni();
    }, []);

    if (loading) return <p>Učitavanje omiljenih artikala...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="">
            <div className="w-full mx-auto flex justify-between items-center p-2">
                <h1 className="font-bold text-3xl mb-[10px]">Omiljeni Artikli</h1>
                <SortiranjeButton artikli={artikli} setArtikli={setArtikli} />
            </div>
            <div>
                <ListaArtikala artikli={artikli} />            
            </div>
        </div>
    );
};

export default Heart;
