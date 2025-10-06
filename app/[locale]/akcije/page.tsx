import React, { Suspense } from 'react';
import Akcije from './Akcije';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <Akcije />
    </Suspense>
  );
}
