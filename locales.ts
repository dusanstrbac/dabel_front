// locales.ts
export const locales = ['sr', 'en', 'mk', 'bh', 'al', 'cg'] as const;

export type Locale = (typeof locales)[number];

export function isLocale(locale: string | undefined): locale is Locale {
  return locale ? locales.includes(locale as Locale) : false;
}

export const defaultLocale: Locale = 'sr';

export const languages: Record<Locale, { label: string; flag: string }> = {
  sr: { label: 'Srpski', flag: 'fi-rs' },
  en: { label: 'English', flag: 'fi-gb' },
  mk: { label: 'Makedonski', flag: 'fi-mk' },
  bh: { label: 'Bosanski', flag: 'fi-ba' },
  cg: { label: 'Crnogorski', flag: 'fi-me' },
  al: { label: 'Albanski', flag: 'fi-al' },
};