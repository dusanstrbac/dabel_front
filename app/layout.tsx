// app/layout.tsx
import { ParametriWatcher } from "@/components/ui/ParametriWatcher";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dabel.rs",
  description: "Dabel web shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          {children}
          <ParametriWatcher/>
      </body>
    </html>
  );
}