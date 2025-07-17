// components/ui/ParametriWatcher.tsx
'use client';

import { useWebParametri } from "@/contexts/DajParametre";

export function ParametriWatcher() {
  useWebParametri(); // Samo pozivamo hook da se aktivira
  return null; // Ne renderujemo ništa
}