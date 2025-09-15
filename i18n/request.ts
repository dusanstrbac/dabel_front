// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../types/locale';

export default getRequestConfig(async ({ locale }) => {
  // Proverite da li je jezik podržan. Ako nije, notFound() prekida izvršavanje.
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Nakon provere, TypeScript zna da je 'locale' string.
  // Dekonstrukcijom i dodeljivanjem izbegavate grešku.
  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});