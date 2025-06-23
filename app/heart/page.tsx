'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { ArtikalType } from "@/types/artikal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dajKorisnikaIzTokena } from "@/lib/auth";

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

const OmiljeniArtikli = () => {
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('naziv');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const searchParams = useSearchParams();
  const router = useRouter();

  // Sinhronizacija trenutne strane, sortiranja sa URL parametrima
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const sortKeyParam = searchParams.get("sortKey") as SortKey | null;
    const sortOrderParam = searchParams.get("sortOrder") as SortOrder | null;

    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum !== currentPage) setCurrentPage(pageNum);
    }

    if (sortKeyParam && sortKeyParam !== sortKey) setSortKey(sortKeyParam);
    if (sortOrderParam && sortOrderParam !== sortOrder) setSortOrder(sortOrderParam);
  }, [searchParams]);

  // Fetch omiljenih artikala
  const fetchOmiljeniArtikli = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const korisnik = dajKorisnikaIzTokena();

      if (!korisnik?.idKorisnika) {
        setError("Niste ulogovani!");
        setLoading(false);
        return;
      }

      const url = new URL(`${apiAddress}/api/Partner/DajOmiljeneArtikle`);
      url.searchParams.append("idPartnera", korisnik.idKorisnika);
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("pageSize", pageSize.toString());
      url.searchParams.append("sortKey", sortKey);
      url.searchParams.append("sortOrder", sortOrder);

      const res = await fetch(url.toString());

      if (!res.ok) throw new Error("Greška pri preuzimanju omiljenih artikala");

      const data = await res.json();

      setArtikli(data.artikli ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(Math.ceil((data.totalCount ?? 0) / pageSize));
    } catch (err) {
      setError("Došlo je do greške");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOmiljeniArtikli();
  }, [currentPage, sortKey, sortOrder]);

  // Menjanje strane sa paginacijom
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortOrder", sortOrder);

    router.push(`${url.pathname}${url.search}`, { scroll: false });
    setCurrentPage(newPage);
  };

  // Menjanje sortiranja
  const handleSortChange = (key: SortKey, order: SortOrder) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sortKey", key);
    url.searchParams.set("sortOrder", order);
    url.searchParams.set("page", "1"); // vrati na prvu stranu kad menjaš sortiranje

    router.push(`${url.pathname}${url.search}`, { scroll: false });
    setSortKey(key);
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className="lg:p-4">
      <div className="w-full mx-auto flex justify-between items-center p-2">
        <h1 className="font-bold text-3xl">Omiljeni Artikli</h1>
        <SortiranjeButton
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {loading ? (
        <p className="text-center mt-4">Učitavanje omiljenih artikala...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <ListaArtikala
          artikli={artikli}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default OmiljeniArtikli;
