import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AritkalKorpaType } from "@/types/artikal";
import { cn } from "@/lib/utils";
import { DokumentInfo } from "@/types/dokument";
import { useState } from "react";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface KreirajNarudzbenicuProps {
    artikli: AritkalKorpaType[];
    partner: KorisnikPodaciType;
    mestoIsporuke: string;
    napomena: string;
    dostava: number;
    disabled: boolean;
}


    const KreirajNarudzbenicu = ({ artikli, partner, mestoIsporuke, napomena, disabled, dostava }: KreirajNarudzbenicuProps) => {
        const router = useRouter();
        const t = useTranslations();
        const [korisnikUdugu, setKorisnikUdugu] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

        // useEffect(() => {
        //     const korisnik = dajKorisnikaIzTokena();

        //     if (korisnik?.finKarta) {
        //     const { nerealizovano } = korisnik.finKarta;
        //     if (nerealizovano > 0) {
        //         setKorisnikUdugu(true);
        //         toast.error("Ne možete kreirati narudžbenicu, jer imate neplaćene fakture.");
        //     }
        //     }
        // }, []);


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

<<<<<<< HEAD
        t('kreirajNarudzbenicu.Kreiranje')
=======
        const sifraIsporuke = partner?.partnerDostava[0].sifra;

>>>>>>> 251c921075e53f6954a182ca5e9c9944d4e3f177
        const handleClick = async () => {
            setIsLoading(true);
            toast.info(t('kreirajNarudzbenicu.⏳ Kreiranje narudžbenice je u toku'));

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
                lokacija: sifraIsporuke, 
                napomena: napomena,
                dostava: dostava,
                stavkeDokumenata: artikli.map((value) => ({
                    idArtikla: value.idArtikla.toString() || "",
                    nazivArtikla: value.naziv || "",
                    jm: value.jm,
                    cena: value.koriscenaCena.toString() || "0",
                    originalnaCena: value.originalnaCena.toString() || value.koriscenaCena.toString(),                    
                    kolicina: value.kolicina.toString() || "0",
                    pdv: value.pdv.toString() || "20",
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
                    toast.error(t('kreirajNarudzbenicu.❌ Greška: server nije prihvatio zahtev'));
                    console.error(t('kreirajNarudzbenicu.❌ Neuspešan POST'), res.status);
                    return;
                }

                if (res.ok) {
                    toast.success(t('kreirajNarudzbenicu.✅ Narudžbenica uspešno poslata!'));

                    // Nakon uspešnog upisa dokumenta, fetchuj najnoviji dokument
                    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
                    const korisnik = dajKorisnikaIzTokena();

                    try {
                        const resDoc = await fetch(`${apiAddress}/api/Dokument/DajDokumentPoBroju?idPartnera=${korisnik?.partner}&idKorisnika=${korisnik?.idKorisnika}`);
                        if (!resDoc.ok) throw new Error("❌ Greška pri učitavanju dokumenta posle POST-a.");

                        const docData = await resDoc.json();
                        const dokument: DokumentInfo = docData.dokument;
                        sessionStorage.setItem("dokInfo", JSON.stringify({
                            brojDokumenta: dokument.brojDokumenta,
                            datumDokumenta: dokument.datumDokumenta,
                            lokacija: dokument.lokacija,
                            napomena: dokument.napomena,
                            dostava: dokument.dostava
                        }));

                        toast.success(t('kreirajNarudzbenicu.📄 Dokument je uspešno sačuvan u sistemu'));

                    } catch (err) {
                        toast.error("❌ Greška pri učitavanju dokumenta");
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
                    toast.error("⚠️ Došlo je do greške pri slanju narudžbenice.");
                    console.error("❌ Greška pri slanju POST zahteva:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            

        return (
            <div className="space-y-2">
            <Button
                onClick={handleClick}
                disabled={disabled || korisnikUdugu}
                className={cn("w-full", (disabled || korisnikUdugu) && "opacity-50 cursor-not-allowed")}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        {/* Choose one of the spinner options below */}
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('kreirajNarudzbenicu.Kreiranje')}
                    </div>
                ) : korisnikUdugu ? (
                    t('kreiranjeNarudzbenice.Postoje neplaćene fakture')
                ) : (
                    t('kreirajNarudzbenicu.Kreiraj Narudžbenicu')
                )}
            </Button>
            </div>
        );
    } 

    export default KreirajNarudzbenicu;