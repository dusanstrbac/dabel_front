'use client';
import { useState } from "react";
import { Button } from "./button";
import { Span } from "next/dist/trace";

type Props = {
    jediniceFilter: { [key: string]: boolean };
    resetJediniceFilter: () => void;
    priceRange: { min: number; max: number };
    resetPriceFilter: () => void;
    defaultMin: number;
    defaultMax: number;
};

const BrisiFilter = ({  jediniceFilter,
                        resetJediniceFilter,
                        priceRange,
                        resetPriceFilter,
                        defaultMin,
                        defaultMax,
                        }: Props) => {

    const jedinice = ["pak", "KD", "set"];

    const showPriceFilter = priceRange.min !== defaultMin || priceRange.max !== defaultMax;
    const showJedinicaMereFilter = Object.values(jediniceFilter).some(val => val);
    const showClearAllButton = showPriceFilter || Object.values(jediniceFilter).some(val => val);

    return(
        <div className="flex gap-2 px-4">
                                {showPriceFilter && (
                                    <Button asChild> 
                                        <span   
                                            className="flex items-center gap-1 p-1 border rounded-md cursor-pointer"
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
    );
}

export default BrisiFilter;