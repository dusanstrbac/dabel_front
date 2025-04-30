'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  User2, 
  History, 
  CreditCard, 
  Package, 
  Users, 
  BadgeDollarSign, 
  Youtube, 
  Key, 
  LogOut, 
  Wallet
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function KorisnikMenu() {
    const [isMounted, setIsMounted] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);

        setUsername(localStorage.getItem('username'));
    }, []);

    if (!isMounted) {
        return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full">
            <User className="h-5 w-5 text-gray-500" />
        </div>
        );
    }

    /*
        Uraditi proveru ukoliko korisnik nije ulogovan
        
        if (!username) {
            return <div className="h-9 w-9 bg-gray-100 rounded-full" />;
        }  

    */

    const menuItems = [
        { icon: <User2 className="h-4 w-4" />, text: "Moji podaci", href: username ? `${username}/profil/podaci` : '/profil/podaci' }, // Staviti ako korisnik nije ulogovan da ga salje na /login-page
        { icon: <History className="h-4 w-4" />, text: "Istorija poručivanja", href: "/profil/istorija" },
        { icon: <Wallet className="h-4 w-4" />, text: "Moje uplate", href: "/profil/uplate" },
        { icon: <Package className="h-4 w-4" />, text: "Poslata roba", href: "/profil/posiljke" },
        { icon: <Users className="h-4 w-4" />, text: "Korisnici", href: "/admin/korisnici" },
        { icon: <BadgeDollarSign className="h-4 w-4" />, text: "Cenovnik", href: "/admin/cenovnik" },
        { icon: <Youtube className="h-4 w-4" />, text: "Video uputstva", href: "/video-uputstva" },
        { icon: <Key className="h-4 w-4" />, text: "Promena lozinke", href: "/profil/podesavanja" },
    ];


  return (
    <DropdownMenu>
        
        <DropdownMenuTrigger asChild>
          <User className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </DropdownMenuTrigger>
      
        <DropdownMenuContent 
            className="w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            align="end"
        >
            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-normal text-gray-600">
            Korisnik
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
            <button className="flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm text-red-600 hover:bg-gray-100">
                <LogOut className="h-4 w-4" />
                <span>Odjava</span>
            </button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default KorisnikMenu;