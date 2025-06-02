'use client';
import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { ArtikalType } from "@/types/artikal";

const PreporuceniProizvodi = () => {
    const [proizvodi, setProizvodi] = useState<ArtikalType[]>([]);  
    const [loading, setLoading] = useState<boolean>(true);  
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
        const fetchProizvodi = async () => {
            try {
                // Staviti fetch ovde za preporucene artikle
                const response = await fetch("/api/proizvodi");
                if (!response.ok) {
                    throw new Error("Došlo je do greške prilikom učitavanja preporučenih proizvoda.");
                }
                const data: ArtikalType[] = await response.json(); 
                setProizvodi(data);
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
                {proizvodi.map((proizvod) => (
                    <ArticleCard 
                        key={proizvod.id} 
                        naslov={proizvod.naslov} 
                        cena={proizvod.cena} 
                        slika={proizvod.slika} 
                    />
                ))}
            </div>
        </div>
    );
};

export default PreporuceniProizvodi;
