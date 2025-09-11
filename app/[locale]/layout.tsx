'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Locale } from '@/config/locales';
import allMessages from '@/messages/allMessages';

interface LocaleLayoutProps {
  children: React.ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  const params = useParams();
  const locale = params?.locale as Locale | undefined;

  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    if (!locale) return;

    const loader = allMessages[locale];
    if (!loader) {
      console.error('Nepoznat jezik:', locale);
      setMessages(null);
      return;
    }

    loader()
      .then(mod => setMessages(mod.default))
      .catch(err => {
        console.error('Greška prilikom učitavanja poruka:', err);
        setMessages(null);
      });
  }, [locale]);

  if (!locale) return <p>Učitavanje jezika...</p>;
  if (!messages) return <p>Učitavanje poruka...</p>;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
