import FormTable from "@/components/FormTable";
import { Button } from "@/components/ui/button";
import {Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Metadata } from "next";


type Props = {
    params: {
        korisnik: string;
    };
};

export function generateMetadata({ params }: Props): Metadata {
    return {
      title: `${params.korisnik} • Podaci`,
    };
}

const Istorija = () => {

    return (
        <FormTable title="Istorija poručivanja"/>
    );
}

export default Istorija;