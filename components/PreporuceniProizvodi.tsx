'use client';
import { useEffect, useState } from "react";
import { ArtikalType } from "@/types/artikal";
import ListaArtikala from "./ListaArtikala";
import { useRouter } from "next/navigation";

const PreporuceniProizvodi = () => {
    const [artikli, setArtikli] = useState<ArtikalType[]>([]);  
    const [loading, setLoading] = useState<boolean>(true);  
    const [error, setError] = useState<string | null>(null);  
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);

        const url = new URL(window.location.href);
        url.searchParams.set("page", newPage.toString());
        router.push(`${url.pathname}${url.search}`, { scroll: false });
    };

    useEffect(() => {
        const fetchProizvodi = async () => {
            try {
                // Staviti fetch ovde za preporucene artikle
                // Staviti maks 4 artikla da mogu biti u preporuceni proizvodi !!!
                const response = await fetch("/api/preporuceniArtikli");
                if (!response.ok) {
                    throw new Error("Došlo je do greške prilikom učitavanja preporučenih proizvoda.");
                }
                const data: ArtikalType[] = await response.json(); 
                setArtikli(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProizvodi();
    }, []);

    if (loading) {
        return <p>Učitavanje...</p>;
    }

    if (error) {
        return <p>Greška: {error}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl">Preporučeni proizvodi</h1>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          <ListaArtikala
            artikli={artikli}
            totalCount={totalCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            />
            </div>
        </div>
    );
};

export default PreporuceniProizvodi;
