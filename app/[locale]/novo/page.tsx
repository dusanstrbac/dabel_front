import React, { Suspense } from 'react';
import Novopristigli from './Novo';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <Novopristigli />
    </Suspense>
  );
}
