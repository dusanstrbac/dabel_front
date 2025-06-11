import Header from "@/components/Header";

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