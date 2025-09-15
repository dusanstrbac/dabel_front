'use client';

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Locale } from '@/config/locales';
import { useParams } from "next/navigation";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
  const DEFAULT_LOCALE: Locale = 'sr'; // default fallback
  const params = useParams();
  const locale = (params.locale ?? DEFAULT_LOCALE) as Locale;

  return (
    <div>
      <div className="px-4">
        <Header currentLocale={locale} />
        {children}
      </div>
      <Footer />
    </div>
  );
}
