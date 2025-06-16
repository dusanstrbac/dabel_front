'use client';

import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import { useEffect, useState } from "react";
import { dajKorisnikaIzTokena } from "@/lib/auth";

interface myProps {
    title: string;
}

const FormTable = ({ title }: myProps) => {
    const korisnik = dajKorisnikaIzTokena();
    const [error, setError] = useState('');
    const [dokumenta, setDokumenta] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const izvuciDokumenta = async () => {
            try {
                const idKorisnika = korisnik?.idKorisnika;
                const res = await fetch(`http://localhost:7235/api/Dokument/DajDokumentePoPartneru?idPartnera=${idKorisnika}`);

                if (!res.ok) {
                    throw new Error("Greška pri učitavanju podataka.");
                }
                const data = await res.json();
                setDokumenta(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        izvuciDokumenta();
    }, []);

    const ukupnaSuma = dokumenta.reduce((sum, dok) => {
        const suma = dok.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
        return sum + suma;
    }, 0);

    if (loading) return <div>Učitavanje podataka...</div>;
    if (error) return <div>Greška: {error}</div>;
    if (!dokumenta.length) return <div>Nema podataka.</div>;

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
                        {dokumenta.map((dokument, index) => {
                            const ukupno = dokument.stavkeDokumenata?.reduce(
                                (sum: number, stavka: any) => sum + stavka.ukupnaCena,
                                0
                            ) ?? 0;

                            return (
                                <TableRow key={index} className="hover:odd:bg-gray-300">
                                    <TableCell className="font-medium">
                                        {new Date(dokument.datumDokumenta).toLocaleDateString('sr-RS')}
                                    </TableCell>
                                    <TableCell>
                                        <a href={`/${korisnik?.korisnickoIme}/dokument/${dokument.brojDokumenta}`} className="text-blue-500 hover:underline">
                                            {dokument.brojDokumenta}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-right">{ukupno.toFixed(2)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow className="bg-gray-400 hover:bg-gray-400">
                            <TableCell className="font-medium">Ukupno:</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right">{ukupnaSuma.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
};

export default FormTable;
