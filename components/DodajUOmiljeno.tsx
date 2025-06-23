'use client';
import { Heart } from "lucide-react";
import { useState } from "react";

interface OmiljeniType {
  idArtikla: string;
  idPartnera: string;
  inicijalniStatus?: boolean;
}

const DodajUOmiljeno = ({ idArtikla, idPartnera, inicijalniStatus = false }: OmiljeniType) => {
  const [lajkovano, setLajkovano] = useState<boolean>(inicijalniStatus);
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

  const toggleOmiljeni = async () => {
    try {
      const noviStatus = lajkovano ? 0 : 1;

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

      setLajkovano(prev => !prev);
    } catch (err) {
      console.error("Greška pri promeni statusa omiljenog:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-[16px]">
        {lajkovano ? "Ukloni iz omiljenog" : "Dodaj u omiljeno"}
      </p>
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
