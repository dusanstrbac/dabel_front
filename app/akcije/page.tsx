import React, { Suspense } from 'react';
import Akcije from './Akcije';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <Akcije />
    </Suspense>
  );
}
