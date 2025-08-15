'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { ArtikalAtribut, ArtikalFilterProp, ArtikalType } from "@/types/artikal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dajKorisnikaIzTokena } from "@/lib/auth";

const Akcije = () => {
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [atributi, setAtributi] = useState<{ [artikalId: string]: ArtikalAtribut[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState<'cena' | 'naziv'>('cena');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortChange = (key: 'cena' | 'naziv', order: 'asc' | 'desc') => {
    setSortKey(key);
    setSortOrder(order);
  };

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;
  

    if (!isNaN(pageNumber) && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [searchParams]);

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

  const fetchAkcijeArtikli = async () => {
  try {
    setLoading(true);
    setError(null);

    const korisnik = dajKorisnikaIzTokena();
    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const res = await fetch(
<<<<<<< HEAD
      `${apiAddress}/api/Artikal/AkcijeSaPaginacijom?idPartnera=${korisnik?.idKorisnika}&page=${currentPage}&pageSize=${pageSize}`
=======
      `${apiAddress}/api/Artikal/PartnerAkcije?idPartnera=${korisnik?.partner}&idKorisnika=${korisnik?.idKorisnika}`
>>>>>>> bdfe10082df22cc2e869c69f8e8b8afae23e841a
    );

    if (!res.ok) throw new Error("Greška pri preuzimanju artikala");

    const data = await res.json();
<<<<<<< HEAD

    setArtikli(data.artikli ?? []);
=======
    console.log('Data za akciju', data.akcije);

    setArtikli(data.akcije ?? []);
>>>>>>> bdfe10082df22cc2e869c69f8e8b8afae23e841a
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

  return (
    <div className="lg:p-4">
      <div className="w-full mx-auto flex justify-between items-center p-2">
        <h1 className="font-bold text-3xl">Akcije</h1>
                <SortiranjeButton
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {loading ? (
        <p className="text-center mt-4">Učitavanje...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Akcije;
