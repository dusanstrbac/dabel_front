'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button"; // adjust if your path differs
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import React, { useState } from "react";

const PromenaPodatakaKorisnika = () => {
  const params = useSearchParams();

  const korisnickoIme = params.get("korisnickoIme") || "";
  const lozinka = params.get("lozinka") || "";
  const ime = params.get("ime") || "";
  const prezime = params.get("prezime") || "";
  const aktivan = params.get("aktivan") || "";
  const telefon = params.get("telefon") || "";
  const mobilniTelefon = params.get("mobilniTelefon") || "";
  const email = params.get("email") || "";
  const uloga = params.get("uloga") || "";

  const [selectedAktivan, setSelectedAktivan] = useState(aktivan || "Select");
  const [selectedRole, setSelectedRole] = useState(uloga || "Select");

  return (
    <div className="flex flex-col gap-2 mt-[50px] items-center pb-20">
      <h1 className="text-2xl font-medium">Promena podataka korisnika</h1>

      <div className='lg:px-[120px] mt-[40px]'>
        <div className='flex flex-wrap justify-between gap-10 lg:gap-4 pb-10'>
          <div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between gap-2'>
                <p>Korisničko ime:</p>
                <textarea defaultValue={korisnickoIme} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>Lozinka:</p>
                <textarea defaultValue={lozinka} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>Ime:</p>
                <textarea defaultValue={ime} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>Prezime:</p>
                <textarea defaultValue={prezime} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>Aktivan:</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gray-400 hover:bg-gray-400">
                    {selectedAktivan}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setSelectedAktivan("Da")}>
                      Da
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedAktivan("Ne")}>
                      Ne
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-6 text-left lg:text-right'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between gap-2'>
                <p>Telefon:</p>
                <textarea defaultValue={telefon} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>Mobilni telefon:</p>
                <textarea defaultValue={mobilniTelefon} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>E-mail:</p>
                <textarea defaultValue={email} className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-hidden overflow-y-hidden whitespace-nowrap"></textarea>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <p>Uloga:</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gray-400 hover:bg-gray-400">{selectedRole}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setSelectedRole("Sve aktivnosti")}>
                      Sve aktivnosti
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSelectedRole("Rezervisanje robe")}>
                      Rezervisanje robe
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="bg-gray-400 hover:bg-gray-400">Sačuvaj promene</Button>
        </div>
      </div>
    </div>
  );
};

export default PromenaPodatakaKorisnika;