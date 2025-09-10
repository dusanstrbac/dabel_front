// app/[locale]/not-found.tsx
'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const locale = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Stranica nije pronađena</h1>
      <p className="text-lg mb-8">Stranica koju tražite ne postoji.</p>
      <Link 
        href={`/${locale}`}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Nazad na početnu
      </Link>
    </div>
  );
}