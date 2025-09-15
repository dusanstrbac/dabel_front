// components/ClientProviders.tsx
"use client";

import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

interface ClientProvidersProps {
  children: ReactNode;
  i18nInstance: any;
}

export const ClientProviders = ({ children, i18nInstance }: ClientProvidersProps) => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
};