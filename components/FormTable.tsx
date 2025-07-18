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
import { usePathname, useSearchParams } from "next/navigation"; 
import { toast } from "sonner";

interface myProps {
  title: string;
}

const statusMap: Record<number, string> = {
  0: "U obradi",
  1: "Obrađen",
  2: "Odbijen",
  3: "Greška",
  4: "Opozvan",
};

const statusPriority: Record<string, number> = {
  "U obradi": 1,
  "Obrađen": 2,
  "Odbijen": 3,
  "Greška": 4,
  "Opozvan": 5,
};

const FormTable = ({ title }: myProps) => {
  const [error, setError] = useState("");
  const [dokumenta, setDokumenta] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<'datum' | 'cena' | 'status'>('datum');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const pathname = usePathname();
  const prikazNarudzbenica = pathname.includes(`/narudzbenica`);
  const prikazPoslataRoba = pathname.includes(`/roba`);

  const itemsPerPage = 15;
  const searchParams = useSearchParams();
  const [korisnik, setKorisnik] = useState<any>(null);

  useEffect(() => {
    setKorisnik(dajKorisnikaIzTokena());
  }, []);

  const sortiranaDokumenta = [...dokumenta].sort((a, b) => {
    if (sortKey === 'datum') {
      const dateA = new Date(a.datumDokumenta).getTime();
      const dateB = new Date(b.datumDokumenta).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortKey === 'cena') {
      const sumaA = a.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
      const sumaB = b.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
      return sortOrder === 'asc' ? sumaA - sumaB : sumaB - sumaA;
    } else if (sortKey === 'status') {
      const statusA = statusMap[a.status] ?? "Nepoznat";
      const statusB = statusMap[b.status] ?? "Nepoznat";
      const priorityA = statusPriority[statusA] ?? 99;
      const priorityB = statusPriority[statusB] ?? 99;
      return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    }
    return 0;
  });

  const paginatedDokumenta = sortiranaDokumenta.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const ukupnaSuma = paginatedDokumenta.reduce((sum, dok) => {
    const suma = dok.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
    return sum + suma;
  }, 0);

  const ukupnaSumaSvihDokumenata = dokumenta.reduce((sum, dok) => {
    const suma = dok.stavkeDokumenata?.reduce((s: number, st: any) => s + st.ukupnaCena, 0) ?? 0;
    return sum + suma;
  }, 0);

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

        const dokumentiSaStatusom = data.map((dok: any) => ({
          ...dok,
          statusText: statusMap[dok.status] ?? "Nepoznat"
        }));

        const dokumentiZaPrikaz = prikazPoslataRoba
          ? dokumentiSaStatusom.filter((d: any) => d.statusText === "Obrađen")
          : dokumentiSaStatusom;

        setDokumenta(dokumentiZaPrikaz);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    izvuciDokumenta();
  }, [korisnik, prikazPoslataRoba]);


  const handleOpoziv = async (brojDokumenta: number) => {
  try {
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;

    const res = await fetch(`${apiAddress}/api/Dokument/OpozoviDokument`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ BrojDokumenta: brojDokumenta }),
    });

    if (!res.ok) {
      throw new Error("Greška prilikom opoziva dokumenta.");
    }

    toast.success("Dokument je uspešno opozvan.");
    setDokumenta((prev) =>
      prev.map((dok) =>
        dok.brojDokumenta === brojDokumenta
          ? { ...dok, status: 4, statusText: statusMap[4] }
          : dok
      )
    );
  } catch (err: any) {
    toast.error(err.message || "Došlo je do greške pri opozivu.");
  }
};


  if (loading) return <div>Učitavanje podataka...</div>;
  if (error) return <div>Greška: {error}</div>;
  if (!dokumenta.length) return <div>Nema podataka.</div>;

  return (
    <div className="flex flex-col gap-2 lg:gap-4 my-[20px] lg:items-center lg:justify-center">
      <div className="flex sm:flex-row flex-col justify-between items-center w-full lg:w-[800px] gap-3">
        <h1 className="font-bold text-3xl">{title}</h1>
        <div className="flex sm:flex-row flex-col jusitfy-end gap-2">
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() =>
              setSortKey((prev) => {
                if (prev === 'datum') return 'cena';
                if (prev === 'cena') return 'status';
                return 'datum';
              })
            }
          >
            Sortiraj po: {sortKey === 'datum' ? 'Datumu' : sortKey === 'cena' ? 'Ceni' : 'Statusu'}
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() =>
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
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
              const ukupno =
                dokument.stavkeDokumenata?.reduce(
                  (sum: number, stavka: any) => sum + stavka.ukupnaCena,
                  0
                ) ?? 0;

              const statusText = dokument.statusText;

              return (
                <TableRow key={index} className="hover:odd:bg-gray-300">
                  <TableCell className="font-medium">
                    {new Date(dokument.datumDokumenta).toLocaleDateString("sr-RS")}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/${korisnik?.korisnickoIme}/dokument/${dokument.brojDokumenta}`}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                    >
                      {dokument.brojDokumenta}
                    </a>
                  </TableCell>
                  {prikazNarudzbenica && (
                    <TableCell className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full border
                          ${
                            statusText === "U obradi"
                              ? "border-yellow-500"
                              : statusText === "Obrađen"
                              ? "border-green-600"
                              : "border-gray-500"
                          }
                        `}
                      />
                      <span className="text-sm">{statusText}</span>
                    </TableCell>
                  )}

                  <TableCell className="text-right">{ukupno.toFixed(2)}</TableCell>
                  {prikazNarudzbenica && (
                    <TableCell className="flex justify-center">
                      {dokument.status === 0 && (
                        <a
                          href="#"
                          className="text-blue-500 font-bold hover:underline justify-end"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpoziv(dokument.brojDokumenta);
                          }}
                        >
                          Opoziv
                        </a>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-gray-400 hover:bg-gray-400">
              <TableCell className="font-medium">Ukupno po strani:</TableCell>
              <TableCell />
              {prikazNarudzbenica && <TableCell />}
              <TableCell className="text-right">{ukupnaSuma.toFixed(2)}</TableCell>
              {prikazNarudzbenica && <TableCell />}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ukupno:</TableCell>
              <TableCell />
              {prikazNarudzbenica && <TableCell />}
              <TableCell className="text-right">{ukupnaSumaSvihDokumenata.toFixed(2)}</TableCell>
              {prikazNarudzbenica && <TableCell />}
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
