'use client';

import dynamic from 'next/dynamic';
import 'yet-another-react-lightbox/styles.css';
import type { ComponentProps } from 'react';

const DynamicLightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false,
});

// Izvuci tip props-a iz dinamički uvezene komponente
type LightboxProps = ComponentProps<typeof DynamicLightbox>;

export default function ClientLightbox(props: LightboxProps) {
  return <DynamicLightbox {...props} />;
}
