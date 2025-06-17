import { toast } from "sonner"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";

type rezervisiButtonProps = {
    ukupnaCena: number;
};

const RezervisiButton = ({ ukupnaCena } : rezervisiButtonProps ) => {

    const router = useRouter();

    const handleRezervacija = () => {
        if(ukupnaCena > 5000) {
            toast.error("Rezervisanje robe nije moguce jer je cena preko 5.000 RSD.");
            return;
        }
        
        toast("Uspešno ste rezervisali artikle iz korpe.", {
            description: "Trajanje rezervacije je 5 dana."
        });
        router.push('/');
        localStorage.removeItem('cart');

    };

    return (
        <Button 
            className="px-6 py-4 cursor-pointer" 
            onClick={handleRezervacija}>
            
            
            
            Rezerviši
        </Button>
    )
}

export default RezervisiButton;