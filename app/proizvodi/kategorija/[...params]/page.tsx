'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalAtribut, ArtikalFilterProp, AtributiResponse } from '@/types/artikal';

type SortKey = "cena" | "naziv";
type SortOrder = 'asc' | 'desc';

export default function ProizvodiPage() {
  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const idPartnera = dajKorisnikaIzTokena()?.partner;

  // State za artikle, atribute, broj artikala, učitavanje i greške
  const [artikli, setArtikli] = useState<any[]>([]);
  const [atributi, setAtributi] = useState<any>({}); // Atributi po idArtikla
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Parametri za paginaciju i sortiranje
  const pageSize = 8;
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10); // Dobijanje broja stranice iz URL-a
  const sortKey: SortKey = searchParams.get('sortKey') as SortKey || 'cena';
  const sortOrder: SortOrder = searchParams.get('sortOrder') as SortOrder || 'asc';

  const kategorija = params?.[0] ? decodeURIComponent(params[0]) : '';
  const podkategorija = params?.length && params.length >= 2 ? decodeURIComponent(params[1]) : null;



  // Funkcija za fetch artikala sa paginacijom
  const DajArtikleSaPaginacijom = async (
  kategorija: string,
  podkategorija: string | null,
  page: number,
  pageSize: number,
  sortKey: string,
  sortOrder: string,
  filters: ArtikalFilterProp
) => {
  try {
    const query = new URLSearchParams();

    // Osnovni parametri
    query.append('idPartnera', idPartnera!);
    query.append('page', page.toString());
    query.append('pageSize', pageSize.toString());
    query.append('sortKey', sortKey);
    query.append('sortOrder', sortOrder);
    query.append('Kategorija', kategorija);

    if (podkategorija) {
      query.append('PodKategorija', podkategorija);
    }

    // Dodaj filtere za cenu (koristite minCena/maxCena kako backend očekuje)
    if (filters.cena) {
      const [minCena, maxCena] = filters.cena.split('-').map(Number);
      query.append('minCena', minCena.toString());
      query.append('maxCena', maxCena.toString());
    }

    // Dodaj ostale filtere
    for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
      const vrednosti = filters[key as keyof ArtikalFilterProp];
      if (Array.isArray(vrednosti) && vrednosti.length > 0) {
        vrednosti.forEach(val => query.append(key, val));
      }
    }

    const { data } = await axios.get(`${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${query.toString()}`);
    
    return {
      artikli: data.artikli || [],
      totalCount: data.totalCount || 0
    };
  } catch (error) {
    console.error('Greška pri učitavanju:', error);
    throw new Error('Došlo je do greške pri učitavanju artikala');
  }
};


  // Učitaj artikle i atribute kada se stranica učita
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Pročitaj filtere iz URL-a
    const minCenaParam = searchParams.get('minCena');
    const maxCenaParam = searchParams.get('maxCena');
    const cenaFilter = minCenaParam && maxCenaParam 
      ? `${minCenaParam}-${maxCenaParam}`
      : '';

    const filtersFromUrl: ArtikalFilterProp = {
      naziv: searchParams.get('naziv') || '',
      cena: cenaFilter,
      jm: searchParams.getAll('jm'),
      Materijal: searchParams.getAll('Materijal'),
      Model: searchParams.getAll('Model'),
      Pakovanje: searchParams.getAll('Pakovanje'),
      RobnaMarka: searchParams.getAll('RobnaMarka'),
      Upotreba: searchParams.getAll('Upotreba'),
      Boja: searchParams.getAll('Boja'),
    };

    try {
      const result = await DajArtikleSaPaginacijom(
        kategorija,
        podkategorija,
        pageFromUrl,
        pageSize,
        sortKey,
        sortOrder,
        filtersFromUrl
      );

      setArtikli(result.artikli);
      setTotalCount(result.totalCount);

    } catch (err) {
      setError('Došlo je do greške pri učitavanju artikala');
    } finally {
      setLoading(false);
    }
  };

  if (kategorija) {
    fetchData();
  }
}, [kategorija, podkategorija, pageFromUrl, sortKey, sortOrder, searchParams]);


  // Funkcija za promenu stranice
  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

const handleFilterChange = async (filters: ArtikalFilterProp) => {
    setLoading(true);
    setError(null);

    try {
        // Razdvajamo cenu na min i max
        const cenaRange = filters.cena?.split('-');
        const minCena = cenaRange ? parseFloat(cenaRange[0]) : 0;
        const maxCena = cenaRange ? parseFloat(cenaRange[1]) : 100000;

        // Kreiramo novi query string sa filterima
        const query = new URLSearchParams();

        // Dodajemo filtere u URL
        if (filters.naziv) query.append('naziv', filters.naziv);
        if (filters.cena) query.append('minCena', minCena.toString());
        if (filters.cena) query.append('maxCena', maxCena.toString());

        // Dodavanje ostalih filtera
        for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
            const vrednosti = filters[key as keyof ArtikalFilterProp];
            if (Array.isArray(vrednosti)) {
                vrednosti.forEach((val) => query.append(key, val));
            }
        }

        // Dodajemo parametre za paginaciju, sortiranje
        query.set('page', '1');  // Resetujemo stranicu na 1 prilikom promena filtera
        query.set('sortKey', sortKey);
        query.set('sortOrder', sortOrder);

        // Prosleđujemo filtrirane parametre
        router.push(`${window.location.pathname}?${query.toString()}`);
    } catch (err) {
        console.error('Greška pri filter fetchu', err);
        setError('Došlo je do greške pri filtriranju.');
    } finally {
        setLoading(false);
    }
};

  // Transformacija atributa u oblik koji očekuje ListaArtikala komponenta
  // const transformAtributi = () => {
  //   const atributiMap: { [artikalId: string]: ArtikalAtribut[] } = {};
    
  //   artikli.forEach(artikal => {
  //     if (artikal.artikalAtributi && artikal.artikalAtributi.length > 0) {
  //       atributiMap[artikal.idArtikla] = artikal.artikalAtributi;
  //     }
  //   });

  //   return atributiMap;
  // };

  const atributiResponse: AtributiResponse = artikli.reduce((acc, artikal) => {
    if (artikal.artikalAtributi && artikal.artikalAtributi.length > 0) {
      acc[artikal.idArtikla] = artikal.artikalAtributi;
    }
    return acc;
  }, {} as AtributiResponse);

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
            router.push(`${window.location.pathname}?${searchParams.toString()}`);
          }}
        />
      </div>

      {/* Error handling */}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div>
        <ListaArtikala
          artikli={artikli}
          atributi={atributiResponse}
          kategorija={kategorija}
          podkategorija={podkategorija}
          totalCount={totalCount}
          currentPage={pageFromUrl}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange} // Promena stranice
          onFilterChange={handleFilterChange} // Promena filtera
        />
      </div>
    </div>
  );
}