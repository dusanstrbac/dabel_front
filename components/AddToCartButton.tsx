import { useCart } from "@/contexts/CartContext";
import { Button } from "./ui/button"
import { ShoppingCartIcon } from "lucide-react";

const AddToCartButton = () => {

    const { incrementCart } = useCart();

    return (
        <Button onClick={incrementCart} variant="outline" size="icon">
            <ShoppingCartIcon color='red' />
        </Button>
    )
}

export default AddToCartButton;