import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/provides";
import { Toaster } from "sonner";

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
        <Toaster/>
      </body>
    </html>
  );
}
