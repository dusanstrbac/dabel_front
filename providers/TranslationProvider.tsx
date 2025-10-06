'use client';

import { createContext, useContext, ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Interfejsi za tipove
interface TranslationResource {
  [key: string]: {
    [key: string]: string | TranslationResource;
  };
}

interface TranslationContextType {
  locale: string;
  resources: TranslationResource;
}

// Kreiramo kontekst sa default vrednošću null
const TranslationContext = createContext<TranslationContextType | null>(null);

// Custom hook za lako korišćenje prevoda
export const useTranslations = () => {
  const context = useContext(TranslationContext);
  if (context === null) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }

  // Funkcija za prevođenje
  return (key: string) => {
    const keys = key.split('.');
    let result: any = context.resources;
    let found = true;

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = result[k];
      } else {
        found = false;
        break;
      }
    }

    return found && typeof result === 'string' ? result : key;
  };
};

// Komponenta Provider
export const TranslationProvider = ({ children, locale, resources }: { children: ReactNode; locale: string; resources: TranslationResource }) => {
  i18n.use(initReactI18next).init({
    lng: locale,
    resources,
  });

  return (
    <TranslationContext.Provider value={{ locale, resources }}>
      {children}
    </TranslationContext.Provider>
  );
};