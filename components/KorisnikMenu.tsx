'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  User2, 
  History, 
  Package, 
  Users, 
  BadgeDollarSign, 
  Youtube, 
  Key, 
  LogOut, 
  Wallet
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuSeparator } from './ui/dropdown-menu';
import Link from 'next/link';
import { deleteCookie, getCookie } from 'cookies-next';

export function KorisnikMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLoading(false);
    // Provera postojanja kolacica
    const fetchData = async() => {
      try {
        // const token = await getCookie('auth_token');
        const user = await getCookie('KorisnickoIme');

         if(user) {
           setIsLoggedIn(true);
           setUsername(user as string);
         } 
        else {
          setIsLoggedIn(false);
          setUsername(null)
        }
      } catch(err) {
        console.log(err);
        setIsLoggedIn(false);
      }
    };
    fetchData();

  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full">
        <User className="h-5 w-5 text-gray-500" />
      </div>
    );
  }

  const menuItems = [
    { icon: <User2 className="h-4 w-4" />, text: "Moji podaci", href: username ? `/${username}/profil/podaci` : '/login' },
    { icon: <History className="h-4 w-4" />, text: "Istorija poručivanja", href: username ? `/${username}/profil/istorija` : '/login' },
    { icon: <Wallet className="h-4 w-4" />, text: "Moje uplate", href: username ? `/${username}/profil/uplate` : '/login' },
    { icon: <Package className="h-4 w-4" />, text: "Poslata roba", href: username ? `/${username}/profil/roba` : '/login' },
    { icon: <Users className="h-4 w-4" />, text: "Korisnici", href: username ? `/${username}/profil/korisnici` : '/login' },
    { icon: <BadgeDollarSign className="h-4 w-4" />, text: "Cenovnik", href: "/admin/cenovnik" },
    { icon: <Youtube className="h-4 w-4" />, text: "Video uputstva", href: "/video" },
    { icon: <Key className="h-4 w-4" />, text: "Promena lozinke", href: username ? `/${username}/profil/podesavanja` : '/login' },
  ];

  const odjaviKorisnika = () => {
    deleteCookie('Email');
    deleteCookie('KorisnickoIme');
    window.location.href = '/';
  };

  const prijaviKorisnika = () => {
    window.location.href = '/login';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer z-20" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg" align="end">
        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-normal text-gray-600">
          {username ? username : 'Korisnik'}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-1" />
        
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={item.href}
              className="flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem asChild>
          {isLoggedIn ? (
            <button onClick={odjaviKorisnika} className="flex cursor-pointer w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm text-red-600 hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              <span>Odjava</span>
            </button> ) : (
            <button onClick={prijaviKorisnika} className="flex cursor-pointer w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              <span>Prijavi se</span>
            </button>
            )} 
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default KorisnikMenu;
