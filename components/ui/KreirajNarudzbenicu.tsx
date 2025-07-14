import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AritkalKorpaType } from "@/types/artikal";
import { cn } from "@/lib/utils";

interface KreirajNarudzbenicuProps {
  artikli: AritkalKorpaType[];
  partner: KorisnikPodaciType;
  mestoIsporuke: string;
  napomena: string;
  disabled: boolean;
}


const KreirajNarudzbenicu = ({ artikli, partner, mestoIsporuke, napomena, disabled }: KreirajNarudzbenicuProps) => {
    const router = useRouter();

    const handleClick = async () => {

        const now = new Date().toISOString();

        // Datum važenja +7 dana
        const datumVazenja = new Date();
        datumVazenja.setDate(datumVazenja.getDate() + 7);
        const ceneSaPDV = JSON.parse(sessionStorage.getItem("cene-session-storage") || "{}");

        const payload = {
            tip: "narudzbenica",
            idPartnera: partner.idPartnera,
            idKomercijaliste: partner.komercijalisti.id,
            datumDokumenta: now,
            datumVazenja: datumVazenja.toISOString(),
            lokacija: mestoIsporuke,
            napomena: napomena,
            stavkeDokumenata: artikli.map((value) => ({
                idArtikla: value.idArtikla.toString() || "",
                nazivArtikla: value.naziv || "",
                cena: value.koriscenaCena,
                originalnaCena: value.originalnaCena,
                kolicina: value.kolicina.toString() || "0",
                pdv: value.pdv.toString() || "20",
                ukupnaCena: value.IznosSaPDV,
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


            const kanal = new BroadcastChannel("dokument-kanal");
            kanal.onmessage = (event) => {
                if (event.data === "dokument_je_ucitan") {
                    sessionStorage.removeItem("korpaPodaci");
                    sessionStorage.removeItem("dostava");
                    sessionStorage.removeItem("ukupnoSaDostavom");
                    localStorage.removeItem("cart");
                    kanal.close();
                    router.push("/");
                }
            };

            window.open("/dokument", "_blank"); 
            router.push("/");

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