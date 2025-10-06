'use client';

import { useEffect, useState } from "react";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import Pagination from "./ui/pagination";
import { useLocale, useTranslations } from "next-intl";

interface myProps {
  title: string;
}

interface Uplata {
  id: number;
  datumPristizanja: string;
  potrazuje: number;
}

const UplateTable = ({ title }: myProps) => {
  const [uplate, setUplate] = useState<Uplata[]>([]);
  const [korisnik, setKorisnik] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<'datum' | 'cena'>('datum');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const t = useTranslations();
  const locale = useLocale();

  const itemsPerPage = 15;

  useEffect(() => {
    setKorisnik(dajKorisnikaIzTokena());
  }, []);

  useEffect(() => {
    if (!korisnik) return;

    const ucitajUplate = async () => {
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const idKorisnika = korisnik?.partner;

        const res = await fetch(
          `${apiAddress}/api/Partner/DajUplatePartnera?idPartnera=${idKorisnika}`
        );

        if (!res.ok) {
          throw new Error(t('uplateTable.Greška pri učitavanju uplata'));
        }

        const data = await res.json();
        setUplate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    ucitajUplate();
  }, [korisnik]);

  const sortiraneUplate = [...uplate].sort((a, b) => {
    if (sortKey === 'datum') {
      const dateA = new Date(a.datumPristizanja).getTime();
      const dateB = new Date(b.datumPristizanja).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' ? a.potrazuje - b.potrazuje : b.potrazuje - a.potrazuje;
    }
  });

  const paginatedUplate = sortiraneUplate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const ukupnoNaStrani = paginatedUplate.reduce((sum, u) => sum + u.potrazuje, 0);
  const ukupnoSve = uplate.reduce((sum, u) => sum + u.potrazuje, 0);

  if (loading) return <div>{t('main.Učitavanje')}</div>;
  if (error) return <div>Greška: {error}</div>;
  if (!uplate.length) return <div>{t('uplateTable.Nema podataka')}</div>;

  return (
    <div className="flex flex-col gap-2 lg:gap-4 my-[20px] lg:items-center lg:justify-center">
      <div className="flex sm:flex-row flex-col justify-between items-center w-full lg:w-[800px] gap-3">
        <h1 className="font-bold text-3xl">{title}</h1>
        <div className="flex sm:flex-row flex-col gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setSortKey(prev => (prev === 'datum' ? 'cena' : 'datum'))
            }
          >
            {t('uplateTable.Sortiraj po')} {sortKey === 'datum' ? t('uplateTable.Datumu') : t('uplateTable.Ceni')}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
            }
          >
            {t('uplateTable.Redosled')} {sortOrder === 'asc' ? t('uplateTable.Rastuće') : t('uplateTable.Opadajuće')}
          </Button>
        </div>
      </div>

      <div>
        <Table className="lg:w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="lg:w-[200px] text-xl">{t('uplateTable.Datum')}</TableHead>
              <TableHead className="text-xl">{t('uplateTable.Dokument')}</TableHead>
              <TableHead className="text-xl text-right">{t('uplateTable.Iznos')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUplate.map((uplata, index) => (
              <TableRow key={index} className="hover:odd:bg-gray-300">
                <TableCell className="font-medium">
                  {new Date(uplata.datumPristizanja).toLocaleDateString(locale)}
                </TableCell>
                <TableCell>{`Dokument-${uplata.id}`}</TableCell>
                <TableCell className="text-right">
                  {uplata.potrazuje.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-gray-400 hover:bg-gray-400">
              <TableCell className="font-medium">{t('uplateTable.Ukupno po strani')}</TableCell>
              <TableCell />
              <TableCell className="text-right">{ukupnoNaStrani.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('uplateTable.Ukupno')}</TableCell>
              <TableCell />
              <TableCell className="text-right">{ukupnoSve.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Pagination
          totalItems={sortiraneUplate.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default UplateTable;
