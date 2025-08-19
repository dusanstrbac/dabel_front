'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

const Akcije = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [akcije, setAkcije] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 8;

  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const sortKey = (searchParams.get('sortKey') as SortKey) || 'cena';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';

  useEffect(() => {
    const fetchAkcije = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        const korisnik = dajKorisnikaIzTokena();

        if (!korisnik) {
          setError('Korisnik nije prijavljen.');
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${apiAddress}/api/Artikal/PartnerAkcije?idPartnera=${korisnik.partner}&idKorisnika=${korisnik.idKorisnika}`
        );

        if (!res.ok) throw new Error('Greška pri preuzimanju akcija');

        const data = await res.json();

        setAkcije(data.akcije ?? []);
      } catch (e) {
        setError('Došlo je do greške pri učitavanju akcija');
      } finally {
        setLoading(false);
      }
    };

    fetchAkcije();
  }, []);

  // Sortiranje
  const sortiraneAkcije = useMemo(() => {
    const kopija = [...akcije];
    kopija.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortKey === 'cena') {
        aVal = a.artikalCene?.[0]?.akcija?.cena ?? a.artikalCene?.[0]?.cena ?? 0;
        bVal = b.artikalCene?.[0]?.akcija?.cena ?? b.artikalCene?.[0]?.cena ?? 0;
      } else {
        aVal = (a.naziv ?? '').toLowerCase();
        bVal = (b.naziv ?? '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return kopija;
  }, [akcije, sortKey, sortOrder]);

  // Paginacija
  const akcijeZaPrikaz = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortiraneAkcije.slice(start, start + pageSize);
  }, [sortiraneAkcije, currentPage, pageSize]);

  const totalPages = Math.ceil(sortiraneAkcije.length / pageSize);
  console.log(totalPages);

  // Promena stranice
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Promena sortiranja
  const handleSortChange = (key: SortKey, order: SortOrder) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sortKey', key);
    params.set('sortOrder', order);
    params.set('page', '1');
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filters: ArtikalFilterProp) => {
      const query = new URLSearchParams();
  
      if (filters.naziv) query.set('naziv', filters.naziv);
      if (filters.cena) query.set('cena', filters.cena);
  
      ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'].forEach((key) => {
        const vrednosti = filters[key as keyof ArtikalFilterProp];
        if (Array.isArray(vrednosti)) {
          vrednosti.forEach((val) => query.append(key, val));
        }
      });
  
      query.set('page', '1');
      query.set('sortKey', sortKey);
      query.set('sortOrder', sortOrder);
  
      router.push(`${window.location.pathname}?${query.toString()}`);
<<<<<<< HEAD
    };
=======
    } catch (err) {
      setError('Došlo je do greške pri filtriranju.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAkcijeArtikli = async () => {
  try {
    setLoading(true);
    setError(null);

    const korisnik = dajKorisnikaIzTokena();
    const partner = korisnik?.partner;
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const res = await fetch(
      `${apiAddress}/api/Artikal/PartnerAkcije?idPartnera=${partner}&idKorisnika=${korisnik?.idKorisnika}`
    );

    if (!res.ok) throw new Error("Greška pri preuzimanju artikala");

    const data = await res.json();
    console.log(data.akcije);

    setArtikli(data.akcije);
    setAtributi(data.akcije.artikalAtributi);
    setTotalCount(data.totalCount ?? 0);
    setTotalPages(Math.ceil((data.totalCount ?? 0) / pageSize));
  } catch (err: any) {
    setError(err.message || "Došlo je do greške");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAkcijeArtikli();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    router.push(`${url.pathname}${url.search}`, { scroll: false });
  };
>>>>>>> eddafae92cac920bb11e7d9e7423019c38bc26a4

  return (
    <div className="lg:p-4">
      <div className="w-full mx-auto flex justify-between items-center p-2">
        <h1 className="font-bold text-3xl">Akcije</h1>
        <SortiranjeButton sortKey={sortKey} sortOrder={sortOrder} onSortChange={handleSortChange} />
      </div>

      {loading ? (
        <p className="text-center mt-4">Učitavanje...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <ListaArtikala
<<<<<<< HEAD
          artikli={sortiraneAkcije}
          totalCount={sortiraneAkcije.length}
=======
          artikli={artikli}
          totalCount={totalCount}
>>>>>>> eddafae92cac920bb11e7d9e7423019c38bc26a4
          currentPage={currentPage}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default Akcije;
