import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface KreirajNarudzbenicuProps {
  artikli: any[];
  partner: any;
  imeiPrezime: string;
  mestoIsporuke: string;
  grad: string;
  telefon: string;
  email: string;
  valid: () => boolean;
}

const KreirajNarudzbenicu = ({ artikli, partner, imeiPrezime, mestoIsporuke, grad, telefon, email, valid }: KreirajNarudzbenicuProps) => {
    const router = useRouter();

    const handleClick = () => {
        console.log("✅ Kreiranje narudžbenice...");
        console.log("🧾 Artikli:", artikli);
        console.log("👤 Partner:", partner);
        console.log("📇 Kontakt osoba:", imeiPrezime);
        console.log("📦 Mesto isporuke:", mestoIsporuke, grad, telefon, email);
        
        const validno = valid();
        if(!validno) return;

        // Sve podatke pakujemo u objektu
        const payload = {
            artikli,
            partner,
            imeiPrezime,
            mestoIsporuke,
            grad,
            telefon,
            email,
        };

        sessionStorage.setItem("narudzbenica-podaci", JSON.stringify(payload));
        router.push("/dokument");
    };

    return(
        <Button onClick={handleClick}>
            Kreiraj Narudžbenicu
        </Button>
    );
} 

export default KreirajNarudzbenicu;