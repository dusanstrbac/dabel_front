"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, User, Phone, Mail, Bolt, Rows2, Sofa, LinkIcon, Lightbulb, Vault, Hammer, Menu as MenuIcon, BadgePercent, Wallet, Users, BadgeDollarSign, Youtube, Key, Package, History, User as User2, LogOut, Smartphone, FileText } from "lucide-react";
import Image from "next/image";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { Separator } from "./ui/separator";
import KorisnikMenu from "./KorisnikMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import IconComponent from "./IconComponent";
import "flag-icons/css/flag-icons.min.css";
import LanguageSelector from "./LanguageSelector";
import PretragaProizvoda from "./PretragaProizvoda";
import { Locale } from "@/config/locales";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useTranslations } from "next-intl";

interface HeaderProps {
  currentLocale: Locale;
}

export default function Header({ currentLocale }: HeaderProps) {
  const [korisnickoIme, setKorisnickoIme] = useState<string | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [brojRazlicitihArtikala, setBrojRazlicitihArtikala] = useState(0);
  const [parametri, setParametri] = useState<any[]>([]);
  const [WEBKontaktTelefon, setWEBKontaktTelefon] = useState<string>('N/A');
  const [WebKontaktEmail, setWebKontaktEmail] = useState<string>('N/A');
  const korisnik = dajKorisnikaIzTokena();
  const [headerMainNav, setHeaderMainNav] = useState<NavigacijaItem[]>([]);
  const t = useTranslations('header');

  const dodatniLinkovi = [
    { text: t('header-NavAkcije'), href: "/akcije", icon: <BadgePercent className="w-5 h-5" /> },
    { text: t('header-NavNovoPristigli'), href: "/novo", icon: <Bolt className="w-5 h-5" /> },
    { text: t('header-NavBrzoNarucivanje'), href: "/BrzoNarucivanje", icon: <Smartphone className="w-5 h-5" /> },
    { text: t('header-NavKorpa'), href: "/korpa", icon: <ShoppingCart className="w-5 h-5" /> },
    { text: t('header-NavKontakt'), href: "/kontakt", icon: <Phone className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const updateCartCount = () => {
      const existing = localStorage.getItem("cart");
      setBrojRazlicitihArtikala(existing ? Object.keys(JSON.parse(existing)).length : 0);

      const parami = JSON.parse(localStorage.getItem('webparametri') || '[]');
      setParametri(parami);
      setWEBKontaktTelefon(parami.find((p: any) => p.naziv === 'WEBKontaktTelefon')?.vrednost || 'N/A');
      setWebKontaktEmail(parami.find((p: any) => p.naziv === 'WebKontaktEmail')?.vrednost || 'N/A');
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_ADDRESS;
        const res = await fetch(`${api}/api/Web/KategorijeNavigacija`);
        const data: any[] = await res.json();

        const mapped = data.map(item => ({
          icon: <IconComponent name={item.naziv} />,
          text: item.naziv,
          href: `/proizvodi/kategorija/${encodeURIComponent(item.naziv)}`,
          subMenuItems: item.deca?.length
            ? item.deca.map((sub: any) => ({
                icon: <IconComponent name={sub.naziv} />,
                text: sub.naziv,
                href: `/proizvodi/kategorija/${encodeURIComponent(item.naziv)}/${encodeURIComponent(sub.naziv)}`
              }))
            : null
        }));
        setHeaderMainNav(mapped);
      } catch (err) {
        console.error("Greška pri fetch navigacije:", err);
      }
    };
    fetchNav();
  }, []);

  useEffect(() => {
    if (korisnik?.korisnickoIme) {
      setKorisnickoIme(korisnik.korisnickoIme);
      setIsLoggedIn(true);
    } else setIsLoggedIn(false);
    setIsMounted(true);
  }, [korisnik]);

  const odjaviKorisnika = () => {
    if (localStorage.getItem("cart")) localStorage.removeItem("cart");
    deleteCookie("AuthToken");
    setIsLoggedIn(false);
    router.push('/login');
    window.location.reload();
  };

  return (
    <header className="w-full z-[20] relative border-b border-gray-200">
      {/* Desktop navigacija */}
      <div>
        <div className="hidden border-b border-gray-200 lg:flex lg:flex-col lg:gap-2 h-[138px]">
        <div className="w-full h-[45%] flex items-center px-8">
          <Link href="/"><Image src="/Dabel-logo-2.png" alt="Dabel logo" height={80} width={125} className="object-contain" priority /></Link>
          <PretragaProizvoda />
          <div className="w-[30%] flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2"><Phone className="text-gray-500 h-7 w-7"/><span className="text-sm">{WEBKontaktTelefon}</span></div>
            <div className="flex items-center space-x-2"><Mail className="text-gray-500 h-7 w-7"/><Link href={`mailto:${WebKontaktEmail}`} className="text-sm">{WebKontaktEmail}</Link></div>
          </div>
          <div className="flex justify-center items-center space-x-6">
            <Link href="/heart"><Heart className="h-6 w-6 text-gray-500 hover:text-gray-700"/></Link>
            <Link href="/korpa" className="relative inline-block"><ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700"/>{brojRazlicitihArtikala > 0 && <span className="absolute -top-2.5 -right-2.5 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full min-w-[20px] h-5 flex justify-center items-center">{brojRazlicitihArtikala}</span>}</Link>
            <KorisnikMenu />
            <LanguageSelector />
          </div>
        </div>

        <nav className="w-full h-[55%] flex items-center px-8 border-gray-200">
          <div className="flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[20px] font-normal bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">{t('header-NavProizvodi')}</NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[300px] p-4 relative !overflow-visible z-50">
                    <ul className="grid gap-2 relative">
                      {headerMainNav.map((item, idx) => (
                        <li key={idx} className="relative group">
                          <NavigationMenuLink asChild className="hover:text-red-500">
                            <Link href={item.href} className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                              {item.icon}
                              <span className="text-[15px] flex items-center justify-between w-full group">
                                {item.text}
                                {item.subMenuItems && <span className="ml-auto relative flex items-center text-[16px]"><span className="transition-all duration-200 group-hover:opacity-0 group-hover:translate-x-1">&gt;</span><span className="absolute ml-0.5 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">&lt;</span></span>}
                              </span>
                            </Link>
                          </NavigationMenuLink>
                          {item.subMenuItems && (
                            <ul className="absolute top-0 left-full ml-2 w-60 max-w-xs bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                              {item.subMenuItems.map((sub, sidx) => (
                                <li key={sidx}>
                                  <Link href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 break-words whitespace-normal">
                                    {sub.text}
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

            <Link href="/akcije" className="text-[20px] font-normal hover:text-red-600 transition-colors">{t('header-NavAkcije')}</Link>
            <Link href="/novo" className="text-[20px] font-normal hover:text-red-600 transition-colors">{t('header-NavNovoPristigli')}</Link>
            <Link href="/BrzoNarucivanje" className="text-[20px] font-normal hover:text-red-600 transition-colors">{t('header-NavBrzoNarucivanje')}</Link>
          </div>
        </nav>
      </div>
      </div>
      {/* Mobile navigacija */}
      <div className="lg:hidden px-3">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/Dabel-logo-2.png" 
              alt="Dabel logo"
              height={50}
              width={100}
              className="object-contain"
              priority
            />
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Korisnik menu */}
            <div className="lg:hidden">
              <KorisnikMenu />
            </div>

            {/* Korpa */}
            <Link href="/korpa" className="relative p-1">
              <ShoppingCart className="w-6 h-6" color="gray"/>
              {brojRazlicitihArtikala > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-600 rounded-full">
                  {brojRazlicitihArtikala}
                </span>
              )}
            </Link>

            {/* Hamburger menu */}
            <Sheet>
              <SheetTrigger className="p-1">
                <MenuIcon className="w-6 h-6" color="gray"/>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Meni</SheetTitle>
                  <Separator />
                </SheetHeader>

                <div className="pl-2 flex flex-col gap-2 mt-4">
                  {/* Pretraga */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <Input
                      placeholder="Pretraga"
                      className="pl-10 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Kategorije */}
                  <Accordion type="single" collapsible className="flex flex-col gap-2">
                    {headerMainNav.map((item, index) => (
                      item.subMenuItems ? (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="flex items-center gap-3 px-2 py-3 hover:bg-gray-50 rounded">
                            {item.icon}
                            <span className="text-[16px]">{item.text}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pl-10">
                            <ul className="flex flex-col gap-1 py-2">
                              {item.subMenuItems.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    href={subItem.href}
                                    className="block px-2 py-2 text-[15px] text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                  >
                                    {subItem.text}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <Link
                          key={index}
                          href={item.href}
                          className="flex items-center gap-3 px-2 py-3 hover:bg-gray-50 rounded"
                        >
                          {item.icon}
                          <span className="text-[16px]">{item.text}</span>
                        </Link>
                      )
                    ))}
                  </Accordion>

                  {/* Dodatni linkovi */}
                  <div className="flex flex-col gap-1 mt-2">
                    {dodatniLinkovi.map((item, index) => (
                      <Link
                        key={`add-${index}`}
                        href={item.href}
                        className="text-[16px] flex items-center gap-3 px-2 py-3 hover:bg-gray-50 rounded"
                      >
                        {item.icon}
                        <span>{item.text}</span>
                        {item.text === "Korpa" && brojRazlicitihArtikala > 0 && (
                          <span className="ml-auto bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {brojRazlicitihArtikala}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="px-2">
                  <div className="border-t py-2 border-gray-300 px-2">
                    <LanguageSelector />
                  </div>
                </div>

              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}