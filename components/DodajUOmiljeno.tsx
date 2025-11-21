'use client';
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface OmiljeniType {
  idArtikla: string;
  inicijalniStatus?: boolean;
}

const DodajUOmiljeno = ({ idArtikla, inicijalniStatus = false }: OmiljeniType) => {
  const t = useTranslations('heart');
  const [lajkovano, setLajkovano] = useState<boolean>(inicijalniStatus);
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const IdKorisnika = dajKorisnikaIzTokena()?.idKorisnika;
  
  const toggleOmiljeni = async () => {
    try {
      const noviStatus = lajkovano ? 0 : 1;

      const res = await fetch(`${apiAddress}/api/Partner/OmiljeniArtikal/Toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdKorisnika,
          idArtikla,
          status: noviStatus
        })
      });
      
      if (!res.ok) {
        throw new Error(t('neuspesanZahtev'));
      }

      setLajkovano(prev => !prev);
    } catch (err) {
      console.error(t('greskaPromenaStatusa'), err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-[16px]">
        {lajkovano ? t('ukloniOmiljeno') : t('dodajOmiljeno')}
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
