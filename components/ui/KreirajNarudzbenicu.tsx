import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArtikalType } from "@/types/artikal";
import { cn } from "@/lib/utils";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { toast } from "sonner";

interface KreirajNarudzbenicuProps {
  artikli: ArtikalType[];
  partner: KorisnikPodaciType;
  idDokumenta: number;
  mestoIsporuke: string;
  napomena: string;
  disabled: boolean;
}

const KreirajNarudzbenicu = ({artikli, partner, idDokumenta, mestoIsporuke,
  napomena,
  disabled,
}: KreirajNarudzbenicuProps) => {
  const router = useRouter();
  const [korisnikUdugu, setKorisnikUdugu] = useState(false);

  useEffect(() => {
    const korisnik = dajKorisnikaIzTokena();

    if (korisnik?.finKarta) {
      const { nerealizovano } = korisnik.finKarta;
      if (nerealizovano > 0) {
        setKorisnikUdugu(true);
        toast.error("Ne možete kreirati narudžbenicu, jer imate neplaćene fakture.");
      }
    }
  }, []);

  const handleClick = async () => {
    const now = new Date().toISOString();
    const datumVazenja = new Date();
    datumVazenja.setDate(datumVazenja.getDate() + 7);
    localStorage.setItem("poslednjiIdDokumenta", idDokumenta.toString());

    const payload = {
      idDokumenta,
      tip: "narudzbenica",
      idPartnera: partner.idPartnera,
      brojDokumenta: idDokumenta.toString(),
      idKomercijaliste: partner.komercijalisti.id,
      datumDokumenta: now,
      datumVazenja: datumVazenja.toISOString(),
      lokacija: mestoIsporuke,
      napomena: napomena,
      stavkeDokumenata: artikli.map((value) => ({
        idDokumenta: idDokumenta.toString(),
        idArtikla: value.idArtikla.toString() || "",
        nazivArtikla: value.naziv || "",
        cena: value.artikalCene[0].cena || 0,
        originalnaCena: value.artikalCene[0].cena || 0,
        kolicina: value.kolicina.toString() || "0",
        ukupnaCena: Number(
          (Number(value.kolicina) * value.artikalCene[0].cena).toFixed(2)
        ),
      })),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ADDRESS}/api/Dokument/UpisiDokument`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("❌ Neuspešan POST:", res.status);
        return;
      }

      const data = await res.text();

      sessionStorage.setItem(
        "narudzbenica-podaci",
        JSON.stringify({
          idDokumenta,
          artikli,
          partner,
          DatumKreiranja: now,
          mestoIsporuke,
          napomena,
        })
      );

      router.push("/dokument");
    } catch (err) {
      console.error("❌ Greška pri slanju POST zahteva:", err);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={disabled || korisnikUdugu}
        className={cn("w-full", (disabled || korisnikUdugu) && "opacity-50 cursor-not-allowed")}
      >
        {korisnikUdugu ? "Postoje neplaćene fakture" : "Kreiraj Narudžbenicu"}
      </Button>
    </div>
  );
};

export default KreirajNarudzbenicu;
