import React, { Suspense } from 'react';
import LoginForm from './LoginForm';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <Suspense fallback={<div>{t('main.Učitavanje')}</div>}>
      <LoginForm />
    </Suspense>
  );
}
