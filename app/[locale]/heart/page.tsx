import React, { Suspense } from 'react';
import OmiljeniArtikli from './Omiljeno';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <OmiljeniArtikli />
    </Suspense>
  );
}
