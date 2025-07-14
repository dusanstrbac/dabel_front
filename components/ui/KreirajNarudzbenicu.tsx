import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AritkalKorpaType } from "@/types/artikal";
import { cn } from "@/lib/utils";
import { DokumentInfo } from "@/types/dokument";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useEffect } from "react";

interface KreirajNarudzbenicuProps {
  artikli: AritkalKorpaType[];
  partner: KorisnikPodaciType;
  mestoIsporuke: string;
  napomena: string;
  disabled: boolean;
}


const KreirajNarudzbenicu = ({ artikli, partner, mestoIsporuke, napomena, disabled }: KreirajNarudzbenicuProps) => {
    const router = useRouter();


    // useEffect(() => {
    //     const korisnik = dajKorisnikaIzTokena();

    //     if (korisnik?.finKarta) {
    //         const { nerealizovano } = korisnik.finKarta;
    //         if (nerealizovano > 0) {
    //             setKorisnikUdugu(true);
    //             toast.error("Ne možete kreirati narudžbenicu, jer imate neplaćene fakture.");
    //         }
    //     }
    // }, []);


    const handleClick = async () => {


        const now = new Date().toISOString();
        // Datum važenja +7 dana
        const datumVazenja = new Date();
        datumVazenja.setDate(datumVazenja.getDate() + 7);

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

            if (res.ok) {
                // Nakon uspešnog upisa dokumenta, fetchuj najnoviji dokument
                const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
                const idKorisnika = partner.idPartnera;

                try {
                    const resDoc = await fetch(`${apiAddress}/api/Dokument/DajDokumentPoBroju?idPartnera=${idKorisnika}`);
                    if (!resDoc.ok) throw new Error("❌ Greška pri učitavanju dokumenta posle POST-a.");

                    const docData = await resDoc.json();
                    const dokument: DokumentInfo = docData.dokument;

                    console.log("📥 Dobijen dokument iz GET rute:", dokument);

                    sessionStorage.setItem("dokInfo", JSON.stringify({
                        brojDokumenta: dokument.brojDokumenta,
                        datumDokumenta: dokument.datumDokumenta,
                        lokacija: dokument.lokacija,
                        napomena: dokument.napomena,
                    }));

                } catch (err) {
                    console.error("❌ Greška pri fetchovanju dokumenta:", err);
                }
            }

            window.open("/dokument", "_blank");
            

            // ZA BRISANJE IZ SESSION STORAGE NAKON POSTAVLJENE NARUDzBENICE
            const kanal = new BroadcastChannel("dokument-kanal");
            kanal.onmessage = (event) => {
                if (event.data === "dokument_je_ucitan") {
                    sessionStorage.removeItem("korpaPodaci");
                    sessionStorage.removeItem("dokInfo");
                    sessionStorage.removeItem("dostava");
                    sessionStorage.removeItem("ukupnoSaDostavom");
                    localStorage.removeItem("cart");

                    kanal.close();
                    router.push("/");
                }
            };

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