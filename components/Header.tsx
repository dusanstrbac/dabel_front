"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, User, Phone, Mail, Bolt, Rows2, Sofa, LinkIcon, Lightbulb, Vault, Hammer, MenuIcon, BadgePercent, Wallet, Users, BadgeDollarSign, Youtube, Key, Package, History, User2, LogOut, Smartphone, FileText, ShieldUser, Camera } from "lucide-react";
import Image from "next/image";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import KorisnikMenu from "./KorisnikMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import { dajKorisnikaIzTokena } from "@/lib/auth";
import PretragaProizvoda from "./PretragaProizvoda";

export default function Header() {
  const [korisnickoIme, setKorisnickoIme] = useState<string | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brojRazlicitihArtikala, setBrojRazlicitihArtikala] = useState(0);
  const [parametri, setParametri] = useState<any>([]);
  const [WEBKontaktTelefon, setWEBKontaktTelefon] = useState<string>('N/A');
  const [WebKontaktEmail, setWebKontaktEmail] = useState<string>('N/A');
  const korisnik = dajKorisnikaIzTokena();
  const username = korisnik?.korisnickoIme;
  const uloga = korisnik?.webUloga;
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;



 useEffect(() => {
  const updateCartCount = async () => {
    const existing = localStorage.getItem("cart");
    if (existing) {
      const cart = JSON.parse(existing);
         setBrojRazlicitihArtikala(Object.keys(cart).length);
    } else {
      setBrojRazlicitihArtikala(0);
    }

  updateCartCount();
  // Event listener za slušanje promena korpe
  window.addEventListener("storage", updateCartCount);
  return () => {
    window.removeEventListener("storage", updateCartCount);
  };
}
}, [])



    useEffect(() => {
      const ucitajParametre = async () => {
        try {
          const local = localStorage.getItem("WEBParametrizacija");

          if (local) {
            const parsed = JSON.parse(local);
            const telefon = parsed.find((p: any) => p.naziv === "WEBKontaktTelefon")?.vrednost;
            const email = parsed.find((p: any) => p.naziv === "WebKontaktEmail")?.vrednost;

            if (telefon) setWEBKontaktTelefon(telefon);
            if (email) setWebKontaktEmail(email);
            return;
          }

          const res = await fetch(`${apiAddress}/api/Auth/WEBParametrizacija`);
          if (!res.ok) throw new Error("Greška pri fetchovanju parametara");

          const data = await res.json();
          localStorage.setItem("WEBParametrizacija", JSON.stringify(data)); 

          const telefon = data.find((p: any) => p.naziv === "WEBKontaktTelefon")?.vrednost;
          const email = data.find((p: any) => p.naziv === "WebKontaktEmail")?.vrednost;

          if (telefon) setWEBKontaktTelefon(telefon);
          if (email) setWebKontaktEmail(email);

        } catch (err) {
          console.error("Greška pri učitavanju WEB parametara:", err);
        }
      };

      ucitajParametre();
    }, [apiAddress]);




