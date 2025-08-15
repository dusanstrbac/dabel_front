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

  // Filtriranje artikala
  // const filtriraniArtikli = useMemo(() => {
  //   console.log("--- POČETAK FILTRIRANJA ---");
    
  //   // 1. Prikazi sve URL parametre
  //   console.log("URL parametri:", Array.from(searchParams.entries()));

  //   let result = [...sviArtikli];
  //   console.log(`Ukupno artikala pre filtera: ${result.length}`);

  //   // 2. Filter po ceni (AND - mora biti u opsegu)
  //   const minCena = searchParams.get('minCena');
  //   const maxCena = searchParams.get('maxCena');
  //   if (minCena && maxCena) {
  //     const min = parseFloat(minCena);
  //     const max = parseFloat(maxCena);
  //     result = result.filter(artikal => {
  //       const cena = artikal.artikalCene?.[0]?.cena || 0;
  //       return cena >= min && cena <= max;
  //     });
  //     console.log(`Artikala posle cene (${min}-${max}): ${result.length}`);
  //   }

  //   // 3. Grupiši filtere po kategorijama (AND između grupa, OR unutar grupe)
  //   const filterGroups: Record<string, string[]> = {};
  //   const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'];
    
  //   filterKeys.forEach(key => {
  //     const values = searchParams.getAll(key).flatMap(v => v.split(','));
  //     if (values.length > 0) {
  //       filterGroups[key] = values;
  //     }
  //   });

  //   console.log("Grupe filtera:", filterGroups);

  //   // 4. Ako ima filtera, primeni kombinovanu AND/OR logiku
  //   if (Object.keys(filterGroups).length > 0) {
  //     result = result.filter(artikal => {
  //       // Proveri da li artikal zadovoljava SVE grupe filtera (AND)
  //       return Object.entries(filterGroups).every(([key, values]) => {
  //         // Unutar svake grupe, proveri da li zadovoljava BAR JEDNU vrednost (OR)
  //         if (key === 'jm') {
  //           return values.includes(artikal.jm);
  //         }
          
  //         if (artikal.artikalAtributi) {
  //           const atributKey = key === 'RobnaMarka' ? 'Robna marka' : 
  //                           key === 'Boja' ? 'Zavr.obr-boja' : key;
            
  //           return artikal.artikalAtributi.some(atribut => 
  //             atribut.imeAtributa === atributKey && 
  //             values.includes(atribut.vrednost)
  //           );
  //         }
  //         return false;
  //       });
  //     });
  //   }

  //   console.log(`--- KRAJ FILTRIRANJA ---`);
  //   console.log(`Filtriranih artikala: ${result.length}`);
  //   console.log("Primeri:", result.slice(0, 3).map(a => a.naziv));
    
  //   return result;
  // }, [sviArtikli, searchParams]);


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
    
    if (filters.cena) {
      query.set('minCena', filters.cena.split('-')[0]);
      query.set('maxCena', filters.cena.split('-')[1]);
    }

    const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'];
    filterKeys.forEach(key => {
      const values = filters[key as keyof ArtikalFilterProp];
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(val => query.append(key, val));
      }
    });

    router.push(`${window.location.pathname}?${query.toString()}`);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-center items-center gap-6 py-2 px-8 flex-wrap md:justify-between">
        <h1 className="font-bold text-3xl mb-[5px]">
          {kategorija} {podkategorija ? `/ ${podkategorija}` : ''}
        </h1>
        <SortiranjeButton
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

      {error && <p className="text-center text-red-500">{error}</p>}

      <div>
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
      </div>
    </div>
  );
}