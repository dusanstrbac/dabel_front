import React, { Suspense } from 'react';
import RegisterForm from './RegisterForm';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <RegisterForm />
    </Suspense>
  );
}
