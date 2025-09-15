'use client';

import { useState, useEffect } from 'react';
import { User, User2, Package, Users, BadgeDollarSign, Key, LogOut, Wallet, FileText, ShieldUser } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import Link from 'next/link';
import { deleteCookie, getCookie } from 'cookies-next';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function KorisnikMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [korisnickoIme, setKorisnickoIme] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const korisnik = dajKorisnikaIzTokena();
  const username = korisnik?.korisnickoIme;
  const uloga = korisnik?.webUloga;
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const t = useTranslations('header');

  useEffect(() => {
    const korisnik = dajKorisnikaIzTokena();
    if (korisnik?.korisnickoIme) {
      setKorisnickoIme(korisnik.korisnickoIme);
      setIsLoggedIn(true);
    } else {
      setKorisnickoIme(null);
      setIsLoggedIn(false);
    }
    setIsMounted(true);
  }, []);

  const odjaviKorisnika = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("webparametri");
    
    deleteCookie('AuthToken');
    router.push('/login');
    window.location.reload();
  };

  const preuzmiCenovnik = async () => {
    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const token = getCookie("AuthToken");

      const response = await fetch(`${apiAddress}/api/Web/PreuzmiCenovnik`, {
        method: 'GET',
          headers: {
          Authorization: `Bearer ${token}`
        }      
      });

      if (!response.ok) {
        throw new Error('Greška prilikom preuzimanja cenovnika.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'cenovnik.xlsx';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full">
        <User className="h-5 w-5 text-gray-500" />
      </div>
    );
  }

  const menuItems = [
    ...(uloga === 'ADMINISTRATOR' ? [
      { icon: <ShieldUser className="h-4 w-4" />, text: 'Admin podešavanja', href: `/${username}/admin` },
    ] : []),
   ...(uloga === 'PARTNER' || uloga === 'PODKORISNIK' ? [
      { icon: <User2 className="h-4 w-4" />, text: t('header-MojiPodaci'), href: `/${username}/profil/podaci` },
      { icon: <FileText className="h-4 w-4" />, text: t('header-Narudzbenica'), href: `/${username}/profil/narudzbenica` },
      { icon: <Wallet className="h-4 w-4" />, text: t('header-MojeUplate'), href: `/${username}/profil/uplate` },
      { icon: <Package className="h-4 w-4" />, text: t('header-PoslataRoba'), href: `/${username}/profil/roba` },
      { icon: <BadgeDollarSign className="h-4 w-4" />, text: t('header-Cenovnik'), onClick: preuzmiCenovnik },
      //{ icon: <Youtube className="h-4 w-4" />, text: 'Video uputstva', href: '/video' },
    ] : []),
    ...(uloga === "PARTNER" ? [
      { icon: <Users className="h-4 w-4" />, text: t('header-Korisnici'), href: `/${username}/profil/korisnici` },
    ] : []),
    ...(uloga === 'PARTNER' || uloga === 'ADMINISTRATOR' || uloga === 'PODKORISNIK' ? [
      { icon: <Key className="h-4 w-4" />, text: t('header-PromenaLozinke'), href: `/${username}/profil/podesavanja` },
    ] : []),

  ];

  return (
    <>
      {/* Desktop meni */}
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <User className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg" align="end">
            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-normal text-gray-600">
              {korisnickoIme || t('header-Korisnik')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
              {menuItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="flex w-full items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </button>
                  ) : (
                    <Link href={item.href} className="flex w-full items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100">
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator className="my-1" />
            {isLoggedIn ? (
              <DropdownMenuItem asChild>
                <button
                  onClick={odjaviKorisnika}
                  className="flex w-full items-center gap-3 px-2 py-1.5 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('header-Odjava')}</span>
                </button>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex w-full items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('header-PrijaviSe')}</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => router.push('/register')}
                    className="flex w-full items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100"
                  >
                    <User2 className="h-4 w-4" />
                    <span>{t('header-RegistrujSe')}</span>
                  </button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobilni meni */}
      <div className="lg:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <User className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader>
              <SheetTitle className="text-left text-lg font-semibold">
                {korisnickoIme}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-3">
              {menuItems.map((item, index) => (
                item.onClick ? (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-2 py-3 text-[15px] text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {item.icon}
                    {item.text}
                  </button>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsSheetOpen(false)}
                    className="flex items-center gap-3 px-2 py-3 text-[15px] text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {item.icon}
                    {item.text}
                  </Link>
                )
              ))}
              <div className="border-t pt-4 mt-4">
                {isLoggedIn ? (
                  <button
                    onClick={odjaviKorisnika}
                    className="flex items-center gap-3 px-2 py-2 text-red-600 hover:bg-gray-100 rounded text-[15px]"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('header-Odjava')}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/login')}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded text-[15px]"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('header-PrijaviSe')}
                    </button>
                    <button
                      onClick={() => router.push('/register')}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded text-[15px]"
                    >
                      <User2 className="w-5 h-5" />
                      {t('header-RegistrujSe')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
