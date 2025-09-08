export const locales = ['sr', 'en', 'mk', 'hr', 'al', 'lt'] as const;

export type Locale = (typeof locales)[number];

export function isLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export const defaultLocale: Locale = 'sr';

export const languages: Record<Locale, { label: string; flag: string }> = {
  sr: { label: 'Srpski', flag: 'fi-rs' },
  en: { label: 'English', flag: 'fi-gb' },
  mk: { label: 'Makedonski', flag: 'fi-mk' },
  hr: { label: 'Hrvatski', flag: 'fi-hr' },
  lt: { label: 'Litvanski', flag: 'fi-lt' },
  al: { label: 'Albanski', flag: 'fi-al' },
};
