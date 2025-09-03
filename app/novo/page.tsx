import React, { Suspense } from 'react';
import Novopristigli from './Novo';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <Novopristigli />
    </Suspense>
  );
}
