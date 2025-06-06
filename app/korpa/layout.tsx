import Header from "@/components/Header";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <div>
      <Header />
      <div className="px-4">
        {children}
      </div>
    </div>
  );
}
