import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface KreirajNarudzbenicuProps {
  artikli: any[];
  partner: any;
  mestoIsporuke: string;
  grad: string;
  telefon: string;
  email: string;
}


const KreirajNarudzbenicu = ({ artikli, partner, mestoIsporuke, grad, telefon, email }: KreirajNarudzbenicuProps) => {
    
    const router = useRouter();

    const handleClick = () => {
        console.log("✅ Kreiranje narudžbenice...");
        console.log("🧾 Artikli:", artikli);
        console.log("👤 Partner:", partner);
        console.log("📦 Mesto isporuke:", mestoIsporuke, grad, telefon, email);

        // Sve podatke pakujemo u objektu
        const payload = {
            artikli,
            partner,
            mestoIsporuke,
            grad,
            telefon,
            email,
        };

        // Lokacija privremenog slanja - možeš koristiti sessionStorage ili query parametre
        sessionStorage.setItem("narudzbenica-podaci", JSON.stringify(payload));

        // Navigacija ka novoj stranici
        router.push("/dokument"); // Napraviš kasnije tu stranicu
    };
    

    const isprazniKorpu = () => {
        //OVO CE DA RADIMO NA STRANICI!!!
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("storage"));//za izbacivanje broja na ikonici korpe posle brisanja artikala iz korpe
        console.log("🗑️ Korpa je ispražnjena iz localStorage-a.");
        // setArticleList([]);
        // setQuantities([]);
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