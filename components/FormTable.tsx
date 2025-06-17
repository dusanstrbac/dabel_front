'use client';

import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import Pagination from "./ui/pagination";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation"; 


interface myProps {
  title: string;
}

const FormTable = ({ title }: myProps) => {
  const korisnik = dajKorisnikaIzTokena();
  const [error, setError] = useState("");
  const [dokumenta, setDokumenta] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<'datum' | 'cena'>('datum');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const pathname = usePathname();
  const prikazNarudzbenica = pathname.includes(`/narudzbenica`);


  const itemsPerPage = 15;

  // sortiraj dokumenta po izabranom ključu i redosledu
  const sortiranaDokumenta = [...dokumenta].sort((a, b) => {
    if (sortKey === 'datum') {
      const dateA = new Date(a.datumDokumenta).getTime();
      const dateB = new Date(b.datumDokumenta).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const sumaA = a.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
      const sumaB = b.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
      return sortOrder === 'asc' ? sumaA - sumaB : sumaB - sumaA;
    }
  });

  // izdvajamo samo deo podataka za prikaz na trenutnoj stranici
  const paginatedDokumenta = sortiranaDokumenta.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ukupna suma iz prikazanih dokumenata
  const ukupnaSuma = paginatedDokumenta.reduce((sum, dok) => {
    const suma = dok.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
    return sum + suma;
  }, 0);

  // učitavanje podataka
  useEffect(() => {
    if (!korisnik) return;
    const izvuciDokumenta = async () => {
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const idKorisnika = korisnik?.idKorisnika;
        const res = await fetch(
          `${apiAddress}/api/Dokument/DajDokumentePoPartneru?idPartnera=${idKorisnika}`
        );

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
  }, [korisnik]);

  if (loading) return <div>Učitavanje podataka...</div>;
  if (error) return <div>Greška: {error}</div>;
  if (!dokumenta.length) return <div>Nema podataka.</div>;



  return (
    <div className="flex flex-col gap-2 lg:gap-4 mt-[20px] lg:items-center lg:justify-center">
      <div className="flex justify-between items-center w-full lg:w-[800px]">
        <h1 className="font-bold text-3xl">{title}</h1>
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() =>
              setSortKey((prev) => (prev === 'datum' ? 'cena' : 'datum'))
            }
          >
            Sortiraj po: {sortKey === 'datum' ? 'Datumu' : 'Ceni'}
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() =>
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
            }
          >
            Redosled: {sortOrder === 'asc' ? 'Rastuće' : 'Opadajuće'}
          </Button>
        </div>
      </div>

      <div>
        <Table className="lg:w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="lg:w-[200px] text-xl">Datum</TableHead>
              <TableHead className="text-xl">Dokument</TableHead>
              {prikazNarudzbenica && (
                <TableHead className="text-xl">Status</TableHead>
              )}
              <TableHead className="text-xl text-right">Iznos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDokumenta.map((dokument, index) => {
              const status = dokument.status || (index % 2 === 0 ? "U obradi" : "Poslat");
              console.log("Evo ga status ", status);
              const ukupno =
                dokument.stavkeDokumenata?.reduce(
                  (sum: number, stavka: any) => sum + stavka.ukupnaCena,
                  0
                ) ?? 0;

              return (
                <TableRow key={index} className="hover:odd:bg-gray-300">
                  <TableCell className="font-medium">
                    {new Date(dokument.datumDokumenta).toLocaleDateString("sr-RS")}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/${korisnik?.korisnickoIme}/dokument/${dokument.brojDokumenta}`}
                      className="text-blue-500 hover:underline"
                    >
                      {dokument.brojDokumenta}
                    </a>
                  </TableCell>
                  {prikazNarudzbenica && (
                    <TableCell className="flex items-center gap-2">
                      <span
                        className={`
                          inline-block w-3 h-3 rounded-full border
                          ${status === "U obradi" ? "border-yellow-500" : "border-green-600"}
                        `}
                      />
                      <span className="text-sm">{status}</span>
                    </TableCell>
                  )}

                  <TableCell className="text-right">{ukupno.toFixed(2)}</TableCell>
                  {prikazNarudzbenica && (
                    <TableCell className="flex justify-center">
                      <a 
                        href="#"
                        className="text-blue-500 font-bold hover:underline justify-end"
                      >
                        Opoziv
                      </a>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-gray-400 hover:bg-gray-400">
              <TableCell className="font-medium">Ukupno:</TableCell>
              <TableCell></TableCell>
              {prikazNarudzbenica && (
                <TableCell/>
              )}
              <TableCell className="text-right">{ukupnaSuma.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Pagination
          totalItems={sortiranaDokumenta.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default FormTable;
