'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArtikalFilterProp, ArtikalType } from '@/types/artikal';
import ListaArtikala from '@/components/ListaArtikala';
import ArtikalFilter from '@/components/ArtikalFilter';
import SortiranjeButton from '@/components/SortiranjeButton';
import Sorter from '@/components/Sorter';

export default function ProizvodiPage() {
  const { params } = useParams(); // Izvadi polje params

  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchArtikli = async (
    kategorija: string | null,
    podkategorija: string | null,
    filters: ArtikalFilterProp
  ) => {
    setLoading(true);
    setArtikli([]);

    const queryParams = new URLSearchParams();

    if (kategorija) {
      queryParams.append('Kategorija', kategorija);
    }

    if (podkategorija) {
      queryParams.append('PodKategorija', podkategorija);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(','));
        } else if (typeof value === 'string' && value.length > 0) {
          queryParams.append(key, value);
        }
      }
    });

    queryParams.append('batchSize', '4000');

    const fullUrl = `http://localhost:7235/api/Artikal/DajFilterArtikle?${queryParams.toString()}`;

    try {
      const res = await fetch(fullUrl);
      const data = await res.json();

      if (data.items?.length) {
        setArtikli(data.items); // Učitaj artikle
      } else {
        setArtikli([]);
        console.log('Nema artikala za ove parametre.');
      }
    } catch (error) {
      console.error('Greška pri učitavanju artikala:', error);
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
    });
  }, [params]);

  if (!params || params.length === 0) {
    return <p>Greška: Očekuje se najmanje jedna ruta (kategorija).</p>;
  }

  console.log(artikli);

  const kategorija = decodeURIComponent(params[0]);
  const podkategorija = params.length >= 2 ? decodeURIComponent(params[1]) : null;

  return (
    <div className="flex flex-row gap-6 px-6 py-4">
      <div className="w-1/4">
        <ArtikalFilter onFilterChange={(filters) => {}} />
      </div>
      <div className="w-3/4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">
            {kategorija} {podkategorija ? `/ ${podkategorija}` : ''}
          </h1>
          <Sorter artikli={artikli} setArtikli={setArtikli} />
        </div>

        {!loading && artikli.length === 0 && (
          <p>Nema rezultata za ovu {podkategorija ? 'podkategoriju' : 'kategoriju'}.</p>
        )}

        {loading ? <p>Učitavanje...</p> : <ListaArtikala artikli={artikli} />}
      </div>
    </div>
  );
}
