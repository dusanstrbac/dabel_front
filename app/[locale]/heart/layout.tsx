'use client';

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Locale } from '@/config/locales';
import { getCookie } from "cookies-next";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
  const DEFAULT_LOCALE: Locale = 'sr'; // default fallback
  const jezik = getCookie("NEXT_LOCALE");
  const locale = (jezik ?? DEFAULT_LOCALE) as Locale;

  return (
    <div>
      <Header />
      <div className="lg:px-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}
