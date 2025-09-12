'use client';

import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { Locale } from '@/config/locales';
import { useParams } from "next/navigation";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) 
{
  const DEFAULT_LOCALE: Locale = 'sr'; // default fallback
  const params = useParams();
  const locale = (params.locale ?? DEFAULT_LOCALE) as Locale;

  return (
    <div>
      <Header currentLocale={locale} />
      <CartProvider>
        {children}
      </CartProvider>
    </div>
  );
}