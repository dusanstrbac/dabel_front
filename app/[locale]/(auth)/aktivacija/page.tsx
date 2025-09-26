import React, { Suspense } from 'react';
import AktivacijaNaloga from './AktivacijaPage';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <AktivacijaNaloga />
    </Suspense>
  );
}
