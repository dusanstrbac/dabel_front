'use client';
import { useEffect, useState } from "react";
import ListaArtikala from "@/components/ListaArtikala";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getCookie } from "cookies-next";

type ArtikalType = {
    id: string;
    naziv: string;
    cena: number;
    slika: string;
};

const Heart = () => {
    const [artikli, setArtikli] = useState<ArtikalType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchOmiljeni = async () => {
    const idPartnera = getCookie("IdKorisnika") as string | undefined;
    if (!idPartnera) {
        setError("Korisnik nije prijavljen");
        setLoading(false);
        return;
    }

    try {
        const res = await fetch(`http://localhost:5128/api/Partner/${idPartnera}/OmiljeniArtikli`);
        if (!res.ok) throw new Error(`Greška pri učitavanju omiljenih artikala: ${res.statusText}`);

        const data: { id: string }[] = await res.json();

        const artikliIzBaze = await Promise.all(
            data.map(async (artikal) => {
                try {
                    const artikalIzBazeRes = await fetch(`http://localhost:5128/api/Artikal/ArtikalId?id=${artikal}`);

                    if (!artikalIzBazeRes.ok) {
                        return null;
                    }

                    const artikalData = await artikalIzBazeRes.json();

                    // Proveri da li artikalData sadrži podatke
                    return artikalData && artikalData.length > 0 ? artikalData[0] : null;
                } catch (error) {
                    console.error("Greška prilikom fetchovanja artikla:", error);
                    return null;
                }
            })
        );

        // Filtriramo null vrednosti
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

    // Funkcije za sortiranje
    const sortirajRastuce = () => {
        const sorted = [...artikli].sort((a, b) => a.cena - b.cena);
        setArtikli(sorted);
    };

    const sortirajOpadajuce = () => {
        const sorted = [...artikli].sort((a, b) => b.cena - a.cena);
        setArtikli(sorted);
    };

    if (loading) return <p>Učitavanje omiljenih artikala...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="">
            <div className="w-full mx-auto flex justify-between items-center p-2">
                <h1 className="font-bold text-3xl mb-[10px]">Omiljeni Artikli</h1>

                <Popover>
                    <PopoverTrigger asChild>
                        <button className="text-sm font-semibold border px-3 py-1 rounded-md hover:bg-gray-100">
                            Sortiraj
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44">
                        <div className="flex flex-col gap-2">
                            <button onClick={sortirajRastuce} className="text-left hover:underline">
                                Cena: Rastuće
                            </button>
                            <button onClick={sortirajOpadajuce} className="text-left hover:underline">
                                Cena: Opadajuće
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <ListaArtikala artikli={artikli} />            
            </div>
        </div>
    );
};

export default Heart;
