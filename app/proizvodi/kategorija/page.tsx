'use client';

import ArticleCard from "@/components/ArticleCard";
import FilterCena from "@/components/ui/filterCena";
import SortirajDugme from "@/components/ui/sortirajDugme";

import { useState } from 'react';


const Page = () => {

    const [filter, setFilter] = useState({ min: '', max: '' });

    const handleFilterChange = (newFilter: { min: string; max: string }) => {
        setFilter(newFilter);
        console.log('Filtriraj po ceni:', newFilter);
        // Ovde možeš filtrirati proizvode ili pozvati API sa filterima
    };

    return (
        <div className="flex flex-col">
            <h1 className="font-bold text-3xl px-5">Tiplovi</h1>

            <div className="flex justify-between gap-5 m-5 border-1">
                {/* filter */}
                <div className="flex flex-col w-60 border-2">
                    {/* filter cena */}
                    <FilterCena onFilterChange={handleFilterChange}/>
                    <div/>
                    <p>vrsta</p>
                    <p>boja</p>
                    <p>materijal</p>
                </div>

                {/* artikli */}
                <div  className="flex flex-col w-310 border-2">
                    <div className="flex justify-end">
                        <SortirajDugme/>
                    </div>
                    <div className="w-full mx-auto grid gap-4 grid-cols-2 md:grid-cols-3 self-end">
                        <ArticleCard/>
                        <ArticleCard/>
                        <ArticleCard/>
                        <ArticleCard/>
                        <ArticleCard/>
                        <ArticleCard/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;