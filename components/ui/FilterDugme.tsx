'use client';
import { Link, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import MultiRangeSlider from "./MultiRangeSlider";
import { Span } from "next/dist/trace";
import BrisiFilter from "./BrisiFilter";
import MaliCheckbox from "./MaliCheckBox";
import { useEffect, useState } from "react";

const filterNav = [
    {key:"cena" ,text: 'Cena'},
    {key:"jm" ,text: 'Jedinica mere',
        subMenuItems:[
        { text: 'pak' },
        { text: 'KD' },
        { text: 'set' },
      ]},
    ];


interface FilterDugmeProps {
    jediniceFilter: { [key: string]: boolean };
    setJediniceFilter: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    resetPriceFilter: () => void;
    resetJediniceFilter: () => void;
    defaultMin: number;
    defaultMax: number;
    showPriceFilter: boolean;
    showJedinicaMereFilter: boolean;
};



const FilterDugme = ({
        jediniceFilter,
        setJediniceFilter,
        priceRange,
        setPriceRange,
        resetPriceFilter,
        resetJediniceFilter,
        defaultMin,
        defaultMax,
        showPriceFilter,
        showJedinicaMereFilter
    }: FilterDugmeProps) => {
    
    const [accordionValue, setAccordionValue] = useState<string | undefined>('item-1');
    // Ako korisnik promeni stanje filtera, automatski otvori ako je potrebno
    useEffect(() => {
        if (showJedinicaMereFilter) {
            setAccordionValue('item-1');
        }
    }, [showJedinicaMereFilter]);

    return(
        <div className="flex items-center lg:hidden p-2">
                        <Sheet>
                            <SheetTrigger>
                                <button className="text-sm font-semibold px-3 py-1 border rounded-md">
                                    Filtriraj proizvode
                                </button>
                            </SheetTrigger>
                            <SheetContent className="w-full overflow-scroll">
                                <SheetHeader>
                                    <SheetTitle className="text-red-500 font-bold">Filtriraj proizvode</SheetTitle>
                                    <Separator />
                                </SheetHeader>
                                <div className="pl-2 flex flex-col gap-2">
                                    <BrisiFilter
                                        jediniceFilter={jediniceFilter}
                                        resetJediniceFilter={resetJediniceFilter}
                                        priceRange={priceRange}
                                        resetPriceFilter={resetPriceFilter}
                                        defaultMin={defaultMin}
                                        defaultMax={defaultMax}
                                    />
                                    <Accordion 
                                        type="single"
                                        collapsible
                                        className="flex flex-col gap-4"
                                        // value={accordionValue}       //ovo mi je on rekao da mozda najbolje staticki da bude
                                        // onValueChange={setAccordionValue}
                                    >
                                        {filterNav.map((item, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="flex items-center gap-3 pl-2">
                                                <span className="text-[18px]">{item.text}</span>
                                            </AccordionTrigger>

                                            <AccordionContent className="pl-5">
                                                {item.key === "cena" && (
                                                    <MultiRangeSlider
                                                        minValue={priceRange.min}
                                                        maxValue={priceRange.max}
                                                        // min={priceRange.min}
                                                        // max={priceRange.max}
                                                        onChange={({ min, max }) => setPriceRange({ min, max })}
                                                    />
                                                )}
                                            {item.key === "jm" && item.subMenuItems ? (
                                                <ul className="flex flex-col gap-1">
                                                {item.subMenuItems.map((subItem, subIndex) => (
                                                    <li className="flex gap-1 items-center" key={subIndex}>
                                                        <MaliCheckbox
                                                            checked={jediniceFilter[subItem.text]}
                                                            onChange={(newVal)=>
                                                                setJediniceFilter(prev => ({ ...prev, [subItem.text]: newVal }))
                                                            }
                                                        />
                                                        {subItem.text}
                                                    </li>
                                                ))}
                                                </ul>
                                            ):null}
                                            </AccordionContent>
                                        </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </SheetContent>
                        </Sheet>
        </div>
    );
}

export default FilterDugme;