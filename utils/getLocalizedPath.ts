// utils/getLocalizedPath.ts
import { locales } from '@/types/locale';

// Ova funkcija vraca putanju sa prefiksom
export const getLocalizedPath = (path: string, locale: string) => {
  // Proveri da li je putanja vec lokalizovana
  const segments = path.split('/').filter(Boolean);
  if (locales.includes(segments[0] as any)) {
    return path;
  }

  // Vrati lokalizovanu putanju
  return `/${locale}${path}`;
};