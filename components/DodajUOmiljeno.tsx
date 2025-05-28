'use client';
import { getCookie } from "cookies-next";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface OmiljeniType {
    idArtikla: string;
    // idPartnera ukloni iz props, jer će se čitati iz cookie
}

const DodajUOmiljeno = ({ idArtikla }: { idArtikla: string }) => {
    const [lajkovano, setLajkovano] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Uvek uzmi idPartnera iz kolačića
    const idPartnera = getCookie("IdKorisnika") as string | undefined;

    useEffect(() => {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

        const fetchStatus = async () => {

            try {
                const res = await fetch(`${apiAddress}/api/Partner/${idPartnera}/OmiljeniArtikli`);
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
        if (!idPartnera) {
            alert("Morate biti prijavljeni da biste dodali u omiljeno.");
            return;
        }

        try {
            const noviStatus = lajkovano ? 0 : 1;

            setLajkovano(prev => !prev);
            
            const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
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

    if (loading) return <p className="text-sm text-gray-500">Proveravam status...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;

    return (
        <div className="flex items-center gap-2">
            <p className="text-[16px]">Dodaj u omiljeno</p>
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