const headerMainNav = [ 
  { icon: <Bolt className="w-4 h-4"/>, text: 'Okov građevinski', href: '/proizvodi/kategorija/' + encodeURIComponent('Okov građevinski') },
  { icon: <Sofa className="w-4 h-4"/>, text: 'Okov nameštaj', href: '/proizvodi/kategorija/' + encodeURIComponent('Okov nameštaj') },
  { icon: <Rows2 className="w-4 h-4"/>, text: 'Klizni okov za građevinu, nameštaj', href: '/proizvodi/kategorija/' + encodeURIComponent('Klizni okov građevina,nameštaj') },
  { 
    icon: <LinkIcon className="w-4 h-4"/>, 
    text: 'Elementi za pričvršćivanje', 
    href: '/proizvodi/kategorija/' + encodeURIComponent('Elementi za pričvršćivanje'), 
    subMenuItems:[
      { icon: <text className="w-4 h-4"/>, text: 'Spojnice', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Spojnice')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Ručke', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Ručke')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Delovi za sajle', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Delovi za sajle')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Tiplovi', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Tiplovi')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Drvo', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Drvo')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Podloške, navrtke', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Podloške, navrtke')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Kapice', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Kapice')}` },
    ]
  },
  { icon: <Lightbulb className="w-4 h-4"/>, text: 'LED rasveta', href: '/proizvodi/kategorija/' + encodeURIComponent('Led Rasveta') },
  { icon: <Vault className="w-4 h-4"/>, text: 'Kontrola pristupa', href: '/proizvodi/kategorija/' + encodeURIComponent('Kontrola Pristupa') },
  { icon: <Hammer className="w-4 h-4"/>, text: 'Ručni alat', href: '/proizvodi/kategorija/' + encodeURIComponent('Ručni Alat') },
];


  const menuItems = [

    // Stavke koje se samo prikazuju administratoru
    ...(uloga === "ADMINISTRATOR" ? [
      { icon: <ShieldUser className="h-4 w-4" />, text: "Admin podešavanja", href: username ? `/${username}/admin` : '/login' },
    ]: []),
    ...(uloga === "PARTNER" ? [
      { icon: <User2 className="h-4 w-4" />, text: "Moji podaci", href: username ? `/${username}/profil/podaci` : '/login' },
      { icon: <User2 className="h-4 w-4" />, text: "Rezervisana roba", href: username ? `/${username}/profil/rezervacije` : '/login' },
      { icon: <FileText className="h-4 w-4" />, text: "Narudžbenica", href: username ? `/${username}/profil/narudzbenica` : '/login' },
      { icon: <Wallet className="h-4 w-4" />, text: "Moje uplate", href: username ? `/${username}/profil/uplate` : '/login' },
      { icon: <Package className="h-4 w-4" />, text: "Poslata roba", href: username ? `/${username}/profil/roba` : '/login' },
      { icon: <Users className="h-4 w-4" />, text: "Korisnici", href: username ? `/${username}/profil/korisnici` : '/login' },
      { icon: <BadgeDollarSign className="h-4 w-4" />, text: "Cenovnik", href: "/admin/cenovnik" },
      { icon: <Youtube className="h-4 w-4" />, text: "Video uputstva", href: "/video" },
    ]: []),    
    ...(uloga === "PARTNER" || uloga === "ADMINISTRATOR" ? [
      { icon: <Key className="h-4 w-4" />, text: "Promena lozinke", href: username ? `/${username}/profil/podesavanja` : '/login' },
    ]: []),
  ];

  const dodatniLinkovi = [
    { icon: <BadgePercent className="w-4 h-4" />, text: "Akcije", href: "/akcije" },
    { icon: <LinkIcon className="w-4 h-4" />, text: "Novopristigli artikli", href: "/novo" },
    { icon: <Smartphone className="w-4 h-4" />, text: "Brzo naručivanje", href: "/BrzoNarucivanje" },
    { icon: <Heart className="w-4 h-4" />, text: "Omiljeni artikli", href: "/heart" },
    { icon: <ShoppingCart className="w-4 h-4" />, text: "Korpa", href: "/korpa" },
  ];


  const [openKorisnikMeni, setOpenKorisnikMeni] = useState(false);

  useEffect(() => {    
    if(korisnik && korisnik.korisnickoIme) {
      setKorisnickoIme(korisnik.korisnickoIme);
      setIsLoggedIn(true);
    } else {
      setKorisnickoIme(null);
      setIsLoggedIn(false);
    }
    setIsMounted(true);

  }, []);

  const odjaviKorisnika = () => {
    const postojiKorpa = localStorage.getItem("cart");

    // Ukoliko postoji korpa kada se korisnik odjavi
    if(postojiKorpa) {
      localStorage.removeItem("cart");
    }
    deleteCookie("AuthToken");
    setIsLoggedIn(false);
    router.push('/');
    window.location.reload();
  };

  return (
    <header className="w-full h-[138px] z-[20] relative">
      {/* NAVIGACIJA ZA RACUNAR */}
      <div className="hidden border-b border-gray-200 lg:flex lg:flex-col lg:gap-2">
        <div className="w-full h-[45%] flex items-center px-8">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/Dabel-logo-2.png" 
                alt="Dabel logo"
                height={80}
                width={125}
                className="object-contain"
                style={{ width: 'auto' }}
                priority
              />
            </Link>
          </div>

          {/* Pretraga */}
          <PretragaProizvoda />

          {/* Kontakt Info */}
          <div className="w-[30%] flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="text-gray-500 h-7 w-7" />
              <span className="text-sm">{WEBKontaktTelefon}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="text-gray-500 h-7 w-7" />
              <Link href='/' as="mailto:website@dabel.rs" className="text-sm">{WebKontaktEmail}</Link>
            </div>
          </div>

          {/* Ikonice */}
          <div className="flex justify-center items-center space-x-6">
            {/* OMILJENI ARTIKLI */}
            <Link href="/heart">
              <Heart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            {/* KORPA */}
            <Link href="/korpa" className="relative inline-block">
              <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              {brojRazlicitihArtikala > 0 && (
              <span
                  className="
                    absolute -top-2.5 -right-2.5 
                    inline-flex items-center justify-center
                    px-2 py-1 text-xs font-bold
                    leading-none text-white bg-red-600
                    rounded-full
                    min-w-[20px] h-5
                  "
                >
                  {brojRazlicitihArtikala}
                </span>
              )}
            </Link>

            {/* NALOG IKONICA */}
            <KorisnikMenu />
          </div>  
        </div>

        {/* Navigacija */}
        <nav className="w-full h-[55%] flex items-center px-8 border-gray-200">
          <div className="flex items-center gap-8">
            {/* Padajuci meni za Proizvode */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[20px] font-normal bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    Proizvodi
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[300px] p-4 relative !overflow-visible z-50">
                    <ul className="grid gap-2 relative">
                      {headerMainNav.map((item, index) => (
                        <li key={index} className="relative group">
                          <NavigationMenuLink asChild className="hover:text-red-500">
                            <Link href={item.href} className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                              {item.icon}
                              <span className="text-[15px] flex items-center justify-between w-full group">
                                {item.text}
                                {item.subMenuItems && (
                                  <span className="ml-auto relative flex items-center text-[16px]">
                                    <span className="transition-all duration-200 group-hover:opacity-0 group-hover:translate-x-1">
                                      &gt;
                                    </span>
                                    <span className="absolute ml-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                                      &lt;
                                    </span>
                                  </span>
                                )}
                              </span>
                            </Link>
                          </NavigationMenuLink> 

                          {/* Ako ima podnavigaciju */}
                          {item.subMenuItems && (
                            <ul className="absolute top-0 left-full ml-2 w-52 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                              {item.subMenuItems.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link href={subItem.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600">
                                    {subItem.text}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Obicni linkovi */}
            <Link href="/akcije" className="text-[20px] font-normal hover:text-red-600 transition-colors">
              Akcije
            </Link>
            <Link href="/novo" className="text-[20px] font-normal hover:text-red-600 transition-colors">
              Novopristigli artikli
            </Link>
            <Link href="/BrzoNarucivanje" className="text-[20px] font-normal hover:text-red-600 transition-colors">
              Brzo Naručivanje
            </Link>
          </div>
        </nav>
      </div>

      {/* TELEFONSKI MENU */}
      <div className="lg:hidden px-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/Dabel-logo-2.png" 
                alt="Dabel logo"
                height={80}
                width={125}
                className="object-contain"
              />
            </Link>
          </div>
          <div>
          {/* KORISNIK MENU */}
            <Sheet open={openKorisnikMeni} onOpenChange={setOpenKorisnikMeni}>
              <SheetTrigger>
                <User className="w-6 h-8" />
              </SheetTrigger>
              <SheetContent className="w-full">
                <SheetHeader>
                  <SheetTitle>{korisnickoIme ? korisnickoIme : 'Korisnik'}</SheetTitle>
                  <SheetDescription></SheetDescription>
                  <Separator />
                </SheetHeader>
                <div className="pl-2 flex flex-col">
                  <ScrollArea>
                      {menuItems.map((item) => (
                        <Link href={item.href} key={item.href} className="flex gap-3 items-center pb-4" onClick={() => setOpenKorisnikMeni(false)}>
                          <span className="">{item.icon}</span>
                          <span className="text-[18px]">{item.text}</span>
                        </Link>
                      ))}

                      {isLoggedIn ? (
                        <Link href="#" className="flex gap-3 items-center pb-4">
                          <LogOut className="w-6 h-6" />
                          <span className="text-[18px] text-red-500" onClick={() => {
                            odjaviKorisnika();
                            setOpenKorisnikMeni(false);
                          }}>Odjava</span>
                        </Link>
                      ) : (
                        <>
                          <Link href="#" className="flex gap-3 items-center pb-4">
                            <LogOut className="w-6 h-6" />
                            <span className="text-[18px]" onClick={() => {
                              router.push('/login');
                              setOpenKorisnikMeni(false);
                            }}>
                              Prijavi se
                            </span>
                          </Link>
                          <Link href="/register" className="flex gap-3 items-center pb-4">
                            <User2 className="w-6 h-6" />
                            <span className="text-[18px]" onClick={() => setOpenKorisnikMeni(false)}>
                              Registruj se
                            </span>
                          </Link>
                        </>
                      )}


                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            {/* HAMBURGER MENU */}
            <Sheet>
              <SheetTrigger>
                <MenuIcon className="w-8 h-8" />
              </SheetTrigger>
              <SheetContent className="w-full overflow-scroll">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <Separator />
                </SheetHeader>

                <div className="pl-2 flex flex-col gap-2">
                  <Accordion type="single" collapsible className="flex flex-col gap-4">
                    {headerMainNav.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="flex items-center gap-3 pl-2">
                          {item.icon}
                          <span className="text-[18px]">{item.text}</span>
                        </AccordionTrigger>

                        <AccordionContent className="pl-10">
                          {item.text === "Elementi za pričvršćivanje" && item.subMenuItems ? (
                            <ul className="flex flex-col gap-1">
                              {item.subMenuItems.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    href={subItem.href}
                                    className="block px-2 py-1 text-[16px] text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    {subItem.text}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <Link
                              href={item.href}
                              className="flex flex-row items-center gap-3 p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <span className="text-[18px]">{item.text}</span>
                            </Link>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="flex flex-col gap-4 mt-2">
                    {dodatniLinkovi.map((item, index) => (
                      <Link
                        key={`add-${index}`}
                        href={item.href}
                        className="text-[18px] flex items-center gap-2 px-2"
                      >
                        {item.icon}
                        <span>{item.text}</span>

                        {item.text === "Korpa" && brojRazlicitihArtikala > 0 && (
                          <span className="ml-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {brojRazlicitihArtikala}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* Pretraga */}

        <div className="relative mt-3">
          <PretragaProizvoda/>
        </div>

      </div>
    </header>
  );
}
