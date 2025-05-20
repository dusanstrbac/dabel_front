import { Props } from "next/script";
import { Button } from "./ui/button";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table";
import SortirajTabele from "./ui/sortirajTabele";

interface myProps {
    title: string;
}

const FormTable = ({ title } : myProps )=> {

// Zameniti sa podacima iz API-a
// const tebelaStavke = await getStavke(params.korisnik);


    const tabelaStavke = [
        { datum: "12.03.2025.", dokument: "1-1612", iznos: 177584.28 },
        { datum: "12.03.2025.", dokument: "1-1699", iznos: 177584.28 },
        { datum: "12.03.2025.", dokument: "1-1602", iznos: 177584.28 },
        { datum: "12.03.2025.", dokument: "1-1619", iznos: 177584.28 },
        { datum: "12.03.2025.", dokument: "1-1622", iznos: 280009.28 },
        { datum: "12.03.2025.", dokument: "1-1639", iznos: 177584.28 },
        { datum: "12.03.2025.", dokument: "1-1642", iznos: 280009.28 },
    
    ];

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
                    {tabelaStavke.map((stavka) => (
                        <TableRow key={stavka.dokument} className="hover:odd:bg-gray-300">
                            <TableCell className="font-medium">{stavka.datum}</TableCell>
                            <TableCell>{stavka.dokument}</TableCell>
                            <TableCell className="text-right">{stavka.iznos}</TableCell>
                        </TableRow>
                    ))}
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