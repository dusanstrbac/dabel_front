
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <div>
      <div className="px-4">
        {children}
      </div>
    </div>
  );
}
