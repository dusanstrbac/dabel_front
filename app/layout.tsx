// app/layout.tsx
import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ParametriWatcher } from "@/components/ui/ParametriWatcher";

export const metadata : Metadata = {
  title: "Dabel.rs",
  description: "Dabel web shop"
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="sr">
      <body>
        {children}
        <ParametriWatcher/>
        <Toaster
          toastOptions={{
            duration:5000, // Sooner se automatski iskljucuje za 5000ms = 5s
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