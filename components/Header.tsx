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
import { useCart } from "@/contexts/CartContext";
import KorisnikMenu from "./KorisnikMenu";
import { useState, useEffect } from "react";
import { deleteToken, getEmailFromToken, getUsernameFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {

  const { cartCount } = useCart();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const headerMainNav = [ 
    { icon: <Bolt className="w-4 h-4"/>, text: 'Okov građevinski', href: '/okov-gradjevinski'},
    { icon: <Sofa className="w-4 h-4"/>, text: 'Okov nameštaj', href: '/okov-gradjevinski'},
    { icon: <Rows2 className="w-4 h-4"/>, text: 'Klizni okov za građevinu, nameštaj', href: '/okov-gradjevinski'},
    { icon: <LinkIcon className="w-4 h-4"/>, text: 'Elementi za pričvršćivanje', href: '/okov-gradjevinski'},
    { icon: <Lightbulb className="w-4 h-4"/>, text: 'LED rasveta', href: '/okov-gradjevinski'},
    { icon: <Vault className="w-4 h-4"/>, text: 'Kontrola pristupa', href: '/okov-gradjevinski'},
    { icon: <Hammer className="w-4 h-4"/>, text: 'Ručni alat', href: '/okov-gradjevinski'},
  ];

  const menuItems = [
    { icon: <User2 className="h-6 w-6" />, text: "Moji podaci", href: username ? `/${username}/profil/podaci` : '/login' },
    { icon: <History className="h-6 w-6" />, text: "Istorija poručivanja", href: username ? `/${username}/profil/istorija` : '/login' },
    { icon: <Wallet className="h-6 w-6" />, text: "Moje uplate", href: username ? `/${username}/profil/uplate` : '/login' },
    { icon: <Package className="h-6 w-6" />, text: "Poslata roba", href: username ? `/${username}/profil/roba` : '/login' },
    { icon: <Users className="h-6 w-6" />, text: "Korisnici", href: "/admin/korisnici" },
    { icon: <BadgeDollarSign className="h-6 w-6" />, text: "Cenovnik", href: "/admin/cenovnik" },
    { icon: <Youtube className="h-6 w-6" />, text: "Video uputstva", href: "/video-uputstva" },
    { icon: <Key className="h-6 w-6" />, text: "Promena lozinke", href: username ? `/${username}/profil/podesavanja` : '/login' },
  ];

  if(username === 'null') {
    router.push('/login');
  }

  const odjaviKorisnika = () => {
    const korisnickiToken = localStorage.getItem('token');

    if(!korisnickiToken) {
      return;
    } else {
      deleteToken();
      window.location.replace('/');
    }    
  }

  useEffect(() => {
    const usernameFromToken = getUsernameFromToken();
    setUsername(usernameFromToken);
    setEmail(getEmailFromToken());
  }, []);


  return (
<<<<<<< HEAD
    <header className="relative w-full h-[138px] z-[20]">
=======
    <header className="w-full h-[138px] z-[20] relative">
>>>>>>> 0362e87d0872c18faf5b070bdcabd23fdf9cd919
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
                className="h-[75px] object-contain"
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
              <Link href='/' as="mailto:website@dabel.rs" className="text-sm hover:text-red-500">website@dabel.rs</Link>
            </div>
          </div>

          {/* Ikonice */}
          <div className="flex justify-center items-center space-x-6">
            {/* OMILJENI ARTIKLI */}
            <Link href="/heart">
              <Heart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            {/* KORPA */}
            <Link href="/korpa" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-800 text-white text-xs rounded-full h-[20px] w-[20px] flex items-center justify-center border border-black">
                {cartCount}
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
                  <NavigationMenuContent className="min-w-[300px] p-4">
                    <ul className="grid gap-2">
                      {headerMainNav.map((item, index) => (
                        <NavigationMenuLink key={index} asChild className="hover:text-red-500">
                           <Link href={item.href} className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                             {item.icon}
                             <span className="text-[15px]">{item.text}</span>
                           </Link>
                         </NavigationMenuLink>
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
                  <SheetTitle>{email ? email : 'Korisnik'}</SheetTitle>
                  <SheetDescription></SheetDescription>
                  <Separator />
                </SheetHeader>
                <div className="pl-2 flex flex-col">
                  <ScrollArea>
                      {menuItems.map((item) => (
                        <Link href={item.href} key={item.href} className="flex gap-3 items-center pb-4">
                          <span className="">{item.icon}</span>
                          <span className="text-2xl">{item.text}</span>
                        </Link>
                      ))}
                        <Link href='#' className="flex gap-3 items-center pb-4">
                          <LogOut className="w-6 h-6" />
                          <span className="text-2xl text-red-500" onClick={odjaviKorisnika}>Odjava</span>
                        </Link>
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
                          <Link href={item.href} className="flex flex-row items-center gap-3 p-1 hover:bg-gray-100 rounded transition-colors">
                            <span className="text-[18px]">{item.text}</span>
                          </Link>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <BoxesIcon className="h-6 w-6" />
                    <span className="text-[18px]">Proizvodi</span>
                  </Link> */}
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <BadgePercent className="h-6 w-6" />
                    <span className="text-[18px]">Akcija</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <LinkIcon className="h-6 w-6" />
                    <span className="text-[18px]">Novopristigli proizvodi</span>
                  </Link>
                  <Link href="/heart" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <Heart className="h-6 w-6" />
                    <span className="text-[18px]">Omiljeni artikli</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-[18px]">Korpa</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <User className="h-6 w-6" />
                    <span className="text-[18px]">Moj profil</span>
                  </Link>
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
