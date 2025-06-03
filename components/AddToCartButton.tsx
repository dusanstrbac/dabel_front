import { toast } from "sonner";
import { Button } from "./ui/button";
import { ShoppingCartIcon } from "lucide-react";

interface AddToCartButtonProp {
    id: any,
    className? : string,
    title? : string,
    getKolicina: () => number,
    nazivArtikla: string,
}

const AddToCartButton = ({ id, className, title, getKolicina, nazivArtikla}: AddToCartButtonProp) => {
  const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();

    console.log(id)
    // Proveri da li je id validan broj
    const brojId = Number(id);
    if (isNaN(brojId)) {
      console.error("Nevalidan ID artikla:", id);
      return;
    }
    
    const kolicina = getKolicina();

    const existing = localStorage.getItem("cart");
    let cart: Record<number, { kolicina: number }> = existing ? JSON.parse(existing) : {};

    if (cart[id]) {
        cart[id].kolicina += kolicina;
    } else {
        cart[id] = { kolicina };
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    //console.log(localStorage);
    window.dispatchEvent(new Event("storage"));

    const brojRazlicitih = Object.keys(cart).length;
    console.log("Broj razlicitih: " + brojRazlicitih);

    toast("Uspešno ste dodali artikal u korpu!", {
        description: `Artikal ${nazivArtikla} je uspešno dodat u korpu`,
    });
};



  return (
    <Button onClick={(e) => handleAddToCart(e)} variant="outline" size="icon" className={className}>
    <span>{title}</span>
      <ShoppingCartIcon className="w-5 h-5 text-red-500 mr-2" />
    </Button>
  );
}

export default AddToCartButton;
