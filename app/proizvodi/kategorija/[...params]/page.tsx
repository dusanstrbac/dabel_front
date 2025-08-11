'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { dajKorisnikaIzTokena } from '@/lib/auth';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';

type SortKey = "cena" | "naziv";
type SortOrder = 'asc' | 'desc';

export default function ProizvodiPage() {
  console.log("1. Početak komponente - ovo se pokaže prvo");

  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  const idPartnera = dajKorisnikaIzTokena()?.partner;

  const [sviArtikli, setSviArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 8;
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const sortKey: SortKey = searchParams.get('sortKey') as SortKey || 'cena';
  const sortOrder: SortOrder = searchParams.get('sortOrder') as SortOrder || 'asc';

  const kategorija = params?.[0] ? decodeURIComponent(params[0]) : '';
  const podkategorija = params?.length && params.length >= 2 ? decodeURIComponent(params[1]) : null;

  console.log(`2. Trenutni URL parametri: 
    page=${pageFromUrl}, 
    sortKey=${sortKey}, 
    sortOrder=${sortOrder},
    kategorija=${kategorija},
    podkategorija=${podkategorija}`);

  // Fetch svih artikala jednom prilikom učitavanja
  useEffect(() => {
    console.log("3. useEffect za fetch podataka - pokreće se samo kada se promeni kategorija ili podkategorija");

    const fetchData = async () => {
      console.log("4. Početak fetch podataka sa servera");
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        query.append('idPartnera', idPartnera!);
        query.append('pageSize', '1000');
        query.append('Kategorija', kategorija);

        if (podkategorija) {
          query.append('PodKategorija', podkategorija);
        }

        console.log("5. Šaljem zahtev serveru sa parametrima:", query.toString());
        const { data } = await axios.get(`${apiAddress}/api/Artikal/DajArtikleSaPaginacijom?${query.toString()}`);
        
        console.log("6. Dobio odgovor od servera, broj artikala:", data.artikli?.length || 0);
        setSviArtikli(data.artikli || []);

        data.artikli?.forEach((artikal: ArtikalType) => {
          artikal.artikalAtributi?.forEach(atribut => {
            if (atribut.imeAtributa === 'Zavr.obr-boja') {
            }
          });
        });
      } catch (err) {
        console.error("8. Greška pri fetch podataka:", err);
        setError('Došlo je do greške pri učitavanju artikala');
      } finally {
        console.log("9. Završetak fetch podataka");
        setLoading(false);
      }
    };

    if (kategorija) {
      fetchData();
    } else {
      console.log("10. Nema kategorije - preskačem fetch");
    }
  }, [kategorija, podkategorija]);

  // Funkcija za klijentsko filtriranje
  const handleFilterChange = (filters: ArtikalFilterProp) => {
    console.log("11. Korisnik je promenio filtere:", JSON.stringify(filters));
    
    const query = new URLSearchParams();
    
    if (filters.cena) {
      console.log("12. Postavljam filter za cenu:", filters.cena);
      query.set('minCena', filters.cena.split('-')[0]);
      query.set('maxCena', filters.cena.split('-')[1]);
    }

    const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'];
    filterKeys.forEach(key => {
      const values = filters[key as keyof ArtikalFilterProp];
      if (Array.isArray(values) && values.length > 0) {
        console.log(`13. Postavljam filter za ${key}:`, values);
        values.forEach(val => query.append(key, val));
      }
    });

    console.log("14. Ažuriram URL sa novim filterima");
    router.push(`${window.location.pathname}?${query.toString()}`);
  };

  // Filtriranje artikala na osnovu URL parametara
  const filtriraniArtikli = useMemo(() => {
    console.log("15. Početak filtriranja artikala po URL parametrima");
    
    let result = [...sviArtikli];
    console.log("16. Ukupno artikala pre filtriranja:", result.length);

    // Filtriraj po ceni
    const minCena = searchParams.get('minCena');
    const maxCena = searchParams.get('maxCena');
    if (minCena && maxCena) {
      console.log(`17. Filtriranje po ceni: ${minCena} - ${maxCena}`);
      const min = parseFloat(minCena);
      const max = parseFloat(maxCena);
      result = result.filter(artikal => {
        const cena = artikal.artikalCene?.[0]?.cena || 0;
        return cena >= min && cena <= max;
      });
      console.log("18. Broj artikala nakon filtriranja cene:", result.length);
    }

    // Filtriraj po ostalim atributima
    const filterKeys = ['jm', 'Materijal', 'Model', 'Pakovanje', 'RobnaMarka', 'Upotreba', 'Boja'];
    filterKeys.forEach(key => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        console.log(`19. Filtriranje po ${key}:`, values);
        result = result.filter(artikal => {
          if (key === 'jm') return values.includes(artikal.jm);
          
          if (artikal.artikalAtributi) {
            const atributKey = key === 'RobnaMarka' ? 'Robna marka' : 
                             key === 'Boja' ? 'Zavr.obr-boja' : key;
            
            return artikal.artikalAtributi.some(atribut => 
              atribut.imeAtributa === atributKey && 
              values.includes(atribut.vrednost)
            );
          }
          return false;
        });
        console.log(`20. Broj artikala nakon filtriranja po ${key}:`, result.length);
      }
    });

    console.log("21. Ukupno artikala nakon svih filtera:", result.length);
    return result;
  }, [sviArtikli, searchParams]);

  // Sortiranje i paginacija
  const prikazaniArtikli = useMemo(() => {
    console.log("22. Početak sortiranja i paginacije");
    let result = [...filtriraniArtikli];
    
    console.log(`23. Sortiranje po ${sortKey} u redosledu ${sortOrder}`);
    result.sort((a, b) => {
      const aValue = sortKey === 'cena' ? (a.artikalCene?.[0]?.cena || 0) : a.naziv;
      const bValue = sortKey === 'cena' ? (b.artikalCene?.[0]?.cena || 0) : b.naziv;
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const startIndex = (pageFromUrl - 1) * pageSize;
    console.log(`24. Paginacija: strana ${pageFromUrl}, prikazujem artikle od ${startIndex} do ${startIndex + pageSize}`);
    
    const paginated = result.slice(startIndex, startIndex + pageSize);
    console.log("25. Broj artikala za prikaz:", paginated.length);
    return paginated;
  }, [filtriraniArtikli, sortKey, sortOrder, pageFromUrl]);

  const handlePageChange = (newPage: number) => {
    console.log(`26. Korisnik je kliknuo na stranu ${newPage}`);
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set('page', newPage.toString());
    console.log("27. Ažuriram URL sa novom stranom");
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  console.log("28. Renderovanje komponente sa trenutnim podacima");
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
            console.log(`29. Promena sortiranja: ${newSortKey} ${newSortOrder}`);
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('sortKey', newSortKey);
            searchParams.set('sortOrder', newSortOrder);
            searchParams.set('page', '1');
            console.log("30. Ažuriram URL sa novim sortiranjem");
            router.push(`${window.location.pathname}?${searchParams.toString()}`, { scroll: false });
          }}
        />
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div>
        <ListaArtikala
          artikli={prikazaniArtikli}
          sviArtikli={sviArtikli}
          kategorija={kategorija}
          podkategorija={podkategorija}
          totalCount={filtriraniArtikli.length}
          currentPage={pageFromUrl}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}