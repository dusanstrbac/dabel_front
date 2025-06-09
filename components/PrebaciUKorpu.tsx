"use client";

import { toast } from "sonner";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

interface RowItem {
  sifra: string;
  kolicina: number;
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
      const sifre = rows.map((r) => r.sifra);

      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const { data } = await axios.post(`${apiAddress}/api/Artikal/ProveriValidnost`, rows.map(row => row.sifra));

      const validneSifre: string[] = data.validneSifre;

      if (!validneSifre || validneSifre.length === 0) {
        toast("Nijedan artikal nije pronađen u bazi.");
        return;
      }

      const validniRows = rows.filter((row) =>
        validneSifre.includes(row.sifra)
      );

      const existing = localStorage.getItem("cart");
      let cart: Record<string, { kolicina: number }> = existing
        ? JSON.parse(existing)
        : {};

      validniRows.forEach(({ sifra, kolicina }) => {
        if (cart[sifra]) {
          cart[sifra].kolicina += kolicina;
        } else {
          cart[sifra] = { kolicina };
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));

      toast("Artikli su uspešno dodati u korpu", {
        description: `Ukupno dodatih: ${validniRows.length}`,
      });
    } catch (error) {
      console.error("Greška prilikom poziva:", error);
      toast("Došlo je do greške prilikom dodavanja u korpu.");
    }
  };

  return (
    <Button onClick={handleAddToCart} variant="default">
      <ShoppingCartIcon className="w-5 h-5 text-white mr-2" />
      Prebaci u korpu
    </Button>
  );
};

export default PrebaciUKorpu;
