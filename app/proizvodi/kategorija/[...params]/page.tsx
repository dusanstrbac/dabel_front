'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalFilterProp } from '@/types/artikal';

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
    filters: ArtikalFilterProp // Dodali smo filtere kao parametar
  ) => {
    try {
      const query = new URLSearchParams();

      // Dodajemo sve filtere u URL parametre
      if (filters.naziv) query.append('naziv', filters.naziv);
      if (filters.cena) query.append('cena', filters.cena);

      for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
        const vrednosti = filters[key as keyof ArtikalFilterProp];
        if (Array.isArray(vrednosti)) {
          vrednosti.forEach((val) => query.append(key, val));
        }
      }

      // Dodajemo osnovne parametre
      query.append('idPartnera', idPartnera!);
      query.append('kategorija', kategorija);
      if (podkategorija) query.append('podkategorija', podkategorija);
      query.append('page', page.toString());
      query.append('pageSize', pageSize.toString());
      query.append('sortKey', sortKey);
      query.append('sortOrder', sortOrder);

      const { data } = await axios.get(`${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${query.toString()}`);
      return data;
    } catch (error) {
      throw new Error('Greska prilikom fetcha artikala');
    }
  };

  // FETCH ATRIBUTA ZA ARTIKLE
  const DajAtributeZaArtikle = async (kategorija: string, podkategorija: string | null) => {
    if (Object.keys(atributi).length > 0) {
      // Ako su atributi već učitani, ne ponavljaj fetch
      return;
    }

    try {
      const { data } = await axios.get(`${apiAddress}/api/Artikal/ArtikalAtributi`, {
        params: {
          idPartnera,
          kategorija,
          podkategorija,
        },
      });
      setAtributi(data); // Spremamo atribute po artiklu
    } catch (error) {
      throw new Error('Greska prilikom fetcha atributa');
    }
  };

  // Učitaj artikle i atribute kada se stranica učita
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Uzimamo filtere iz URL-a
      const filters: ArtikalFilterProp = {
        naziv: searchParams.get('naziv') || '',
        cena: searchParams.get('cena') || '',
        jm: searchParams.getAll('jm'),
        Materijal: searchParams.getAll('Materijal'),
        Model: searchParams.getAll('Model'),
        Pakovanje: searchParams.getAll('Pakovanje'),
        RobnaMarka: searchParams.getAll('RobnaMarka'),
        Upotreba: searchParams.getAll('Upotreba'),
        Boja: searchParams.getAll('Boja'),
      };

      try {
        const data = await DajArtikleSaPaginacijom(
          kategorija,
          podkategorija,
          pageFromUrl,
          pageSize,
          sortKey,
          sortOrder,
          filters // Prosleđujemo filtere u fetch
        );

        setArtikli(data.artikli);
        setTotalCount(data.totalCount); // Pretpostavljamo da API vraća ukupni broj artikala

        // Nakon što smo dobili artikle, dohvatimo atribute za te artikle
        await DajAtributeZaArtikle(kategorija, podkategorija);
      } catch (err) {
        setError('Došlo je do greške pri učitavanju artikala');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kategorija, podkategorija, pageFromUrl, sortKey, sortOrder, searchParams]); // Reload kada se ovi parametri promene

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
      // Kreiramo novi query string sa filterima
      const query = new URLSearchParams();

      // Dodajemo filtere u URL
      if (filters.naziv) query.append('naziv', filters.naziv);
      if (filters.cena) query.append('cena', filters.cena);

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
          atributi={atributi}
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
