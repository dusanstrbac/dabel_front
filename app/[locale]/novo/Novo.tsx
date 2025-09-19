'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { ArtikalAtribut, ArtikalFilterProp, ArtikalType } from "@/types/artikal";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { useTranslations } from "next-intl";

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

const Novopristigli = () => {
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [atributi, setAtributi] = useState<{ [artikalId: string]: ArtikalAtribut[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const t = useTranslations();

  const pageSize = 8;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Čitanje page, sortKey i sortOrder iz URL parametara sa default vrednostima
  const currentPage = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const sortKey: SortKey = (searchParams.get('sortKey') as SortKey) || 'cena';
  const sortOrder: SortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';

  // Fetch artikala jednom na mount
  useEffect(() => {
    const fetchNovopristigliArtikli = async () => {
      setLoading(true);
      setError(null);
      try {
        const korisnik = dajKorisnikaIzTokena();
        const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
        if (!korisnik) {
          setError('Korisnik nije prijavljen.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${apiAddress}/api/Artikal/NovopristigliArtikli?idPartnera=${korisnik.partner}`);

        if (!res.ok) throw new Error("Greška pri preuzimanju artikala");

        const data = await res.json();

        setArtikli(data.artikli ?? []);
        setTotalCount(data.totalCount ?? (data.artikli?.length ?? 0));

        // Opcionalno možeš obraditi atribute kao u OmiljeniArtikli ako treba
        // const noviAtributi: { [artikalId: string]: ArtikalAtribut[] } = {};
        // (data.artikli ?? []).forEach((artikal: any) => {
        //   noviAtributi[artikal.idArtikla] = artikal.artikalAtributi.map((atribut: any) => ({
        //     ...atribut,
        //     imeAtributa: ocistiImeAtributa(atribut.imeAtributa),
        //   }));
        // });
        // setAtributi(noviAtributi);

      } catch (e: any) {
        setError(e.message || "Došlo je do greške");
      } finally {
        setLoading(false);
      }
    };

    fetchNovopristigliArtikli();
  }, []);

  // Sortiranje artikala memoizovano
  const sortiraniArtikli = useMemo(() => {
    const kopija = [...artikli];
    kopija.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortKey === 'cena') {
        aVal = a.artikalCene?.[0]?.cena ?? 0;
        bVal = b.artikalCene?.[0]?.cena ?? 0;
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

  // Paginated artikli memoizovano
  const artikliZaPrikaz = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortiraniArtikli.slice(start, start + pageSize);
  }, [sortiraniArtikli, currentPage, pageSize]);

  // Ukupan broj stranica
  const totalPages = Math.ceil(totalCount / pageSize);

  // Promena stranice - samo update URL-a, ne setuj lokalni state
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Promena sortiranja - update URL i reset stranice na 1
  const handleSortChange = (key: SortKey, order: SortOrder) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sortKey', key);
    params.set('sortOrder', order);
    params.set('page', '1');
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Promena filtera (ako budeš implementirao)
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

  return (
    <div className="lg:p-4">
      <div className="w-full mx-auto flex justify-between items-center p-2">
        <h1 className="font-bold text-3xl">Novopristigli artikli</h1>
        <SortiranjeButton
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
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

export default Novopristigli;