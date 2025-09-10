// i18n.ts - alternativa
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale, isLocale} from './locales';

const config = getRequestConfig(async ({locale}) => {
  if (!locale || !isLocale(locale)) {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }

  return {
    locale: locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

export default config;