import { toast } from "sonner";
import { Button } from "./ui/button";
import { CircleOffIcon, ShoppingCartIcon } from "lucide-react";
import {useTranslations} from 'next-intl';

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
  const t = useTranslations();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (onPreAdd && !onPreAdd()) return;


    // Proveri da li je id validan za artikle
    const brojId = Number(id);
    if (isNaN(brojId)) {
      console.error(t('proizvod.nevalidanID'), id);
      return;
    }

    // Dodati proveru za kolicinu koja je na stanju
    
    // const novaKolicina = getKolicina();
    const existing = localStorage.getItem("cart");
    const novaKolicina = getKolicina ? getKolicina() : ( kolZaIzdavanje || 1);

    let cart: Record<number, { kolicina: number }> = existing ? JSON.parse(existing) : {};

    const trenutnoUKorpi = cart[id]?.kolicina ?? 0;

    if (trenutnoUKorpi + novaKolicina > ukupnaKolicina) {
      toast.error(t('proizvod.nedovoljnoNaStanju'), {
        description: `${t('proizvod.maks')} ${t('proizvod.jos')} ${Math.max(ukupnaKolicina - trenutnoUKorpi, 0)} ${t('proizvod.kom')}`,
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

    toast.success(t('proizvod.dodatUspesno'), {
        description: `${t('proizvod.artikalLabel')} ${nazivArtikla} ${t('proizvod.jeDodatUspesno')}`,
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
