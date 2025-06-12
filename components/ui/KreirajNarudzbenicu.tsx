import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface KreirajNarudzbenicuProps {
  artikli: any[];
  idDokumenta: number;
  idPartner: string;
  imeiPrezime: string;
  mestoIsporuke: string;
  grad: string;
  telefon: string;
  email: string;
  valid: () => boolean;
}


const KreirajNarudzbenicu = ({ artikli, idDokumenta, idPartner, imeiPrezime, mestoIsporuke, grad, telefon, email, valid }: KreirajNarudzbenicuProps) => {
    const router = useRouter();

    const handleClick = async () => {
        const validno = valid();
        if (!validno) return;

        const now = new Date().toISOString();

        // Datum važenja +7 dana
        const datumVazenja = new Date();
        datumVazenja.setDate(datumVazenja.getDate() + 7);

        // Ažuriraj localStorage sa novim ID-jem
        localStorage.setItem("poslednjiIdDokumenta", idDokumenta.toString());

        const payload = {
            idDokumenta,
            tip: "narudzbenica",
            idPartnera: idPartner,
            brojDokumenta: idDokumenta.toString(),
            idKomercijaliste: idPartner,
            datumDokumenta: now,
            datumVazenja: datumVazenja.toISOString(),
            stavkeDokumenata: artikli.map((value) => ({
                idDokumenta: idDokumenta.toString(),
                idArtikla: value.id.toString() || "",
                nazivArtikla: value.naziv || "",
                cena: value.cena || 0,
                originalnaCena: value.originalnaCena || 0,
                kolicina: value.kolicina.toString() || "0",
                pdv: value.pdv.toString() || "20",
                ukupnaCena: Number((value.kolicina * value.cena).toFixed(2)),
            })),
        };

        console.log("Saljem dokument:", JSON.stringify(payload, null, 2));

        try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_ADDRESS}/UpisiDokument`, {
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
            console.log("✅ Uspešno poslato:", data);
            
            router.push("/dokument");
            } catch (err) {
                console.error("❌ Greška pri slanju POST zahteva:", err);
            }

        };



    return(
        <Button
            onClick={handleClick}
        >
            Kreiraj Narudžbenicu
        </Button>
    );
} 

export default KreirajNarudzbenicu;