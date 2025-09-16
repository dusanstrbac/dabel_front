export const locales = [
  { code: 'sr', label: 'Srpski', flag: 'rs' },
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'mk', label: 'Makedonski', flag: 'mk' },
  { code: 'al', label: 'Albanski', flag: 'al' },
  { code: 'me', label: 'Crnogorski', flag: 'me' },
] as const;

export type Locale = typeof locales[number]['code'];
