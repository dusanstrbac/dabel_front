"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Heart, ShoppingCart, User, Phone, Mail, Bolt, Rows2, Sofa, LinkIcon, Lightbulb, Vault, Hammer, MenuIcon, BoxesIcon, BadgePercent, UserPen, Wallet, Users, BadgeDollarSign, Youtube, LogOutIcon, YoutubeIcon, Key, Package, History, User2} from "lucide-react";
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

export default function Header() {

  const { cartCount }  = useCart(); // Menja broj artikala u korpi preko localStorage-a
  // Prebaciti posle na API poziv gde ce preko localStorage-a da se uzima id korisnika
  const korisnik = 'Dusan';

  return (
    <header className="w-full h-[138px]">
      {/* NAVIGACIJA ZA RACUNAR */}
      <div className="hidden border-b border-gray-200 lg:flex lg:flex-col lg:gap-2">
        <div className="w-full h-[45%] flex items-center px-8">
          {/* Logo */}
          <div>
            <div className="">
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
              <span className="text-sm">website@dabel.rs</span>
            </div>
          </div>

          {/* Ikonice */}
          <div className="flex justify-center items-center space-x-6">
            {/* OMILJENI ARTIKLI */}
            <Link href="/okov-namestaj">
              <Heart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            {/* KORPA */}
            <Link href="/okov-namestaj" className="relative">
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
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/okov-gradjevinski" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <Bolt className="w-4 h-4"/>
                          <span className="text-[15px]">Okov građevinski</span>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/okov-namestaj" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <Sofa className="h-4 w-4" />
                          <span className="text-[15px]">Okov nameštaj</span>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/klizni-okov" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <Rows2 className="h-4 w-4" />
                          <span className="text-[15px]">Klizni okov za građevinu, nameštaj</span>
                        </Link>
                      </NavigationMenuLink>
                      {/* NAPRAVITI NOVI POD MENU OD OVOG SEGMENTA */}
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <LinkIcon className="h-4 w-4" />
                          <span className="text-[15px]">Elementi za pričvršćivanje</span>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/led-rasveta" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <Lightbulb className="h-4 w-4" />
                          <span className="text-[15px]">LED rasveta</span>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/kontrola-pristupa" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <Vault className="h-4 w-4" />
                          <span className="text-[15px]">Kontrola pristupa</span>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="hover:text-red-500">
                        <Link href="/rucni-alat" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                          <Hammer className="h-4 w-4" />
                          <span className="text-[15px]">Ručni alat</span>
                        </Link>
                      </NavigationMenuLink>
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
                  <SheetTitle>Korisnik</SheetTitle>
                  <SheetDescription></SheetDescription>
                  <Separator />
                </SheetHeader>
                <div className="pl-2 flex flex-col gap-2">
                  <ScrollArea>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <User2 className="h-6 w-6" />
                    <span className="text-[18px]">Moji podaci</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <History className="h-6 w-6" />
                    <span className="text-[18px]">Istorija poručivanja</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <Wallet className="h-6 w-6" />
                    <span className="text-[18px]">Moje uplate</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <Package className="h-6 w-6" />
                    <span className="text-[18px]">Poslata roba</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <Users className="h-6 w-6" />
                    <span className="text-[18px]">Korisnici</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <BadgeDollarSign className="h-6 w-6" />
                    <span className="text-[18px]">Cenovnik</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <Youtube className="h-6 w-6" />
                    <span className="text-[18px]">Video uputstva</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <Key className="h-6 w-6" />
                    <span className="text-[18px]">Promena lozinke</span>
                  </Link>
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                    <LogOutIcon className="h-6 w-6" />
                    <span className="text-[18px]">Odjava</span>
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
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="flex items-center gap-3 pl-2">
                          <BoxesIcon className="h-6 w-6" />
                          <span className="text-[18px]">Proizvodi</span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <Bolt className="h-6 w-6" />
                        <span className="text-[18px]">Okov građevinski</span>
                      </Link>
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <Sofa className="h-6 w-6" />
                        <span className="text-[18px]">Okov nameštaj</span>
                      </Link>
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <Rows2 className="h-6 w-6" />
                        <span className="text-[18px]">Klizni okov za građevinu, nameštaj</span>
                      </Link>
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <LinkIcon className="h-6 w-6" />
                        <span className="text-[18px]">Elementi za pričvršćivanje</span>
                      </Link>
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <Lightbulb className="h-6 w-6" />
                        <span className="text-[18px]">LED rasveta</span>
                      </Link>
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <Vault className="h-6 w-6" />
                        <span className="text-[18px]">Kontrola pristupa</span>
                      </Link>
                      <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
                        <Hammer className="h-6 w-6" />
                        <span className="text-[18px]">Ručni alat</span>
                      </Link>
                      </AccordionContent>
                    </AccordionItem>
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
                  <Link href="/elementi-za-pricvrscivanje" className="flex flex-row items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors">
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