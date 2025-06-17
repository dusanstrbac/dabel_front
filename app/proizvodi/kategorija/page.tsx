"use client";

import { useState } from "react";
import ListaArtikala from "@/components/ListaArtikala";
import MaliCheckbox from "@/components/ui/MaliCheckBox";
import MultiRangeSlider from "@/components/ui/MultiRangeSlider";
import SortirajDugme from "@/components/ui/sortirajDugme";
import FilterDugme from "@/components/ui/FilterDugme";
import { Button } from "@/components/ui/button";


const Page = () => {

    const defaultMin = 9;
    const defaultMax = 300000;

    const [showPriceFilter, setShowPriceFilter] = useState(true);
    const [minValue, setMinValue] = useState(defaultMin);
    const [maxValue, setMaxValue] = useState(defaultMax);

    const resetPriceFilter = () => {
        setShowPriceFilter(false);
        setMinValue(defaultMin);
        setMaxValue(defaultMax);
    };

    const jedinice = ["pak", "KD", "set"];
    const [jediniceFilter, setJediniceFilter] = useState<{ [key: string]: boolean }>(
        () => Object.fromEntries(jedinice.map(label => [label, false]))
    );
    const showJedinicaMereFilter = Object.values(jediniceFilter).some(val => val);

    const resetJediniceFilter = () => {
        setJediniceFilter(Object.fromEntries(jedinice.map(label => [label, false])));
    };


    const showClearAllButton = showPriceFilter || Object.values(jediniceFilter).some(val => val);
    
    return (
        <div className="lg:flex gap-2">
            {/* FILTER ZA PC */}
            <div className="hidden lg:block">
                <div className="w-[300px] pl-4 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Neka kategorija</h1>
                    <h2 className="text-xl text-red-500">Filtriraj proizvode</h2>
                    <p>Cena:</p>

                    <MultiRangeSlider
                        minValue={minValue}
                        maxValue={maxValue}
                        onChange={({ min, max }) => {
                            setMinValue(min);
                            setMaxValue(max);
                            if (!showPriceFilter) setShowPriceFilter(true);
                        }}
                    />

                    <p>Jedinica mere:</p>
                    <div className="flex flex-col ml-5">
                        {jedinice.map(label => (
                            <div className="flex items-center gap-2" key={label}>
                                <MaliCheckbox
                                    checked={jediniceFilter[label]}
                                    onChange={(newVal)=>
                                        setJediniceFilter(prev => ({ ...prev, [label]: newVal }))
                                    }
                                />
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-3xl font-bold px-5 lg:hidden">Neka kategorija</p>


            {/* ARTIKLI ZA PC*/}
            <div className="flex flex-col">

                {/* SORTIRAJ I FILTER DUGMICI */}
                    <div className="flex items-center justify-between p-2">
                        <div className="hidden lg:block"> 
                            <div className="flex gap-2 px-4">
                                {showPriceFilter && (
                                    <Button asChild>
                                        <span
                                            className="flex items-center gap-1 p-1 border rounded-md cursor-pointer "
                                            onClick={resetPriceFilter}
                                        >
                                            Cena
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="black"
                                                width="12px"
                                                height="12px"
                                                style={{ transform: "translateY(+2px)" }}
                                            >
                                                <path d="M18 6L6 18M6 6l12 12" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                    </Button>
                                )}

                                {showJedinicaMereFilter && (
                                    <Button asChild>
                                        <span
                                            className="flex items-center gap-1 p-1 border rounded-md cursor-pointer"
                                            onClick={resetJediniceFilter}
                                        >
                                            Jedinica mere
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="black"
                                                width="12px"
                                                height="12px"
                                                style={{ transform: "translateY(+2px)" }}
                                            >
                                                <path d="M18 6L6 18M6 6l12 12" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                    </Button>
                                )}
                                {showClearAllButton && (
                                    <Button asChild> 
                                        <span
                                                className="cursor-pointer font-bold text-red-500"
                                                onClick={() => {
                                                    resetPriceFilter();
                                                    resetJediniceFilter();
                                                }}
                                        >
                                            Poništi sve
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        {/* FILTER MENI */}
                        
                        <FilterDugme
                            jediniceFilter={jediniceFilter}
                            setJediniceFilter={setJediniceFilter}
                            priceRange={{ min: minValue, max: maxValue }}
                            setPriceRange={({ min, max }) => {
                                setMinValue(min);
                                setMaxValue(max);
                                if (!showPriceFilter) setShowPriceFilter(true);
                            }}
                            resetPriceFilter={resetPriceFilter}
                            resetJediniceFilter={resetJediniceFilter}
                            defaultMin={defaultMin}
                            defaultMax={defaultMax}
                            showPriceFilter={showPriceFilter}
                            showJedinicaMereFilter={showJedinicaMereFilter}
                        />
                        <SortirajDugme />
                    </div>
                
                <ListaArtikala/>
            </div>
        </div>
    );
};

export default Page;
