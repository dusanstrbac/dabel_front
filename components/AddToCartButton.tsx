import { useCart } from "@/contexts/CartContext";
import { Button } from "./ui/button"


const AddToCartButton = () => {

    const { incrementCart } = useCart();

    return (
        <Button onClick={incrementCart} className="ml-6 cursor-pointer">
            Dodaj u korpu
        </Button>
    )
}

export default AddToCartButton;