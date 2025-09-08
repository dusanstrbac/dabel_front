'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dajKorisnikaIzTokena } from '@/lib/auth';

interface Stavka {
  id: number;
  idArtikla: string;
  nazivArtikla: string;
  cena: number;
  originalnaCena: number;
  kolicina: string;
  pdv: string;
  ukupnaCena: number;
}

const RezervacijaDetailPage = () => {
  const { id } = useParams();
  const [stavke, setStavke] = useState<Stavka[]>([]);
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const partner = dajKorisnikaIzTokena()?.idKorisnika;

  useEffect(() => {
    if (!id) return;
    const fetchDokument = async () => {
      const res = await fetch(`${apiAddress}/api/Dokument/DajRezervacije?idPartnera=${partner}`);
      const dokumenti = await res.json();
      const dokument = dokumenti.find((d: any) => String(d.idDokumenta) === String(id));
      if (dokument) {
        setStavke(dokument.stavkeDokumenata || []);
      }
    };
    fetchDokument();
  }, [id]);

  const format = (n: number) => Number(n).toFixed(2);

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold mb-10">Stavke rezervacije</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Naziv artikla</TableHead>
            <TableHead className="text-center">Količina</TableHead>
            <TableHead className="text-center">Cena (bez PDV)</TableHead>
            <TableHead className="text-center">PDV %</TableHead>
            <TableHead className="text-center">Ukupna cena</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stavke.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.nazivArtikla}</TableCell>
              <TableCell className="text-center">{s.kolicina}</TableCell>
              <TableCell className="text-center">{format(s.cena)} RSD</TableCell>
              <TableCell className="text-center">{s.pdv}%</TableCell>
              <TableCell className="text-center">{format(s.ukupnaCena)} RSD</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="font-bold text-right">Ukupno:</TableCell>
            <TableCell className="text-center font-bold">
              {format(stavke.reduce((sum, s) => sum + s.ukupnaCena, 0))} RSD
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default RezervacijaDetailPage;
