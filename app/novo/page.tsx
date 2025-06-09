'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { fetcher } from "@/lib/fetcher";
import { ArtikalType } from "@/types/artikal";
import { useState } from "react";
import useSWR from "swr";

  const novo = () => {

  // Promeniti samo api poziv kada bude stigao sa backend-a
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);

  const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
  
  const { data, error } = useSWR<ArtikalType[]>(`${apiAddress}/api/artikli?sort=novo`, fetcher, {
    dedupingInterval: 1000 * 60 * 60 * 4, // Re-kesira api poziv na svaka 4 sata
    revalidateOnFocus: false,
  });
    

  return (
    <div className="">
        <div className="w-full mx-auto flex justify-center items-center gap-6 py-2 px-8 flex-wrap md:justify-between">
            <h1 className="font-bold text-3xl">Novopristigli artikli</h1>
            <SortiranjeButton artikli={artikli} setArtikli={setArtikli} />
        </div>
        <div>
          {error && <p>Greška prilikom učitavanja artikala.</p>}
          {!data && <p>Učitavanje...</p>}
          {data && <ListaArtikala artikli={artikli} />}     
        </div>
    </div>
  );
}
export default novo;