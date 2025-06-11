import React, { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <LoginForm />
    </Suspense>
  );
}
