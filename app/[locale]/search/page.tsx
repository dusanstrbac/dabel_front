'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import Header from '@/components/Header'; // ✅ Dodato
import Footer from '@/components/Footer'; // ✅ Dodato
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';

type SortKey = "cena" | "naziv";
type SortOrder = 'asc' | 'desc';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const idPartnera = dajKorisnikaIzTokena()?.partner;
  const t = useTranslations();

  const [sviArtikli, setSviArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const queryText = searchParams.get('q')?.trim() || '';
  const sortKey: SortKey = (searchParams.get('sortKey') as SortKey) || 'cena';
  const sortOrder: SortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';
  const pageSize = 8;

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(page) ? 1 : page;
  }, [searchParams]);

  useEffect(() => {
    if (!queryText) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?idPartnera=${idPartnera}&pageSize=1000`
        );

        const svi = data.artikli || [];

        const filtrirani = svi.filter((artikal: ArtikalType) =>
          artikal.naziv.toLowerCase().includes(queryText.toLowerCase())
        );

        setSviArtikli(filtrirani);
      } catch (err) {
        console.error('Greška pri pretrazi:', err);
        setError('Došlo je do greške pri učitavanju artikala.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryText]);

  const sortiraniArtikli = useMemo(() => {
    const result = [...sviArtikli];
    result.sort((a, b) => {
      const aValue = sortKey === 'cena' ? (a.artikalCene?.[0]?.cena || 0) : a.naziv;
      const bValue = sortKey === 'cena' ? (b.artikalCene?.[0]?.cena || 0) : b.naziv;

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [sviArtikli, sortKey, sortOrder]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <>
      <Header />

      <main className="w-full mx-auto min-h-screen">
        <div className="flex justify-between items-center gap-2 py-2 px-8 flex-wrap">
          <h1 className="font-bold lg:text-2xl md:text-3xl">
            "{queryText}"
          </h1>

          <SortiranjeButton
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSortChange={(newSortKey, newSortOrder) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set('sortKey', newSortKey);
              searchParams.set('sortOrder', newSortOrder);
              router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
            }}
          />
        </div>

        {loading ? (
          <p className="text-center mt-4">{t('main.Učitavanje')}</p>
        ) : error || sviArtikli.length === 0 ? (
          <p className="text-center text-xl font-medium text-red-600 mt-4">
            {sviArtikli.length === 0 ? t('main.Nema rezultata') : error}
          </p>
        ) : (
          <ListaArtikala
            artikli={sortiraniArtikli}
            kategorija="Pretraga"
            totalCount={sortiraniArtikli.length}
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
            onPageChange={handlePageChange}
            onFilterChange={() => {}}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
