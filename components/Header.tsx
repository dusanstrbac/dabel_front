"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, User, Phone, Mail, Bolt, Rows2, Sofa, LinkIcon, Lightbulb, Vault, Hammer, MenuIcon, BoxesIcon, BadgePercent, UserPen, Wallet, Users, BadgeDollarSign, Youtube, LogOutIcon, YoutubeIcon, Key, Package, History, User2, LogOut} from "lucide-react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import KorisnikMenu from "./KorisnikMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useCart } from "@/contexts/CartContext";
import AddToCartButton from "./AddToCartButton";
import { string } from "zod";


export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [korisnickoIme, setKorisnickoIme] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brojRazlicitihArtikala, setBrojRazlicitihArtikala] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const existing = localStorage.getItem("cart");
      if (existing) {
        const cart = JSON.parse(existing);
        const brojRazlicitih = Object.keys(cart).length;
        setBrojRazlicitihArtikala(brojRazlicitih);
      } else {
        setBrojRazlicitihArtikala(0);
      }
    };

    updateCartCount();

    // Event listener za slušanje promena korpe
    window.addEventListener("storage", updateCartCount);

    // Cleanup
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

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
      { icon: <text className="w-4 h-4"/>, text: 'Delovi za sajle', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Sajle')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Tiplovi', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Tiplovi')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Drvo', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Drvo')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Podloške, navrtke', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Podloške')}` },
      { icon: <text className="w-4 h-4"/>, text: 'Kapice', href: `/proizvodi/kategorija/${encodeURIComponent('Elementi za pričvršćivanje')}/${encodeURIComponent('Kapice')}` },
    ]
  },
  { icon: <Lightbulb className="w-4 h-4"/>, text: 'LED rasveta', href: '/proizvodi/kategorija/' + encodeURIComponent('Led Rasveta') },
  { icon: <Vault className="w-4 h-4"/>, text: 'Kontrola pristupa', href: '/proizvodi/kategorija/' + encodeURIComponent('Kontrola Pristupa') },
  { icon: <Hammer className="w-4 h-4"/>, text: 'Ručni alat', href: '/proizvodi/kategorija/' + encodeURIComponent('Ručni Alat') },
];


  const menuItems = [
    { id: 'podaci', icon: <User2 className="h-6 w-6" />, text: "Moji podaci", href: username ? `/${username}/profil/podaci` : '/login' },
    { id: 'istorija', icon: <History className="h-6 w-6" />, text: "Istorija poručivanja", href: username ? `/${username}/profil/istorija` : '/login' },
    { id: 'uplate', icon: <Wallet className="h-6 w-6" />, text: "Moje uplate", href: username ? `/${username}/profil/uplate` : '/login' },
    { id: 'roba', icon: <Package className="h-6 w-6" />, text: "Poslata roba", href: username ? `/${username}/profil/roba` : '/login' },
    { id: 'korisnici', icon: <Users className="h-6 w-6" />, text: "Korisnici", href: "/admin/korisnici" },
    { id: 'cenovnik', icon: <BadgeDollarSign className="h-6 w-6" />, text: "Cenovnik", href: "/admin/cenovnik" },
    { id: 'uputstva', icon: <Youtube className="h-6 w-6" />, text: "Video uputstva", href: "/video-uputstva" },
    { id: 'podesavanja', icon: <Key className="h-6 w-6" />, text: "Promena lozinke", href: username ? `/${username}/profil/podesavanja` : '/login' },
  ];

  const dodatniLinkovi = [
    { icon: <BadgePercent className="w-4 h-4" />, text: "Akcija", href: "/akcija" },
    { icon: <LinkIcon className="w-4 h-4" />, text: "Novopristigli proizvodi", href: "/novopristigli" },
    { icon: <Heart className="w-4 h-4" />, text: "Omiljeni artikli", href: "/heart" },
    { icon: <ShoppingCart className="w-4 h-4" />, text: "Korpa", href: "/korpa" },
    { icon: <User className="w-4 h-4" />, text: "Moj profil", href: "/profil" },
  ];

  useEffect(() => {
    const korisnik = dajKorisnikaIzTokena();
    
    if(korisnik && korisnik.korisnickoIme) {
      setKorisnickoIme(korisnik.korisnickoIme);
      setIsLoggedIn(true);
    } else {
      setKorisnickoIme(null);
      setIsLoggedIn(false);
    }
    setIsMounted(true);

  }, []);

   const prijaviKorisnika = () => {
    router.push('/login');
  };

  const odjaviKorisnika = () => {
    deleteCookie("AuthToken");
    setKorisnickoIme(null);
    setIsLoggedIn(false);
    router.push('/');
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
                height={164}
                width={140}
                className="h-[75px] w-auto object-contain0"
                priority={true}
              />
            </Link>
          </div>

          {/* Pretraga */}
          <div className="w-[40%] relative ml-16 mr-2">
            <Input
              placeholder="Pretraga"
              className="pl-4 pr-10 py-2 border border-black rounded-md"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          </div>

          {/* Kontakt Info */}
          <div className="w-[30%] flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="text-gray-500 h-7 w-7" />
              <span className="text-sm">+38122802860</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="text-gray-500 h-7 w-7" />
              <Link href='/' as="mailto:website@dabel.rs" className="text-sm">website@dabel.rs</Link>
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
              {/*{brojRazlicitih > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2 
                    inline-flex items-center justify-center
                    px-2 py-1 text-xs font-bold
                    leading-none text-white bg-red-600
                    rounded-full
                    min-w-[20px] h-5
                  "
                >
                  {brojRazlicitih}
                </span>
              )}*/}
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
            <Sheet>
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
                        <Link href={item.href} key={item.id} className="flex gap-3 items-center pb-4">
                          <span className="">{item.icon}</span>
                          <span className="text-[18px]">{item.text}</span>
                        </Link>
                      ))}

                      {isLoggedIn ? (
                       
                       <Link href='#' className="flex gap-3 items-center pb-4">
                          <LogOut className="w-6 h-6" />
                          <span className="text-[18px] text-red-500" onClick={odjaviKorisnika}>Odjava</span>
                        </Link> ) : (

                          <Link href='#' className="flex gap-3 items-center pb-4">
                          <LogOut className="w-6 h-6" />
                          <span className="text-[18px]" onClick={prijaviKorisnika}>Prijavi se</span>
                        </Link>

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
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Pretraga"
            className="pl-8 border border-black rounded-md"
          />
        </div>
      </div>
    </header>
  );
}
