'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';
import ListaArtikala from '@/components/ListaArtikala';
import SortiranjeButton from '@/components/SortiranjeButton';

export default function ProizvodiPage() {
  const { params } = useParams();
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;
    
    if (!isNaN(pageNumber) && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [searchParams]);


  // Za sada fetch-ujemo stranicu 1, možeš kasnije da dodaš state za stranicu i filtere
  const pageSize = 8; // Poželjno da backend vraća ovaj broj po strani

  const fetchArtikli = async (
    kategorija: string | null,
    podkategorija: string | null,
    filters: ArtikalFilterProp,
    page: number
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

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => queryParams.append(key, v));
        } else if (typeof value === 'string' && value.length > 0) {
          queryParams.append(key, value);
        }
      }
    });

    const fullUrl = `http://localhost:7235/api/Artikal/DajArtikleSaPaginacijom?${queryParams.toString()}`;

    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        throw new Error(`HTTP greška: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Odgovor sa servera:', data);

      if (data.items?.length) {
        setArtikli(data.items);
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
  if (!params || params.length === 0) return;

  const kategorija = decodeURIComponent(params[0]);
  const podkategorija = params.length > 1 ? decodeURIComponent(params[1]) : null;

  fetchArtikli(kategorija, podkategorija, {
    naziv: '',
    jedinicaMere: '',
    Materijal: [],
    Model: [],
    Pakovanje: [],
    RobnaMarka: [],
    Upotreba: [],
    Boja: [],
  }, currentPage);
}, [params, currentPage]);

  if (!params || params.length === 0) {
    return <p>Greška: Očekuje se najmanje jedna ruta (kategorija).</p>;
  }

  const kategorija = decodeURIComponent(params[0]);
  const podkategorija = params.length >= 2 ? decodeURIComponent(params[1]) : null;

  return (
    <div className="">
      <div className="w-full mx-auto flex justify-center items-ce nter gap-6 py-2 px-8 flex-wrap md:justify-between">
        <h1 className="font-bold text-3xl mb-[5px]">
          {kategorija} {podkategorija ? `/ ${podkategorija}` : ''}
        </h1>
        <SortiranjeButton artikli={artikli} setArtikli={setArtikli} />
      </div>
      <div>
        {!loading && artikli.length === 0 && (
          <p>Nema rezultata za ovu {podkategorija ? 'podkategoriju' : 'kategoriju'}.</p>
        )}

        {loading ? <p>Učitavanje...</p> : <ListaArtikala artikli={artikli} totalCount={totalCount} currentPage={currentPage} onPageChange={setCurrentPage} />}
      </div>
    </div>
  );
}
