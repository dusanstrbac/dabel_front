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
  onNedovoljnaKolicina?: (nedovoljni: { sifra: string; trazena: number; dostupna: number }[]) => void;
}

const PrebaciUKorpu = ({ rows, onInvalidSifre, onNedovoljnaKolicina }: PrebaciUKorpuProps) => {
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

      if (!artikli || artikli.length === 0) {
        toast.error(t('PrebaciUKorpu.Greska'), {
          className: 'toast-error',
          description: t('PrebaciUKorpu.NepostojeciArtikal')
        });
        return;
      }

      const sveSifre = rows.map(row => row.sifra);
      const validneSifre = artikli.flatMap(a => [a.idArtikla, a.barKod]);
      const nevalidne = sveSifre.filter(sifra => !validneSifre.includes(sifra));
      onInvalidSifre?.(nevalidne);

      const artikalMapa: Record<string, Artikal> = {};
      artikli.forEach(artikal => {
        artikalMapa[artikal.idArtikla] = artikal;
        artikalMapa[artikal.barKod] = artikal;
      });

      const kolicinePoArtiklu: Record<string, number> = {};
      rows.forEach(row => {
        if (!row.sifra) return;

        const artikal = artikalMapa[row.sifra];
        if (artikal) {
          if (kolicinePoArtiklu[artikal.idArtikla]) {
            kolicinePoArtiklu[artikal.idArtikla] += row.kolicina;
          } else {
            kolicinePoArtiklu[artikal.idArtikla] = row.kolicina;
          }
        }
      });

      const artikliSaNedovoljnomKolicinom = artikli.filter(artikal => {
        const trazenaKolicina = kolicinePoArtiklu[artikal.idArtikla] || 0;
        return trazenaKolicina > artikal.kolicina;
      });

      if (artikliSaNedovoljnomKolicinom.length > 0) {
        const nedovoljni = artikliSaNedovoljnomKolicinom.map(artikal => {
          const trazena = kolicinePoArtiklu[artikal.idArtikla] || 0;
          const originalSifra = rows.find(r => r.sifra === artikal.idArtikla || r.sifra === artikal.barKod)?.sifra || artikal.idArtikla;

          return {
            sifra: originalSifra,
            trazena,
            dostupna: artikal.kolicina
          };
        });

        onNedovoljnaKolicina?.(nedovoljni);

        const poruke = nedovoljni.map((n) =>
          `${t('proizvod.artikalLabel')} ${n.sifra} ${t('PrebaciUKorpu.zahteva')} ${n.trazena}, ${t('PrebaciUKorpu.a dostupno je')} ${n.dostupna}`
        );

        toast.error(t('PrebaciUKorpu.NemaNaStanju'), {
          description: poruke.join("\n"),
        });
        return;
      }

      const existing = localStorage.getItem("cart");
      let cart: Record<string, { kolicina: number; barKod?: string }> = existing
        ? JSON.parse(existing)
        : {};

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
