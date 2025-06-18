import Header from "@/components/Header";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <div>
      <div className="px-4">
        <Header />
        {children}
      </div>
    </div>
  );
}
