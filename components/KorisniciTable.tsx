import { Props } from "next/script";
import { Button } from "./ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";

interface myProps {
    title: string;
}

const KorisniciTable = ({ title } : myProps )=> {

// Zameniti sa podacima iz API-a
// const tebelaStavke = await getStavke(params.korisnik);


    const tabelaStavke = [
        { korisnickoIme: "danilo", lozinka: "***", ime: "Danilo", prezime: "Dabovic", aktivan: "Da", telefon: "0698211007", mobilniTelefon: "", email: "danilo.d@dabel.rs", uloga: "Sve aktivnosti"},
        { korisnickoIme: "perapera", lozinka: "***", ime: "Petar", prezime: "Petrovic", aktivan: "Ne", telefon: "011345789", mobilniTelefon: "0655342887", email: "petar@gmail.com", uloga: "Sve aktivnosti"},    
    ];

    return (
        <div className="flex flex-col gap-2 lg:gap-4 mt-[50px] lg:items-center lg:justify-center">
            
            <div className="flex justify-between items-center w-full lg:w-[800px]">
                <h1 className="font-bold text-3xl">{title}</h1>
            </div>

            <div className="">
            <Table className="lg:w-[800px]">
                <TableHeader className="bg-gray-400 hover:bg-gray-400">
                    <TableRow>
                    <TableHead className="lg:w-[200px] text-xl">Korisničko ime</TableHead>
                    <TableHead className="text-xl">Lozinka</TableHead>
                    <TableHead className="text-xl">Ime</TableHead>
                    <TableHead className="text-xl">Prezime</TableHead>
                    <TableHead className="text-xl">Aktivan</TableHead>
                    <TableHead className="text-xl">Telefon</TableHead>
                    <TableHead className="text-xl">Mobilni telefon</TableHead>
                    <TableHead className="text-xl">E-mail</TableHead>
                    <TableHead className="text-xl">Uloga</TableHead>
                    <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tabelaStavke.map((stavka) => (
                        <TableRow key={stavka.korisnickoIme} className="hover:odd:bg-gray-300">
                            <TableCell className="font-medium text-center">{stavka.korisnickoIme}</TableCell>
                            <TableCell className="font-medium text-center">{stavka.lozinka}</TableCell>
                            <TableCell className="text-center">{stavka.ime}</TableCell>
                            <TableCell className="text-center">{stavka.prezime}</TableCell>
                            <TableCell className="text-center">{stavka.aktivan}</TableCell>
                            <TableCell className="text-center">{stavka.telefon}</TableCell>
                            <TableCell className="text-center">{stavka.mobilniTelefon}</TableCell>
                            <TableCell className="text-center">{stavka.email}</TableCell>
                            <TableCell className="text-center">{stavka.uloga}</TableCell>
                            <TableCell className="text-center">
                                <Button className="bg-gray-400 hover:bg-gray-400">Promena</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            <div className="flex justify-between items-center w-full lg:w-[800px]">
                <h1 className="text-2xl">Kreiranje novog korisnika</h1>
            </div>
            <div className='lg:px-[120px] lg:mt-[40px]'>
            <div className='flex flex-wrap justify-between gap-10 lg:gap-4 '>
                <div>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <p>Korisničko ime:</p>
                            <textarea></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Lozinka:</p>
                            <textarea></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Ime:</p>
                            <textarea></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Prezime:</p>
                            <textarea></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Aktivan:</p>
                            <Button className="bg-gray-400 hover:bg-gray-400">Select</Button>
                        </div>
                    </div>
                </div>                

                <div className='flex flex-col lg:gap-6 text-left lg:text-right'>
                    <div className='mt-4 flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <p>Telefon:</p>
                            <textarea></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Mobilni telefon:</p>
                            <textarea className=""></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>E-mail:</p>
                            <textarea></textarea>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Uloga:</p>
                            <Button className="bg-gray-400 hover:bg-gray-400">Select</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </div>
        
    );
}

export default KorisniciTable;