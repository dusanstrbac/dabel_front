"use client";

import { toast } from "sonner";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useTranslations } from "next-intl";

interface RowItem {
  sifra: string;
  kolicina: number;
}

interface Artikal {
  idArtikla: string;
  barKod: string;
  kolicina: number;
}

interface PrebaciUKorpuProps {
  rows: RowItem[];
  onInvalidSifre?: (nevalidne: string[]) => void;
  onInvalidKolicine?: (nevalidneKol: string[]) => void;
}

const PrebaciUKorpu = ({ rows, onInvalidSifre, onInvalidKolicine }: PrebaciUKorpuProps) => {

  const t = useTranslations();

  const handleAddToCart = async () => {
    if (rows.length === 0) {
      toast.error(t('PrebaciUKorpu.Greska'), {
        className: 'toast-error',
        description: t('PrebaciUKorpu.NemaArtikala')
      });
      return;
    }

    try {
      // Razdvajamo unete šifre na ID-ove i barKod-ove
      const ids: string[] = [];
      const barKods: string[] = [];

      rows.forEach((r) => {
        if (/^\d{13}$/.test(r.sifra)) {
          barKods.push(r.sifra);
        } else {
          ids.push(r.sifra);
        }
      });

      const payload = { Ids: ids, BarKod: barKods };

      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const { data } = await axios.post(
        `${apiAddress}/api/Artikal/ProveriValidnost`,
        payload
      );

      const artikli: Artikal[] = data.artikli;

      const sveSifre = rows.map(row => row.sifra);
      const validneSifre = artikli.flatMap(a => [a.idArtikla, a.barKod]);
      const nevalidne = sveSifre.filter(sifra => !validneSifre.includes(sifra));      

      // Pošalji sve šifre kao nevalidne
        onInvalidSifre?.(nevalidne);

      if (!artikli || artikli.length === 0) {
        toast.error(t('PrebaciUKorpu.Greska'), {
        className: 'toast-error',
        description: t('PrebaciUKorpu.NepostojeciArtikal')
      });
        return;
      }

      // ✅ KREIRAJ MAPU ZA BRZO PRONALAŽENJE ARTIKALA PO ŠIFRI
      const artikalMapa: Record<string, Artikal> = {};
      artikli.forEach(artikal => {
        // Mapiraj po ID-u artikla
        artikalMapa[artikal.idArtikla] = artikal;
        // Mapiraj i po barkodu
        artikalMapa[artikal.barKod] = artikal;
      });

      // ✅ GRUPIŠI KOLIČINE PO STVARNOM ID-U ARTIKLA
      const kolicinePoArtiklu: Record<string, number> = {};

      rows.forEach(row => {
        if (!row.sifra) return;
        
        // Pronađi koji artikal odgovara ovoj šifri (bilo ID ili barkod)
        const artikal = artikalMapa[row.sifra];
        if (artikal) {
          // Koristi idArtikla kao jedinstveni ključ
          if (kolicinePoArtiklu[artikal.idArtikla]) {
            kolicinePoArtiklu[artikal.idArtikla] += row.kolicina;
          } else {
            kolicinePoArtiklu[artikal.idArtikla] = row.kolicina;
          }
        }
      });

      // ✅ Provera zaliha - sada koristi kolicinePoArtiklu
      const artikliSaNedovoljnomKolicinom = artikli.filter(artikal => {
        const trazenaKolicina = kolicinePoArtiklu[artikal.idArtikla] || 0;
        return trazenaKolicina > artikal.kolicina;
      });

      // 🔹 vraćamo korisničke šifre koje su unesene u rows, a koje imaju manju zalihu
      const nevalidneKol = rows
        .filter(r => {
          const artikal = artikli.find(
            a => a.idArtikla === r.sifra || a.barKod === r.sifra
          );
          return artikal && r.kolicina > artikal.kolicina;
        })
        .map(r => r.sifra);

      onInvalidKolicine?.(nevalidneKol);


      if (artikliSaNedovoljnomKolicinom.length > 0) {
        const poruke = artikliSaNedovoljnomKolicinom.map((artikal) => {
          const trazenaKolicina = kolicinePoArtiklu[artikal.idArtikla] || 0;
          return `${t('proizvod.artikalLabel')} ${artikal.idArtikla} ${t('PrebaciUKorpu.zahteva')} ${trazenaKolicina}, ${t('PrebaciUKorpu.a dostupno je')} ${artikal.kolicina}`;
        });

        toast.error(t('PrebaciUKorpu.NemaNaStanju'), {
          description: poruke.join("\n"),
        });
        return;
      }

      // ✅ DODAVANJE U KORPU
      const existing = localStorage.getItem("cart");
      let cart: Record<string, { kolicina: number; barKod?: string }> = existing
        ? JSON.parse(existing)
        : {};

      // Prođi kroz sve artikle i dodaj/azuriraj korpu
      artikli.forEach(artikal => {
        const trazenaKolicina = kolicinePoArtiklu[artikal.idArtikla] || 0;
        if (trazenaKolicina > 0) {
          if (cart[artikal.idArtikla]) {
            cart[artikal.idArtikla].kolicina += trazenaKolicina;
          } else {
            cart[artikal.idArtikla] = {
              kolicina: trazenaKolicina,
              barKod: artikal.barKod,
            };
          }
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));

      toast.success(t('PrebaciUKorpu.Artikli su uspešno dodati u korpu'), {
        description: `${t('PrebaciUKorpu.Ukupno dodatih')} ${Object.keys(kolicinePoArtiklu).length}`,
        descriptionClassName: "toast-success-description"
      });

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Greška prilikom poziva:", error.response?.data || error.message);
      } else {
        console.error("Nepoznata greška:", error);
      }
    }
  };

  return (
    <Button onClick={handleAddToCart} variant="default" className="cursor-pointer">
      <ShoppingCartIcon className="w-5 h-5 text-white mr-2" />
      {t('PrebaciUKorpu.Prebaci u korpu')}
    </Button>
  );
};

export default PrebaciUKorpu;

