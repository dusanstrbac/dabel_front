import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <div>
      <div className="">
        {children}
      </div>
    </div>
  );
}
