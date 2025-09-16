'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';

type SortKey = "cena" | "naziv";
type SortOrder = 'asc' | 'desc';

export default function ProizvodiPage() {
  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const idPartnera = dajKorisnikaIzTokena()?.partner;

  const [sviArtikli, setSviArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 8;
  
  // Reaktivno čitanje stranice iz URL-a
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(page) ? 1 : page;
  }, [searchParams]);

  const sortKey: SortKey = searchParams.get('sortKey') as SortKey || 'cena';
  const sortOrder: SortOrder = searchParams.get('sortOrder') as SortOrder || 'asc';

  const kategorija = params?.[0] ? decodeURIComponent(params[0]) : '';
  const podkategorija = params?.length && params.length >= 2 ? decodeURIComponent(params[1]) : null;

  // Fetch podataka samo jednom
  useEffect(() => {
    if (!kategorija) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        query.append('idPartnera', idPartnera!);
        query.append('pageSize', '1000');
        query.append('Kategorija', kategorija);

        if (podkategorija) {
          query.append('PodKategorija', podkategorija);
        }

        const { data } = await axios.get(`${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${query.toString()}`);
        setSviArtikli(data.artikli || []);
      } catch (err) {
        console.error("Greška pri fetch podataka:", err);
        setError('Došlo je do greške pri učitavanju artikala');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kategorija, podkategorija]);


  // Sortirani artikli (bez paginacije)
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

  // Handler za promenu stranice
  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filters: ArtikalFilterProp) => {
    const query = new URLSearchParams();
    
    // if (filters.cena) {
    //   query.set('minCena', filters.cena.split('-')[0]);
    //   query.set('maxCena', filters.cena.split('-')[1]);
    // }

    const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'];
    filterKeys.forEach(key => {
      const values = filters[key as keyof ArtikalFilterProp];
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(val => query.append(key, val));
      }
    });

//    router.push(`${window.location.pathname}?${query.toString()}`);
  };



  return (
    <div className="w-full mx-auto">
      <div  className="flex justify-between items-center gap-6 py-2 px-8 flex-wrap">
        <h1 className="font-bold text-2xl sm:text-3xl mb-[5px] break-words whitespace-normal w-full">
          {kategorija} {podkategorija ? `/ ${podkategorija}` : ''}
        </h1>
        <SortiranjeButton
        //ovaj button zelim da bude ispod ovog h1 u divu kao, ili mozda ne treba novi wrapper div jer vec je 
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={(newSortKey, newSortOrder) => {
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('sortKey', newSortKey);
            searchParams.set('sortOrder', newSortOrder);
            searchParams.set('page', '1');
            router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
          }}
        />
      </div>

        {loading ? (
          <p className="text-center mt-4">Učitavanje...</p>
        ) : error || sviArtikli.length === 0 ? (
          <p className="text-center text-xl font-medium text-red-600 mt-4">
            {sviArtikli.length === 0 ? "Partner nema asortiman za ovu kategoriju!" : error}
          </p>
        ) : (
          <>
          <ListaArtikala
            artikli={sortiraniArtikli} // Šaljemo SVE sortirane artikle
            kategorija={kategorija}
            podkategorija={podkategorija}
            totalCount={sortiraniArtikli.length} // Ukupan broj artikala za paginaciju
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
          />       
          </>
        )} 
    </div>
  );
}