'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalFilterProp, ArtikalType, AtributiResponse } from '@/types/artikal';

type SortKey = "cena" | "naziv";
type SortOrder = 'asc' | 'desc';


export default function ProizvodiPage() {
  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const idPartnera = dajKorisnikaIzTokena()?.partner;

  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 8;
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sortKey: SortKey = searchParams.get('sortKey') as SortKey || 'cena';
  const sortOrder: SortOrder = searchParams.get('sortOrder') as SortOrder || 'asc';

  const kategorija = params?.[0] ? decodeURIComponent(params[0]) : '';
  const podkategorija = params?.length && params.length >= 2 ? decodeURIComponent(params[1]) : null;

  // Memoizovana transformacija atributa u AtributiResponse format
  const atributiResponse = useMemo<AtributiResponse>(() => {
    const transformed: AtributiResponse = {};
    
    artikli.forEach(artikal => {
      if (artikal.artikalAtributi && artikal.artikalAtributi.length > 0) {
        transformed[artikal.idArtikla] = artikal.artikalAtributi.map(atribut => ({
          ...atribut,
          imeAtributa: atribut.imeAtributa === "Robna marka" ? "RobnaMarka" : 
                      atribut.imeAtributa === "Zavr.obr-boja" ? "Boja" :
                      atribut.imeAtributa
        }));
      }
    });

    console.log('Transformisani atributi:', transformed);
    return transformed;
  }, [artikli]);

  // useEffect(() => {
  //   if (artikli.length > 0) {
  //     const newFilterOptions = {
  //       jm: [] as string[],
  //       Materijal: [] as string[],
  //       Model: [] as string[],
  //       Pakovanje: [] as string[],
  //       RobnaMarka: [] as string[],
  //       Upotreba: [] as string[],
  //       Boja: [] as string[],
  //     };

  //     artikli.forEach(artikal => {
  //       if (artikal.artikalAtributi) {
  //         artikal.artikalAtributi.forEach(atribut => {
  //           const key = atribut.imeAtributa === "Robna marka" ? "RobnaMarka" : 
  //                       atribut.imeAtributa === "Zavr.obr-boja" ? "Boja" :
  //                       atribut.imeAtributa;
            
  //           if (newFilterOptions.hasOwnProperty(key)) {
  //             const vrednost = atribut.vrednost.trim();
  //             if (vrednost && !newFilterOptions[key as keyof typeof newFilterOptions].includes(vrednost)) {
  //               newFilterOptions[key as keyof typeof newFilterOptions].push(vrednost);
  //             }
  //           }
  //         });
  //       }

  //       if (artikal.jm && !newFilterOptions.jm.includes(artikal.jm)) {
  //         newFilterOptions.jm.push(artikal.jm);
  //       }
  //     });

  //     console.log('Generisane filter opcije:', newFilterOptions);
  //     setFilterOptions(newFilterOptions);
  //   }
  // }, [artikli]);

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
      query.append('idPartnera', idPartnera!);
      query.append('page', page.toString());
      query.append('pageSize', pageSize.toString());
      query.append('sortKey', sortKey);
      query.append('sortOrder', sortOrder);
      query.append('Kategorija', kategorija);

      const { data } = await axios.get(`${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${query.toString()}`);

      if (podkategorija) {
        query.append('PodKategorija', podkategorija);
      }

      if (filters.cena) {
        const [minCena, maxCena] = filters.cena.split('-').map(Number);
        query.append('minCena', minCena.toString());
        query.append('maxCena', maxCena.toString());
      }

      for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
        const vrednosti = filters[key as keyof ArtikalFilterProp];
        if (Array.isArray(vrednosti) && vrednosti.length > 0) {
          vrednosti.forEach(val => query.append(key, val));
        }
      }

      
      return {
        artikli: data.artikli || [],
        totalCount: data.totalCount || 0
      };
    } catch (error) {
      console.error('Greška pri učitavanju:', error);
      throw new Error('Došlo je do greške pri učitavanju artikala');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

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

        console.log('Podaci sa fetchData (DajArtikleSaPaginacijom):', result);
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

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const handleFilterChange = async (filters: ArtikalFilterProp) => {
    setLoading(true);
    setError(null);

    try {
      const cenaRange = filters.cena?.split('-');
      const minCena = cenaRange ? parseFloat(cenaRange[0]) : 0;
      const maxCena = cenaRange ? parseFloat(cenaRange[1]) : 100000;

      const query = new URLSearchParams();

      if (filters.naziv) query.append('naziv', filters.naziv);
      if (filters.cena) query.append('minCena', minCena.toString());
      if (filters.cena) query.append('maxCena', maxCena.toString());

      for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
        const vrednosti = filters[key as keyof ArtikalFilterProp];
        if (Array.isArray(vrednosti)) {
          vrednosti.forEach((val) => query.append(key, val));
        }
      }

      query.set('page', '1');
      query.set('sortKey', sortKey);
      query.set('sortOrder', sortOrder);

      router.push(`${window.location.pathname}?${query.toString()}`);
    } catch (err) {
      console.error('Greška pri filter fetchu', err);
      setError('Došlo je do greške pri filtriranju.');
    } finally {
      setLoading(false);
    }
  };

  


  console.log('Podaci koji se šalju u ListaArtikala:', {
    artikli,
    atributi: atributiResponse,
    kategorija,
    podkategorija,
    totalCount,
    currentPage: pageFromUrl,
    pageSize,
    loading
  });

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

      {error && <p className="text-center text-red-500">{error}</p>}

      <div>
        <ListaArtikala
          artikli={artikli}
          kategorija={kategorija}
          podkategorija={podkategorija}
          totalCount={totalCount}
          currentPage={pageFromUrl}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
        
      </div>
    </div>
  );
}