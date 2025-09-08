import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div>
      <Header/>
      <CartProvider>
        {children}
      </CartProvider>
    </div>
  );
}