import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../types/locale';
import { getCookie } from 'cookies-next';

export default getRequestConfig(async () => {

  const locale = getCookie('NEXT_LOCALE') || 'sr';

  if (!locales.includes(locale as any)) {
    console.log('Nepoznat locale:', locale);
    notFound();
  }

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
