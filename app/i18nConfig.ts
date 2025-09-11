// i18nConfig.ts
export const i18nConfig = {
  locales: ['sr', 'en'],
  defaultLocale: 'sr',
  fallbackLng: 'sr', // Dodaj ovu liniju
  prefixDefault: false,
};

export type Locale = (typeof i18nConfig)['locales'][number];