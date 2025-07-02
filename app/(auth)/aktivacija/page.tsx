import React, { Suspense } from 'react';
import AktivacijaNaloga from './AktivacijaPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <AktivacijaNaloga />
    </Suspense>
  );
}
