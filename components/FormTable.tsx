'use client';
import { Button } from "./ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

interface myProps {
    title: string;
}

const FormTable = ({ title } : myProps )=> {
    const [korisnik, setKorisnik] = useState<string | null>(null);


    useEffect(() => {
        const imeKorisnika = getCookie("KorisnickoIme") as string | null;
        setKorisnik(imeKorisnika);
    }, []);


    const izvuciDokumenta = async () => {
        const idKorisnika = getCookie("IdKorisnika");
        const res = await fetch(`http://10.0.0.63:2034/api/v2/Dokument/Narudzbenica/${idKorisnika}/Partner?offset=0&limit=10`);
        const data = await res.json();

        console.log(data);
    }

    izvuciDokumenta();

    return (
        <div className="flex flex-col gap-2 lg:gap-4 mt-[50px] lg:items-center lg:justify-center">
            
            <div className="flex justify-between items-center w-full lg:w-[800px]">
                <h1 className="font-bold text-3xl">{title}</h1>
                <Button variant={"outline"} className="lg:px-6 cursor-pointer">Sortiraj</Button>
            </div>

            <div className="">
            <Table className="lg:w-[800px]">
                <TableHeader>
                    <TableRow>
                    <TableHead className="lg:w-[200px] text-xl">Datum</TableHead>
                    <TableHead className="text-xl">Dokument</TableHead>
                    <TableHead className="text-xl text-right">Iznos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* {tabelaStavke.map((stavka) => (
                        <TableRow key={stavka.dokument} className="hover:odd:bg-gray-300">
                            <TableCell className="font-medium">{stavka.datum}</TableCell>
                            <TableCell>
                                <Link href={`/${korisnik}/dokument/${stavka.dokument}`} className="text-blue-500 hover:underline">
                                    {stavka.dokument}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">{stavka.iznos}</TableCell>
                        </TableRow>
                    ))} */}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-gray-400 hover:bg-gray-400">
                        <TableCell className="font-medium">Ukupno:</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right">117584.28</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            </div>
        </div>
    );
}

export default FormTable;