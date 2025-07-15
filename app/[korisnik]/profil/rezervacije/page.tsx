'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dajKorisnikaIzTokena } from '@/lib/auth';

type Rezervacija = {
  idDokumenta: string;
  brojDokumenta: string;
  datumDokumenta: string;
};

const RezervacijePage = () => {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  const router = useRouter();

  useEffect(() => {
    const idPartnera = dajKorisnikaIzTokena()?.idKorisnika;

    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const fetchRezervacije = async () => {
      const res = await fetch(`${apiAddress}/api/Dokument/DajRezervacije?idPartnera=${idPartnera}`);
      const data = await res.json();
      setRezervacije(data);
    };
    fetchRezervacije();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold mb-10">Rezervisana roba</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naziv dokumenta</TableHead>
            <TableHead>Datum rezervacije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rezervacije.map((rez) => (
            <TableRow
              key={rez.idDokumenta}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/rezervacije/${rez.idDokumenta}`)}
            >
              <TableCell>{rez.brojDokumenta}</TableCell>
              <TableCell>{new Date(rez.datumDokumenta).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RezervacijePage;
