'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { ArtikalAtribut, ArtikalFilterProp, ArtikalType } from "@/types/artikal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { dajKorisnikaIzTokena } from "@/lib/auth";
import { ocistiImeAtributa } from "@/contexts/OcistiImeAtributa";

type SortKey = 'cena' | 'naziv';
type SortOrder = 'asc' | 'desc';

const OmiljeniArtikli = () => {
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [atributi, setAtributi] = useState<{ [artikalId: string]: ArtikalAtribut[] }>({});
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

  // Sinhronizacija URL parametara sa stanjem komponente
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

  // Funkcija za preuzimanje podataka o omiljenim artiklima
  const fetchOmiljeniArtikli = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
      const korisnik = dajKorisnikaIzTokena();

      const res = await fetch(`${apiAddress}/api/Partner/POA?idPartnera=${korisnik?.partner}&idKorisnika=${korisnik?.idKorisnika}`);
      if (!res.ok) throw new Error("Greška pri preuzimanju omiljenih artikala");

      const data = await res.json();

      // Setovanje cena artikala. Prvo se gleda akcijska cena da se posalje u filter, ali ukoliko nema akcije gleda obicnu cenu
      const artikliSaCenama = data.artikli?.map((artikal: any) => {
        const akcijaCena = artikal.artikalCene?.[0]?.akcija?.cena ? parseFloat(artikal.artikalCene[0].akcija.cena) : null;        
        const cena = akcijaCena !== null ? akcijaCena : (artikal.artikalCene?.[0]?.cena ? parseFloat(artikal.artikalCene[0].cena) : 0);
        return {
          ...artikal,
          cena,
        };
      }) ?? [];


      // Setovanje podataka o artiklima
      setArtikli(artikliSaCenama);
      setTotalCount(data.totalCount ?? 0);

      // Postavljanje atributa sa očišćenim imenima
      const noviAtributi: { [artikalId: string]: ArtikalAtribut[] } = {};
      artikliSaCenama.forEach((artikal: any) => {
        noviAtributi[artikal.idArtikla] = artikal.artikalAtributi.map((atribut: any) => ({
          ...atribut,
          imeAtributa: ocistiImeAtributa(atribut.imeAtributa),
        }));
      });

      setAtributi(noviAtributi);
    } catch (err) {
      setError("Došlo je do greške prilikom učitavanja omiljenih artikala");
    } finally {
      setLoading(false);
    }
  };

  // Učitaj artikle kada se stranica, sortiranje ili parametri promene
  useEffect(() => {
    fetchOmiljeniArtikli();
  }, [currentPage, sortKey, sortOrder]);

  // Funkcija za promenu filtera
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

  console.log('Omiljeno Props: ',artikli);


  // Promena stranice
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setCurrentPage(newPage); // Postavljanje nove strane
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortOrder", sortOrder);

    router.push(`${url.pathname}?${url.search}`, { scroll: false });
  };

  // Promena sortiranja
  const handleSortChange = (key: SortKey, order: SortOrder) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sortKey", key);
    url.searchParams.set("sortOrder", order);
    url.searchParams.set("page", "1");  // Vraćanje na prvu stranu pri promeni sortiranja

    router.push(`${url.pathname}?${url.search}`, { scroll: false });
    setSortKey(key);
    setSortOrder(order);
    setCurrentPage(1);  // Postavljanje trenutne stranice na 1
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
        <p className="text-center mt-4">Učitavanje...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <ListaArtikala
          artikli={artikli}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange} // Filtriranje (ako bude potrebno)
        />
      )}
    </div>
  );
};

export default OmiljeniArtikli;
