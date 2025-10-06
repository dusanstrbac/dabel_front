import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
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
    const t = useTranslations();

    const handleClick = () => {
        const validno = valid();
        if(!validno) return;

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