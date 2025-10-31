"use client";

import { ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useTranslations } from "next-intl";
import { dajKorisnikaIzTokena } from "@/lib/auth";

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
  onMessagesChange?: (poruke: string[]) => void;
}

const PrebaciUKorpu = ({
  rows,
  onInvalidSifre,
  onInvalidKolicine,
  onMessagesChange,
}: PrebaciUKorpuProps) => {
  const t = useTranslations();

  const handleAddToCart = async () => {
    onMessagesChange?.([]);

    if (rows.length === 0) {
      onMessagesChange?.([t("PrebaciUKorpu.NemaArtikala")]);
      return;
    }

    try {
      const ids: string[] = [];
      const barKods: string[] = [];

      rows.forEach((r) => {
        if (/^\d{13}$/.test(r.sifra)) barKods.push(r.sifra);
        else ids.push(r.sifra);
      });

      const korisnik = dajKorisnikaIzTokena();
      const idPartnera = korisnik?.idKorisnika;

      const payload = { Ids: ids, BarKod: barKods, partner: idPartnera };
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const { data } = await axios.post(
        `${apiAddress}/api/Artikal/ProveriValidnost`,
        payload
      );

      const artikli: Artikal[] = data.artikli;
      const sveSifre = rows.map((r) => r.sifra);
      const validneSifre = artikli.flatMap((a) => [a.idArtikla, a.barKod]);
      const nevalidne = sveSifre.filter((sifra) => !validneSifre.includes(sifra));
      onInvalidSifre?.(nevalidne);

      let poruke: string[] = [];

      // 🟥 Nepostojeće šifre — odmah obriši
      if (nevalidne.length > 0) {
        poruke = nevalidne.map(
          (sifra) => `Artikal - ${sifra}, nije na stanju.`
        );
        onMessagesChange?.(poruke);
        return;
      }

      // mapa artikala
      const artikalMapa: Record<string, Artikal> = {};
      artikli.forEach((a) => {
        artikalMapa[a.idArtikla] = a;
        artikalMapa[a.barKod] = a;
      });

      const kolicinePoArtiklu: Record<string, number> = {};
      rows.forEach((r) => {
        const a = artikalMapa[r.sifra];
        if (!a) return;
        kolicinePoArtiklu[a.idArtikla] =
          (kolicinePoArtiklu[a.idArtikla] || 0) + r.kolicina;
      });

      const existing = localStorage.getItem("cart");
      let cart: Record<string, { kolicina: number; barKod?: string }> = existing
        ? JSON.parse(existing)
        : {};

      const sifreZaBrisanje: string[] = [];

      for (const a of artikli) {
        const trazena = kolicinePoArtiklu[a.idArtikla] || 0;
        if (trazena <= 0) continue;

        const uKorpi = cart[a.idArtikla]?.kolicina || 0;
        const dostupno = a.kolicina;
        const ukupnoMoguce = Math.max(dostupno - uKorpi, 0);

        // Ako je kolicina 0
        if(dostupno === 0) {
          poruke.push(
            `Artikal id: ${a.idArtikla}, barkod: ${a.barKod} nije dostupan na stanju.`
          )
          sifreZaBrisanje.push(a.idArtikla)
          if(a.barKod) sifreZaBrisanje.push(a.barKod);
          continue;
        }

        // ako je sve već dodato ranije
        if (uKorpi >= dostupno) {
          poruke.push(
            `U korpi se već nalazi maksimalna količina (${dostupno}) artikla sa šifrom ${a.idArtikla}, ne možeš dodati više.`
          );
          sifreZaBrisanje.push(a.idArtikla);
          if (a.barKod) sifreZaBrisanje.push(a.barKod);
          continue;
        }

        // Ako je trazena kolicina dobra, ali pakovanje pravi problem (npr 1337 u magacinu on trazi 1338, samo ce se zakucati na 1340 jer je pakovanje 5)
        if(trazena > ukupnoMoguce) {
          
        }


        // ako je tražena količina veća od preostalog broja na stanju
        if (trazena > ukupnoMoguce) {
          const dodato = ukupnoMoguce;
          const nijeDodat = trazena - ukupnoMoguce;
          if (dodato > 0) {
            cart[a.idArtikla] = {
              kolicina: uKorpi + dodato,
              barKod: a.barKod,
            };
          }
          poruke.push(
            `U korpu je dodat maksimalan broj (${dostupno}) artikla sa šifrom ${a.idArtikla}, dok ${nijeDodat} od ${trazena} nije dodat zato što ih nema na stanju.`
          );
          sifreZaBrisanje.push(a.idArtikla);
          if(a.barKod) sifreZaBrisanje.push(a.barKod);
        } else {
          // sve može da se doda
          cart[a.idArtikla] = {
            kolicina: uKorpi + trazena,
            barKod: a.barKod,
          };
          sifreZaBrisanje.push(a.idArtikla);
          if(a.barKod) sifreZaBrisanje.push(a.barKod);
        }
      }

      // ažuriraj localStorage i pošalji event
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));

      if (poruke.length === 0) {
        poruke.push(t("PrebaciUKorpu.Artikli su uspešno dodati u korpu"));
      }

      onMessagesChange?.(poruke);
      onInvalidKolicine?.([]); // reset
      onInvalidSifre?.(sifreZaBrisanje); // obriši redove koji su obrađeni
    } catch (error) {
      console.error("Greška prilikom dodavanja u korpu:", error);
      onMessagesChange?.(["Došlo je do greške prilikom dodavanja u korpu."]);
    }
  };

  return (
    <Button onClick={handleAddToCart} variant="default" className="cursor-pointer">
      <ShoppingCartIcon className="w-5 h-5 text-white mr-2" />
      {t("PrebaciUKorpu.Prebaci u korpu")}
    </Button>
  );
};

export default PrebaciUKorpu;
