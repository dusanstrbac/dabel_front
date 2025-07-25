'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import { dajKorisnikaIzTokena } from '@/lib/auth';

export default function ProizvodiPage() {
  const { params } = useParams() as { params?: string[] };
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [atribut, setAtribut] = useState< any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [sortKey, setSortKey] = useState<'cena' | 'naziv'>('cena');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const searchParams = useSearchParams();
  const router = useRouter();

  const pageSize = 8; // Poželjno da backend vraća ovaj broj po strani

  
  const [aktivniFilteri, setAktivniFilteri] = useState<ArtikalFilterProp>({
      naziv: '',
      jm: [],
      Materijal: [],
      Model: [],
      Pakovanje: [],
      RobnaMarka: [],
      Upotreba: [],
      Boja: [],
  });

  const pageFromUrl = useMemo(() => {
    const pageParam = searchParams.get('page');
    const parsed = parseInt(pageParam || '1', 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams]);

  const fetchArtikli = async (
    kategorija: string | null,
    podkategorija: string | null,
    filters: ArtikalFilterProp,
    page: number,
    sortKey: 'cena' | 'naziv',
    sortOrder: 'asc' | 'desc'
  ) => {
    setLoading(true);
    setArtikli([]);
    setError(null);

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    if (kategorija) {
      queryParams.append('Kategorija', kategorija);
    }

    if (podkategorija) {
      queryParams.append('PodKategorija', podkategorija);
    }

    queryParams.append('sortKey', sortKey);
    queryParams.append('sortOrder', sortOrder);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => v && queryParams.append(key, v));
        } else if (typeof value === 'string' && value.trim() !== '') {
          queryParams.append(key, value);
        }
      }
    });

    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const korisnik = dajKorisnikaIzTokena();
    const fullUrl = `${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${queryParams.toString()}&idPartnera=${korisnik?.idKorisnika}`;
    //const fullUrl = `${apiAddress}/api/Artikal/DajFilterArtikle?idPartnera=${korisnik?.idKorisnika}&batchSize=10000&${queryParams.toString()}`;
    //console.log("API URL:", fullUrl);
    // http://localhost:7235/api/Artikal/DajArtikleSaPaginacijom?page=1&pageSize=8&sortBy=naziv&sortOrder=asc&idPartnera=3005


    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        throw new Error(`HTTP greška: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();

      if (data.items?.length) {
        setArtikli(data.items); //ovde vrv stize 8 artikala
        setTotalCount(data.totalCount ?? 0);
      } else {
        setArtikli([]);
        setTotalCount(0);
        setError('Nema rezultata za ove parametre.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Greška pri učitavanju podataka. Detalji greške: ' + error.message);
        console.error('Greška:', error);
      } else {
        setError('Došlo je do nepoznate greške.');
        console.error('Nepoznata greška:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //if (!brojDokumenta) return;

    const fetchAtributi = async () => {
      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const korisnik = dajKorisnikaIzTokena();
        const res = await fetch(`${apiAddress}/api/Artikal/ArtikliKategorije?idPartnera=${korisnik?.idKorisnika}`);
        if (!res.ok) throw new Error('Greška pri učitavanju dokumenta.');

        const data = await res.json();
        setAtribut(data);
        console.log("Atributi",data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAtributi();
  }, []);

  // Fetch artikle kad se menjaju parametri ili sortiranje ili stranica
  useEffect(() => {
    if (!params || params.length === 0) return;

    const kategorija = decodeURIComponent(params[0]);
    const podkategorija = params.length > 1 ? decodeURIComponent(params[1]) : null;
    const totalPages = Math.ceil(totalCount / pageSize);

    if (pageFromUrl > totalPages && totalPages > 0) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('page', '1');
      router.replace(`?${newParams.toString()}`);
      return;
    }

    // ✅ Čitanje filtera iz URL-a
    const filteri: ArtikalFilterProp = {
      naziv: '',
      jm: searchParams.getAll('jm') || '',
      Materijal: searchParams.getAll('Materijal'),
      Model: searchParams.getAll('Model'),
      Pakovanje: searchParams.getAll('Pakovanje'),
      RobnaMarka: searchParams.getAll('RobnaMarka'),
      Upotreba: searchParams.getAll('Upotreba'),
      Boja: searchParams.getAll('Boja'),
    };
    setAktivniFilteri(filteri); // dodaj ovu liniju


    fetchArtikli(
      kategorija,
      podkategorija,
      filteri,
      pageFromUrl,
      sortKey,
      sortOrder
    );
  }, [params, pageFromUrl, sortKey, sortOrder, totalCount, searchParams]);


  const handleSortChange = (key: 'cena' | 'naziv', order: 'asc' | 'desc') => {
    setSortKey(key);
    setSortOrder(order);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', '1');
    router.push(`?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    if (!params || params.length === 0) return;

    const newParams = new URLSearchParams();

    // Kopiramo samo ne-prazne parametre
    searchParams.forEach((value, key) => {
      if (value && value.trim() !== '') {
        newParams.append(key, value);
      }
    });

    newParams.set('page', page.toString());

    const basePath = `/proizvodi/kategorija/${params[0]}${
      params.length > 1 ? `/${params[1]}` : ''
    }`;

    router.push(`${basePath}?${newParams.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!params || params.length === 0) {
    return <p>Greška: Očekuje se najmanje jedna ruta (kategorija).</p>;
  }

  const kategorija = decodeURIComponent(params[0]);
  const podkategorija = params.length >= 2 ? decodeURIComponent(params[1]) : null;


  const removeEmptyParams = (params: URLSearchParams): URLSearchParams => {
    const newParams = new URLSearchParams();

    const keys = Array.from(params.keys());

    for (const key of keys) {
      const values = params.getAll(key);
      const nonEmpty = values.filter((val) => val.trim() !== '');

      for (const val of nonEmpty) {
        newParams.append(key, val);
      }
    }

    return newParams;
  };

  return (
    <div className="">
      <div className="w-full mx-auto flex justify-center items-center gap-6 py-2 px-8 flex-wrap md:justify-between">
        <h1 className="font-bold text-3xl mb-[5px]">
          {kategorija} {podkategorija ? `/ ${podkategorija}` : ''}
        </h1>
        <SortiranjeButton
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
      <div>
        {loading ? (
          <p className="text-center">Učitavanje...</p>
        ) : (
          <ListaArtikala
            artikli={artikli}
            atributi={atribut}
            kategorija={kategorija}
            podkategorija={podkategorija}
            totalCount={totalCount}
            currentPage={pageFromUrl}
            onPageChange={(page) => {
              const cleanedParams = removeEmptyParams(new URLSearchParams(searchParams.toString()));
              cleanedParams.set('page', page.toString());

              const basePath = `/proizvodi/kategorija/${params[0]}${params.length > 1 ? `/${params[1]}` : ''}`;

              router.push(`${basePath}?${cleanedParams.toString()}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {error && <p className="text-center text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}