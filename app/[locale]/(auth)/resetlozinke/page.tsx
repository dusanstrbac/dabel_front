import React, { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import ResetLozinkePage from './ResetLozinkePage';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <ResetLozinkePage />
    </Suspense>
  );
}
