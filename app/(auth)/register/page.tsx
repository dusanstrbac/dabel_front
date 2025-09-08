import React, { Suspense } from 'react';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
