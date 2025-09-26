'use client';
import Header from '@/components/Header';
import Najprodavanije from '@/components/Najprodavanije';
import PoruciPonovo from '@/components/PoruciPonovo';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Locale } from '@/config/locales';
import HeroImage from '@/components/HeroImage';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

const DEFAULT_LOCALE: Locale = 'sr'; // default fallback

export default function Home() {
  const params = useParams();
  const locale = (params.locale ?? DEFAULT_LOCALE) as Locale;
  const t = useTranslations();

  return (
    <>
      <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
        <Header />
        <main className="flex flex-col items-center gap-2">
          <HeroImage />
          <div className="w-full px-2">
            <PoruciPonovo />
            <Najprodavanije />
          </div>
          <Footer/>
        </main>
      </Suspense>
    </>
  );
}
