'use client';

import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { fetcher } from "@/lib/fetcher";
import { ArtikalAtribut, ArtikalFilterProp, ArtikalType } from "@/types/artikal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Novo = () => {
  type SortKey = 'cena' | 'naziv';
  type SortOrder = 'asc' | 'desc';

  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [atributi, setAtributi] = useState<{ [artikalId: string]: ArtikalAtribut[] }>({});
  
  const [sortKey, setSortKey] = useState<SortKey>('naziv');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(8);
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState<string | null>(null);



  const router = useRouter();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const korisnik = dajKorisnikaIzTokena(); // assuming it's synchronous

  // SWR fetch
  const { data, error } = useSWR<{
    artikli: ArtikalType[];
    totalCount: number;
  }>(
    currentPage && korisnik?.idKorisnika
      ? `${apiAddress}/api/Artikal/AkcijeSaPaginacijom?idPartnera=${korisnik.idKorisnika}&page=${currentPage}&pageSize=${pageSize}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 60 * 4, // 4h cache
      shouldRetryOnError: false,
    }
  );

  const handleFilterChange = async (filters: ArtikalFilterProp) => {
      setLoading(true);
      setError(null);
    
      try {
        const query = new URLSearchParams();
        if (filters.naziv) query.append('naziv', filters.naziv);
        if (filters.cena) query.append('cena', filters.cena);
    
        for (const key of ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja']) {
          const vrednosti = filters[key as keyof ArtikalFilterProp];
          if (Array.isArray(vrednosti)) {
            vrednosti.forEach((val) => query.append(key, val));
          }
        }
    
        query.set('page', '1');  // Resetovanje stranice
        query.set('sortKey', sortKey);
        query.set('sortOrder', sortOrder);
    
        router.push(`${window.location.pathname}?${query.toString()}`);
      } catch (err) {
        setError('Došlo je do greške pri filtriranju.');
      } finally {
        setLoading(false);
      }
    };

  // Load from SWR response or localStorage only once
  useEffect(() => {
    const cached = localStorage.getItem("novopristigli_artikli");

    if (cached && artikli.length === 0) {
      const parsed = JSON.parse(cached);
      setArtikli(parsed.artikli ?? []);
      setTotalCount(parsed.totalCount ?? 0);
      setTotalPages(Math.ceil((parsed.totalCount ?? 0) / pageSize));
    } else if (data && artikli.length === 0) {
      setArtikli(data.artikli ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(Math.ceil((data.totalCount ?? 0) / pageSize));
      localStorage.setItem("novopristigli_artikli", JSON.stringify(data));
    }
  }, [data]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    router.push(`${url.pathname}${url.search}`, { scroll: false });
  };

  const handleSortChange = (key: SortKey, order: SortOrder) => {
    setSortKey(key);
    setSortOrder(order);
  };

  return (
    <div className="">
      <div className="w-full mx-auto flex justify-center items-center gap-6 py-2 px-8 flex-wrap md:justify-between">
        <h1 className="font-bold text-3xl">Novopristigli artikli</h1>
        <SortiranjeButton
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
      <div>
        {err && <p>Greška prilikom učitavanja artikala.</p>}
        {!data && artikli.length === 0 && <p>Učitavanje...</p>}
        {artikli.length > 0 && (
        <ListaArtikala
          artikli={artikli}
          atributi={atributi || {}}  // Prosleđivanje atributa
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange} // Filtriranje (ako bude potrebno)
        />
        )}
      </div>
    </div>
  );
};

export default Novo;
