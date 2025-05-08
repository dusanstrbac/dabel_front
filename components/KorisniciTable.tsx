"use client"
import React, { useState } from "react";
import { Props } from "next/script";
import { Button } from "./ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
  } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation";
import Link from "next/link";

interface myProps {
    title: string;
}


const KorisniciTable = ({ title } : myProps )=> {

// Zameniti sa podacima iz API-a
// const tebelaStavke = await getStavke(params.korisnik);

    const [selectedAktivan, setSelectedAktivan] = useState("Select");
    const [selectedRole, setSelectedRole] = useState("Select");
    const router = useRouter();

    const tabelaStavke = [
        { korisnickoIme: "danilo", lozinka: "***", ime: "Danilo", prezime: "Dabovic", aktivan: "Da", telefon: "0698211007", mobilniTelefon: "", email: "danilo.d@dabel.rs", uloga: "Sve aktivnosti"},
        { korisnickoIme: "perapera", lozinka: "***", ime: "Petar", prezime: "Petrovic", aktivan: "Ne", telefon: "011345789", mobilniTelefon: "0655342887", email: "petar@gmail.com", uloga: "Sve aktivnosti"},    
    ];

    return (
        <div className="flex flex-col gap-2 lg:gap-4 mt-[50px] lg:items-center lg:justify-center pb-20">
            
            <div className="flex justify-center w-full lg:w-[800px]">
                <h1 className="font-bold text-3xl">{title}</h1>
            </div>

            <div className="pb-20">
            <Table className="lg:w-[800px]">
                <TableHeader className="bg-gray-400 hover:bg-gray-400">
                    <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="lg:w-[200px] text-xl">Korisničko ime</TableHead>
                    <TableHead className="text-xl">Lozinka</TableHead>
                    <TableHead className="text-xl">Ime</TableHead>
                    <TableHead className="text-xl">Prezime</TableHead>
                    <TableHead className="text-xl">Aktivan</TableHead>
                    <TableHead className="text-xl">Telefon</TableHead>
                    <TableHead className="text-xl">Mobilni telefon</TableHead>
                    <TableHead className="text-xl">E-mail</TableHead>
                    <TableHead className="text-xl">Uloga</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tabelaStavke.map((stavka) => (
                        <TableRow key={stavka.korisnickoIme} className="hover:odd:bg-gray-300">
                            <TableCell className="text-center">
                            <Link
                                href={{
                                pathname: "/dusan/profil/korisnici/promena",
                                query: {
                                    korisnickoIme: stavka.korisnickoIme,
                                    lozinka: stavka.lozinka,
                                    ime: stavka.ime,
                                    prezime: stavka.prezime,
                                    aktivan: stavka.aktivan,
                                    telefon: stavka.telefon,
                                    mobilniTelefon: stavka.mobilniTelefon,
                                    email: stavka.email,
                                    uloga: stavka.uloga,
                                }
                                }}
                            >
                                <Button className="bg-gray-400 hover:bg-gray-400">Promena</Button>
                            </Link>
                            </TableCell>
                            <TableCell className="font-medium text-center">{stavka.korisnickoIme}</TableCell>
                            <TableCell className="font-medium text-center">{stavka.lozinka}</TableCell>
                            <TableCell className="text-center">{stavka.ime}</TableCell>
                            <TableCell className="text-center">{stavka.prezime}</TableCell>
                            <TableCell className="text-center">{stavka.aktivan}</TableCell>
                            <TableCell className="text-center">{stavka.telefon}</TableCell>
                            <TableCell className="text-center">{stavka.mobilniTelefon}</TableCell>
                            <TableCell className="text-center">{stavka.email}</TableCell>
                            <TableCell className="text-center">{stavka.uloga}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            <div className="flex justify-center w-full lg:w-[800px]">
                <h1 className="text-2xl font-medium">Kreiranje novog korisnika</h1>
            </div>
            <div className='lg:px-[120px] lg:mt-[40px]'>
            <div className='flex flex-wrap justify-between gap-10 lg:gap-4 pb-10'>
                <div>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                            <p>Korisničko ime:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <p>Lozinka:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <p>Ime:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <p>Prezime:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
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

                <div className='flex flex-col lg:gap-6 text-left lg:text-right'>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center justify-between gap-2'>
                            <p>Telefon:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <p>Mobilni telefon:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap"></textarea>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <p>E-mail:</p>
                            <textarea className="w-48 h-8 outline-1 outline-gray-400 rounded px-2 py-1 resize-none overflow-x-hidden overflow-y-hidden whitespace-nowrap"></textarea>
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
                <Button className="bg-gray-400 hover:bg-gray-400">Kreiraj</Button>
            </div>
        </div>
        </div>
        
    );
}

export default KorisniciTable;