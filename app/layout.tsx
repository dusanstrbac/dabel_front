import { ParametriWatcher } from "@/components/ui/ParametriWatcher";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/provides";

export const metadata: Metadata = {
  title: "Dabel.rs",
  description: "Dabel web shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <Providers>
          {children}
          </Providers>
          <ParametriWatcher/>
          <Toaster
            toastOptions={{
              classNames: {
                error: "toast-error",
                success: "toast-info"
              }
            }}
          />
      </body>
    </html>
  );
}