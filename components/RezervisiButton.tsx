"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { dajKorisnikaIzTokena } from "@/lib/auth";

const RezervisiButton = ({ ukupnaCena }: { ukupnaCena: number }) => {
  const router = useRouter();
  const korisnik = dajKorisnikaIzTokena();
  const username = korisnik?.korisnickoIme;
  const idPartnera = korisnik?.idKorisnika;

  const handleRezervacija = async () => {
    if (!idPartnera) {
      toast.error("Nedostaje ID partnera.");
      return;
    }

    if (ukupnaCena > 5000) {
      toast.error("Rezervisanje robe nije moguće jer je cena preko 5.000 RSD.");
      return;
    }

    const cartData = localStorage.getItem("cart");
    if (!cartData) {
      toast.error("Korpa je prazna.");
      return;
    }

    const cart = JSON.parse(cartData);

    try {
      const ids = Object.keys(cart);
      const query = ids.map((id) => `ids=${id}`).join("&");
      const artikalRes = await fetch(`${process.env.NEXT_PUBLIC_API_ADDRESS}/api/Artikal/DajArtikalId?${query}`);
      const artikli = await artikalRes.json();

      const stavkeDokumenata = artikli.map((a: any) => {
        const kolicina = cart[a.idArtikla].kolicina;
        const cena = a.artikalCene?.[0]?.akcija?.cena || a.artikalCene?.[0]?.cena || 0;
        const pdvStopa = parseFloat(a.pdv) || 20; // ili postavi statički ako ne dolazi iz API-ja
        const pdv = (cena * pdvStopa) / 100;
        const ukupnaCena = kolicina * (cena + pdv);

        return {
            id: 0,
            idDokumenta: 0,
            idArtikla: a.idArtikla,
            nazivArtikla: a.naziv,
            cena: Number(cena),
            originalnaCena: Number(cena),
            kolicina: Number(kolicina),
            pdv: Number(pdv),
            ukupnaCena: Number(ukupnaCena),
        };

      });
    console.log("Stavke dokumenata detaljno:");
    stavkeDokumenata.forEach((s: any, i: number) => {
        console.log(`Stavka ${i}:`, s);
    });


      console.log("Stavke dokumenata:", stavkeDokumenata);

      const now = new Date();
      const datumDokumenta = now.toISOString();
      const datumVazenja = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(); // +5 dana

    const dokument = {
        idDokumenta: 0, // <-- broj, ne "0"
        tip: "REZ",
        idPartnera: "0241",
        datumDokumenta: new Date().toISOString(),
        datumVazenja: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // primer: +5 dana
        lokacija: "Online",
        napomena: "Rezervacija putem webshopa",
        stavkeDokumenata: [
            {
            id: 0,
            idDokumenta: 0, // <-- takođe broj
            idArtikla: "3308001",
            nazivArtikla: "...",
            cena: 179,
            originalnaCena: 179,
            kolicina: 1,
            pdv: 35.8,
            ukupnaCena: 17935.8
            }
        ]
    };



      console.log("Dokument koji šaljemo:", JSON.stringify({ dokument }, null, 2));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ADDRESS}/api/Dokument/UpisiDokument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dokument }),
        });

        if (!res.ok) {
        const errorText = await res.text(); // Dodato
        console.error("Greška pri POST-u:", res.status, errorText); // Dodato
        throw new Error("Greška pri kreiranju dokumenta.");
        }


      toast("Uspešno ste rezervisali artikle iz korpe.", {
        description: "Trajanje rezervacije je 5 dana.",
      });

      localStorage.removeItem("cart");
      router.push(`/${username}/profil/rezervacije`);
    } catch (error) {
      console.error(error);
      toast.error("Greška pri slanju rezervacije.");
    }
  };

  return (
    <Button className="px-6 py-4 cursor-pointer" onClick={handleRezervacija}>
      Rezerviši
    </Button>
  );
};

export default RezervisiButton;
