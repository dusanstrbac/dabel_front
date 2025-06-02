"use client"
import React, { useEffect, useState } from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pagination } from "./ui/pagination";
import KreirajKorisnika from "./KreirajKorisnika";
import PromenaPodatakaKorisnika from "./PromenaPodatakaKorisnika";
import { Input } from "./ui/input";

interface myProps {
    title: string;
}


const KorisniciTable = ({ title } : myProps )=> {

    const [tabelaStavke, setTabelaStavke] = useState<any[]>([]);
    const [pretraga, setPretraga] = useState("");
    const [trenutnaStrana, setTrenutnaStrana] = useState(1);
    const korisnikaPoStrani = 10;

    useEffect(() => {
        const fethujPartnere = async () => {
            try {
                const res = await fetch("http://localhost:7235/api/Partner/DajPartnere");
                const data = await res.json();
                setTabelaStavke(data);
            } catch (err) {
                console.error("Greska: ", err);
            }
        };
        fethujPartnere();
    }, []);

    const filtriraniKorisnici = tabelaStavke.filter((korisnik) => 
        korisnik.ime.toLowerCase().includes(pretraga.toLowerCase()) ||
        korisnik.email.toLowerCase().includes(pretraga.toLowerCase()),
    )
    
    const trenutniBrojKorisnika = filtriraniKorisnici.slice(
        (trenutnaStrana - 1 ) * korisnikaPoStrani,
        trenutnaStrana * korisnikaPoStrani
    );

    return (
        <div className="mt-2 flex flex-col gap-2 lg:gap-4">
            
            <div className="flex justify-between items-center w-full px-2 lg:px-4 flex-wrap">
                <h1 className="font-bold text-3xl text-center">{title}</h1>
                <div className="flex gap-2">
                    <Input type="text" placeholder="Pretraga korisnika" className="border-2" value={pretraga} onChange={(e) => setPretraga(e.target.value)} />
                    <KreirajKorisnika />
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-400 hover:bg-gray-400">
                        <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="text-xl">Korisničko ime</TableHead>
                        <TableHead className="text-xl">E-mail</TableHead>
                        <TableHead className="text-xl">Telefon</TableHead>
                        <TableHead className="text-xl">Adresa</TableHead>
                        <TableHead className="text-xl">Aktivan</TableHead>
                        <TableHead className="text-xl">Uloga</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trenutniBrojKorisnika.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center">
                                    Nema podataka
                                </TableCell>
                            </TableRow>
                        ) : (
                            trenutniBrojKorisnika.map((stavka) => (
                                <TableRow key={stavka.ime}>
                                    <TableCell>
                                        <PromenaPodatakaKorisnika
                                            korisnik={{
                                                korisnickoIme: stavka.ime,
                                                lozinka: stavka.lozinka,
                                                email: stavka.email,
                                                telefon: stavka.telefon,
                                                status: stavka.status,
                                                uloga: stavka.uloga,
                                                adresa: stavka.adresa,
                                                grad: stavka.grad,
                                                delatnost: stavka.delatnost,
                                                pib: stavka.pib,
                                                maticniBroj: stavka.maticniBroj,
                                                zip: stavka.zip,
                                                finKarta: stavka.finKarta || { kredit: ''}
                                            }}
                                        /> 
                                    </TableCell>
                                    <TableCell className="text-left">{stavka.ime}</TableCell>
                                    <TableCell className="text-left lg:pl-2 truncate">{stavka.email}</TableCell>
                                    <TableCell className="lg:pl-2">{stavka.telefon}</TableCell>
                                    <TableCell className="lg:pl-2">{stavka.adresa}</TableCell>                            
                                    <TableCell className="lg:pl-2">{stavka.aktivan}</TableCell>
                                    <TableCell className="lg:pl-2">{stavka.uloga}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                totalItems={filtriraniKorisnici.length}
                itemsPerPage={korisnikaPoStrani}
                currentPage={trenutnaStrana}
                onPageChange={setTrenutnaStrana}
            />
        </div>

    );
}

export default KorisniciTable;