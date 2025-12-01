// app/layout.tsx
import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { WebParametriProvider } from "@/contexts/WebParametriContext";

export const metadata : Metadata = {
  title: "Dabel.rs",
  description: "Dabel web shop"
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="sr">
      <body>
        <WebParametriProvider>
          {children}
          <Toaster
            toastOptions={{
              duration:5000, // Sooner se automatski iskljucuje za 5000ms = 5s
              classNames: {
                error: "toast-error",
                success: "toast-info"
              }
            }}
          />
        </WebParametriProvider>
      </body>
    </html>
  );
}