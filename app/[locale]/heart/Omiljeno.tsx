'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ocistiImeAtributa } from '@/contexts/OcistiImeAtributa';
import { ArtikalAtribut, ArtikalFilterProp, ArtikalType } from '@/types/artikal';
import { useLocale, useTranslations } from 'next-intl';

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

const OmiljeniArtikli = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stanja
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [atributi, setAtributi] = useState<{ [artikalId: string]: ArtikalAtribut[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const pageSize = 8;

  // Čitanje parametara iz URL-a sa default vrednostima
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const sortKey = (searchParams.get('sortKey') as SortKey) || 'naziv';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';

  // Fetch omiljenih artikala jednom na mount i kad se korisnik promeni (ako se može menjati)
  useEffect(() => {
    const fetchOmiljeniArtikli = async () => {
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
          `${apiAddress}/api/Partner/POA?idPartnera=${korisnik.partner}&idKorisnika=${korisnik.idKorisnika}`
        );

        if (!res.ok) throw new Error('Greška pri preuzimanju omiljenih artikala');

        const data = await res.json();
        const artikliSaPodacima = data.artikli?.map((artikal: any) => {
          const akcijaCena = artikal.artikalCene?.[0]?.akcija?.cena
            ? parseFloat(artikal.artikalCene[0].akcija.cena)
            : null;

          const cena =
            akcijaCena !== null
              ? akcijaCena
              : artikal.artikalCene?.[0]?.cena
              ? parseFloat(artikal.artikalCene[0].cena)
              : 0;

          const datumPoslednjeKupovine = artikal.artikalIstorija?.[0]?.datumPoslednjeKupovine ?? null;
          const kolicinaKupovine = artikal.artikalIstorija?.[0]?.kolicina ?? 0;

          const datumPristizanja = artikal.datumPristizanja?.[0]?.datum ?? null;
          const kolicinaPristizanja = artikal.datumPristizanja?.[0]?.kolicina ?? 0;

          return {
            ...artikal,
            cena,
            datumPoslednjeKupovine,
            kolicinaKupovine,
            datumPristizanja,
            kolicinaPristizanja,
          };
        }) ?? [];

        setArtikli(artikliSaPodacima);

        // Atributi sa očišćenim imenima
        const noviAtributi: { [artikalId: string]: ArtikalAtribut[] } = {};
        artikliSaPodacima.forEach((artikal: any) => {
          noviAtributi[artikal.idArtikla] = artikal.artikalAtributi.map((atribut: any) => ({
            ...atribut,
            imeAtributa: ocistiImeAtributa(atribut.imeAtributa),
          }));
        });
        setAtributi(noviAtributi);

      } catch (e) {
        setError('Došlo je do greške prilikom učitavanja omiljenih artikala');
      } finally {
        setLoading(false);
      }
    };

    fetchOmiljeniArtikli();
  }, []);

  // Sortirani artikli - memoizovano
  const sortiraniArtikli = useMemo(() => {
    const kopija = [...artikli];
    kopija.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortKey === 'cena') {
        aVal = a.cena ?? 0;
        bVal = b.cena ?? 0;
      } else {
        aVal = a.naziv.toLowerCase();
        bVal = b.naziv.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return kopija;
  }, [artikli, sortKey, sortOrder]);

  // Paginated artikli - memoizovano
  const artikliZaPrikaz = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortiraniArtikli.slice(start, start + pageSize);
  }, [sortiraniArtikli, currentPage, pageSize]);

  // Ukupan broj stranica
  const totalPages = Math.ceil(sortiraniArtikli.length / pageSize);

  // Promena stranice - samo update URL-a, ne menjaj state direktno
const handlePageChange = (newPage: number) => {
  const params = new URLSearchParams(window.location.search);
  params.set('page', newPage.toString());
  router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
};


  // Promena sortiranja - update URL i trenutna stranica na 1
  const handleSortChange = (key: SortKey, order: SortOrder) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set('sortKey', key);
    newSearchParams.set('sortOrder', order);
    newSearchParams.set('page', '1');
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  // Promena filtera - kao u tvom kodu, update URL i reset stranice na 1
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
  };

  const t = useTranslations();

  return (
    <div className="lg:p-4">
      <div className="w-full mx-auto flex justify-between items-center p-2">
        <h1 className="font-bold text-3xl">{t('main.Omiljeni Artikli')}</h1>
        <SortiranjeButton sortKey={sortKey} sortOrder={sortOrder} onSortChange={handleSortChange} />
      </div>

      {loading ? (
        <p className="text-center mt-4">{t('main.Učitavanje')}</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <ListaArtikala
          artikli={sortiraniArtikli}
          totalCount={sortiraniArtikli.length}
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

export default OmiljeniArtikli;
