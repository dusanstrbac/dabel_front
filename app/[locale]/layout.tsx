// app/[locale]/layout.tsx
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { locales } from '@/types/locale';
import { TranslationProvider } from '@/components/TranslationProvider';
import initTranslations from '../i18n';
import '../globals.css'; // Dodaj ovu liniju za uvoz globalnih stilova

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Učitavamo prevode na serveru pre renderovanja
  const { resources } = await initTranslations(locale, ['common', 'header', 'profile']);

  return (
    <TranslationProvider locale={locale} resources={resources}>
      <body>
        {children}
      </body>
    </TranslationProvider>
  );
}