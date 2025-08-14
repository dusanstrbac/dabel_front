import { toast } from "sonner";
import { Button } from "./ui/button";
import { CircleOffIcon, ShoppingCartIcon } from "lucide-react";

interface AddToCartButtonProp {
    id: any,
    className? : string,
    title? : string,
    getKolicina: () => number,
    nazivArtikla: string,
    disabled?: boolean,
    ukupnaKolicina: number,
    onPreAdd?: () => boolean,
    kolZaIzdavanje?: number,
  }

const AddToCartButton = ({ id, className, title, getKolicina, nazivArtikla, disabled=false, ukupnaKolicina, onPreAdd, kolZaIzdavanje}: AddToCartButtonProp) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (onPreAdd && !onPreAdd()) return;


    // Proveri da li je id validan za artikle
    const brojId = Number(id);
    if (isNaN(brojId)) {
      console.error("Nevalidan ID artikla:", id);
      return;
    }

    // Dodati proveru za kolicinu koja je na stanju
    
    // const novaKolicina = getKolicina();
    const existing = localStorage.getItem("cart");
    const novaKolicina = getKolicina ? getKolicina() : ( kolZaIzdavanje || 1);

    let cart: Record<number, { kolicina: number }> = existing ? JSON.parse(existing) : {};

    const trenutnoUKorpi = cart[id]?.kolicina ?? 0;

    if (trenutnoUKorpi + novaKolicina > ukupnaKolicina) {
      toast.error("Nema dovoljno artikala na stanju!", {
        description: `Maksimalno možete dodati još ${Math.max(ukupnaKolicina - trenutnoUKorpi, 0)} kom.`,
      });
      return;
    }

    if (cart[id]) {
        cart[id].kolicina += novaKolicina;
    } else {
        cart[id] = { kolicina: novaKolicina };
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));

    const brojRazlicitih = Object.keys(cart).length;

    toast.success("Uspešno ste dodali artikal u korpu!", {
        description: `Artikal ${nazivArtikla} je uspešno dodat u korpu`,
        descriptionClassName: 'toast-success-description'
    });
};

  return (
    <Button onClick={(e) => handleAddToCart(e) } variant="outline" size="icon" disabled={disabled} className={className}>
    <span>{title}</span>
      {disabled ? (
        <CircleOffIcon className="w-5 h-5 text-red-500 mr-2" />
      ) : (
        <ShoppingCartIcon className="w-5 h-5 text-red-500 mr-2" />
      )}
    </Button>
  );
}

export default AddToCartButton;
