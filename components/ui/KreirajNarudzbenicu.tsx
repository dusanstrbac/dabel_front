import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArtikalType } from "@/types/artikal";
import { cn } from "@/lib/utils";

interface KreirajNarudzbenicuProps {
  artikli: ArtikalType[];
  partner: KorisnikPodaciType;
  idDokumenta: number;
  mestoIsporuke: string;
  napomena: string;
  disabled: boolean;
}


const KreirajNarudzbenicu = ({ artikli, partner, idDokumenta, mestoIsporuke, napomena, disabled }: KreirajNarudzbenicuProps) => {
    const router = useRouter();

    const handleClick = async () => {

        const now = new Date().toISOString();

        // Datum važenja +7 dana
        const datumVazenja = new Date();
        datumVazenja.setDate(datumVazenja.getDate() + 7);

        // Ažuriraj localStorage sa novim ID-jem
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
                // pdv: value.pdv.toString() || "20", -- PRoveriti da li pdv je isti za sve 
                ukupnaCena: Number((Number(value.kolicina) * value.artikalCene[0].cena).toFixed(2)),
            })),
        };

        console.log("Saljem dokument:", JSON.stringify(payload, null, 2));

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
            

            console.log(idDokumenta);
            
            sessionStorage.setItem("narudzbenica-podaci", JSON.stringify({
                idDokumenta,
                artikli,
                partner,
                DatumKreiranja: now,
                mestoIsporuke,
                napomena,
            }));

            console.log("Da vidim samo sta saljemo u /dokument: ", sessionStorage);
            router.push("/dokument");
            } catch (err) {
                console.error("❌ Greška pri slanju POST zahteva:", err);
            }
        };

    return(
        <Button
            onClick={handleClick}
            disabled={disabled}
            className={cn("...", disabled && "opacity-50 cursor-not-allowed")}
        >
            Kreiraj Narudžbenicu
        </Button>
    );
} 

export default KreirajNarudzbenicu;