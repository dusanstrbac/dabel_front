// components/AddToCartButton.tsx
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
  const handleAddToCart = () => {
    const kolicina = getKolicina();

    const existing = localStorage.getItem("cart");
    let cart: Record<number, { kolicina: number }> = existing ? JSON.parse(existing) : {};

    if (cart[id]) {
        cart[id].kolicina += kolicina;
    } else {
        cart[id] = { kolicina };
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    toast("Uspešno ste dodali artikal u korpu!", {
        description: `Artikal ${nazivArtikla} je uspešno dodat u korpu`,
    });
};


  return (
    <Button onClick={handleAddToCart} variant="outline" size="icon" className={className}>
    <span>{title}</span>
      <ShoppingCartIcon color="red" />
    </Button>
  );
}

export default AddToCartButton;