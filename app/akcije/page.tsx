'use client';
import ListaArtikala from "@/components/ListaArtikala";
import SortiranjeButton from "@/components/SortiranjeButton";
import { ArtikalType } from "@/types/artikal";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Akcije = () => {
  const [artikli, setArtikli] = useState<ArtikalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;

    if (!isNaN(pageNumber) && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [searchParams]);

  const fetchAkcijeArtikli = async () => {
  try {
    setLoading(true);
    setError(null);

    const apiAddress = process.env.NEXT_PUBLIC_API_ADDRESS;
    const res = await fetch(
      `${apiAddress}/api/Artikal/AkcijeSaPaginacijom?page=${currentPage}&pageSize=${pageSize}`
    );

    if (!res.ok) throw new Error("Greška pri preuzimanju artikala");

    const data = await res.json();
    console.log("API data:", data);

    setArtikli(data.artikli ?? []);
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
        <SortiranjeButton artikli={artikli} setArtikli={setArtikli} />
      </div>

      {loading ? (
        <p className="text-center mt-4">Učitavanje...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-4">{error}</p>
      ) : (
        <>
          <ListaArtikala
            artikli={artikli}
            totalCount={totalCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Akcije;
