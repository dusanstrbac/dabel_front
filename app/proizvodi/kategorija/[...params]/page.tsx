'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';

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

  if (!params || params.length === 0) {
    return <p>Greška: Očekuje se najmanje jedna ruta (kategorija).</p>;
  }

  const kategorija = decodeURIComponent(params[0]);
  const podkategorija = params.length >= 2 ? decodeURIComponent(params[1]) : null;

  // Funkcija za fetch artikala sa paginacijom
  const DajArtikleSaPaginacijom = async (
    kategorija: string,
    podkategorija: string | null,
    page: number,
    pageSize: number,
    sortKey: string,
    sortOrder: string
  ) => {
    try {
      const { data } = await axios.get(`${apiAddress}/api/Artikal/DajArtikleSaPaginacijom`, {
        params: {
          idPartnera,
          kategorija,
          podkategorija,
          page,
          pageSize,
          sortKey,
          sortOrder,
        },
      });
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

      try {
        const data = await DajArtikleSaPaginacijom(
          kategorija,
          podkategorija,
          pageFromUrl,
          pageSize,
          sortKey,
          sortOrder
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
  }, [kategorija, podkategorija, pageFromUrl, sortKey, sortOrder]); // Reload kada se ovi parametri promene

  // Funkcija za promenu stranice
  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
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
            // Promeni sort parametre i navigiraj ka novoj stranici
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
        {/* Prosleđivanje podataka u Listu artikala */}
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
        />
      </div>
    </div>
  );
}
