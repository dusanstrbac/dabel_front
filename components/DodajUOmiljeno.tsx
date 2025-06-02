'use client';
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface OmiljeniType {
    idArtikla: string;
    idPartnera: string | null | undefined;
}

const DodajUOmiljeno = ({ idArtikla }: OmiljeniType) => {
    const [lajkovano, setLajkovano] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const korisnik = dajKorisnikaIzTokena();
    const idPartnera = korisnik?.idKorisnika;

    useEffect(() => {
        const fetchStatus = async () => {
            if (!idPartnera) {
                setLoading(false);
                setError("Korisnik nije prijavljen");
                return;
            }

            try {
                const res = await fetch(`${apiAddress}/api/Partner/OmiljeniArtikli?idPartnera=${idPartnera}`);
                if (!res.ok) throw new Error("Greška prilikom učitavanja omiljenih");

                const omiljeniArtikli: string[] = await res.json();
                setLajkovano(omiljeniArtikli.includes(idArtikla));
            } catch (err) {
                console.error(err);
                setError("Ne mogu da učitam status");
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [idArtikla, idPartnera]);

    const toggleOmiljeni = async () => {
        // Ukloniti kada se implementira middleware
        if (!idPartnera) {
            alert("Morate biti prijavljeni da biste dodali u omiljeno.");
            return;
        }

        try {
            const noviStatus = lajkovano ? 0 : 1;  // Ako je lajkovano, šalji 0 (ukloni), inače 1 (dodaj)

            setLajkovano(prev => !prev);

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
        } catch (err) {
            console.error("Greška:", err);
            setLajkovano(prev => !prev); // Vrati prethodno stanje ako padne
        }
    };

    // 3. UI
    if (loading) return <p className="text-sm text-gray-500">Proveravam status...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;

    const proveriStatus = () => {
        if(lajkovano) {
            return <p className="text-[16px]">Ukloni iz omiljenog</p> 
        } else {
            return <p className="text-[16px]">Dodaj u omiljeno</p>
        }
    }

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