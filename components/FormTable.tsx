'use client';
import { Button } from "./ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import SortirajTabele from "./ui/sortirajTabele";

interface myProps {
    title: string;
}

const FormTable = ({ title } : myProps )=> {
    const korisnik = dajKorisnikaIzTokena();
    const [error, setError] = useState('');
    const [dokumenta, setDokumenta] = useState('');
    const [loading, setLoading] = useState(false);
    
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    
    useEffect(() => {
        const izvuciDokumenta = async () => {
            try {
                const idKorisnika = korisnik?.idKorisnika;
                const res = await fetch(`${apiAddress}/api/v2/Dokument/Narudzbenica/${idKorisnika}/Partner?offset=0&limit=10`);
                if (!res.ok) {
                throw new Error("Greška pri učitavanju podataka.");
                }
                const data = await res.json();
                setDokumenta(data); // Postavljanje podataka u state
            } catch (err: any) {
                setError(err.message); // Postavljanje greške u state
            } finally {
                setLoading(false); // Završava loading
            }
        };
        izvuciDokumenta();
    }, []);

    if (loading) return <div>Učitavanje podataka...</div>;
    if (error) return <div>Greška: {error}</div>;
    if (!dokumenta.length) return <div>Nema podataka.</div>;

    return (
        <div className="flex flex-col gap-2 lg:gap-4 mt-[50px] lg:items-center lg:justify-center">
            
            <div className="flex justify-between items-center w-full lg:w-[800px]">
                <h1 className="font-bold text-3xl">{title}</h1>
                <SortirajTabele/>
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