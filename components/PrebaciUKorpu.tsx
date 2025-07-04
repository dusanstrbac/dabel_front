"use client";

import { toast } from "sonner";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

interface RowItem {
  sifra: string;
  kolicina: number;
}

interface Artikal {
  idArtikla: string;
  barKod: string;
}

interface PrebaciUKorpuProps {
  rows: RowItem[];
}

const PrebaciUKorpu = ({ rows }: PrebaciUKorpuProps) => {
  const handleAddToCart = async () => {
    if (rows.length === 0) {
      toast("Niste uneli nijedan artikal.");
      return;
    }

    try {
      // Razdvajamo unete šifre na ID-ove i barKod-ove
      const ids: string[] = [];
      const barKods: string[] = [];

      rows.forEach((r) => {
        if (/^\d{13}$/.test(r.sifra)) {
          barKods.push(r.sifra); // ako je 13 cifara, tretiraj kao barkod
        } else {
          ids.push(r.sifra); // ostalo tretiraj kao IdArtikla
        }
      });

      const payload = { Ids: ids, BarKod: barKods };
      console.log("Payload koji se šalje:", payload);

      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const { data } = await axios.post(
        `${apiAddress}/api/Artikal/ProveriValidnost`,
        payload
      );

      const artikli: Artikal[] = data.artikli;

      if (!artikli || artikli.length === 0) {
        toast("Nijedan artikal nije pronađen u bazi.");
        return;
      }

      const existing = localStorage.getItem("cart");
      let cart: Record<string, { kolicina: number; barKod?: string }> = existing
        ? JSON.parse(existing)
        : {};

      artikli.forEach(({ idArtikla, barKod }) => {
        // Pronađi odgovarajući unos u rows po ID-ju ili barKodu
        const row = rows.find((r) => r.sifra === idArtikla || r.sifra === barKod);
        if (!row) return;

        if (cart[idArtikla]) {
          cart[idArtikla].kolicina += row.kolicina;
        } else {
          cart[idArtikla] = {
            kolicina: row.kolicina,
            barKod
          };
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));

      toast("Artikli su uspešno dodati u korpu", {
        description: `Ukupno dodatih: ${artikli.length}`,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Greška prilikom poziva:", error.response?.data || error.message);
      } else {
        console.error("Nepoznata greška:", error);
      }
      toast("Došlo je do greške prilikom dodavanja u korpu.");
    }
  };

  return (
    <Button onClick={handleAddToCart} variant="default" className="cursor-pointer">
      <ShoppingCartIcon className="w-5 h-5 text-white mr-2" />
      Prebaci u korpu
    </Button>
  );
};

export default PrebaciUKorpu;
