import React, { Suspense } from 'react';
import OmiljeniArtikli from './Omiljeno';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <OmiljeniArtikli />
    </Suspense>
  );
}
